import { GAME_CONFIG } from '../config/gameConfig'
import { UiButton } from '../ui/UiButton'
import zeldaHero from '../../../assets/characters/zelda/runtime/zelda-home-cutout.png'
import linkHero from '../../../assets/characters/link/runtime/link-home-cutout.png'
import villageHero from '../../../assets/environments/thistle-village/optimized/thistle-village-hero.png'

type Props = { onPlay: () => void; onLeaderboard: () => void; onSettings: () => void }

export function HomeScene({ onPlay, onLeaderboard, onSettings }: Props) {
  return <main className="home-scene scene" aria-label="Zelda Thistle home">
    <img className="home-environment" src={villageHero} alt="Thistle Village" />
    <div className="home-scene__atmosphere" aria-hidden="true"><i /><i /><i /></div>
    <header className="topbar"><span className="brand-mark">✦</span><button className="wallet" disabled title="Coming soon">CONNECT WALLET <small>COMING SOON</small></button></header>
    <section className="home-content">
      <p className="eyebrow">AN ENDLESS FANTASY ADVENTURE</p>
      <h1>{GAME_CONFIG.title.split(' ').map((word) => <span key={word}>{word}</span>)}</h1>
      <p className="home-tagline">A small journey. A bigger world.</p>
      <nav className="main-actions" aria-label="Main menu">
        <UiButton onClick={onPlay}>PLAY <span>→</span></UiButton>
        <UiButton tone="secondary" onClick={onLeaderboard}>LEADERBOARD</UiButton>
        <UiButton tone="secondary" onClick={onSettings}>SETTINGS</UiButton>
      </nav>
    </section>
    <div className="hero-figures" aria-label="Zelda and Link">
      <img className="hero-character hero-character--link" src={linkHero} alt="Link" />
      <img className="hero-character hero-character--zelda" src={zeldaHero} alt="Zelda" />
    </div>
    <footer className="home-footer"><span>EXPLORE</span><i /> <span>FIGHT</span><i /> <span>COLLECT</span><i /> <span>ENDURE</span></footer>
  </main>
}
