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
  laneChangeDuration: .24,
  cameraLaneFollow: .14,
  // Slightly reduce Zelda's overall in-world presence without moving her feet.
  characterScale: .92,
  jumpHeight: 1.15,
  jumpDuration: .58,
  slideDuration: .42,
  slideCooldown: .28,
  // Four-frame run cycle, with restrained secondary motion layered on top.
  runCycleHzPerSpeed: .26,
  runAnimationBobHeight: .035,
  runAnimationSway: .015,
  runAnimationTilt: .014,
  runAnimationShadowPulse: .06,
} as const
