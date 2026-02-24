require "spec_helper"
ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
abort("The Rails environment is running in production mode!") if Rails.env.production?
require "rspec/rails"
require "webmock/rspec"

ENV["TWILIO_ACCOUNT_SID"] ||= "ACtest123"
ENV["TWILIO_AUTH_TOKEN"] ||= "test_token"
ENV["TWILIO_PHONE_NUMBER"] ||= "+15551234567"

Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }

ActiveJob::Base.queue_adapter = :test

RSpec.configure do |config|
  config.use_active_record = false
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!

  config.include FactoryBot::Syntax::Methods

  config.before(:each) do
    Mongoid.purge!
  end
end
