import type { ReactElement } from 'react'
import './App.css'

const foundationItems = [
  {
    title: 'Starter cleanup',
    description:
      'The stock Vite hero, demo counter, and social blocks are gone, leaving a neutral shell for the real product.',
  },
  {
    title: 'Quality gates',
    description:
      'Type-aware ESLint, stricter TypeScript defaults, and a single `npm run check` command now guard the repo baseline.',
  },
  {
    title: 'Implementation target',
    description:
      'The next layer can focus on the assignment itself: character search, cache interactions, persistence, and tests.',
  },
] as const

const deliveryTracks = [
  'React Hook Form for the search flow',
  'TanStack Query for request orchestration',
  'Zustand as the cache source of truth',
  'Jest + Playwright coverage for critical paths',
] as const

const projectSlices = [
  'app/providers and global styles',
  'pages/home composition',
  'widgets/character-browser screen shell',
  'entities/character model and reusable UI',
  'features for search, select, remove, and clear cache',
] as const

function App(): ReactElement {
  const currentYear = new Date().getFullYear()

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Production starter baseline</p>
          <h1>Fetch 'n' Cache</h1>
          <p className="hero-summary">
            A clean foundation for the Rick and Morty character cache app:
            template noise removed, repo quality gates tightened, and the entry
            screen aligned with the real assignment.
          </p>
          <div className="tag-row" aria-label="Project stack">
            <span className="tag">React 19</span>
            <span className="tag">Vite 8</span>
            <span className="tag">Strict TypeScript</span>
            <span className="tag">Type-aware ESLint</span>
          </div>
        </div>

        <aside className="hero-panel" aria-labelledby="hero-panel-title">
          <p id="hero-panel-title" className="panel-kicker">
            Ready for the next pass
          </p>
          <ul className="compact-list">
            {deliveryTracks.map((track) => (
              <li key={track}>{track}</li>
            ))}
          </ul>
        </aside>
      </header>

      <main className="content-grid">
        <section className="panel panel-wide" aria-labelledby="foundation-title">
          <div className="section-heading">
            <p className="section-kicker">What changed</p>
            <h2 id="foundation-title">Template clutter is no longer driving the repo</h2>
          </div>

          <div className="card-grid">
            {foundationItems.map((item) => (
              <article key={item.title} className="info-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" aria-labelledby="structure-title">
          <div className="section-heading">
            <p className="section-kicker">Suggested structure</p>
            <h2 id="structure-title">Slices already mapped for implementation</h2>
          </div>

          <ul className="stack-list">
            {projectSlices.map((slice) => (
              <li key={slice}>{slice}</li>
            ))}
          </ul>
        </section>

        <section className="panel" aria-labelledby="quality-title">
          <div className="section-heading">
            <p className="section-kicker">Build discipline</p>
            <h2 id="quality-title">Quality checks are now explicit</h2>
          </div>

          <dl className="metrics">
            <div>
              <dt>Lint</dt>
              <dd>Type-aware rules with zero warnings tolerated.</dd>
            </div>
            <div>
              <dt>Typecheck</dt>
              <dd>Dedicated script for project references before bundling.</dd>
            </div>
            <div>
              <dt>Build</dt>
              <dd>Production output now depends on a clean TypeScript pass.</dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className="footer">
        <p>
          Next up: implement the real fetch, cache, persistence, and test flows
          from the assignment docs.
        </p>
        <span>Baseline refreshed {currentYear}</span>
      </footer>
    </div>
  )
}

export default App
