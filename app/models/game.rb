class Game < ApplicationRecord
  has_many :plays
  has_many :users, through: :plays
  belongs_to :manufacturer

  validates :name, presence: true, uniqueness: true
  validates :token_cost, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  accepts_nested_attributes_for :manufacturer, reject_if: :all_blank

  scope :playable, ->(tokens) { where("token_cost <= ?", tokens).order(name: :asc)}
  scope :cheapest, ->() { order(token_cost: :asc).limit(3) }
end
