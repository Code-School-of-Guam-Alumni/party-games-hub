class GuessTheNumberPreset < ApplicationRecord
  normalizes :slug, with: ->(slug) { slug.strip.downcase }
  normalizes :name, :description, :instructions, with: ->(value) { value.strip }

  validates :name, :slug, :description, :instructions, presence: true
  validates :slug,
    uniqueness: { case_sensitive: false },
    format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/ }
  validates :min_number, :max_number, :guess_rounds, :position,
    presence: true,
    numericality: { only_integer: true }
  validates :min_number, numericality: { greater_than_or_equal_to: 0 }
  validates :max_number, comparison: { greater_than: :min_number }
  validates :guess_rounds, numericality: { greater_than: 0 }
  validates :position, numericality: { greater_than: 0 }

  scope :active, -> { where(active: true) }
end
