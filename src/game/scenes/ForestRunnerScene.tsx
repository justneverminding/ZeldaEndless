import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { BackSide, CatmullRomCurve3, Color, Group, Mesh, SRGBColorSpace, TextureLoader, Vector3 } from 'three'
import zeldaIdle from '../../../assets/characters/zelda/runtime/zelda-rear-hero-v2.png'
import zeldaRun01 from '../../../assets/characters/zelda/runtime/gameplay/run-cycle/zelda-run-01.png'
import zeldaRun02 from '../../../assets/characters/zelda/runtime/gameplay/run-cycle/zelda-run-02.png'
import zeldaRun03 from '../../../assets/characters/zelda/runtime/gameplay/run-cycle/zelda-run-03.png'
import zeldaRun04 from '../../../assets/characters/zelda/runtime/gameplay/run-cycle/zelda-run-04.png'
import zeldaJump from '../../../assets/characters/zelda/runtime/gameplay/zelda-jump.png'
import zeldaSlide from '../../../assets/characters/zelda/runtime/gameplay/zelda-slide.png'
import zeldaLaneChange from '../../../assets/characters/zelda/runtime/gameplay/zelda-lane-change.png'
import treeCard from '../../../assets/environments/whispering-forest/runtime/ancient-tree-billboard-v2.png'
import { FOREST_RUN_SEGMENTS, FOREST_SEGMENT_LENGTH, VISIBLE_SEGMENTS_AHEAD, type ForestRunSegment } from '../world/forestSegments'
import { RUNNER_CONFIG } from '../config/gameConfig'
import type { RunnerCommands } from '../input/InputManager'

function RunnerCamera() {
  const { camera } = useThree()
  const target = useMemo(() => new Vector3(0, 0.72, -18), [])
  useEffect(() => { camera.position.set(0, 4.15, 8.8); camera.lookAt(target) }, [camera, target])
  useFrame(() => camera.lookAt(target))
  return null
}

type RunnerAnimationState = 'IDLE' | 'RUN' | 'JUMP' | 'SLIDE' | 'LANE_LEFT' | 'LANE_RIGHT'

const ZELDA_RUN_FRAMES = [zeldaRun01, zeldaRun02, zeldaRun03, zeldaRun04] as const
const ZELDA_MOTION_TEXTURES = {
  IDLE: zeldaIdle,
  JUMP: zeldaJump,
  SLIDE: zeldaSlide,
  LANE_LEFT: zeldaLaneChange,
  LANE_RIGHT: zeldaLaneChange,
} as const

// Every pose is attached at bottom-center. The wide slide source is deliberately
// rendered in a shorter frame so her boots keep the same ground anchor as RUN.
const ZELDA_MOTION_FRAMES: Record<RunnerAnimationState, { width: number; height: number }> = {
  IDLE: { width: 3.04, height: 4.56 },
  RUN: { width: 3.04, height: 4.56 },
  JUMP: { width: 3.04, height: 4.56 },
  SLIDE: { width: 4.56, height: 3.04 },
  LANE_LEFT: { width: 3.04, height: 4.56 },
  LANE_RIGHT: { width: 3.04, height: 4.56 },
}

function ZeldaBillboard({ visualRef, shadowRef, animationStateRef, runFrameRef }: { visualRef: MutableRefObject<Group | null>; shadowRef: MutableRefObject<Group | null>; animationStateRef: MutableRefObject<RunnerAnimationState>; runFrameRef: MutableRefObject<number> }) {
  const textures = useLoader(TextureLoader, [...ZELDA_RUN_FRAMES, ...Object.values(ZELDA_MOTION_TEXTURES)])
  const poseRefs = useRef<Mesh[]>([])
  useEffect(() => { textures.forEach(texture => { texture.colorSpace = SRGBColorSpace; texture.needsUpdate = true }) }, [textures])
  useFrame(() => {
    const activePose = animationStateRef.current
    poseRefs.current.forEach((mesh, index) => {
      const isRunFrame = index < ZELDA_RUN_FRAMES.length
      mesh.visible = isRunFrame ? activePose === 'RUN' && index === runFrameRef.current : activePose === (Object.keys(ZELDA_MOTION_TEXTURES) as RunnerAnimationState[])[index - ZELDA_RUN_FRAMES.length]
    })
  })
  const meshStates = [...Array(ZELDA_RUN_FRAMES.length).fill('RUN'), ...Object.keys(ZELDA_MOTION_TEXTURES)] as RunnerAnimationState[]
  return <><group ref={shadowRef}><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .025, 0]} scale={[1.4, .44, 1]}><circleGeometry args={[1, 32]} /><meshBasicMaterial color="#0a1611" transparent opacity={.42} depthWrite={false} /></mesh></group><group ref={visualRef}>{meshStates.map((state, index) => {
    const frame = ZELDA_MOTION_FRAMES[state]
    return <mesh key={`${state}-${index}`} ref={node => { if (node) poseRefs.current[index] = node }} visible={false} position={[0, frame.height / 2, 0]}><planeGeometry args={[frame.width, frame.height]} /><meshBasicMaterial map={textures[index]} transparent alphaTest={.02} depthWrite={false} toneMapped={false} /></mesh>
  })}</group></>
}

function ForestCard({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const texture = useLoader(TextureLoader, treeCard)
  useEffect(() => { texture.colorSpace = SRGBColorSpace; texture.needsUpdate = true }, [texture])
  return <group position={[x, 0, z]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .016, .08]} scale={[1.5 * scale, .44 * scale, 1]}><circleGeometry args={[1, 24]} /><meshBasicMaterial color="#132419" transparent opacity={.26} depthWrite={false} /></mesh>
    <sprite position={[0, 4.2 * scale, 0]} scale={[5.6 * scale, 8.4 * scale, 1]}><spriteMaterial map={texture} transparent alphaTest={.02} depthWrite={false} /></sprite>
  </group>
}

function Rock({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return <mesh position={[x, .35 * scale, z]} scale={scale} rotation={[.12, .5, -.16]} castShadow><dodecahedronGeometry args={[.58, 1]} /><meshStandardMaterial color="#53675c" roughness={1} flatShading /></mesh>
}

function Torch({ x, z }: { x: number; z: number }) {
  return <group position={[x, 0, z]}><mesh position={[0, 1.08, 0]} castShadow><cylinderGeometry args={[.07, .11, 2.16, 7]} /><meshStandardMaterial color="#493222" roughness={1} /></mesh><mesh position={[0, 2.26, 0]}><sphereGeometry args={[.15, 10, 8]} /><meshBasicMaterial color="#ffba52" /></mesh><pointLight position={[0, 2.3, 0]} color="#ffb75b" intensity={1.15} distance={6} decay={2} /></group>
}

function Ruin({ x, z, height = 2.8 }: { x: number; z: number; height?: number }) {
  return <group position={[x, 0, z]} rotation={[0, .18, 0]}><mesh position={[0, height / 2, 0]} castShadow><cylinderGeometry args={[.25, .34, height, 7]} /><meshStandardMaterial color="#7b887f" roughness={1} /></mesh><mesh position={[0, height + .1, 0]} rotation={[.1, .2, .05]} castShadow><boxGeometry args={[.72, .32, .65]} /><meshStandardMaterial color="#849087" roughness={1} /></mesh><mesh position={[-.18, .55, .18]} scale={[.34, .1, .28]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#507947" roughness={1} /></mesh></group>
}

function RuinedArch({ z }: { z: number }) {
  return <group position={[0, 0, z]} rotation={[0, .08, 0]}>
    {[-4.9, 4.9].map(x => <mesh key={x} position={[x, 2.15, 0]} castShadow><cylinderGeometry args={[.32, .45, 4.3, 7]} /><meshStandardMaterial color="#78867f" roughness={1} /></mesh>)}
    <mesh position={[0, 4.18, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.35, .45, 9.4, 7]} /><meshStandardMaterial color="#78867f" roughness={1} /></mesh>
    {[-5.15, 5.15].map(x => <mesh key={x} position={[x, .2, .18]} scale={[.62, .12, .4]}><sphereGeometry args={[1, 9, 7]} /><meshStandardMaterial color="#4f7d49" roughness={1} /></mesh>)}
  </group>
}

function Fence({ x, z, flip = false }: { x: number; z: number; flip?: boolean }) {
  return <group position={[x, 0, z]} rotation={[0, flip ? -.22 : .22, 0]}>{[-1.15, 1.15].map(px => <mesh key={px} position={[px, .58, 0]} rotation={[0, 0, px * .08]}><cylinderGeometry args={[.055, .075, 1.18, 6]} /><meshStandardMaterial color="#593d26" roughness={1} /></mesh>)}{[.36, .72].map(py => <mesh key={py} position={[0, py, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.045, .055, 2.5, 6]} /><meshStandardMaterial color="#64452a" roughness={1} /></mesh>)}</group>
}

function TrailDressing({ z }: { z: number }) {
  const rootCurve = useMemo(() => new CatmullRomCurve3([new Vector3(-2.4, .08, 0), new Vector3(-.8, .12, .18), new Vector3(.4, .08, -.1), new Vector3(1.55, .05, 0)]), [])
  return <group position={[0, 0, z]}>
    {[-3.95, 3.95].map((x, i) => <group key={x} position={[x, 0, i ? 2.5 : -2.5]}>{[0, .3, .6].map((offset, j) => <mesh key={j} position={[i ? -offset : offset, .17, j * .34]} scale={[.36, .22, .44]}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={j === 1 ? '#6d9b45' : '#3c743f'} roughness={1} flatShading /></mesh>)}</group>)}
    <mesh position={[0, 0, -3]} rotation={[0, .12, 0]}><tubeGeometry args={[rootCurve, 16, .055, 6, false]} /><meshStandardMaterial color="#563c25" roughness={1} /></mesh>
    {[-2.8, -.9, 1.2, 2.7].map((x, i) => <mesh key={x} position={[x, .1, i % 2 ? 2.4 : -1.8]} rotation={[.15, i, .2]} scale={.14 + i * .03}><dodecahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#7b6b4d" roughness={1} flatShading /></mesh>)}
  </group>
}

function ForestEdge({ z }: { z: number }) {
  const side = [-5.15, 5.15]
  return <group position={[0, 0, z]}>{side.map((x, sideIndex) => <group key={x} position={[x, 0, sideIndex ? -5 : 5]}>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[sideIndex ? -(i % 2) * .25 : (i % 2) * .25, .13 + (i % 3) * .035, -4 + i * 1.05]} scale={[.32 + (i % 3) * .08, .16, .36 + (i % 2) * .12]} rotation={[0, i, 0]}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={i % 4 === 0 ? '#78a64d' : i % 3 === 0 ? '#427b42' : '#24583a'} roughness={1} flatShading /></mesh>)}
    {[-2.8, .4, 3.2].map((pz, i) => <mesh key={pz} position={[sideIndex ? -.2 : .2, .22, pz]} scale={[.09, .09, .09]}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color={i % 2 ? '#7ea6ed' : '#d79bc5'} /></mesh>)}
    {[-1.7, 1.9].map((pz, i) => <mesh key={pz} position={[sideIndex ? -.5 : .5, .14, pz]} scale={[.16 + i * .04, .08, .28]} rotation={[0, i, .15]}><sphereGeometry args={[1, 9, 7]} /><meshStandardMaterial color="#3b6c3b" roughness={1} /></mesh>)}
  </group>)}</group>
}

function WorldSegment({ segment, initialZ, segmentRef }: { segment: ForestRunSegment; initialZ: number; segmentRef: (node: Group | null) => void }) {
  return <group ref={segmentRef} position={[0, 0, initialZ]} data-segment={segment.id}>
    <mesh position={[0, -.18, 0]} receiveShadow><boxGeometry args={[13, .34, segment.length]} /><meshStandardMaterial color="#28503a" roughness={1} /></mesh>
    <mesh position={[0, .01, 0]} receiveShadow><boxGeometry args={[7.8, .08, segment.length]} /><meshStandardMaterial color={segment.pathColor} roughness={.96} /></mesh>
    {Array.from({ length: 16 }, (_, i) => <mesh key={`stone-${i}`} position={[Math.sin(i * 3.2) * 2.9, .08, -10 + i * 1.25]} scale={[.08 + (i % 3) * .025, .025, .12 + (i % 2) * .035]} rotation={[0, i, .08]}><dodecahedronGeometry args={[1, 1]} /><meshStandardMaterial color={i % 2 ? '#ae9366' : '#6c5d45'} roughness={1} flatShading /></mesh>)}
    <ForestCard x={-6.2} z={4} scale={segment.treeScale} /><ForestCard x={6.4} z={-4} scale={segment.treeScale * .92} />
    <Rock x={-4.7} z={-2} scale={.75} /><Rock x={4.8} z={5} scale={.58} />
    <Torch x={-4.15} z={-5} /><Torch x={4.15} z={5} />
    <TrailDressing z={0} />
    <ForestEdge z={0} />
    <Fence x={-5.45} z={7} /><Fence x={5.45} z={-7} flip />
    {segment.hasRuin && <RuinedArch z={-7} />}
    {segment.hasRuin && <><Ruin x={-5.2} z={-5} height={3.8} /><Ruin x={5.4} z={4} height={3.2} /></>}
  </group>
}

function WorldSegmentPool({ playerZRef }: { playerZRef: MutableRefObject<number> }) {
  const segmentPositions = useRef(Array.from({ length: VISIBLE_SEGMENTS_AHEAD }, (_, index) => -10 - index * FOREST_SEGMENT_LENGTH))
  const segmentRefs = useRef<(Group | null)[]>([])
  useFrame(() => {
    let furthestAhead = Math.min(...segmentPositions.current)
    segmentPositions.current.forEach((segmentZ, index) => {
      if (segmentZ > playerZRef.current + FOREST_SEGMENT_LENGTH) {
        furthestAhead -= FOREST_SEGMENT_LENGTH
        segmentPositions.current[index] = furthestAhead
        segmentRefs.current[index]?.position.setZ(furthestAhead)
      }
    })
  })
  return <>{segmentPositions.current.map((initialZ, index) => <WorldSegment key={index} segment={FOREST_RUN_SEGMENTS[index % FOREST_RUN_SEGMENTS.length]} initialZ={initialZ} segmentRef={node => { segmentRefs.current[index] = node }} />)}</>
}

function DistantWorld({ playerZRef }: { playerZRef: MutableRefObject<number> }) {
  const backdropRef = useRef<Group | null>(null)
  useFrame(() => { if (backdropRef.current) backdropRef.current.position.z = playerZRef.current })
  return <group ref={backdropRef}>
    <mesh position={[0, 18, -42]}><sphereGeometry args={[84, 32, 18]} /><meshBasicMaterial color="#6f99ad" side={BackSide} /></mesh>
    <mesh position={[-13, 18, -45]} scale={[7, 1.4, 1]}><sphereGeometry args={[1, 16, 10]} /><meshBasicMaterial color="#d7e8e6" transparent opacity={.3} /></mesh>
    <mesh position={[12, 15, -47]} scale={[9, 1.2, 1]}><sphereGeometry args={[1, 16, 10]} /><meshBasicMaterial color="#d7e8e6" transparent opacity={.24} /></mesh>
    {[[-15, 6, -55, 6], [-7, 8, -58, 8], [7, 7, -60, 7], [16, 9, -57, 8]].map(([x, y, z, s], i) => <mesh key={i} position={[x, y, z]} scale={s}><icosahedronGeometry args={[1, 2]} /><meshStandardMaterial color="#465f68" roughness={1} flatShading /></mesh>)}
    <mesh position={[0, 7.5, -48]}><planeGeometry args={[5.2, 12]} /><meshBasicMaterial color="#94d5df" transparent opacity={.46} depthWrite={false} /></mesh>
    <mesh position={[-9, 4.3, -39]} scale={[8, 1.6, 1]}><sphereGeometry args={[1, 16, 8]} /><meshBasicMaterial color="#bfd8d5" transparent opacity={.16} depthWrite={false} /></mesh>
    <mesh position={[10, 5.4, -57]} scale={[10, 1.3, 1]}><sphereGeometry args={[1, 16, 8]} /><meshBasicMaterial color="#b8d8d6" transparent opacity={.14} depthWrite={false} /></mesh>
    {[-7, -3, 3, 7].map((x, i) => <mesh key={i} position={[x, 5 + (i % 2), -46 - i]}><cylinderGeometry args={[.34, .46, 7 + i, 7]} /><meshStandardMaterial color="#71807c" roughness={1} /></mesh>)}
    <ForestCard x={-15} z={-42} scale={1.45} /><ForestCard x={15} z={-45} scale={1.28} /><ForestCard x={-10} z={-61} scale={1.05} /><ForestCard x={11} z={-65} scale={.98} />
  </group>
}

function RunnerController({ active, commands, onDistance, playerZRef }: { active: boolean; commands: MutableRefObject<RunnerCommands | null>; onDistance: (distance: number) => void; playerZRef: MutableRefObject<number> }) {
  const { camera } = useThree()
  const visualRef = useRef<Group | null>(null)
  const shadowRef = useRef<Group | null>(null)
  const lane = useRef(1)
  const laneX = useRef(0)
  const distance = useRef(0)
  const reportedDistance = useRef(-1)
  const jumpElapsed = useRef(-1)
  const slideElapsed = useRef(-1)
  const slideAvailableAt = useRef(0)
  const activeRef = useRef(active)
  const cooldownUntil = useRef(0)
  const runCycle = useRef(0)
  const runFrame = useRef(0)
  const animationState = useRef<RunnerAnimationState>('IDLE')
  const laneState = useRef<'LANE_LEFT' | 'LANE_RIGHT' | null>(null)
  const lastRunStep = useRef(-1)
  const target = useMemo(() => new Vector3(), [])

  useEffect(() => {
    activeRef.current = active
    if (active && animationState.current === 'IDLE') animationState.current = 'RUN'
  }, [active])

  useEffect(() => {
    commands.current = {
      moveLeft: () => {
        if (activeRef.current && performance.now() >= cooldownUntil.current && lane.current > 0 && jumpElapsed.current < 0 && slideElapsed.current < 0) {
          lane.current -= 1
          laneState.current = 'LANE_LEFT'
          animationState.current = 'LANE_LEFT'
          cooldownUntil.current = performance.now() + RUNNER_CONFIG.inputCooldown * 1000
        }
      },
      moveRight: () => {
        if (activeRef.current && performance.now() >= cooldownUntil.current && lane.current < 2 && jumpElapsed.current < 0 && slideElapsed.current < 0) {
          lane.current += 1
          laneState.current = 'LANE_RIGHT'
          animationState.current = 'LANE_RIGHT'
          cooldownUntil.current = performance.now() + RUNNER_CONFIG.inputCooldown * 1000
        }
      },
      jump: () => {
        if (activeRef.current && jumpElapsed.current < 0 && slideElapsed.current < 0) {
          jumpElapsed.current = 0
          animationState.current = 'JUMP'
        }
      },
      slide: () => {
        if (activeRef.current && jumpElapsed.current < 0 && slideElapsed.current < 0 && performance.now() >= slideAvailableAt.current) {
          slideElapsed.current = 0
          animationState.current = 'SLIDE'
          slideAvailableAt.current = performance.now() + RUNNER_CONFIG.slideCooldown * 1000
        }
      },
    }
    return () => { commands.current = null }
  }, [commands])

  useFrame((_, delta) => {
    if (!active) return
    distance.current += RUNNER_CONFIG.runSpeed * delta
    playerZRef.current -= RUNNER_CONFIG.runSpeed * delta
    const targetX = (lane.current - 1) * RUNNER_CONFIG.laneOffset
    laneX.current += (targetX - laneX.current) * Math.min(1, delta * RUNNER_CONFIG.laneChangeSpeed)
    let jumpY = 0
    if (jumpElapsed.current >= 0) {
      jumpElapsed.current += delta
      const t = Math.min(1, jumpElapsed.current / RUNNER_CONFIG.jumpDuration)
      jumpY = Math.sin(Math.PI * t) * RUNNER_CONFIG.jumpHeight
      if (t >= 1) jumpElapsed.current = -1
    }
    if (slideElapsed.current >= 0) {
      slideElapsed.current += delta
      if (slideElapsed.current / RUNNER_CONFIG.slideDuration >= 1) slideElapsed.current = -1
    }
    const isSliding = slideElapsed.current >= 0
    const laneIsMoving = Math.abs(laneX.current - targetX) > .02
    if (!laneIsMoving) laneState.current = null
    // Priority: JUMP > SLIDE > lane change > RUN. Inputs and motion share this controller.
    animationState.current = jumpElapsed.current >= 0 ? 'JUMP' : isSliding ? 'SLIDE' : laneIsMoving && laneState.current ? laneState.current : 'RUN'
    const hasRunRhythm = animationState.current === 'RUN' || laneIsMoving
    if (hasRunRhythm) {
      runCycle.current += delta * RUNNER_CONFIG.runSpeed * RUNNER_CONFIG.runCycleHzPerSpeed * Math.PI * 2
      runFrame.current = Math.floor((runCycle.current / (Math.PI * 2)) * ZELDA_RUN_FRAMES.length) % ZELDA_RUN_FRAMES.length
    }
    const runRhythm = Math.sin(runCycle.current)
    const strideLift = Math.abs(runRhythm)
    const runBob = hasRunRhythm ? strideLift * RUNNER_CONFIG.runAnimationBobHeight : 0
    const runStep = Math.floor(runCycle.current / Math.PI)
    if (runStep !== lastRunStep.current && (animationState.current === 'RUN' || laneIsMoving)) {
      lastRunStep.current = runStep
      // Future onRunStep() hook: attach footstep audio, dust, or surface effects here.
    }
    if (visualRef.current) {
      const rhythmX = hasRunRhythm ? runRhythm * RUNNER_CONFIG.runAnimationSway : 0
      const rhythmTilt = hasRunRhythm ? runRhythm * RUNNER_CONFIG.runAnimationTilt : 0
      const strideScale = hasRunRhythm ? strideLift * RUNNER_CONFIG.runAnimationStrideScale : 0
      // The pose is bottom-center anchored, so this compression and lift read as
      // alternating strides without changing the gameplay collision footprint.
      visualRef.current.position.set(laneX.current + rhythmX, jumpY + runBob, playerZRef.current)
      visualRef.current.scale.set(RUNNER_CONFIG.characterScale * 1.08 + strideScale, RUNNER_CONFIG.characterScale - strideScale * .55, 1)
      visualRef.current.rotation.set(isSliding ? .06 : 0, hasRunRhythm ? runRhythm * .018 : 0, animationState.current === 'LANE_LEFT' ? .045 : animationState.current === 'LANE_RIGHT' ? -.045 : rhythmTilt)
    }
    if (shadowRef.current) {
      shadowRef.current.position.set(laneX.current, 0, playerZRef.current)
      const shadowScale = 1 - (hasRunRhythm ? strideLift * RUNNER_CONFIG.runAnimationShadowPulse : 0) - jumpY * .1
      shadowRef.current.scale.set(Math.max(.62, shadowScale), Math.max(.62, shadowScale), 1)
    }
    const smooth = Math.min(1, delta * RUNNER_CONFIG.cameraSmoothing)
    camera.position.x += (laneX.current - camera.position.x) * smooth
    camera.position.z += (playerZRef.current + 7.15 - camera.position.z) * smooth
    target.set(laneX.current, .72 + jumpY * .08, playerZRef.current - 19.65)
    camera.lookAt(target)
    const nextDistance = Math.floor(distance.current)
    if (nextDistance !== reportedDistance.current) { reportedDistance.current = nextDistance; onDistance(nextDistance) }
  })
  return <ZeldaBillboard visualRef={visualRef} shadowRef={shadowRef} animationStateRef={animationState} runFrameRef={runFrame} />
}

function World({ active, commands, onDistance }: { active: boolean; commands: MutableRefObject<RunnerCommands | null>; onDistance: (distance: number) => void }) {
  const playerZRef = useRef(1.65)
  return <>
    <color attach="background" args={[new Color('#6f98a5')]} /><fogExp2 attach="fog" args={['#6f98a5', .021]} />
    <hemisphereLight args={['#d0edf0', '#173225', 1.9]} /><ambientLight color="#b3d2c3" intensity={.38} /><directionalLight position={[-9, 14, 7]} color="#fff0c8" intensity={2.1} castShadow />
    <DistantWorld playerZRef={playerZRef} />
    <WorldSegmentPool playerZRef={playerZRef} />
    <RunnerController active={active} commands={commands} onDistance={onDistance} playerZRef={playerZRef} />
  </>
}

export function ForestRunnerScene({ active, commands, onDistance }: { active: boolean; commands: MutableRefObject<RunnerCommands | null>; onDistance: (distance: number) => void }) {
  return <Canvas className="runner-canvas" shadows dpr={[1, 1.5]} camera={{ fov: 42, near: .1, far: 165 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
    <Suspense fallback={null}><RunnerCamera /><World active={active} commands={commands} onDistance={onDistance} /></Suspense>
  </Canvas>
}
