import './ImposterGame.css'

type ImposterGameProps = {
  onBack: () => void
}

type RoundStep = {
  number: string
  title: string
  description: string
  icon: 'eye' | 'clue' | 'vote' | 'reveal'
}

const roundSteps: RoundStep[] = [
  {
    number: '01',
    title: 'Reveal in private',
    description: 'Pass the phone so each player can safely view and hide their role.',
    icon: 'eye',
  },
  {
    number: '02',
    title: 'Give one clue',
    description: 'Say enough to prove you know the word without giving it away.',
    icon: 'clue',
  },
  {
    number: '03',
    title: 'Discuss and vote',
    description: 'Question suspicious clues, then record the group’s accused player.',
    icon: 'vote',
  },
  {
    number: '04',
    title: 'Reveal the truth',
    description: 'Catch the Imposter—or eliminate a regular player and continue.',
    icon: 'reveal',
  },
]

function RoundStepIcon({ icon }: Pick<RoundStep, 'icon'>) {
  if (icon === 'eye') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z" />
        <circle cx="12" cy="12" r="2.75" />
      </svg>
    )
  }

  if (icon === 'clue') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 18.5h7.25L19 21v-4.25A7.5 7.5 0 0 0 15 3H7a7.75 7.75 0 0 0 0 15.5Z" />
        <path d="M7.5 9h8M7.5 13h5" />
      </svg>
    )
  }

  if (icon === 'vote') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9 4 6 6-4 4-6-6 4-4Z" />
        <path d="m12.5 7.5 3-3M4 14h16v7H4v-7Zm4 3h8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M12 7v5l3.25 2M16 3h5v5" />
    </svg>
  )
}

function ImposterGame({ onBack }: ImposterGameProps) {
  return (
    <main className="imposter-page">
      <nav className="imposter-nav" aria-label="Imposter game navigation">
        <button className="imposter-back" type="button" onClick={onBack}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m12.5 4-6 6 6 6" />
          </svg>
          Back to game library
        </button>
        <span className="imposter-stage">PR 1 · Game skeleton</span>
      </nav>

      <header className="imposter-hero">
        <div className="imposter-hero-copy">
          <p className="imposter-kicker">One phone · One hidden role</p>
          <h1>
            Trust the clue.
            <span>Question the player.</span>
          </h1>
          <p className="imposter-summary">
            Most players know the secret word. One player gets only a hint and must bluff their way
            through the round without being discovered.
          </p>
          <div className="imposter-facts" aria-label="Game details">
            <span>3–8 players</span>
            <span>5–10 minutes</span>
            <span>Pass the device</span>
          </div>
        </div>

        <div className="imposter-hero-mark" aria-hidden="true">
          <div className="imposter-orbit imposter-orbit-one" />
          <div className="imposter-orbit imposter-orbit-two" />
          <div className="imposter-eye">
            <span />
          </div>
          <p>Who is bluffing?</p>
        </div>
      </header>

      <div className="imposter-preview-grid">
        <section className="imposter-setup" aria-labelledby="imposter-setup-heading">
          <div className="imposter-section-heading">
            <div>
              <p className="imposter-label">Round setup</p>
              <h2 id="imposter-setup-heading">Bring the group together</h2>
            </div>
            <span className="imposter-coming-soon">Controls unlock in PR 3</span>
          </div>

          <fieldset disabled>
            <legend className="sr-only">Imposter round setup preview</legend>
            <div className="imposter-field">
              <label htmlFor="imposter-pack">Word pack</label>
              <select id="imposter-pack" defaultValue="everyday">
                <option value="everyday">Everyday Mix</option>
              </select>
              <p>Rails-backed word packs arrive in PR 2.</p>
            </div>

            <div className="imposter-field">
              <div className="imposter-field-label">
                <label htmlFor="imposter-player-one">Player names</label>
                <span>4 recommended</span>
              </div>
              <div className="imposter-player-list">
                <input id="imposter-player-one" type="text" value="Player 1" readOnly />
                <input aria-label="Player 2" type="text" value="Player 2" readOnly />
                <input aria-label="Player 3" type="text" value="Player 3" readOnly />
                <input aria-label="Player 4" type="text" value="Player 4" readOnly />
              </div>
            </div>

            <button className="imposter-start" type="button">
              Start private reveals
            </button>
          </fieldset>
        </section>

        <aside className="imposter-handoff" aria-labelledby="handoff-heading">
          <div className="imposter-phone" aria-hidden="true">
            <div className="imposter-phone-speaker" />
            <p>Pass to</p>
            <strong>Player 1</strong>
            <div className="imposter-hidden-role">
              <svg viewBox="0 0 24 24">
                <path d="M5 10V8a7 7 0 0 1 14 0v2M4 10h16v11H4V10Z" />
              </svg>
              Role hidden
            </div>
            <span>I have the phone</span>
          </div>
          <div className="imposter-handoff-copy">
            <p className="imposter-label">Privacy first</p>
            <h2 id="handoff-heading">No accidental reveals</h2>
            <p>
              Every role is hidden before the next player’s name appears. The phone always moves
              through a neutral handoff screen.
            </p>
          </div>
        </aside>
      </div>

      <section className="imposter-round" aria-labelledby="round-heading">
        <div className="imposter-round-intro">
          <p className="imposter-label">How a round works</p>
          <h2 id="round-heading">Four beats. Plenty of suspicion.</h2>
          <p>The conversation happens around the phone. The app quietly keeps the round moving.</p>
        </div>

        <ol className="imposter-step-list">
          {roundSteps.map((step) => (
            <li key={step.number}>
              <div className="imposter-step-topline">
                <span>{step.number}</span>
                <RoundStepIcon icon={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="imposter-clue-rule" aria-labelledby="clue-rule-heading">
        <div>
          <p className="imposter-label">The clue rule</p>
          <h2 id="clue-rule-heading">Specific enough to belong. Vague enough to protect.</h2>
        </div>
        <p>
          Give exactly one spoken word. Do not say the answer, spell it, rhyme with it, translate it,
          or explain your clue until discussion begins.
        </p>
      </section>

      <footer className="imposter-footer">
        <p>Designed for face-to-face play. No accounts, room codes, or extra phones required.</p>
        <button type="button" onClick={onBack}>Return to all games</button>
      </footer>
    </main>
  )
}

export default ImposterGame
