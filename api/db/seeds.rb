imposter_packs = [
  {
    name: "Everyday Mix",
    slug: "everyday-mix",
    description: "Familiar places, objects, and activities for an easy first round.",
    words: [
      [ "Airport", "travel" ],
      [ "Bicycle", "pedals" ],
      [ "Birthday", "cake" ],
      [ "Campfire", "smoke" ],
      [ "Coffee", "morning" ],
      [ "Garden", "flowers" ],
      [ "Library", "books" ],
      [ "Movie", "popcorn" ],
      [ "Pizza", "cheese" ],
      [ "School", "teacher" ],
      [ "Umbrella", "rain" ],
      [ "Beach", "sand" ]
    ]
  },
  {
    name: "Guam Life",
    slug: "guam-life",
    description: "Island places, food, and traditions familiar to many Guam groups.",
    words: [
      [ "Barbecue", "grill" ],
      [ "Chamorro", "language" ],
      [ "Coconut", "island" ],
      [ "Fiesta", "gathering" ],
      [ "Latte Stone", "ancient" ],
      [ "Mango", "fruit" ],
      [ "Proa", "canoe" ],
      [ "Rainy Season", "umbrella" ],
      [ "Snorkel", "ocean" ],
      [ "Sunset", "orange" ],
      [ "Talofofo", "village" ],
      [ "Village", "mayor" ]
    ]
  }
]

imposter_packs.each do |attributes|
  words = attributes.fetch(:words)
  pack = ImposterWordPack.find_or_initialize_by(slug: attributes.fetch(:slug))
  pack.update!(attributes.except(:words).merge(active: true))

  words.each do |word, hint|
    pack.imposter_words.find_or_initialize_by(word: word).update!(hint: hint)
  end
end
