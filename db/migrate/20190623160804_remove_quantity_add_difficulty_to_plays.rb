class RemoveQuantityAddDifficultyToPlays < ActiveRecord::Migration[5.2]
  def change
    remove_column :plays, :quantity
    add_column :plays, :difficulty, :string
  end
end
