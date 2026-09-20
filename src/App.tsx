import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { HomeScene } from './game/scenes/HomeScene'
import { MenuScene } from './game/scenes/MenuScene'
import { OverlayScene } from './game/scenes/OverlayScene'
import { useInputCapability, usePauseInput } from './game/input/InputManager'
import type { GameState } from './game/systems/GameState'

const GameplayScene = lazy(() => import('./game/scenes/GameplayScene').then(({ GameplayScene }) => ({ default: GameplayScene })))

export function App() {
  const [state, setState] = useState<GameState>('BOOT')
  const input = useInputCapability()
  useEffect(() => setState('HOME'), [])
  const enterPlay = useCallback(() => setState('PLAYING'), [])
  const togglePause = useCallback(() => setState((current) => current === 'PLAYING' ? 'PAUSED' : current === 'PAUSED' ? 'PLAYING' : current), [])
  usePauseInput(state === 'PLAYING' || state === 'PAUSED', togglePause)
  if (state === 'BOOT') return <div className="boot-screen" aria-label="Loading Zelda Thistle"><span>✦</span></div>
  if (state === 'HOME') return <HomeScene onPlay={enterPlay} onLeaderboard={() => setState('LEADERBOARD')} onSettings={() => setState('SETTINGS')} />
  if (state === 'LEADERBOARD' || state === 'SETTINGS') return <MenuScene state={state} onHome={() => setState('HOME')} />
  return <><Suspense fallback={<div className="boot-screen" aria-label="Preparing forest"><span>✦</span></div>}><GameplayScene onPause={togglePause} touchEnabled={input.hasTouch} isRunning={state === 'PLAYING'} /></Suspense>{(state === 'PAUSED' || state === 'GAME_OVER') && <OverlayScene state={state} onResume={togglePause} onRestart={enterPlay} onHome={() => setState('HOME')} onLeaderboard={() => setState('LEADERBOARD')} />}</>
}
