import { useMemo, useState, type CSSProperties } from 'react'
import './GuessTheNumberGame.css'

type GuessTheNumberGameProps = {
  onBack: () => void
}

type Phase = 'setup' | 'secret' | 'handoff' | 'guessing' | 'round-feedback' | 'reveal'

type RangePreset = {
  id: string
  label: string
  min: number
  max: number
  vibe: string
  emoji: string
  guessRounds: number
}

type Player = {
  id: string
  name: string
}

type RoundGuess = {
  playerId: string
  name: string
  guess: number
  distance: number
  round: number
}

type GuessResult = {
  playerId: string
  name: string
  guess: number
  distance: number
  round: number
  isWinner: boolean
}

const rangePresets: RangePreset[] = [
  {
    id: 'easy',
    label: 'Easy',
    min: 1,
    max: 10,
    vibe: '2 guesses each',
    emoji: '☕',
    guessRounds: 2,
  },
  {
    id: 'classic',
    label: 'Classic',
    min: 1,
    max: 100,
    vibe: '5 guesses each',
    emoji: '🎯',
    guessRounds: 5,
  },
  {
    id: 'chaos',
    label: 'Chaos',
    min: 1,
    max: 1000,
    vibe: '8 guesses each',
    emoji: '🌪️',
    guessRounds: 8,
  },
  {
    id: 'galaxy',
    label: 'Galaxy',
    min: 0,
    max: 4200,
    vibe: '8 guesses each',
    emoji: '🌌',
    guessRounds: 8,
  },
]

const flairLines = [
  'Drumroll, please…',
  'The room holds its breath…',
  'Math is about to get dramatic…',
  'Someone is about to feel psychic…',
]

const exactWinLines = [
  '🎯 BULLSEYE! The secret is cracked!',
  '✨ Perfect number! The crowd goes wild!',
  '💥 Nailed it! Round over!',
  '🏆 Exact match — instant win!',
]

const hypeReactions = [
  'Ice cold 🧊',
  'Getting warmer 🌡️',
  'Toasty 🔥',
  'Scorching ☄️',
  'Bullseye energy 🎯',
]

function createPlayers(): Player[] {
  return [
    { id: 'p1', name: 'Player 1' },
    { id: 'p2', name: 'Player 2' },
    { id: 'p3', name: 'Player 3' },
  ]
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function heatLabel(distance: number, span: number) {
  const ratio = span === 0 ? 0 : distance / span
  if (distance === 0) return hypeReactions[4]
  if (ratio <= 0.05) return hypeReactions[3]
  if (ratio <= 0.15) return hypeReactions[2]
  if (ratio <= 0.35) return hypeReactions[1]
  return hypeReactions[0]
}

function buildRoundBoard(
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

function GuessTheNumberGame({ onBack }: GuessTheNumberGameProps) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [rangeId, setRangeId] = useState('classic')
  const [players, setPlayers] = useState<Player[]>(createPlayers)
  const [keeperId, setKeeperId] = useState('p1')
  const [secretDraft, setSecretDraft] = useState(50)
  const [secretNumber, setSecretNumber] = useState<number | null>(null)
  const [peeking, setPeeking] = useState(false)
  const [guessDraft, setGuessDraft] = useState('')
  const [activeGuesserIndex, setActiveGuesserIndex] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [roundGuesses, setRoundGuesses] = useState<Record<string, number>>({})
  const [guessHistory, setGuessHistory] = useState<RoundGuess[]>([])
  const [latestRoundBoard, setLatestRoundBoard] = useState<RoundGuess[]>([])
  const [shakeHint, setShakeHint] = useState(false)
  const [showDrumroll, setShowDrumroll] = useState(false)
  const [flairIndex, setFlairIndex] = useState(0)
  const [pulseDial, setPulseDial] = useState(false)
  const [exactWinner, setExactWinner] = useState<{
    playerId: string
    name: string
    guess: number
    round: number
  } | null>(null)

  const selectedRange = rangePresets.find((preset) => preset.id === rangeId) ?? rangePresets[1]
  const totalRounds = selectedRange.guessRounds
  const keeper = players.find((player) => player.id === keeperId) ?? players[0]
  const guessers = players.filter((player) => player.id !== keeperId)
  const activeGuesser = guessers[activeGuesserIndex]
  const span = selectedRange.max - selectedRange.min
  const isFinalRound = currentRound >= totalRounds

  const finalResults: GuessResult[] = useMemo(() => {
    if (secretNumber === null || guessHistory.length === 0) return []

    const bestByPlayer = new Map<string, GuessResult>()

    for (const entry of guessHistory) {
      const existing = bestByPlayer.get(entry.playerId)
      if (!existing || entry.distance < existing.distance) {
        bestByPlayer.set(entry.playerId, {
          ...entry,
          isWinner: false,
        })
      }
    }

    const ranked = [...bestByPlayer.values()].sort((a, b) => a.distance - b.distance)
    if (ranked.length === 0) return ranked

    const best = ranked[0].distance
    return ranked.map((entry) => ({ ...entry, isWinner: entry.distance === best }))
  }, [guessHistory, secretNumber])

  const winners = finalResults.filter((result) => result.isWinner)

  const updatePlayerName = (id: string, name: string) => {
    setPlayers((current) => current.map((player) => (player.id === id ? { ...player, name } : player)))
  }

  const addPlayer = () => {
    if (players.length >= 8) return
    const nextNumber = players.length + 1
    const id = `p${Date.now()}`
    setPlayers((current) => [...current, { id, name: `Player ${nextNumber}` }])
  }

  const removePlayer = (id: string) => {
    if (players.length <= 3) return
    setPlayers((current) => current.filter((player) => player.id !== id))
    if (keeperId === id) {
      setKeeperId(players.find((player) => player.id !== id)?.id ?? players[0].id)
    }
  }

  const clearPlayState = () => {
    setSecretNumber(null)
    setRoundGuesses({})
    setGuessHistory([])
    setLatestRoundBoard([])
    setGuessDraft('')
    setActiveGuesserIndex(0)
    setCurrentRound(1)
    setPeeking(false)
    setShowDrumroll(false)
    setExactWinner(null)
  }

  const startSecretPhase = () => {
    const midpoint = Math.round((selectedRange.min + selectedRange.max) / 2)
    setSecretDraft(midpoint)
    clearPlayState()
    setPhase('secret')
    setPulseDial(true)
    window.setTimeout(() => setPulseDial(false), 700)
  }

  const lockSecret = () => {
    setSecretNumber(secretDraft)
    setPeeking(false)
    setCurrentRound(1)
    setRoundGuesses({})
    setGuessHistory([])
    setLatestRoundBoard([])
    setActiveGuesserIndex(0)
    setPhase('handoff')
  }

  const beginGuessing = () => {
    setGuessDraft('')
    setPhase('guessing')
  }

  const nudgeSecret = (delta: number) => {
    setSecretDraft((current) => clamp(current + delta, selectedRange.min, selectedRange.max))
    setPulseDial(true)
    window.setTimeout(() => setPulseDial(false), 220)
  }

  const randomizeSecret = () => {
    const next =
      Math.floor(Math.random() * (selectedRange.max - selectedRange.min + 1)) + selectedRange.min
    setSecretDraft(next)
    setPulseDial(true)
    window.setTimeout(() => setPulseDial(false), 350)
  }

  const triggerReveal = (onExactWin: boolean) => {
    setFlairIndex(
      Math.floor(Math.random() * (onExactWin ? exactWinLines.length : flairLines.length)),
    )
    setShowDrumroll(true)
    window.setTimeout(() => {
      setShowDrumroll(false)
      setPhase('reveal')
    }, onExactWin ? 900 : 1200)
  }

  const triggerExactWin = (winner: Player, guess: number, completedRoundGuesses: Record<string, number>) => {
    if (secretNumber === null) return

    const board = buildRoundBoard(guessers, completedRoundGuesses, secretNumber, currentRound)
    setLatestRoundBoard(board)
    setGuessHistory((history) => [...history, ...board])
    setExactWinner({ playerId: winner.id, name: winner.name, guess, round: currentRound })
    triggerReveal(true)
  }

  const finishRound = (completedRoundGuesses: Record<string, number>) => {
    if (secretNumber === null) return

    const exactHit = Object.entries(completedRoundGuesses).find(([, guess]) => guess === secretNumber)
    if (exactHit) {
      const [playerId, guess] = exactHit
      const winner = guessers.find((player) => player.id === playerId)
      if (winner) {
        triggerExactWin(winner, guess, completedRoundGuesses)
        return
      }
    }

    const board = buildRoundBoard(guessers, completedRoundGuesses, secretNumber, currentRound)
    setLatestRoundBoard(board)
    setGuessHistory((history) => [...history, ...board])

    if (currentRound >= totalRounds) {
      triggerReveal(false)
      return
    }

    setPhase('round-feedback')
  }

  const continueToNextRound = () => {
    setCurrentRound((round) => round + 1)
    setRoundGuesses({})
    setActiveGuesserIndex(0)
    setGuessDraft('')
    setPhase('handoff')
  }

  const submitGuess = () => {
    if (!activeGuesser || secretNumber === null) return

    const parsed = Number(guessDraft)
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
      setShakeHint(true)
      window.setTimeout(() => setShakeHint(false), 400)
      return
    }

    if (parsed < selectedRange.min || parsed > selectedRange.max) {
      setShakeHint(true)
      window.setTimeout(() => setShakeHint(false), 400)
      return
    }

    const nextRoundGuesses = { ...roundGuesses, [activeGuesser.id]: parsed }
    setRoundGuesses(nextRoundGuesses)
    setGuessDraft('')

    if (parsed === secretNumber) {
      triggerExactWin(activeGuesser, parsed, nextRoundGuesses)
      return
    }

    if (activeGuesserIndex >= guessers.length - 1) {
      finishRound(nextRoundGuesses)
      return
    }

    setActiveGuesserIndex((index) => index + 1)
    setPhase('handoff')
  }

  const rotateKeeperAndReplay = () => {
    const currentIndex = players.findIndex((player) => player.id === keeperId)
    const nextKeeper = players[(currentIndex + 1) % players.length]
    setKeeperId(nextKeeper.id)
    clearPlayState()
    setPhase('setup')
  }

  const resetRound = () => {
    clearPlayState()
    setPhase('setup')
  }

  const dialPercent =
    ((secretDraft - selectedRange.min) / Math.max(1, selectedRange.max - selectedRange.min)) * 100

  return (
    <main className="gtn-page">
      <nav className="gtn-nav" aria-label="Guess the Number navigation">
        <button className="gtn-back" type="button" onClick={onBack}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m12.5 4-6 6 6 6" />
          </svg>
          Back to game library
        </button>
        <span className="gtn-stage">Interactive skeleton · local playtest</span>
      </nav>

      <header className="gtn-hero">
        <div className="gtn-hero-copy">
          <p className="gtn-kicker">Pass the phone · Hot &amp; cold rounds</p>
          <h1>
            Guess the Number
            <span>Chase the heat.</span>
          </h1>
          <p className="gtn-summary">
            Everyone gets multiple guesses based on difficulty. After each full pass, check hot and
            cold vibes—then keep hunting. The secret stays locked until the final round.
          </p>
          <div className="gtn-facts" aria-label="Game details">
            <span>{players.length} players</span>
            <span>
              {selectedRange.min}–{selectedRange.max}
            </span>
            <span>
              {selectedRange.emoji} {selectedRange.label} · {totalRounds} guesses
            </span>
          </div>
        </div>

        <div className="gtn-hero-mark" aria-hidden="true">
          <div className={`gtn-dial ${pulseDial ? 'is-pulsing' : ''} ${peeking ? 'is-peeking' : ''}`}>
            <div className="gtn-dial-ring" />
            <div className="gtn-dial-ring gtn-dial-ring-mid" />
            <strong>
              {phase === 'secret' && peeking
                ? secretDraft
                : phase === 'reveal'
                  ? secretNumber
                  : '?'}
            </strong>
            <p>
              {phase === 'secret'
                ? peeking
                  ? 'Peek mode'
                  : 'Keep it secret'
                : phase === 'reveal'
                  ? 'Revealed'
                  : phase === 'round-feedback'
                    ? `Round ${currentRound} vibes`
                    : 'Secret locked'}
            </p>
          </div>
        </div>
      </header>

      {phase === 'setup' && (
        <div className="gtn-preview-grid">
          <section className="gtn-setup" aria-labelledby="gtn-setup-heading">
            <div className="gtn-section-heading">
              <div>
                <p className="gtn-label">Round setup</p>
                <h2 id="gtn-setup-heading">Build your crew</h2>
              </div>
              <span className="gtn-coming-soon">Difficulty sets guess count</span>
            </div>

            <div className="gtn-field">
              <p className="gtn-field-title" id="gtn-range-label">
                Difficulty &amp; range
              </p>
              <div className="gtn-range-grid" role="group" aria-labelledby="gtn-range-label">
                {rangePresets.map((preset) => (
                  <button
                    key={preset.id}
                    className={
                      rangeId === preset.id ? 'gtn-range-card is-selected' : 'gtn-range-card'
                    }
                    type="button"
                    onClick={() => setRangeId(preset.id)}
                  >
                    <span>
                      {preset.emoji} {preset.label}
                    </span>
                    <strong>
                      {preset.min}–{preset.max}
                    </strong>
                    <em>{preset.guessRounds} guesses each</em>
                  </button>
                ))}
              </div>
              <p className="gtn-helper-text">
                Selected mode: each guesser gets <strong>{totalRounds}</strong> attempts. Hot/cold
                updates after every full round—secret stays hidden until the last one.
              </p>
            </div>

            <div className="gtn-field">
              <label htmlFor="gtn-keeper">Secret-number keeper</label>
              <select
                id="gtn-keeper"
                value={keeperId}
                onChange={(event) => setKeeperId(event.target.value)}
              >
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="gtn-field">
              <div className="gtn-field-label">
                <p className="gtn-field-title">Players</p>
                <span>{players.length}/8</span>
              </div>
              <div className="gtn-player-list">
                {players.map((player, index) => (
                  <div className="gtn-player-row" key={player.id}>
                    <input
                      aria-label={`Player ${index + 1} name`}
                      type="text"
                      value={player.name}
                      maxLength={18}
                      onChange={(event) => updatePlayerName(player.id, event.target.value)}
                    />
                    <button
                      type="button"
                      className="gtn-ghost-btn"
                      disabled={players.length <= 3}
                      onClick={() => removePlayer(player.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="gtn-secondary"
                disabled={players.length >= 8}
                onClick={addPlayer}
              >
                + Add player
              </button>
            </div>

            <button className="gtn-start" type="button" onClick={startSecretPhase}>
              Pass phone to {keeper.name} →
            </button>
          </section>

          <aside className="gtn-result-preview" aria-labelledby="result-preview-heading">
            <div className="gtn-playground">
              <p className="gtn-label">Guess economy</p>
              <ul className="gtn-guess-economy">
                {rangePresets.map((preset) => (
                  <li key={preset.id} className={rangeId === preset.id ? 'is-active' : undefined}>
                    <strong>
                      {preset.emoji} {preset.label}
                    </strong>
                    <span>{preset.guessRounds} rounds of guessing</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gtn-result-copy">
              <p className="gtn-label">Hot &amp; cold loop</p>
              <h2 id="result-preview-heading">Clues first. Reveal later.</h2>
              <p>
                After everyone locks a guess, the heat board updates. No secret number until every
                allotted attempt is used—then we crown the closest hunter.
              </p>
            </div>
          </aside>
        </div>
      )}

      {phase === 'secret' && (
        <section className="gtn-panel gtn-secret-panel" aria-labelledby="secret-heading">
          <div className="gtn-section-heading">
            <div>
              <p className="gtn-label">Private moment</p>
              <h2 id="secret-heading">{keeper.name}, set the secret</h2>
            </div>
            <span className="gtn-coming-soon">{totalRounds} guess rounds ahead</span>
          </div>

          <div className="gtn-secret-layout">
            <div className={`gtn-secret-dial-wrap ${pulseDial ? 'is-pulsing' : ''}`}>
              <div
                className="gtn-secret-gauge"
                style={{ '--dial-percent': `${dialPercent}%` } as CSSProperties}
              >
                <strong>{peeking ? secretDraft : '•••'}</strong>
              </div>
              <p>
                Range {selectedRange.min}–{selectedRange.max}
              </p>
            </div>

            <div className="gtn-secret-controls">
              <label htmlFor="secret-slider">Slide to choose</label>
              <input
                id="secret-slider"
                type="range"
                min={selectedRange.min}
                max={selectedRange.max}
                value={secretDraft}
                onChange={(event) => setSecretDraft(Number(event.target.value))}
              />

              <div className="gtn-nudge-row">
                <button type="button" className="gtn-secondary" onClick={() => nudgeSecret(-1)}>
                  −1
                </button>
                <button type="button" className="gtn-secondary" onClick={() => nudgeSecret(-5)}>
                  −5
                </button>
                <button type="button" className="gtn-secondary" onClick={randomizeSecret}>
                  Surprise me
                </button>
                <button type="button" className="gtn-secondary" onClick={() => nudgeSecret(5)}>
                  +5
                </button>
                <button type="button" className="gtn-secondary" onClick={() => nudgeSecret(1)}>
                  +1
                </button>
              </div>

              <button
                type="button"
                className={`gtn-peek ${peeking ? 'is-on' : ''}`}
                onMouseDown={() => setPeeking(true)}
                onMouseUp={() => setPeeking(false)}
                onMouseLeave={() => setPeeking(false)}
                onTouchStart={() => setPeeking(true)}
                onTouchEnd={() => setPeeking(false)}
              >
                Hold to peek
              </button>

              <button className="gtn-start" type="button" onClick={lockSecret}>
                Lock secret &amp; hide screen
              </button>
              <button className="gtn-ghost-btn" type="button" onClick={resetRound}>
                Cancel round
              </button>
            </div>
          </div>
        </section>
      )}

      {phase === 'handoff' && (
        <section className="gtn-panel gtn-handoff-panel" aria-labelledby="handoff-heading">
          <p className="gtn-label">
            Guess round {currentRound} of {totalRounds}
          </p>
          <h2 id="handoff-heading">Pass the phone</h2>
          <div className="gtn-phone-card">
            <p>Next up</p>
            <strong>{activeGuesser?.name ?? 'Guesser'}</strong>
            <span>
              Attempt {currentRound}/{totalRounds} · secret still hidden
            </span>
          </div>
          <button className="gtn-start" type="button" onClick={beginGuessing}>
            I have the phone
          </button>
        </section>
      )}

      {phase === 'guessing' && activeGuesser && (
        <section className="gtn-panel gtn-guess-panel" aria-labelledby="guess-heading">
          <div className="gtn-section-heading">
            <div>
              <p className="gtn-label">
                Round {currentRound}/{totalRounds} · Guess {activeGuesserIndex + 1} of{' '}
                {guessers.length}
              </p>
              <h2 id="guess-heading">{activeGuesser.name}, take your shot</h2>
            </div>
            <span className="gtn-coming-soon">
              {selectedRange.min}–{selectedRange.max}
            </span>
          </div>

          <div className="gtn-round-meter" aria-label="Guess rounds remaining">
            {Array.from({ length: totalRounds }, (_, index) => {
              const roundNumber = index + 1
              const status =
                roundNumber < currentRound
                  ? 'is-done'
                  : roundNumber === currentRound
                    ? 'is-active'
                    : undefined
              return (
                <span key={roundNumber} className={status}>
                  {roundNumber}
                </span>
              )
            })}
          </div>

          <div className={`gtn-guess-box ${shakeHint ? 'is-shaking' : ''}`}>
            <label htmlFor="guess-input">Your number</label>
            <input
              id="guess-input"
              type="number"
              inputMode="numeric"
              min={selectedRange.min}
              max={selectedRange.max}
              value={guessDraft}
              placeholder="Type a gut feeling"
              onChange={(event) => setGuessDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submitGuess()
              }}
            />
            <div className="gtn-quick-picks" aria-label="Quick picks">
              {[0.2, 0.5, 0.8].map((ratio) => {
                const value = Math.round(
                  selectedRange.min + (selectedRange.max - selectedRange.min) * ratio,
                )
                return (
                  <button key={ratio} type="button" onClick={() => setGuessDraft(String(value))}>
                    {value}
                  </button>
                )
              })}
            </div>
            <button className="gtn-start" type="button" onClick={submitGuess}>
              Lock my guess
            </button>
          </div>

          <ul className="gtn-progress-pills" aria-label="Guess progress">
            {guessers.map((player, index) => (
              <li
                key={player.id}
                className={
                  roundGuesses[player.id] !== undefined
                    ? 'is-done'
                    : index === activeGuesserIndex
                      ? 'is-active'
                      : undefined
                }
              >
                {player.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase === 'round-feedback' && (
        <section className="gtn-panel gtn-reveal-panel" aria-labelledby="feedback-heading">
          <div className="gtn-section-heading">
            <div>
              <p className="gtn-label">
                Round {currentRound} of {totalRounds} complete
              </p>
              <h2 id="feedback-heading">Hot &amp; cold check-in</h2>
            </div>
            <span className="gtn-coming-soon">Secret still locked</span>
          </div>

          <div className="gtn-winner-banner gtn-feedback-banner">
            {isFinalRound
              ? 'Final round done—time for the reveal.'
              : `${totalRounds - currentRound} guess round${totalRounds - currentRound === 1 ? '' : 's'} left. Use the heat to hunt smarter.`}
          </div>

          <ul className="gtn-heat-board">
            {latestRoundBoard.map((result) => {
              const heat = 100 - Math.min(100, (result.distance / Math.max(1, span)) * 100)
              return (
                <li key={result.playerId}>
                  <div className="gtn-heat-meta">
                    <strong>{result.name}</strong>
                    <span>guessed {result.guess}</span>
                  </div>
                  <div className="gtn-heat-track" aria-hidden="true">
                    <div className="gtn-heat-fill" style={{ width: `${heat}%` }} />
                  </div>
                  <em>{heatLabel(result.distance, span)}</em>
                </li>
              )
            })}
          </ul>

          <p className="gtn-feedback-note">
            Distances stay secret for now—only the vibe labels and heat bars give clues.
          </p>

          <div className="gtn-reveal-actions">
            <button className="gtn-start" type="button" onClick={continueToNextRound}>
              Start guess round {currentRound + 1}
            </button>
            <button className="gtn-secondary" type="button" onClick={resetRound}>
              End early
            </button>
          </div>
        </section>
      )}

      {phase === 'reveal' && secretNumber !== null && (
        <section className="gtn-panel gtn-reveal-panel" aria-labelledby="reveal-heading">
          {showDrumroll ? (
            <div className="gtn-drumroll" role="status">
              <p>
                {exactWinner
                  ? exactWinLines[flairIndex % exactWinLines.length]
                  : flairLines[flairIndex]}
              </p>
            </div>
          ) : (
            <>
              <div className="gtn-section-heading">
                <div>
                  <p className="gtn-label">{exactWinner ? 'Instant win' : 'Final reveal'}</p>
                  <h2 id="reveal-heading">
                    Secret number: <span className="gtn-secret-burst">{secretNumber}</span>
                  </h2>
                </div>
                <span className="gtn-coming-soon">
                  {exactWinner
                    ? 'Round ended early'
                    : winners.length > 1
                      ? 'It’s a tie!'
                      : 'We have a champion'}
                </span>
              </div>

              {exactWinner ? (
                <div className="gtn-exact-win-banner" role="status">
                  <p className="gtn-exact-win-kicker">Perfect guess!</p>
                  <h3>
                    {exactWinner.name} nailed <strong>{secretNumber}</strong>
                  </h3>
                  <p>
                    Bullseye on round {exactWinner.round} of {totalRounds}. The hunt is over—no more
                    guesses needed.
                  </p>
                </div>
              ) : (
                <div className="gtn-winner-banner">
                  {winners.length > 1
                    ? `Shared crown: ${winners.map((winner) => winner.name).join(' & ')}`
                    : `${winners[0]?.name ?? 'Someone'} lands closest!`}
                </div>
              )}

              <ul className="gtn-heat-board">
                {finalResults.map((result) => {
                  const heat = 100 - Math.min(100, (result.distance / Math.max(1, span)) * 100)
                  const isExactWinner = exactWinner?.playerId === result.playerId
                  return (
                    <li
                      key={result.playerId}
                      className={isExactWinner || result.isWinner ? 'is-winner' : undefined}
                    >
                      <div className="gtn-heat-meta">
                        <strong>{result.name}</strong>
                        <span>
                          {isExactWinner
                            ? `exact hit on round ${result.round}!`
                            : `best guess ${result.guess} · off by ${result.distance} · round ${result.round}`}
                        </span>
                      </div>
                      <div className="gtn-heat-track" aria-hidden="true">
                        <div className="gtn-heat-fill" style={{ width: `${heat}%` }} />
                      </div>
                      <em>{isExactWinner ? 'Bullseye energy 🎯' : heatLabel(result.distance, span)}</em>
                    </li>
                  )
                })}
              </ul>

              <div className="gtn-history-block">
                <p className="gtn-label">Full guess trail</p>
                <ul className="gtn-history-list">
                  {guessHistory.map((entry) => (
                    <li key={`${entry.playerId}-${entry.round}-${entry.guess}`}>
                      <span>
                        R{entry.round} · {entry.name}
                      </span>
                      <strong>{entry.guess}</strong>
                      <em>{heatLabel(entry.distance, span)}</em>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="gtn-reveal-actions">
                <button className="gtn-start" type="button" onClick={rotateKeeperAndReplay}>
                  Rotate keeper &amp; play again
                </button>
                <button className="gtn-secondary" type="button" onClick={resetRound}>
                  Back to setup
                </button>
              </div>
            </>
          )}
        </section>
      )}

      <section className="gtn-round" aria-labelledby="round-heading">
        <div className="gtn-round-intro">
          <p className="gtn-label">How a round works</p>
          <h2 id="round-heading">Guess → Heat check → Guess again → Reveal</h2>
          <p>Difficulty decides how many attempts each hunter gets before the secret drops.</p>
        </div>

        <ol className="gtn-step-list">
          <li>
            <span className="gtn-step-number">01</span>
            <h3>Pick difficulty</h3>
            <p>Easy = 2 guesses, Classic/Galaxy = 8, Chaos = 5.</p>
          </li>
          <li>
            <span className="gtn-step-number">02</span>
            <h3>Hide the target</h3>
            <p>Keeper locks the secret. Everyone else stays out of peek range.</p>
          </li>
          <li>
            <span className="gtn-step-number">03</span>
            <h3>Hot &amp; cold loops</h3>
            <p>After each full pass, see heat vibes—not the number—then guess again.</p>
          </li>
          <li>
            <span className="gtn-step-number">04</span>
            <h3>Final reveal</h3>
            <p>When the last allotted round ends, unlock the secret and crown the closest.</p>
          </li>
        </ol>
      </section>

      <section className="gtn-house-rule" aria-labelledby="house-rule-heading">
        <div>
          <p className="gtn-label">House rule</p>
          <h2 id="house-rule-heading">Clues are allowed. Spoilers are not.</h2>
        </div>
        <p>
          Between rounds you only get hot/cold feedback—unless someone lands the exact secret number.
          A perfect guess ends the round instantly with a clear win message.
        </p>
      </section>

      <footer className="gtn-footer">
        <p>Local interactive demo for PR 1. Rails range presets come in PR 2.</p>
        <button type="button" onClick={onBack}>
          Return to all games
        </button>
      </footer>
    </main>
  )
}

export default GuessTheNumberGame
