require "rails_helper"

RSpec.describe MessageDeliveryService do
  describe "#call" do
    let(:message) { create(:message, user_id: create(:user).id) }
    let(:fake_provider) { instance_double(SmsProviders::Twilio, send_sms: { success: true }) }

    it "enqueues a SendSmsJob for a persisted message" do
      expect {
        described_class.new(sms_provider: fake_provider).call(message)
      }.to have_enqueued_job(SendSmsJob).with(message.id.to_s)
    end

    it "returns success" do
      result = described_class.new(sms_provider: fake_provider).call(message)
      expect(result[:success]).to be true
      expect(result[:message]).to eq(message)
    end

    it "returns failure for an unpersisted message" do
      unsaved = build(:message, user_id: create(:user).id)
      result = described_class.new(sms_provider: fake_provider).call(unsaved)
      expect(result[:success]).to be false
    end
  end
end
