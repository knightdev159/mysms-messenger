module Api
  module V1
    class UsersController < BaseController
      def me
        if current_user
          render_success({ id: current_user.id.to_s, email: current_user.email })
        else
          render_success(nil)
        end
      end
    end
  end
end
