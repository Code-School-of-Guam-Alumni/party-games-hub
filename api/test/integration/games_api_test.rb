require "test_helper"

class GamesApiTest < ActionDispatch::IntegrationTest
  test "lists the four planned games" do
    get "/api/v1/games"

    assert_response :success
    body = response.parsed_body
    assert_equal 4, body.fetch("games").length
    assert_equal "rule-wheel", body.fetch("games").first.fetch("slug")
    assert_equal "Leon", body.fetch("games").last.fetch("owner")
  end
end
