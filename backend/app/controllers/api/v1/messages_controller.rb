module Api
  module V1
    class MessagesController < BaseController
      DEFAULT_PER_PAGE = 20
      MAX_PER_PAGE = 100

      def index
        messages = Message
          .by_session(session.id.to_s)
          .recent_first

        total = messages.count
        page = [params.fetch(:page, 1).to_i, 1].max
        per_page = params.fetch(:per_page, DEFAULT_PER_PAGE).to_i.clamp(1, MAX_PER_PAGE)
        paginated = messages.skip((page - 1) * per_page).limit(per_page)

        render_success(
          paginated.as_json(only: %i[_id phone_number body status created_at updated_at]),
          meta: { page: page, per_page: per_page, total: total }
        )
      end

      def create
        message = Message.new(message_params)
        message.session_id = session.id.to_s

        if message.save
          render_created(message.as_json(only: %i[_id phone_number body status created_at]))
        else
          render_validation_errors(message)
        end
      end

      private

      def message_params
        params.require(:message).permit(:phone_number, :body)
      end
    end
  end
end
