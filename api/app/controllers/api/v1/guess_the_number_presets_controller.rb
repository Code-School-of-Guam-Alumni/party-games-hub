module Api
  module V1
    class GuessTheNumberPresetsController < ApplicationController
      def index
        presets = GuessTheNumberPreset.active.order(:position, :name)

        render json: { range_presets: presets.map { |preset| serialize(preset) } }
      end

      private

      def serialize(preset)
        {
          id: preset.id,
          name: preset.name,
          slug: preset.slug,
          description: preset.description,
          instructions: preset.instructions,
          min_number: preset.min_number,
          max_number: preset.max_number,
          guess_rounds: preset.guess_rounds
        }
      end
    end
  end
end
