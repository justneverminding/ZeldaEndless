import { UiButton } from '../ui/UiButton'
import type { GameState } from '../systems/GameState'

const SCORES = [['PlayerOne', '18,240'], ['PlayerTwo', '16,810'], ['PlayerThree', '15,900'], ['MoonWarden', '14,680']]
type Props = { state: Extract<GameState, 'LEADERBOARD' | 'SETTINGS'>; onHome: () => void }

export function MenuScene({ state, onHome }: Props) {
  const leaderboard = state === 'LEADERBOARD'
  return <main className="menu-scene scene"><div className="menu-glow" /><section className="menu-card"><p className="eyebrow">{leaderboard ? 'THIS WEEK\'S BRIGHTEST RUNS' : 'YOUR ADVENTURE, YOUR WAY'}</p><h2>{leaderboard ? 'LEADERBOARD' : 'SETTINGS'}</h2>
    {leaderboard ? <ol className="scores">{SCORES.map(([name, score]) => <li key={name}><span>{name}</span><b>{score}</b></li>)}</ol> : <div className="settings"><label>Music <button role="switch" aria-checked="true"><i /></button></label><label>Sound Effects <button role="switch" aria-checked="true"><i /></button></label><label>Controls <span>Keyboard &amp; Touch</span></label></div>}
    <UiButton tone="secondary" onClick={onHome}>HOME</UiButton>
  </section></main>
}
