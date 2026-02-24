class JwtService
  SECRET = ENV.fetch("JWT_SECRET_KEY", Rails.application.secret_key_base)
  EXPIRY = 7.days

  def self.encode(user)
    payload = {
      sub: user.id.to_s,
      jti: user.jti,
      exp: EXPIRY.from_now.to_i,
      iat: Time.current.to_i
    }
    JWT.encode(payload, SECRET, "HS256")
  end

  def self.decode(token)
    return nil if token.blank?
    payload = JWT.decode(token, SECRET, true, { algorithm: "HS256" }).first
    payload
  rescue JWT::DecodeError
    nil
  end
end
