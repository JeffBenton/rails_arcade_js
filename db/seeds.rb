# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Game.destroy_all
Manufacturer.destroy_all
Play.destroy_all


def create_game(name, manufacturer)
  Game.create(name: name, token_cost: rand(10..20), manufacturer_id: manufacturer.id)
end

def create_manufacturer
  Manufacturer.create(name: Faker::Company.name)
end

manufacturers = []
(1..2).each do
  manufacturers << create_manufacturer
end

create_game("Skee Ball", manufacturers[rand(0..1)])
create_game("Pinball", manufacturers[rand(0..1)])
create_game("Whack-A-Mole", manufacturers[rand(0..1)])
create_game("Dance Dance Revolution", manufacturers[rand(0..1)])
create_game("Air Hockey", manufacturers[rand(0..1)])
create_game("Time Crisis", manufacturers[rand(0..1)])

