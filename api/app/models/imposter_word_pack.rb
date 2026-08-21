class ImposterWordPack < ApplicationRecord
  has_many :imposter_words, -> { order(:word) }, dependent: :destroy, inverse_of: :imposter_word_pack

  normalizes :slug, with: ->(slug) { slug.strip.downcase }

  validates :name, :slug, :description, presence: true
  validates :slug,
    uniqueness: { case_sensitive: false },
    format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/ }

  scope :active, -> { where(active: true) }
end
