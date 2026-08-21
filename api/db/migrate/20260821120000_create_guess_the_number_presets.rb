class CreateGuessTheNumberPresets < ActiveRecord::Migration[8.1]
  def change
    create_table :guess_the_number_presets do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description, null: false
      t.text :instructions, null: false
      t.integer :min_number, null: false
      t.integer :max_number, null: false
      t.integer :guess_rounds, null: false
      t.integer :position, null: false
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :guess_the_number_presets, "lower(slug)", unique: true, name: "index_guess_the_number_presets_on_lower_slug"
    add_index :guess_the_number_presets, :active
    add_index :guess_the_number_presets, :position
  end
end
