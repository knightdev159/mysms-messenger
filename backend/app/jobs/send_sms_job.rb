class SendSmsJob < ApplicationJob
  queue_as :default
  retry_on StandardError, wait: :polynomially_longer, attempts: 3

  def perform(message_id)
    message = Message.find(message_id)
    return if message.status == "sent"

    provider = SmsProviders::Twilio.new
    base = ENV["TWILIO_WEBHOOK_BASE_URL"].to_s.sub(/\/\z/, "").presence
    callback_url = base ? "#{base}/api/v1/webhooks/twilio_status" : nil
    result = provider.send_sms(to: message.phone_number, body: message.body, callback_url: callback_url)

    if result[:success]
      message.update!(status: "sent", twilio_sid: result[:sid])
      Rails.logger.info("SMS delivered | message_id=#{message_id} twilio_sid=#{result[:sid]}")
    else
      message.update!(status: "failed")
      Rails.logger.error("SMS failed | message_id=#{message_id} error=#{result[:error]}")
    end
  end
end
