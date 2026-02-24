class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include ActiveModel::SecurePassword

  has_secure_password

  field :email, type: String
  field :password_digest, type: String
  field :jti, type: String

  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { password.present? }

  index({ email: 1 }, { unique: true })
  index({ jti: 1 }, { unique: true, sparse: true })

  has_many :messages, class_name: "Message", inverse_of: :user

  before_create :set_jti

  def self.find_by_jti(jti)
    find_by(jti: jti)
  end

  def regenerate_jti!
    set_jti
    save!
  end

  private

  def set_jti
    self.jti = SecureRandom.uuid
  end
end
