import { ForestRunnerScene } from './ForestRunnerScene'

type Props = { onPause: () => void; touchEnabled: boolean }

export function GameplayScene({ onPause, touchEnabled }: Props) {
  return <main className="game-scene scene" aria-label="Gameplay placeholder">
    <ForestRunnerScene />
    <header className="game-hud"><div className="health-placeholder"><span>✦</span><div><small>HEALTH</small><b /></div></div><div className="run-stats"><span>SCORE <b>0</b></span><span>DISTANCE <b>0m</b></span></div><button className="icon-button" onClick={onPause} aria-label="Pause game">Ⅱ</button></header>
    {touchEnabled && <div className="touch-foundation" aria-label="Touch controls reserved for a future milestone"><span>◯</span><span>◈</span></div>}
  </main>
}
