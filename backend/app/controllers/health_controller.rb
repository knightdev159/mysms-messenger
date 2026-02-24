class HealthController < ApplicationController
  def show
    mongo_status = check_mongodb

    status = mongo_status ? :ok : :service_unavailable
    render json: {
      status: mongo_status ? "healthy" : "unhealthy",
      services: {
        mongodb: mongo_status ? "connected" : "disconnected"
      },
      timestamp: Time.current.iso8601
    }, status: status
  end

  private

  def check_mongodb
    Mongoid.default_client.database.command(ping: 1)
    true
  rescue StandardError
    false
  end
end
