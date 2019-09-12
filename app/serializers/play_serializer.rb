class PlaySerializer < ActiveModel::Serializer
  attributes :id, :created_at, :difficulty, :user
  belongs_to :game
end
