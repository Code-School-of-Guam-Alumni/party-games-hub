require "test_helper"

class GuessTheNumberPresetsApiTest < ActionDispatch::IntegrationTest
  setup do
    GuessTheNumberPreset.delete_all
  end

  test "lists active presets with range and instruction fields" do
    active_preset = GuessTheNumberPreset.create!(
      name: "Classic",
      slug: "classic",
      description: "The standard 1–100 hunt.",
      instructions: "Each guesser gets 5 attempts. After every full pass, players get hot and cold clues. Closest guess wins; ties stay ties.",
      min_number: 1,
      max_number: 100,
      guess_rounds: 5,
      position: 2
    )
    GuessTheNumberPreset.create!(
      name: "Hidden Range",
      slug: "hidden-range",
      description: "Not ready",
      instructions: "Do not show this preset.",
      min_number: 1,
      max_number: 20,
      guess_rounds: 3,
      position: 9,
      active: false
    )

    get "/api/v1/guess_the_number_presets"

    assert_response :success
    assert_equal "application/json", response.media_type

    presets = response.parsed_body.fetch("range_presets")
    assert_equal 1, presets.length
    assert_equal(
      {
        "id" => active_preset.id,
        "name" => "Classic",
        "slug" => "classic",
        "description" => "The standard 1–100 hunt.",
        "instructions" => active_preset.instructions,
        "min_number" => 1,
        "max_number" => 100,
        "guess_rounds" => 5
      },
      presets.first
    )
  end

  test "returns an empty collection when no presets are active" do
    get "/api/v1/guess_the_number_presets"

    assert_response :success
    assert_equal [], response.parsed_body.fetch("range_presets")
  end
end
