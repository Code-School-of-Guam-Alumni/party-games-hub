module Api
  module V1
    class GamesController < ApplicationController
      GAMES = [
        {
          slug: "rule-wheel",
          name: "Rule Wheel",
          summary: "Spin for a house rule that stays active during the game night.",
          play_mode: "shared screen",
          milestone: "first playable"
        },
        {
          slug: "matching",
          name: "Matching",
          summary: "Flip cards and collect matching pairs.",
          play_mode: "pass the device",
          milestone: "round two"
        },
        {
          slug: "guess-the-number",
          name: "Guess the Number",
          summary: "Choose a secret number and see who gets closest.",
          play_mode: "pass the device",
          milestone: "round two"
        },
        {
          slug: "imposter",
          name: "Imposter",
          summary: "Blend in, share clues, and identify the player who does not know the word.",
          play_mode: "pass the device",
          milestone: "team stretch"
        }
      ].freeze

      def index
        render json: { games: GAMES }
      end
    end
  end
end
