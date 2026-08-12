class CreateImposterWordPacks < ActiveRecord::Migration[8.1]
  def change
    create_table :imposter_word_packs do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description, null: false
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :imposter_word_packs, "lower(slug)", unique: true, name: "index_imposter_word_packs_on_lower_slug"
    add_index :imposter_word_packs, :active
  end
end
