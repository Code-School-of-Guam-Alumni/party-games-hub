export type RangePreset = {
  id: number
  name: string
  slug: string
  description: string
  instructions: string
  min_number: number
  max_number: number
  guess_rounds: number
}

export type Player = {
  id: string
  name: string
}

export type RoundGuess = {
  playerId: string
  name: string
  guess: number
  distance: number
  round: number
}

export type GuessResult = RoundGuess & {
  isWinner: boolean
}

const heatLabels = [
  'Ice cold 🧊',
  'Getting warmer 🌡️',
  'Toasty 🔥',
  'Scorching ☄️',
  'Bullseye energy 🎯',
] as const

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function rangeMidpoint(min: number, max: number) {
  return Math.round((min + max) / 2)
}

export function parseGuess(raw: string, min: number, max: number) {
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) return null
  if (parsed < min || parsed > max) return null
  return parsed
}

export function heatLabel(distance: number, span: number) {
  const ratio = span === 0 ? 0 : distance / span
  if (distance === 0) return heatLabels[4]
  if (ratio <= 0.05) return heatLabels[3]
  if (ratio <= 0.15) return heatLabels[2]
  if (ratio <= 0.35) return heatLabels[1]
  return heatLabels[0]
}

export function buildRoundBoard(
  guessers: Player[],
  roundGuesses: Record<string, number>,
  secretNumber: number,
  round: number,
): RoundGuess[] {
  return guessers
    .filter((player) => roundGuesses[player.id] !== undefined)
    .map((player) => {
      const guess = roundGuesses[player.id]
      return {
        playerId: player.id,
        name: player.name,
        guess,
        distance: Math.abs(guess - secretNumber),
        round,
      }
    })
    .sort((a, b) => a.distance - b.distance)
}

export function rankBestGuesses(history: RoundGuess[]): GuessResult[] {
  const bestByPlayer = new Map<string, GuessResult>()

  for (const entry of history) {
    const existing = bestByPlayer.get(entry.playerId)
    if (!existing || entry.distance < existing.distance) {
      bestByPlayer.set(entry.playerId, { ...entry, isWinner: false })
    }
  }

  const ranked = [...bestByPlayer.values()].sort((a, b) => a.distance - b.distance)
  if (ranked.length === 0) return ranked

  const bestDistance = ranked[0].distance
  return ranked.map((entry) => ({ ...entry, isWinner: entry.distance === bestDistance }))
}

export function nextKeeperId(players: Player[], keeperId: string) {
  if (players.length === 0) return keeperId

  const currentIndex = players.findIndex((player) => player.id === keeperId)
  const startIndex = currentIndex < 0 ? 0 : currentIndex
  return players[(startIndex + 1) % players.length].id
}
