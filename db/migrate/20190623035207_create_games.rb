class CreateGames < ActiveRecord::Migration[5.2]
  def change
    create_table :games do |t|
      t.string :name
      t.integer :token_cost
      t.integer :manufacturer_id

      t.timestamps
    end
  end
end
