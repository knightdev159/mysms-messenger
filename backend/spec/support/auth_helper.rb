module AuthHelper
  def auth_headers_for(user)
    token = JwtService.encode(user)
    { "Authorization" => "Bearer #{token}", "X-Auth-Token" => token }
  end
end

RSpec.configure do |config|
  config.include AuthHelper, type: :request
end
