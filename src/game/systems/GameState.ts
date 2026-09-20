export type GameState = 'BOOT' | 'HOME' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEADERBOARD' | 'SETTINGS'

export const isOverlayState = (state: GameState) => state === 'PAUSED' || state === 'GAME_OVER'
