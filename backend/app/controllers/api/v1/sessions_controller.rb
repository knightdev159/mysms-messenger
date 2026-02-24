module Api
  module V1
    class SessionsController < BaseController
      skip_before_action :authenticate_request, only: [:create]

      def create
        user = User.find_by(email: params[:email]&.downcase)
        if user&.authenticate(params[:password])
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
    end
  end
end
