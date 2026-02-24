module ApiResponse
  extend ActiveSupport::Concern

  private

  def render_success(data, status: :ok, meta: {})
    render json: { data: data, meta: meta }, status: status
  end

  def render_created(data)
    render json: { data: data }, status: :created
  end

  def render_error(message, status: :unprocessable_entity, code: nil, details: [])
    error = {
      code: code || status.to_s.upcase,
      message: message,
      details: details
    }
    render json: { error: error }, status: status
  end

  def render_validation_errors(record)
    details = record.errors.map do |error|
      { field: error.attribute.to_s, message: error.full_message }
    end

    render_error(
      "Validation failed",
      status: :unprocessable_entity,
      code: "VALIDATION_ERROR",
      details: details
    )
  end
end
