class GameSerializer < ActiveModel::Serializer
  attributes :id, :name, :token_cost, :manufacturer_id
end
