export const GAME_CONFIG = {
  title: 'ZELDA THISTLE',
  version: '0.0.1',
  designWidth: 1600,
  designHeight: 900,
  mobileBreakpoint: 720,
  debugMode: false,
} as const

export const RUNNER_CONFIG = {
  runSpeed: 7.2,
  laneOffset: 2.4,
  laneChangeSpeed: 10,
  jumpHeight: 1.15,
  jumpDuration: .58,
  inputCooldown: .16,
  cameraSmoothing: 7,
} as const
