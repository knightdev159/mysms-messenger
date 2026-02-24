Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get "health", to: "health#show"

  namespace :api do
    namespace :v1 do
      resources :messages, only: %i[index create]
    end
  end
end
