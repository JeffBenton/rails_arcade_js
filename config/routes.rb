Rails.application.routes.draw do
  get '/games/cheapest', to: 'games#cheapest'

  resources :users, only: [:index, :show, :new, :create, :edit, :update]
  resources :games, only: [:index, :show, :new, :create, :edit, :update, :destroy]
  resources :manufacturers, only: [:index, :show, :new, :create, :edit, :update] do
    resources :games, only: [:index, :new]
  end
  resources :plays, only: [:show]
  root 'sessions#new'



  get '/auth/facebook/callback', to: 'sessions#create'
  post '/signin', to: 'sessions#create'
  delete '/signout', to: 'sessions#destroy'

  post '/play', to: 'plays#create'
end
