module Api
  module V1
    class SessionsController < BaseController
      skip_before_action :authenticate_request, only: [:create]

      def create
        email = (params[:email].presence || login_params[:email]).to_s.strip.downcase.presence
        password = params[:password].presence || login_params[:password]
        unless email && password.present?
          return render_error("Email and password are required", status: :unprocessable_entity, code: "MISSING_CREDENTIALS")
        end

        user = User.find_by(email: email)
        if user&.authenticate(password)
          token = JwtService.encode(user)
          render_success({ token: token, user: { id: user.id.to_s, email: user.email } })
        else
          render_error("Invalid email or password", status: :unauthorized, code: "INVALID_CREDENTIALS")
        end
      end

      def destroy
        return render_success({}) unless current_user
        current_user.regenerate_jti!
        render_success({})
      end

      private

      def login_params
        return {} if request.raw_post.blank?
        JSON.parse(request.raw_post).symbolize_keys
      rescue JSON::ParserError
        {}
      end
    end
  end
end
