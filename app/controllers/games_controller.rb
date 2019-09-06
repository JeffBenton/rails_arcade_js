class GamesController < ApplicationController
  before_action :find_game, only: [:show, :edit, :update]
  before_action :require_logged_in
  before_action :require_admin, only: [:new, :create, :edit, :update, :destroy]

  def index
    params[:manufacturer_id].nil? ? @games = Game.order(name: :asc) : @games = Manufacturer.find_by(id: params[:manufacturer_id]).games
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @games }
    end

    # @all_games = Game.all.order(name: :asc)
    # @playable_game = Game.playable(current_user.tokens)
  end

  def playable
    @games = Game.playable(current_user.tokens)
    render json: @games
  end

  def cheapest
    @games = Game.cheapest
  end

  def last
    game = Game.last
    render json: game
  end

  def show
    respond_to do |format|
      format.html {
        @next = @game.next
        @previous = @game.previous
        render :show
      }
      format.json { render json: @game}
    end
  end

  def form
    render "_form",
           layout: false
  end

  def new
    @game = Game.new(manufacturer_id: params[:manufacturer_id])
  end

  def create
    @game = Game.new(game_params)
    if @game.save
      render json: @game
    else
      render json: @game.errors
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