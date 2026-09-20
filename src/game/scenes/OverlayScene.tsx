import { UiButton } from '../ui/UiButton'
import type { GameState } from '../systems/GameState'

type Props = { state: Extract<GameState, 'PAUSED' | 'GAME_OVER'>; onResume: () => void; onRestart: () => void; onHome: () => void; onLeaderboard: () => void }

export function OverlayScene({ state, onResume, onRestart, onHome, onLeaderboard }: Props) {
  const gameOver = state === 'GAME_OVER'
  return <section className="overlay" aria-modal="true" role="dialog" aria-label={gameOver ? 'Run over' : 'Game paused'}><div className="overlay-card">
    <p className="eyebrow">{gameOver ? 'THE JOURNEY ENDS HERE' : 'THE WORLD WAITS'}</p><h2>{gameOver ? 'RUN OVER' : 'PAUSED'}</h2>
    {gameOver ? <div className="run-summary"><span>SCORE <b>0</b></span><span>DISTANCE <b>0m</b></span><span>ENEMIES <b>0</b></span><span>COLLECTIBLES <b>0</b></span></div> : <p className="overlay-copy">Your run is safely waiting.</p>}
    <div className="overlay-actions">{!gameOver && <UiButton onClick={onResume}>RESUME</UiButton>}<UiButton onClick={onRestart}>{gameOver ? 'PLAY AGAIN' : 'RESTART'}</UiButton>{gameOver && <UiButton tone="secondary" onClick={onLeaderboard}>LEADERBOARD</UiButton>}<UiButton tone="secondary" onClick={onHome}>HOME</UiButton></div>
  </div></section>
}
