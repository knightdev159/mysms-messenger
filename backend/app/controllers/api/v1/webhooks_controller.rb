module Api
  module V1
    class WebhooksController < BaseController
      skip_before_action :authenticate_request

      def twilio_status
        unless valid_twilio_signature?
          return render_error("Invalid signature", status: :forbidden, code: "INVALID_SIGNATURE")
        end

        sid = params[:MessageSid]
        status = params[:MessageStatus]

        return render_error("Missing MessageSid", status: :bad_request, code: "BAD_REQUEST") if sid.blank?

        message = Message.find_by(twilio_sid: sid)
        unless message
          Rails.logger.warn("Twilio webhook: message not found for sid=#{sid}")
          return render json: {}, status: :ok
        end

        message.update!(status: normalized_status(status))
        Rails.logger.info("Twilio webhook: message_id=#{message.id} status=#{status}")
        render json: {}, status: :ok
      end

      private

      def valid_twilio_signature?
        auth_token = ENV["TWILIO_AUTH_TOKEN"]
        return false if auth_token.blank?

        validator = ::Twilio::Security::RequestValidator.new(auth_token)
        url = request.original_url
        signature = request.headers["X-Twilio-Signature"].to_s
        validator.validate(url, twilio_params, signature)
      end

      def twilio_params
        request.request_parameters.to_h
      end

      def normalized_status(twilio_status)
        return twilio_status if Message::STATUSES.include?(twilio_status.to_s.downcase)
        case twilio_status.to_s.downcase
        when "accepted", "queued" then "queued"
        when "delivered" then "delivered"
        when "failed", "undelivered" then twilio_status.to_s.downcase
        else "sent"
        end
      end
    end
  end
end
