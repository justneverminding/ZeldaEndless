export type ForestRunSegment = {
  id: 'forest_straight_01' | 'forest_straight_02' | 'forest_ruins' | 'forest_bridge' | 'forest_clearing'
  z: number
  length: number
  pathColor: string
  treeScale: number
  hasRuin: boolean
  futureSpawnPoints: readonly [number, number, number][]
}

/** Static Milestone 0 queue. A future director recycles passed sections and
 * uses each segment's three-lane spawn coordinates. */
export const FOREST_RUN_SEGMENTS: readonly ForestRunSegment[] = [
  { id: 'forest_straight_01', z: -10, length: 24, pathColor: '#876b46', treeScale: 1.08, hasRuin: false, futureSpawnPoints: [[-2.4, .2, -10], [0, .2, -10], [2.4, .2, -10]] },
  { id: 'forest_straight_02', z: -34, length: 24, pathColor: '#766140', treeScale: 1.2, hasRuin: false, futureSpawnPoints: [[-2.4, .2, -34], [0, .2, -34], [2.4, .2, -34]] },
  { id: 'forest_ruins', z: -58, length: 24, pathColor: '#6b6345', treeScale: 1.36, hasRuin: true, futureSpawnPoints: [[-2.4, .2, -58], [0, .2, -58], [2.4, .2, -58]] },
  { id: 'forest_bridge', z: -82, length: 24, pathColor: '#746345', treeScale: 1.18, hasRuin: true, futureSpawnPoints: [[-2.4, .2, -82], [0, .2, -82], [2.4, .2, -82]] },
  { id: 'forest_clearing', z: -106, length: 24, pathColor: '#8b744d', treeScale: 1.5, hasRuin: false, futureSpawnPoints: [[-2.4, .2, -106], [0, .2, -106], [2.4, .2, -106]] },
]
