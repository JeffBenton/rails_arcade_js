class PlaySerializer < ActiveModel::Serializer
  attributes :id, :created_at, :difficulty
  belongs_to :user
end
