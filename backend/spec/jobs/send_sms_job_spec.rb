require "rails_helper"

RSpec.describe SendSmsJob, type: :job do
  let(:message) { create(:message, status: "queued") }

  before do
    allow(SmsProviders::Twilio).to receive(:new).and_return(mock_provider)
  end

  context "when SMS delivery succeeds" do
    let(:mock_provider) do
      instance_double(SmsProviders::Twilio, send_sms: {
        success: true,
        sid: "SM1234567890abcdef",
        status: "sent"
      })
    end

    it "updates message status to sent" do
      described_class.perform_now(message.id.to_s)
      message.reload

      expect(message.status).to eq("sent")
      expect(message.twilio_sid).to eq("SM1234567890abcdef")
    end
  end

  context "when SMS delivery fails" do
    let(:mock_provider) do
      instance_double(SmsProviders::Twilio, send_sms: {
        success: false,
        error: "Invalid phone number",
        code: 21211
      })
    end

    it "updates message status to failed" do
      described_class.perform_now(message.id.to_s)
      message.reload

      expect(message.status).to eq("failed")
    end
  end

  context "when message is already sent" do
    let(:message) { create(:message, status: "sent") }
    let(:mock_provider) do
      instance_double(SmsProviders::Twilio).tap do |d|
        allow(d).to receive(:send_sms).and_return({ success: true, sid: "SM0", status: "sent" })
      end
    end

    it "does not attempt to send again" do
      described_class.perform_now(message.id.to_s)
      expect(mock_provider).not_to have_received(:send_sms)
    end
  end
end
