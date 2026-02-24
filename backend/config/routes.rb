Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get "health", to: "health#show"

  namespace :api do
    namespace :v1 do
      post "login", to: "sessions#create"
      delete "logout", to: "sessions#destroy"
      post "signup", to: "registrations#create"
      get "me", to: "users#me"
      resources :messages, only: %i[index create]
      post "webhooks/twilio_status", to: "webhooks#twilio_status"
    end
  end
end
