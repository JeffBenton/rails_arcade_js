class ApplicationController < ActionController::Base
  helper_method :current_user, :is_logged_in?, :require_logged_in, :require_admin, :clear_edit_id

  def current_user
    if is_logged_in?
      User.find_by_id(session[:user_id])
    end
  end

  def is_logged_in?
    session[:user_id].present?
  end

  def require_logged_in
    redirect_to root_url unless is_logged_in?
  end

  def require_admin
    redirect_to games_path, notice: "You don't have permission to do that" unless current_user.admin
  end

  def clear_edit_id
    session.delete :edit_id
  end

end
