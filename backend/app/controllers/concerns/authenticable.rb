module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
  end

  attr_reader :current_user

  private

  def authenticate_request
    token = bearer_token
    return unless token

    payload = JwtService.decode(token)
    return unless payload && payload["jti"]

    @current_user = User.find_by_jti(payload["jti"])
  end

  def bearer_token
    token = request.headers["X-Auth-Token"]&.strip
    return token if token.present?

    auth = request.headers["Authorization"]
    return nil unless auth&.match?(/\ABearer\s+(.+)\z/)
    Regexp.last_match(1)
  end

  def authenticate_user!
    return if current_user
    render_error("Unauthorized", status: :unauthorized, code: "UNAUTHORIZED")
  end
end
