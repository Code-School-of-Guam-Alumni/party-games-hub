# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_08_21_120000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "guess_the_number_presets", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.text "description", null: false
    t.integer "guess_rounds", null: false
    t.text "instructions", null: false
    t.integer "max_number", null: false
    t.integer "min_number", null: false
    t.string "name", null: false
    t.integer "position", null: false
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.index "lower((slug)::text)", name: "index_guess_the_number_presets_on_lower_slug", unique: true
    t.index ["active"], name: "index_guess_the_number_presets_on_active"
    t.index ["position"], name: "index_guess_the_number_presets_on_position"
  end

  create_table "imposter_word_packs", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.text "description", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.index "lower((slug)::text)", name: "index_imposter_word_packs_on_lower_slug", unique: true
    t.index ["active"], name: "index_imposter_word_packs_on_active"
  end

  create_table "imposter_words", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "hint", null: false
    t.bigint "imposter_word_pack_id", null: false
    t.datetime "updated_at", null: false
    t.string "word", null: false
    t.index "imposter_word_pack_id, lower((word)::text)", name: "index_imposter_words_on_pack_and_lower_word", unique: true
    t.index ["imposter_word_pack_id"], name: "index_imposter_words_on_imposter_word_pack_id"
  end

  add_foreign_key "imposter_words", "imposter_word_packs"
end
