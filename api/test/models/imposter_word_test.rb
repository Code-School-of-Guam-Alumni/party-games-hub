require "test_helper"

class ImposterWordTest < ActiveSupport::TestCase
  setup do
    ImposterWord.delete_all
    ImposterWordPack.delete_all
    @pack = ImposterWordPack.create!(
      name: "Everyday Mix",
      slug: "everyday-mix",
      description: "Familiar words"
    )
  end

  test "requires a word and hint" do
    entry = @pack.imposter_words.new

    assert_not entry.valid?
    assert_includes entry.errors[:word], "can't be blank"
    assert_includes entry.errors[:hint], "can't be blank"
  end

  test "keeps words unique within a pack" do
    @pack.imposter_words.create!(word: "Pizza", hint: "Cheese")
    duplicate = @pack.imposter_words.new(word: "PIZZA", hint: "Dinner")

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:word], "has already been taken"
  end
end
