class UpdateUserTokens < ActiveRecord::Migration[5.2]
  def change
    change_column :users, :tokens, :integer, default: 200
  end
end
