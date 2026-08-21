module Api
  module V1
    class ImposterWordPacksController < ApplicationController
      def index
        packs = ImposterWordPack.active.includes(:imposter_words).order(:name)

        render json: { word_packs: packs.map { |pack| serialize(pack) } }
      end

      private

      def serialize(pack)
        {
          id: pack.id,
          name: pack.name,
          slug: pack.slug,
          description: pack.description,
          words: pack.imposter_words.map do |word|
            { id: word.id, word: word.word, hint: word.hint }
          end
        }
      end
    end
  end
end
