module Api
  module V1
    class RegistrationsController < BaseController
      skip_before_action :authenticate_request, only: [:create]

      def create
        user = User.new(registration_params)
        if user.save
          token = JwtService.encode(user)
          render_created({ token: token, user: { id: user.id.to_s, email: user.email } })
        else
          render_validation_errors(user)
        end
      end

      private

      def registration_params
        params.require(:user).permit(:email, :password, :password_confirmation)
      end
    end
  end
end
