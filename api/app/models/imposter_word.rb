class ImposterWord < ApplicationRecord
  belongs_to :imposter_word_pack, inverse_of: :imposter_words

  normalizes :word, :hint, with: ->(value) { value.strip }

  validates :word, :hint, presence: true
  validates :word, uniqueness: { scope: :imposter_word_pack_id, case_sensitive: false }
end
