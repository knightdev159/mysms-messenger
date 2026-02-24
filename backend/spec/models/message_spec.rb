require "rails_helper"

RSpec.describe Message, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      message = build(:message)
      expect(message).to be_valid
    end

    it "requires phone_number" do
      message = build(:message, phone_number: nil)
      expect(message).not_to be_valid
      expect(message.errors[:phone_number]).to include("can't be blank")
    end

    it "requires body" do
      message = build(:message, body: nil)
      expect(message).not_to be_valid
      expect(message.errors[:body]).to include("can't be blank")
    end

    it "requires session_id" do
      message = build(:message, session_id: nil)
      expect(message).not_to be_valid
      expect(message.errors[:session_id]).to include("can't be blank")
    end

    it "validates phone_number is in E.164 format" do
      invalid_numbers = ["1234567890", "555-1234", "+0invalid", "abc"]
      invalid_numbers.each do |number|
        message = build(:message, phone_number: number)
        expect(message).not_to be_valid
        expect(message.errors[:phone_number]).to be_present
      end
    end

    it "accepts valid E.164 phone numbers" do
      valid_numbers = ["+14155552671", "+447911123456", "+61412345678"]
      valid_numbers.each do |number|
        message = build(:message, phone_number: number)
        expect(message).to be_valid
      end
    end

    it "rejects body longer than 1600 characters" do
      message = build(:message, body: "a" * 1601)
      expect(message).not_to be_valid
      expect(message.errors[:body]).to be_present
    end

    it "validates status is in allowed values" do
      message = build(:message, status: "invalid_status")
      expect(message).not_to be_valid
      expect(message.errors[:status]).to be_present
    end
  end

  describe "scopes" do
    let(:session_id) { "test-session-123" }

    before do
      create(:message, session_id: session_id, created_at: 2.hours.ago)
      create(:message, session_id: session_id, created_at: 1.hour.ago)
      create(:message, session_id: "other-session")
    end

    it ".by_session returns messages for a specific session" do
      messages = Message.by_session(session_id)
      expect(messages.count).to eq(2)
    end

    it ".recent_first orders by created_at descending" do
      messages = Message.by_session(session_id).recent_first
      expect(messages.first.created_at).to be > messages.last.created_at
    end
  end
end
