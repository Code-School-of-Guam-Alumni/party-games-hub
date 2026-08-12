import { useEffect, useMemo, useState } from 'react'
import {
  activePlayers,
  createRound,
  eliminatePlayer,
  guessesMatch,
  imposterHasSurvivedToFinalTwo,
  tallyVotes,
  type ImposterRound,
  type WordPack,
} from './imposterGameLogic'
import './ImposterGame.css'

type ImposterGameProps = {
  onBack: () => void
}

type Phase =
  | 'setup'
  | 'handoff'
  | 'reveal'
  | 'clues'
  | 'vote'
  | 'tie-clue'
  | 'tie-vote'
  | 'vote-result'
  | 'final-guess'
  | 'round-end'

type Winner = 'regulars' | 'imposter'

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'
const initialPlayers = ['Player 1', 'Player 2', 'Player 3', 'Player 4']

function nameFor(round: ImposterRound, playerId: string) {
  return round.players.find((player) => player.id === playerId)?.name ?? 'Unknown player'
}

function ImposterGame({ onBack }: ImposterGameProps) {
  const [packs, setPacks] = useState<WordPack[]>([])
  const [packsStatus, setPacksStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [selectedPackSlug, setSelectedPackSlug] = useState('')
  const [playerNames, setPlayerNames] = useState(initialPlayers)
  const [setupError, setSetupError] = useState('')
  const [phase, setPhase] = useState<Phase>('setup')
  const [round, setRound] = useState<ImposterRound | null>(null)
  const [revealIndex, setRevealIndex] = useState(0)
  const [votes, setVotes] = useState<Record<string, string>>({})
  const [voteError, setVoteError] = useState('')
  const [tiedCandidateIds, setTiedCandidateIds] = useState<string[]>([])
  const [accusedId, setAccusedId] = useState('')
  const [roundNotice, setRoundNotice] = useState('')
  const [finalGuess, setFinalGuess] = useState('')
  const [winner, setWinner] = useState<Winner | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${apiBaseUrl}/imposter_word_packs`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Word pack request failed')
        return response.json() as Promise<{ word_packs: WordPack[] }>
      })
      .then(({ word_packs: wordPacks }) => {
        setPacks(wordPacks)
        setSelectedPackSlug(wordPacks[0]?.slug ?? '')
        setPacksStatus('ready')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setPacksStatus('error')
      })

    return () => controller.abort()
  }, [])

  const currentRevealPlayer = round?.players[revealIndex]
  const livingPlayers = useMemo(() => round ? activePlayers(round) : [], [round])
  const selectedPack = packs.find((pack) => pack.slug === selectedPackSlug)

  function updatePlayer(index: number, name: string) {
    setPlayerNames((current) => current.map((playerName, playerIndex) => (
      playerIndex === index ? name : playerName
    )))
  }

  function addPlayer() {
    setPlayerNames((current) => [...current, `Player ${current.length + 1}`])
  }

  function removePlayer(index: number) {
    setPlayerNames((current) => current.filter((_, playerIndex) => playerIndex !== index))
  }

  function beginRound() {
    if (!selectedPack) {
      setSetupError('Choose an available word pack before starting.')
      return
    }

    try {
      const nextRound = createRound(playerNames, selectedPack)
      setRound(nextRound)
      setRevealIndex(0)
      setVotes({})
      setTiedCandidateIds([])
      setAccusedId('')
      setRoundNotice('')
      setWinner(null)
      setFinalGuess('')
      setSetupError('')
      setPhase('handoff')
    } catch (error) {
      setSetupError(error instanceof Error ? error.message : 'Check the round setup.')
    }
  }

  function finishReveal() {
    if (!round) return

    if (revealIndex === round.players.length - 1) {
      setPhase('clues')
      return
    }

    setRevealIndex((index) => index + 1)
    setPhase('handoff')
  }

  function openVote(nextPhase: 'vote' | 'tie-vote') {
    setVotes({})
    setVoteError('')
    setRoundNotice('')
    setPhase(nextPhase)
  }

  function recordVote(voterId: string, candidateId: string) {
    setVotes((current) => ({ ...current, [voterId]: candidateId }))
  }

  function submitVote() {
    if (!round) return
    if (Object.keys(votes).length !== livingPlayers.length || Object.values(votes).some((vote) => !vote)) {
      setVoteError('Record one vote for every active player.')
      return
    }

    const candidates = phase === 'tie-vote'
      ? tiedCandidateIds
      : livingPlayers.map((player) => player.id)
    const result = tallyVotes(votes, candidates)

    if (result.leaders.length > 1) {
      if (phase === 'tie-vote') {
        setRoundNotice('The revote tied again. Nobody is eliminated; begin a new clue round.')
        setTiedCandidateIds([])
        setPhase('clues')
      } else {
        setTiedCandidateIds(result.leaders)
        setPhase('tie-clue')
      }
      return
    }

    const accused = result.leaders[0]
    setAccusedId(accused)

    if (accused === round.imposterId) {
      setPhase('final-guess')
      return
    }

    const updatedRound = eliminatePlayer(round, accused)
    setRound(updatedRound)
    if (imposterHasSurvivedToFinalTwo(updatedRound)) {
      setWinner('imposter')
      setPhase('round-end')
    } else {
      setPhase('vote-result')
    }
  }

  function submitFinalGuess() {
    if (!round || !finalGuess.trim()) return
    setWinner(guessesMatch(finalGuess, round.secretWord) ? 'imposter' : 'regulars')
    setPhase('round-end')
  }

  function returnToSetup() {
    setRound(null)
    setPhase('setup')
    setSetupError('')
  }

  function renderSetup() {
    return (
      <>
        <header className="imposter-hero imposter-hero-compact">
          <div className="imposter-hero-copy">
            <p className="imposter-kicker">One phone · One hidden role</p>
            <h1>Trust the clue.<span>Question the player.</span></h1>
            <p className="imposter-summary">
              Most players know the secret word. One player gets only a hint and must bluff through
              the round without being discovered.
            </p>
            <div className="imposter-facts" aria-label="Game details">
              <span>4–8 players</span><span>5–10 minutes</span><span>Pass the device</span>
            </div>
          </div>
        </header>

        <section className="imposter-setup imposter-live-setup" aria-labelledby="imposter-setup-heading">
          <div className="imposter-section-heading">
            <div>
              <p className="imposter-label">Round setup</p>
              <h2 id="imposter-setup-heading">Bring the group together</h2>
            </div>
            <span className="imposter-coming-soon">PR 3 · Playable loop</span>
          </div>

          <div className="imposter-field">
            <label htmlFor="imposter-pack">Word pack</label>
            {packsStatus === 'loading' && <p className="imposter-status">Loading word packs…</p>}
            {packsStatus === 'error' && (
              <p className="imposter-error" role="alert">Could not reach the Rails word-pack API. Start it and reload.</p>
            )}
            {packsStatus === 'ready' && packs.length === 0 && (
              <p className="imposter-error" role="alert">No active word packs are available yet.</p>
            )}
            <select
              id="imposter-pack"
              value={selectedPackSlug}
              disabled={packsStatus !== 'ready' || packs.length === 0}
              onChange={(event) => setSelectedPackSlug(event.target.value)}
            >
              {packs.map((pack) => <option key={pack.id} value={pack.slug}>{pack.name}</option>)}
            </select>
            {selectedPack && <p>{selectedPack.description} · {selectedPack.words.length} words</p>}
          </div>

          <fieldset className="imposter-player-fieldset">
            <legend>Player names</legend>
            <div className="imposter-player-list">
              {playerNames.map((name, index) => (
                <div className="imposter-player-row" key={index}>
                  <label className="sr-only" htmlFor={`imposter-player-${index}`}>Player {index + 1}</label>
                  <input
                    id={`imposter-player-${index}`}
                    type="text"
                    value={name}
                    maxLength={24}
                    onChange={(event) => updatePlayer(index, event.target.value)}
                  />
                  {playerNames.length > 4 && (
                    <button type="button" onClick={() => removePlayer(index)} aria-label={`Remove ${name || `player ${index + 1}`}`}>Remove</button>
                  )}
                </div>
              ))}
            </div>
            {playerNames.length < 8 && <button className="imposter-secondary" type="button" onClick={addPlayer}>Add player</button>}
          </fieldset>

          {setupError && <p className="imposter-error" role="alert">{setupError}</p>}
          <button className="imposter-start" type="button" onClick={beginRound} disabled={!selectedPack}>Start private reveals</button>
        </section>
      </>
    )
  }

  function renderVote(candidateIds: string[]) {
    if (!round) return null

    return (
      <section className="imposter-game-card" aria-labelledby="vote-heading">
        <p className="imposter-label">{phase === 'tie-vote' ? 'Tie-breaker vote' : 'Group vote'}</p>
        <h1 id="vote-heading">Record every vote.</h1>
        <p>Vote aloud, then choose each active player’s selection below.</p>
        <div className="imposter-ballots">
          {livingPlayers.map((voter) => (
            <label key={voter.id}>
              <span>{voter.name} votes for</span>
              <select value={votes[voter.id] ?? ''} onChange={(event) => recordVote(voter.id, event.target.value)}>
                <option value="">Choose a player</option>
                {candidateIds.map((candidateId) => (
                  <option key={candidateId} value={candidateId}>{nameFor(round, candidateId)}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
        {voteError && <p className="imposter-error" role="alert">{voteError}</p>}
        <button className="imposter-primary" type="button" onClick={submitVote}>Count votes</button>
      </section>
    )
  }

  function renderRound() {
    if (!round || !currentRevealPlayer) return null
    const imposter = round.players.find((player) => player.id === round.imposterId)
    const accusedName = accusedId ? nameFor(round, accusedId) : ''

    if (phase === 'handoff') {
      return (
        <section className="imposter-game-card imposter-private-card">
          <p className="imposter-label">Role {revealIndex + 1} of {round.players.length}</p>
          <h1>Pass to {currentRevealPlayer.name}.</h1>
          <p>Keep the screen hidden until they confirm they have the phone.</p>
          <button className="imposter-primary" type="button" onClick={() => setPhase('reveal')}>I have the phone</button>
        </section>
      )
    }

    if (phase === 'reveal') {
      const isImposter = currentRevealPlayer.id === round.imposterId
      return (
        <section className={`imposter-game-card imposter-reveal-card ${isImposter ? 'is-imposter' : ''}`}>
          <p className="imposter-label">For {currentRevealPlayer.name} only</p>
          <h1>{isImposter ? 'You are the Imposter.' : round.secretWord}</h1>
          <p>{isImposter ? `Your hint is “${round.hint}.” Bluff carefully.` : 'This is the secret word. Give one clue without saying it.'}</p>
          <button className="imposter-primary" type="button" onClick={finishReveal}>Hide role and pass</button>
        </section>
      )
    }

    if (phase === 'clues') {
      return (
        <section className="imposter-game-card">
          <p className="imposter-label">Clue round · {livingPlayers.length} active</p>
          <h1>{nameFor(round, round.startingPlayerId)} starts.</h1>
          <p>{roundNotice || 'Go around once. Each active player says exactly one clue, then discuss who might be bluffing.'}</p>
          <ul className="imposter-active-list" aria-label="Active players">
            {livingPlayers.map((player) => <li key={player.id}>{player.name}</li>)}
          </ul>
          <button className="imposter-primary" type="button" onClick={() => openVote('vote')}>Ready to vote</button>
        </section>
      )
    }

    if (phase === 'vote') return renderVote(livingPlayers.map((player) => player.id))
    if (phase === 'tie-vote') return renderVote(tiedCandidateIds)

    if (phase === 'tie-clue') {
      return (
        <section className="imposter-game-card">
          <p className="imposter-label">The vote is tied</p>
          <h1>One extra clue each.</h1>
          <p>{tiedCandidateIds.map((id) => nameFor(round, id)).join(' and ')} each give one more clue. Then everyone votes between only those players.</p>
          <button className="imposter-primary" type="button" onClick={() => openVote('tie-vote')}>Start tie-breaker vote</button>
        </section>
      )
    }

    if (phase === 'vote-result') {
      return (
        <section className="imposter-game-card">
          <p className="imposter-label">Regular player eliminated</p>
          <h1>{accusedName} knew the word.</h1>
          <p>The Imposter is still active. The remaining players begin another clue round.</p>
          <button className="imposter-primary" type="button" onClick={() => setPhase('clues')}>Continue the round</button>
        </section>
      )
    }

    if (phase === 'final-guess') {
      return (
        <section className="imposter-game-card">
          <p className="imposter-label">Imposter caught</p>
          <h1>{accusedName}, make one final guess.</h1>
          <p>A correct secret word steals the win.</p>
          <label className="imposter-guess">
            <span>Your final guess</span>
            <input value={finalGuess} onChange={(event) => setFinalGuess(event.target.value)} autoComplete="off" />
          </label>
          <button className="imposter-primary" type="button" onClick={submitFinalGuess} disabled={!finalGuess.trim()}>Lock in guess</button>
        </section>
      )
    }

    if (phase === 'round-end') {
      return (
        <section className="imposter-game-card imposter-result-card">
          <p className="imposter-label">Round complete</p>
          <h1>{winner === 'imposter' ? 'The Imposter wins.' : 'The regulars win.'}</h1>
          <dl>
            <div><dt>Imposter</dt><dd>{imposter?.name}</dd></div>
            <div><dt>Secret word</dt><dd>{round.secretWord}</dd></div>
            <div><dt>Hint</dt><dd>{round.hint}</dd></div>
          </dl>
          <div className="imposter-actions">
            <button className="imposter-primary" type="button" onClick={beginRound}>Play again with same players</button>
            <button className="imposter-secondary" type="button" onClick={returnToSetup}>Change setup</button>
          </div>
        </section>
      )
    }

    return null
  }

  return (
    <main className={`imposter-page ${phase === 'setup' ? '' : 'imposter-page-playing'}`}>
      <nav className="imposter-nav" aria-label="Imposter game navigation">
        <button className="imposter-back" type="button" onClick={phase === 'setup' ? onBack : returnToSetup}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4-6 6 6 6" /></svg>
          {phase === 'setup' ? 'Back to game library' : 'End round'}
        </button>
        <span className="imposter-stage">PR 3 · Playable game</span>
      </nav>
      {phase === 'setup' ? renderSetup() : <div className="imposter-game-stage">{renderRound()}</div>}
    </main>
  )
}

export default ImposterGame
