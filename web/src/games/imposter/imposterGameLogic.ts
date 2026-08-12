export type WordEntry = {
  id: number
  word: string
  hint: string
}

export type WordPack = {
  id: number
  name: string
  slug: string
  description: string
  words: WordEntry[]
}

export type RoundPlayer = {
  id: string
  name: string
  active: boolean
  role: 'regular' | 'imposter'
}

export type ImposterRound = {
  players: RoundPlayer[]
  packName: string
  secretWord: string
  hint: string
  imposterId: string
  startingPlayerId: string
}

export type VoteResult = {
  leaders: string[]
  tally: Record<string, number>
}

function randomIndex(length: number, random: () => number) {
  return Math.min(Math.floor(random() * length), length - 1)
}

export function createRound(playerNames: string[], pack: WordPack, random = Math.random): ImposterRound {
  if (playerNames.length < 4 || playerNames.length > 8) {
    throw new Error('Imposter requires 4–8 players.')
  }

  if (pack.words.length === 0) {
    throw new Error('Choose a word pack with at least one word.')
  }

  const names = playerNames.map((name) => name.trim())
  if (names.some((name) => !name)) throw new Error('Every player needs a name.')
  if (new Set(names.map((name) => name.toLocaleLowerCase())).size !== names.length) {
    throw new Error('Player names must be unique.')
  }

  const imposterIndex = randomIndex(names.length, random)
  const entry = pack.words[randomIndex(pack.words.length, random)]
  const startingPlayerIndex = randomIndex(names.length, random)
  const players = names.map((name, index) => ({
    id: `player-${index + 1}`,
    name,
    active: true,
    role: index === imposterIndex ? 'imposter' as const : 'regular' as const,
  }))

  return {
    players,
    packName: pack.name,
    secretWord: entry.word,
    hint: entry.hint,
    imposterId: players[imposterIndex].id,
    startingPlayerId: players[startingPlayerIndex].id,
  }
}

export function tallyVotes(votes: Record<string, string>, candidateIds: string[]): VoteResult {
  const tally = Object.fromEntries(candidateIds.map((candidateId) => [candidateId, 0]))

  Object.values(votes).forEach((candidateId) => {
    if (candidateId in tally) tally[candidateId] += 1
  })

  const highestVoteCount = Math.max(...Object.values(tally))
  return {
    tally,
    leaders: candidateIds.filter((candidateId) => tally[candidateId] === highestVoteCount),
  }
}

export function eliminatePlayer(round: ImposterRound, playerId: string): ImposterRound {
  const players = round.players.map((player) => (
    player.id === playerId ? { ...player, active: false } : player
  ))
  let startingPlayerId = round.startingPlayerId

  if (startingPlayerId === playerId) {
    const eliminatedIndex = players.findIndex((player) => player.id === playerId)
    for (let offset = 1; offset < players.length; offset += 1) {
      const candidate = players[(eliminatedIndex + offset) % players.length]
      if (candidate.active) {
        startingPlayerId = candidate.id
        break
      }
    }
  }

  return {
    ...round,
    players,
    startingPlayerId,
  }
}

export function activePlayers(round: ImposterRound) {
  return round.players.filter((player) => player.active)
}

export function imposterHasSurvivedToFinalTwo(round: ImposterRound) {
  const activeRegulars = activePlayers(round).filter((player) => player.role === 'regular')
  return activeRegulars.length <= 1
}

export function guessesMatch(guess: string, secretWord: string) {
  return guess.trim().toLocaleLowerCase() === secretWord.trim().toLocaleLowerCase()
}
