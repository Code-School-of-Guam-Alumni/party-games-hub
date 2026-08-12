require "test_helper"

class ImposterWordPackTest < ActiveSupport::TestCase
  test "requires a URL-safe unique slug" do
    ImposterWordPack.create!(
      name: "Everyday Mix",
      slug: "everyday-mix",
      description: "Familiar words"
    )

    duplicate = ImposterWordPack.new(
      name: "Another Mix",
      slug: "EVERYDAY-MIX",
      description: "Duplicate slug"
    )
    malformed = ImposterWordPack.new(
      name: "Malformed",
      slug: "not URL safe",
      description: "Malformed slug"
    )

    assert_not duplicate.valid?
    assert_not malformed.valid?
    assert_includes duplicate.errors[:slug], "has already been taken"
    assert malformed.errors[:slug].present?
  end

  test "removes its words when destroyed" do
    pack = ImposterWordPack.create!(
      name: "Test Pack",
      slug: "test-pack",
      description: "Temporary words"
    )
    pack.imposter_words.create!(word: "Pizza", hint: "Cheese")

    assert_difference("ImposterWord.count", -1) { pack.destroy! }
  end
end
