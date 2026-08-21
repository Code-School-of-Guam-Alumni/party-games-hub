import { describe, expect, it } from 'vitest'
import {
  buildRoundBoard,
  clamp,
  heatLabel,
  nextKeeperId,
  parseGuess,
  rangeMidpoint,
  rankBestGuesses,
  type Player,
} from './guessTheNumberGameLogic'

const guessers: Player[] = [
  { id: 'p1', name: 'Ada' },
  { id: 'p2', name: 'Bo' },
  { id: 'p3', name: 'Cy' },
]

describe('guess input', () => {
  it('accepts integers inside the selected range', () => {
    expect(parseGuess('7', 1, 10)).toBe(7)
    expect(parseGuess('1', 1, 10)).toBe(1)
    expect(parseGuess('10', 1, 10)).toBe(10)
  })

  it('rejects blank, decimal, and out-of-range guesses', () => {
    expect(parseGuess('', 1, 10)).toBeNull()
    expect(parseGuess('3.5', 1, 10)).toBeNull()
    expect(parseGuess('0', 1, 10)).toBeNull()
    expect(parseGuess('11', 1, 10)).toBeNull()
  })

  it('clamps a secret draft to the preset range', () => {
    expect(clamp(50, 1, 10)).toBe(10)
    expect(clamp(-3, 0, 4200)).toBe(0)
    expect(rangeMidpoint(1, 100)).toBe(51)
  })
})

describe('scoring', () => {
  it('ranks a round board by distance without revealing the secret', () => {
    const board = buildRoundBoard(guessers, { p1: 10, p2: 40, p3: 25 }, 20, 1)

    expect(board.map((entry) => entry.playerId)).toEqual(['p3', 'p1', 'p2'])
    expect(board[0]).toMatchObject({ name: 'Cy', guess: 25, distance: 5, round: 1 })
  })

  it('crowns the closest player and keeps ties instead of breaking them', () => {
    const ranked = rankBestGuesses([
      { playerId: 'p1', name: 'Ada', guess: 40, distance: 20, round: 1 },
      { playerId: 'p2', name: 'Bo', guess: 55, distance: 5, round: 1 },
      { playerId: 'p2', name: 'Bo', guess: 80, distance: 30, round: 2 },
      { playerId: 'p3', name: 'Cy', guess: 45, distance: 5, round: 2 },
    ])

    expect(ranked.filter((entry) => entry.isWinner).map((entry) => entry.playerId)).toEqual([
      'p2',
      'p3',
    ])
    expect(ranked.find((entry) => entry.playerId === 'p2')?.guess).toBe(55)
  })

  it('uses hotter labels as guesses get closer', () => {
    expect(heatLabel(0, 100)).toBe('Bullseye energy 🎯')
    expect(heatLabel(4, 100)).toBe('Scorching ☄️')
    expect(heatLabel(90, 100)).toBe('Ice cold 🧊')
  })
})

describe('keeper rotation', () => {
  it('moves the secret-number role to the next player and wraps around', () => {
    expect(nextKeeperId(guessers, 'p1')).toBe('p2')
    expect(nextKeeperId(guessers, 'p3')).toBe('p1')
  })
})
