import { useEffect, useState } from 'react'
import GuessTheNumberGame from './games/guess-the-number/GuessTheNumberGame'
import './App.css'

type Game = {
  slug: string
  name: string
  summary: string
  play_mode: string
  owner: string
}

const starterGames: Game[] = [
  {
    slug: 'rule-wheel',
    name: 'Rule Wheel',
    summary: 'Spin for a house rule that stays active during the game night.',
    play_mode: 'shared screen',
    owner: 'Kiko',
  },
  {
    slug: 'matching',
    name: 'Matching',
    summary: 'Flip cards and collect matching pairs.',
    play_mode: 'pass the device',
    owner: 'Ron',
  },
  {
    slug: 'guess-the-number',
    name: 'Guess the Number',
    summary: 'Choose a secret number and see who gets closest.',
    play_mode: 'pass the device',
    owner: 'Lanna',
  },
  {
    slug: 'imposter',
    name: 'Imposter',
    summary: 'Blend in, share clues, and identify the player who does not know the word.',
    play_mode: 'pass the device',
    owner: 'Leon',
  },
]

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

function App() {
  const [games, setGames] = useState<Game[]>(starterGames)
  const [apiConnected, setApiConnected] = useState(false)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${apiBaseUrl}/games`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Game catalog request failed')
        return response.json() as Promise<{ games: Game[] }>
      })
      .then((data) => {
        setGames(data.games)
        setApiConnected(true)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setApiConnected(false)
      })

    return () => controller.abort()
  }, [])

  // PR 1 uses a small view switch so the skeleton stays dependency-free.
  // Shared routing can replace this when more game pages are ready.
  if (selectedGame === 'guess-the-number') {
    return <GuessTheNumberGame onBack={() => setSelectedGame(null)} />
  }

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">Code School of Guam Alumni</p>
        <h1>Party Games Hub</h1>
        <p className="intro">
          A mobile-first collection of pass-the-device party games built by the CSG internship team.
        </p>
        <span className={apiConnected ? 'connection connected' : 'connection'}>
          {apiConnected ? 'Rails API connected' : 'Showing starter catalog'}
        </span>
      </header>

      <section aria-labelledby="games-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Project roadmap</p>
            <h2 id="games-heading">Planned games</h2>
          </div>
          <p>Each game has one owner and is built through four small PRs.</p>
        </div>

        <div className="game-grid">
          {games.map((game) => {
            const hasSkeleton = game.slug === 'guess-the-number'

            return (
              <article className="game-card" key={game.slug}>
                <div className="card-meta">
                  <span>{game.owner}</span>
                  <span>{game.play_mode}</span>
                </div>
                <h3>{game.name}</h3>
                <p>{game.summary}</p>
                <button
                  className={hasSkeleton ? 'game-card-action' : undefined}
                  type="button"
                  disabled={!hasSkeleton}
                  onClick={() => setSelectedGame(game.slug)}
                >
                  {hasSkeleton ? 'View game skeleton' : 'Coming through a team PR'}
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <footer>
        <p>Built collaboratively with React, TypeScript, Rails, PostgreSQL, GitHub, and Pi.</p>
      </footer>
    </main>
  )
}

export default App
