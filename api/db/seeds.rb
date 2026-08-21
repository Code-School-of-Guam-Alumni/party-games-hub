guess_the_number_presets = [
  {
    name: "Easy",
    slug: "easy",
    description: "A quick 1–10 round for new groups.",
    instructions: "Each guesser gets 2 attempts. After every full pass, players get hot and cold clues. The closest guess wins. Ties stay ties instead of being broken at random.",
    min_number: 1,
    max_number: 10,
    guess_rounds: 2,
    position: 1
  },
  {
    name: "Classic",
    slug: "classic",
    description: "The standard 1–100 hunt.",
    instructions: "Each guesser gets 5 attempts. After every full pass, players get hot and cold clues. The closest guess wins. Ties stay ties instead of being broken at random.",
    min_number: 1,
    max_number: 100,
    guess_rounds: 5,
    position: 2
  },
  {
    name: "Chaos",
    slug: "chaos",
    description: "A wide 1–1000 range for longer hunts.",
    instructions: "Each guesser gets 8 attempts. After every full pass, players get hot and cold clues. The closest guess wins. Ties stay ties instead of being broken at random.",
    min_number: 1,
    max_number: 1000,
    guess_rounds: 8,
    position: 3
  },
  {
    name: "Galaxy",
    slug: "galaxy",
    description: "A 0–4200 range for the biggest hunt.",
    instructions: "Each guesser gets 8 attempts. After every full pass, players get hot and cold clues. The closest guess wins. Ties stay ties instead of being broken at random.",
    min_number: 0,
    max_number: 4200,
    guess_rounds: 8,
    position: 4
  }
]

guess_the_number_presets.each do |attributes|
  preset = GuessTheNumberPreset.find_or_initialize_by(slug: attributes.fetch(:slug))
  preset.update!(attributes.merge(active: true))
end

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
