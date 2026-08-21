require "test_helper"

class GuessTheNumberPresetTest < ActiveSupport::TestCase
  setup do
    GuessTheNumberPreset.delete_all
  end

  test "requires a URL-safe unique slug" do
    GuessTheNumberPreset.create!(valid_attributes)

    duplicate = GuessTheNumberPreset.new(valid_attributes.merge(
      name: "Another Easy",
      slug: "EASY",
      position: 2
    ))
    malformed = GuessTheNumberPreset.new(valid_attributes.merge(
      name: "Malformed",
      slug: "not URL safe",
      position: 3
    ))

    assert_not duplicate.valid?
    assert_not malformed.valid?
    assert_includes duplicate.errors[:slug], "has already been taken"
    assert malformed.errors[:slug].present?
  end

  test "requires a range with a greater maximum" do
    inverted = GuessTheNumberPreset.new(valid_attributes.merge(min_number: 10, max_number: 10))

    assert_not inverted.valid?
    assert inverted.errors[:max_number].present?
  end

  test "requires a positive guess round count" do
    preset = GuessTheNumberPreset.new(valid_attributes.merge(guess_rounds: 0))

    assert_not preset.valid?
    assert preset.errors[:guess_rounds].present?
  end

  private

  def valid_attributes
    {
      name: "Easy",
      slug: "easy",
      description: "A quick 1–10 round for new groups.",
      instructions: "Each guesser gets 2 attempts. Closest guess wins; ties stay ties.",
      min_number: 1,
      max_number: 10,
      guess_rounds: 2,
      position: 1
    }
  end
end
