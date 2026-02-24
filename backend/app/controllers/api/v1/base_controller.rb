module Api
  module V1
    class BaseController < ApplicationController
      include ApiResponse
      include Authenticable
    end
  end
end
