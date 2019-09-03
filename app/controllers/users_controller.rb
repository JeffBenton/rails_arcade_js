class UsersController < ApplicationController
  before_action :find_user, only: [:show, :edit, :update]
  before_action :require_logged_in, except: [:new, :create]
  helper_method :facebook_user?

  def index
    @users = User.all
  end

  def show
  end

  def new
    @user = User.new
  end

  def create
    @user = User.create(user_params(:name, :password))
    if @user.valid?
      session[:user_id] = @user.id
      redirect_to games_path
    else
      render :new
    end
  end

  def edit
    return redirect_to user_path(params[:id]), notice: "You don't have permission to do that" unless params[:id].to_i == session[:user_id]
    return redirect_to user_path(params[:id]), notice: "You cannot edit your facebook login" if facebook_user?
    session[:edit_id] = params[:id]
  end

  def update
    if session[:edit_id] != params[:id]
      clear_edit_id
      redirect_to user_path(session[:edit_id]), notice: "You can't do that"
    end

    @user.update(user_params(:name))
    if @user.valid?
      clear_edit_id
      redirect_to user_path(@user)
    else
      render :edit
    end
  end

  private

  def find_user
    @user = User.find_by(id: params[:id])
  end

  def user_params(*args)
    params.require(:user).permit(*args)
  end

  def facebook_user?
    return current_user.uid.present?
  end
end