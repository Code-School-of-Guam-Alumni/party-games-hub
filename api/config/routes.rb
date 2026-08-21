Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :games, only: :index
      resources :imposter_word_packs, only: :index
    end
  end
end
