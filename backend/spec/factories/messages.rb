FactoryBot.define do
  factory :message do
    phone_number { "+14155552671" }
    body { Faker::Lorem.sentence(word_count: 10) }
    status { "queued" }
    session_id { SecureRandom.hex(16) }
  end
end
