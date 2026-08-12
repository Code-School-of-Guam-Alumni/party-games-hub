class CreateImposterWords < ActiveRecord::Migration[8.1]
  def change
    create_table :imposter_words do |t|
      t.references :imposter_word_pack, null: false, foreign_key: true
      t.string :word, null: false
      t.string :hint, null: false

      t.timestamps
    end

    add_index :imposter_words,
      "imposter_word_pack_id, lower(word)",
      unique: true,
      name: "index_imposter_words_on_pack_and_lower_word"
  end
end
