class MessageDeliveryService
  def initialize(sms_provider: nil)
    @sms_provider = sms_provider || SmsProviders::Twilio.new
  end

  def call(message)
    return failure("Message is invalid") unless message.persisted?

    SendSmsJob.perform_later(message.id.to_s)

    { success: true, message: message }
  end

  private

  def failure(error)
    { success: false, error: error }
  end
end
