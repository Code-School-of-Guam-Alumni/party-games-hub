require "test_helper"

class ImposterWordPacksApiTest < ActionDispatch::IntegrationTest
  test "lists active packs and their words" do
    active_pack = ImposterWordPack.create!(
      name: "Everyday Mix",
      slug: "everyday-mix",
      description: "Familiar words"
    )
    active_pack.imposter_words.create!(word: "Pizza", hint: "Cheese")
    ImposterWordPack.create!(
      name: "Hidden Pack",
      slug: "hidden-pack",
      description: "Not ready",
      active: false
    )

    get "/api/v1/imposter_word_packs"

    assert_response :success
    assert_equal "application/json", response.media_type

    packs = response.parsed_body.fetch("word_packs")
    assert_equal 1, packs.length
    assert_equal "everyday-mix", packs.first.fetch("slug")
    assert_equal [ { "id" => active_pack.imposter_words.first.id, "word" => "Pizza", "hint" => "Cheese" } ], packs.first.fetch("words")
  end

  test "returns an empty collection when no packs are active" do
    get "/api/v1/imposter_word_packs"

    assert_response :success
    assert_equal [], response.parsed_body.fetch("word_packs")
  end
end
