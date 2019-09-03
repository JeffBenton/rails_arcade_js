class PlaysController < ApplicationController
  before_action :require_logged_in

  def show
    @play = Play.find_by(id: params[:id])
  end

  def create
    play = Play.create(plays_params)
    if play.valid?
      play.play_game
      redirect_to play_path(play)
    else
      return redirect_to game_path(play.game), notice: "Insufficient tokens"
    end
  end

  private

  def plays_params
    params.require(:plays).permit(:game_id, :difficulty, :user_id)
  end
end