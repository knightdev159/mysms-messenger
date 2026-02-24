class Message
  include Mongoid::Document
  include Mongoid::Timestamps

  field :phone_number, type: String
  field :body, type: String
  field :status, type: String, default: "queued"
  field :session_id, type: String
  field :user_id, type: BSON::ObjectId
  field :twilio_sid, type: String

  belongs_to :user, optional: true, class_name: "User", inverse_of: :messages

  validates :phone_number, presence: true,
    format: { with: /\A\+[1-9]\d{1,14}\z/, message: "must be in E.164 format (e.g. +14155552671)" }
  validates :body, presence: true,
    length: { maximum: 1600, message: "cannot exceed 1600 characters" }
  validates :status, inclusion: { in: %w[queued sent delivered failed undelivered] }
  validate :must_have_session_or_user

  index({ session_id: 1, created_at: -1 })
  index({ user_id: 1, created_at: -1 })
  index({ twilio_sid: 1 }, { unique: true, sparse: true })

  scope :by_session, ->(sid) { where(session_id: sid) }
  scope :by_user, ->(user) { where(user_id: user.id) }
  scope :recent_first, -> { order(created_at: :desc) }

  STATUSES = %w[queued sent delivered failed undelivered].freeze

  private

  def must_have_session_or_user
    return if session_id.present? || user_id.present?
    errors.add(:base, "message must be associated with a session or user")
  end
end
