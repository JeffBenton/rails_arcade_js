class GamesController < ApplicationController
  before_action :find_game, only: [:show, :edit, :update]
  before_action :require_logged_in
  before_action :require_admin, only: [:new, :create, :edit, :update, :destroy]

  def index
    params[:manufacturer_id].nil? ? @games = Game.all : @games = Manufacturer.find_by(id: params[:manufacturer_id]).games

    # @all_games = Game.all.order(name: :asc)
    # @playable_game = Game.playable(current_user.tokens)
  end


  def cheapest
    @games = Game.cheapest
  end

  def show
  end


  def new
    @game = Game.new(manufacturer_id: params[:manufacturer_id])
  end

  def create
    @game = Game.new(game_params)
    if @game.save
      redirect_to @game
    else
      render :new
    end
  end

  def edit
    session[:edit_id] = params[:id]
  end

  def update
    if session[:edit_id] != params[:id]
      clear_edit_id
      return redirect_to game_path(session[:edit_id]), notice: "You can't do that"
    end

    @game.update(game_params)
    if @game.valid?
      clear_edit_id
      redirect_to game_path(@game)
    else
      render :edit
    end
  end

  def destroy
    Game.destroy(params[:id])
    Play.where(game_id: params[:id]).destroy_all
    redirect_to games_path
  end

  private

  def find_game
    @game = Game.find_by(id: params[:id])
  end

  def game_params
    params.require(:game).permit(:name, :token_cost, :manufacturer_id, manufacturer_attributes: [:name])
  end
end