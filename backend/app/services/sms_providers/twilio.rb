module SmsProviders
  class Twilio < Base
    def initialize
      @client = ::Twilio::REST::Client.new(
        ENV.fetch("TWILIO_ACCOUNT_SID"),
        ENV.fetch("TWILIO_AUTH_TOKEN")
      )
      @from_number = ENV.fetch("TWILIO_PHONE_NUMBER")
    end

    def send_sms(to:, body:, callback_url: nil)
      params = {
        from: @from_number,
        to: to,
        body: body
      }
      params[:status_callback] = callback_url if callback_url

      result = @client.messages.create(**params)

      {
        success: true,
        sid: result.sid,
        status: result.status
      }
    rescue ::Twilio::REST::RestError => e
      {
        success: false,
        error: e.message,
        code: e.code
      }
    end
  end
end
