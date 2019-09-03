class SessionsController < ApplicationController
  before_action :require_logged_in, only: [:destroy]

  def new
    redirect_to games_path if is_logged_in?
  end

  def create
    if auth.present?
      @user = User.find_or_initialize_by(uid: auth['uid']) do |u|
        u.name = auth['info']['name']
      end
      @user.save(validate: false) if @user.new_record?
    else
      @user = User.find_by(name: params[:name])
      return redirect_to root_url,
                         notice: 'Username or password incorrect' if @user.nil? || !@user.authenticate(params[:password])
    end

    session[:user_id] = @user.id
    redirect_to games_path
  end

  def destroy
    session.delete :user_id
    redirect_to root_url
  end

  private

  def auth
    request.env['omniauth.auth']
  end
end