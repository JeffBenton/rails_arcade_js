class Play < ApplicationRecord
  belongs_to :user
  belongs_to :game

  validate :playable?, on: :create

  def play_game
    self.user.tokens -= self.game.token_cost
    self.user.save(validate: false)
  end

  def playable?
    errors.add(:tokens, "Insufficient tokens") if self.user.tokens < self.game.token_cost
  end
end
