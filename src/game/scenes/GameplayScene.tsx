import { ForestRunnerScene } from './ForestRunnerScene'
import { useRef, useState } from 'react'
import { useRunnerInput, type RunnerCommands } from '../input/InputManager'

type Props = { onPause: () => void; touchEnabled: boolean; isRunning: boolean }

export function GameplayScene({ onPause, touchEnabled, isRunning }: Props) {
  const commands = useRef<RunnerCommands | null>(null)
  const surface = useRef<HTMLElement | null>(null)
  const [distance, setDistance] = useState(0)
  useRunnerInput(isRunning, commands, surface)
  return <main ref={surface} className="game-scene scene" aria-label="Gameplay forest run">
    <ForestRunnerScene active={isRunning} commands={commands} onDistance={(next) => setDistance(current => current === next ? current : next)} />
    <header className="game-hud"><div className="health-placeholder"><span>✦</span><div><small>HEALTH</small><b /></div></div><div className="run-stats"><span>SCORE <b>0</b></span><span>DISTANCE <b>{distance}m</b></span></div><button className="icon-button" onClick={onPause} aria-label="Pause game">Ⅱ</button></header>
    {touchEnabled && <div className="touch-gesture-hint" aria-hidden="true">Swipe to move · Swipe up to jump</div>}
  </main>
}
