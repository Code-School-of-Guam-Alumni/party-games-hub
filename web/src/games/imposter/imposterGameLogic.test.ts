import { describe, expect, it } from 'vitest'
import {
  activePlayers,
  createRound,
  eliminatePlayer,
  guessesMatch,
  imposterHasSurvivedToFinalTwo,
  tallyVotes,
  type WordPack,
} from './imposterGameLogic'

const pack: WordPack = {
  id: 1,
  name: 'Everyday Mix',
  slug: 'everyday-mix',
  description: 'Familiar words',
  words: [
    { id: 1, word: 'Pizza', hint: 'cheese' },
    { id: 2, word: 'Beach', hint: 'sand' },
  ],
}

function queuedRandom(...values: number[]) {
  let index = 0
  return () => values[index++] ?? 0
}

describe('createRound', () => {
  it('assigns exactly one imposter and a deterministic word', () => {
    const round = createRound(
      ['Ada', 'Bo', 'Cy', 'Dee'],
      pack,
      queuedRandom(0.3, 0.9, 0.6),
    )

    expect(round.players.filter((player) => player.role === 'imposter')).toHaveLength(1)
    expect(round.imposterId).toBe('player-2')
    expect(round.secretWord).toBe('Beach')
    expect(round.startingPlayerId).toBe('player-3')
  })

  it('rejects invalid group sizes and duplicate names', () => {
    expect(() => createRound(['Ada', 'Bo', 'Cy'], pack)).toThrow('4–8 players')
    expect(() => createRound(['Ada', 'ada', 'Cy', 'Dee'], pack)).toThrow('unique')
  })

  it('avoids immediately repeating the word and Imposter when replaying', () => {
    const firstRound = createRound(['Ada', 'Bo', 'Cy', 'Dee'], pack, queuedRandom(0, 0, 0))
    const replay = createRound(['Ada', 'Bo', 'Cy', 'Dee'], pack, queuedRandom(0, 0, 0), firstRound)

    expect(replay.imposterId).not.toBe(firstRound.imposterId)
    expect(replay.secretWord).not.toBe(firstRound.secretWord)
  })
})

describe('voting and outcomes', () => {
  it('reports a single leader and a tie', () => {
    expect(tallyVotes({ a: 'p1', b: 'p1', c: 'p2' }, ['p1', 'p2']).leaders).toEqual(['p1'])
    expect(tallyVotes({ a: 'p1', b: 'p2' }, ['p1', 'p2']).leaders).toEqual(['p1', 'p2'])
  })

  it('eliminates a regular and detects the Imposter final-two win', () => {
    const round = createRound(['Ada', 'Bo', 'Cy', 'Dee'], pack, queuedRandom(0, 0, 0))
    const afterOne = eliminatePlayer(round, 'player-2')
    const afterTwo = eliminatePlayer(afterOne, 'player-3')

    expect(activePlayers(afterOne)).toHaveLength(3)
    expect(imposterHasSurvivedToFinalTwo(afterOne)).toBe(false)
    expect(imposterHasSurvivedToFinalTwo(afterTwo)).toBe(true)
  })

  it('moves the clue lead when the starting player is eliminated', () => {
    const round = createRound(['Ada', 'Bo', 'Cy', 'Dee'], pack, queuedRandom(0, 0, 0.3))
    const updatedRound = eliminatePlayer(round, 'player-2')

    expect(round.startingPlayerId).toBe('player-2')
    expect(updatedRound.startingPlayerId).toBe('player-3')
  })

  it('checks final guesses without case or surrounding-space sensitivity', () => {
    expect(guessesMatch('  pIzZa ', 'Pizza')).toBe(true)
    expect(guessesMatch('pasta', 'Pizza')).toBe(false)
  })
})
