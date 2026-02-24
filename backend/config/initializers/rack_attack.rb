class Rack::Attack
  # Throttle SMS sending: 10 requests per minute per IP
  throttle("sms/ip", limit: 10, period: 60.seconds) do |req|
    req.ip if req.path == "/api/v1/messages" && req.post?
  end

  # Throttle general API requests: 100 per minute per IP
  throttle("api/ip", limit: 100, period: 60.seconds) do |req|
    req.ip if req.path.start_with?("/api/")
  end

  self.throttled_responder = lambda do |matched, _period, limit, count|
    now = Time.now.utc
    retry_after = (matched[:period] - now.to_i % matched[:period]).to_s

    [
      429,
      {
        "Content-Type" => "application/json",
        "Retry-After" => retry_after
      },
      [{ error: { code: "RATE_LIMITED", message: "Too many requests. Retry after #{retry_after} seconds." } }.to_json]
    ]
  end
end
