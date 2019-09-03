class User < ApplicationRecord
  has_many :plays
  has_many :games, through: :plays
  has_secure_password

  validates :name, uniqueness: true, length: { in: 2..20}
  validates :password, presence: true, on: :create


  def played_games
    self.games.order(name: :asc).uniq
  end

  def show_plays
    self.plays.order(id: :desc)
  end

end
