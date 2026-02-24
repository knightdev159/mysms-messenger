require "rails_helper"

RSpec.describe MessageDeliveryService do
  describe "#call" do
    let(:message) { create(:message) }

    it "enqueues a SendSmsJob for a persisted message" do
      expect {
        described_class.new.call(message)
      }.to have_enqueued_job(SendSmsJob).with(message.id.to_s)
    end

    it "returns success" do
      result = described_class.new.call(message)
      expect(result[:success]).to be true
      expect(result[:message]).to eq(message)
    end

    it "returns failure for an unpersisted message" do
      unsaved = build(:message)
      result = described_class.new.call(unsaved)
      expect(result[:success]).to be false
    end
  end
end
