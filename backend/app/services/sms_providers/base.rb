module SmsProviders
  class Base
    def send_sms(to:, body:, callback_url: nil)
      raise NotImplementedError, "#{self.class}#send_sms must be implemented"
    end
  end
end
