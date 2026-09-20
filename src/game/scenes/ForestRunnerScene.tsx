import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import { BackSide, CatmullRomCurve3, Color, SRGBColorSpace, TextureLoader, Vector3 } from 'three'
import zeldaRear from '../../../assets/characters/zelda/runtime/zelda-rear-hero-v2.png'
import treeCard from '../../../assets/environments/whispering-forest/runtime/ancient-tree-billboard-v2.png'
import { FOREST_RUN_SEGMENTS } from '../world/forestSegments'

function RunnerCamera() {
  const { camera } = useThree()
  const target = useMemo(() => new Vector3(0, 0.72, -18), [])
  useEffect(() => { camera.position.set(0, 4.15, 8.8); camera.lookAt(target) }, [camera, target])
  useFrame(() => camera.lookAt(target))
  return null
}

function ZeldaBillboard() {
  const texture = useLoader(TextureLoader, zeldaRear)
  useEffect(() => { texture.colorSpace = SRGBColorSpace; texture.needsUpdate = true }, [texture])
  return <group position={[0, 0.02, 1.65]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[1.4, .44, 1]}><circleGeometry args={[1, 32]} /><meshBasicMaterial color="#0a1611" transparent opacity={.42} depthWrite={false} /></mesh>
    <mesh position={[0, 2.28, 0]}><planeGeometry args={[3.04, 4.56]} /><meshBasicMaterial map={texture} transparent alphaTest={.02} depthWrite={false} toneMapped={false} /></mesh>
  </group>
}

function ForestCard({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const texture = useLoader(TextureLoader, treeCard)
  useEffect(() => { texture.colorSpace = SRGBColorSpace; texture.needsUpdate = true }, [texture])
  return <sprite position={[x, 4.2 * scale, z]} scale={[5.6 * scale, 8.4 * scale, 1]}><spriteMaterial map={texture} transparent alphaTest={.02} depthWrite={false} /></sprite>
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

function TrailDressing({ z }: { z: number }) {
  const rootCurve = useMemo(() => new CatmullRomCurve3([new Vector3(-2.4, .08, 0), new Vector3(-.8, .12, .18), new Vector3(.4, .08, -.1), new Vector3(1.55, .05, 0)]), [])
  return <group position={[0, 0, z]}>
    {[-3.95, 3.95].map((x, i) => <group key={x} position={[x, 0, i ? 2.5 : -2.5]}>{[0, .3, .6].map((offset, j) => <mesh key={j} position={[i ? -offset : offset, .17, j * .34]} scale={[.36, .22, .44]}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={j === 1 ? '#6d9b45' : '#3c743f'} roughness={1} flatShading /></mesh>)}</group>)}
    <mesh position={[0, 0, -3]} rotation={[0, .12, 0]}><tubeGeometry args={[rootCurve, 16, .055, 6, false]} /><meshStandardMaterial color="#563c25" roughness={1} /></mesh>
    {[-2.8, -.9, 1.2, 2.7].map((x, i) => <mesh key={x} position={[x, .1, i % 2 ? 2.4 : -1.8]} rotation={[.15, i, .2]} scale={.14 + i * .03}><dodecahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#7b6b4d" roughness={1} flatShading /></mesh>)}
  </group>
}

function Segment({ segment }: { segment: (typeof FOREST_RUN_SEGMENTS)[number] }) {
  const left = segment.z + 4
  return <group data-segment={segment.id}>
    <mesh position={[0, -.18, segment.z]} receiveShadow><boxGeometry args={[13, .34, segment.length]} /><meshStandardMaterial color="#28503a" roughness={1} /></mesh>
    <mesh position={[0, .01, segment.z]} receiveShadow><boxGeometry args={[7.8, .08, segment.length]} /><meshStandardMaterial color={segment.pathColor} roughness={.96} /></mesh>
    <ForestCard x={-6.2} z={left} scale={segment.treeScale} /><ForestCard x={6.4} z={segment.z - 4} scale={segment.treeScale * .92} />
    <Rock x={-4.7} z={segment.z - 2} scale={.75} /><Rock x={4.8} z={segment.z + 5} scale={.58} />
    <Torch x={-4.15} z={segment.z - 5} /><Torch x={4.15} z={segment.z + 5} />
    <TrailDressing z={segment.z} />
    {segment.hasRuin && <><Ruin x={-5.2} z={segment.z - 5} height={3.8} /><Ruin x={5.4} z={segment.z + 4} height={3.2} /></>}
  </group>
}

function DistantWorld() {
  return <group>
    <mesh position={[0, 18, -42]}><sphereGeometry args={[84, 32, 18]} /><meshBasicMaterial color="#6f99ad" side={BackSide} /></mesh>
    <mesh position={[-13, 18, -45]} scale={[7, 1.4, 1]}><sphereGeometry args={[1, 16, 10]} /><meshBasicMaterial color="#d7e8e6" transparent opacity={.3} /></mesh>
    <mesh position={[12, 15, -47]} scale={[9, 1.2, 1]}><sphereGeometry args={[1, 16, 10]} /><meshBasicMaterial color="#d7e8e6" transparent opacity={.24} /></mesh>
    {[[-15, 6, -55, 6], [-7, 8, -58, 8], [7, 7, -60, 7], [16, 9, -57, 8]].map(([x, y, z, s], i) => <mesh key={i} position={[x, y, z]} scale={s}><icosahedronGeometry args={[1, 2]} /><meshStandardMaterial color="#465f68" roughness={1} flatShading /></mesh>)}
    <mesh position={[0, 7.5, -48]}><planeGeometry args={[5.2, 12]} /><meshBasicMaterial color="#94d5df" transparent opacity={.46} depthWrite={false} /></mesh>
    {[-7, -3, 3, 7].map((x, i) => <mesh key={i} position={[x, 5 + (i % 2), -46 - i]}><cylinderGeometry args={[.34, .46, 7 + i, 7]} /><meshStandardMaterial color="#71807c" roughness={1} /></mesh>)}
  </group>
}

function World() {
  return <>
    <color attach="background" args={[new Color('#6f98a5')]} /><fogExp2 attach="fog" args={['#6f98a5', .021]} />
    <hemisphereLight args={['#d0edf0', '#173225', 1.9]} /><ambientLight color="#b3d2c3" intensity={.38} /><directionalLight position={[-9, 14, 7]} color="#fff0c8" intensity={2.1} castShadow />
    <DistantWorld />
    {FOREST_RUN_SEGMENTS.map(segment => <Segment key={segment.id} segment={segment} />)}
    <ZeldaBillboard />
  </>
}

export function ForestRunnerScene() {
  return <Canvas className="runner-canvas" shadows dpr={[1, 1.5]} camera={{ fov: 42, near: .1, far: 165 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
    <Suspense fallback={null}><RunnerCamera /><World /></Suspense>
  </Canvas>
}
