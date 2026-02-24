require "rails_helper"

RSpec.describe "Api::V1::Messages", type: :request do
  describe "GET /api/v1/messages" do
    it "returns an empty list when no messages exist" do
      get "/api/v1/messages"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["data"]).to eq([])
      expect(json["meta"]["total"]).to eq(0)
    end

    it "returns paginated messages for the current session" do
      session_id = nil

      # Create a message via POST to establish the session
      post "/api/v1/messages", params: {
        message: { phone_number: "+14155552671", body: "Hello" }
      }
      expect(response).to have_http_status(:created)

      get "/api/v1/messages"
      json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      expect(json["data"].length).to eq(1)
      expect(json["data"][0]["body"]).to eq("Hello")
      expect(json["meta"]["page"]).to eq(1)
      expect(json["meta"]["per_page"]).to eq(20)
      expect(json["meta"]["total"]).to eq(1)
    end

    it "does not return messages from other sessions" do
      create(:message, session_id: "other-session-id", body: "Secret")

      get "/api/v1/messages"
      json = JSON.parse(response.body)

      expect(json["data"]).to be_empty
    end

    it "respects pagination parameters" do
      # Create messages via direct DB insert with a known session
      3.times { |i| create(:message, session_id: "test-sess", body: "Msg #{i}") }

      get "/api/v1/messages", params: { page: 1, per_page: 2 }
      json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      expect(json["meta"]["per_page"]).to eq(2)
    end
  end

  describe "POST /api/v1/messages" do
    let(:valid_params) do
      { message: { phone_number: "+14155552671", body: "Hello from test!" } }
    end

    it "creates a message with valid params" do
      post "/api/v1/messages", params: valid_params

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["data"]["phone_number"]).to eq("+14155552671")
      expect(json["data"]["body"]).to eq("Hello from test!")
      expect(json["data"]["status"]).to eq("queued")
    end

    it "returns validation errors for missing phone_number" do
      post "/api/v1/messages", params: {
        message: { body: "Hello" }
      }

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["error"]["code"]).to eq("VALIDATION_ERROR")
      expect(json["error"]["details"]).to be_present
    end

    it "returns validation errors for invalid phone_number format" do
      post "/api/v1/messages", params: {
        message: { phone_number: "not-a-number", body: "Hello" }
      }

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["error"]["code"]).to eq("VALIDATION_ERROR")
    end

    it "returns validation errors for missing body" do
      post "/api/v1/messages", params: {
        message: { phone_number: "+14155552671" }
      }

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "enqueues a SendSmsJob after creation" do
      expect {
        post "/api/v1/messages", params: valid_params
      }.to have_enqueued_job(SendSmsJob)
    end
  end
end
