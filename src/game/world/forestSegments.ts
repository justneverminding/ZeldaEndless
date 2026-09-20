export type ForestRunSegment = {
  id: 'forest_straight_01' | 'forest_straight_02' | 'forest_ruins' | 'forest_bridge' | 'forest_clearing'
  length: number
  pathColor: string
  treeScale: number
  hasRuin: boolean
  futureSpawnPoints: readonly [number, number, number][]
}

export const FOREST_SEGMENT_LENGTH = 24
export const VISIBLE_SEGMENTS_AHEAD = 7

/** Reusable visual variants. Spawn points are local to each segment so later
 * gameplay systems can attach pooled enemies and collectibles safely. */
export const FOREST_RUN_SEGMENTS: readonly ForestRunSegment[] = [
  { id: 'forest_straight_01', length: FOREST_SEGMENT_LENGTH, pathColor: '#876b46', treeScale: 1.08, hasRuin: false, futureSpawnPoints: [[-2.4, .2, 0], [0, .2, 0], [2.4, .2, 0]] },
  { id: 'forest_straight_02', length: FOREST_SEGMENT_LENGTH, pathColor: '#766140', treeScale: 1.2, hasRuin: false, futureSpawnPoints: [[-2.4, .2, 0], [0, .2, 0], [2.4, .2, 0]] },
  { id: 'forest_ruins', length: FOREST_SEGMENT_LENGTH, pathColor: '#6b6345', treeScale: 1.36, hasRuin: true, futureSpawnPoints: [[-2.4, .2, 0], [0, .2, 0], [2.4, .2, 0]] },
  { id: 'forest_bridge', length: FOREST_SEGMENT_LENGTH, pathColor: '#746345', treeScale: 1.18, hasRuin: true, futureSpawnPoints: [[-2.4, .2, 0], [0, .2, 0], [2.4, .2, 0]] },
  { id: 'forest_clearing', length: FOREST_SEGMENT_LENGTH, pathColor: '#8b744d', treeScale: 1.5, hasRuin: false, futureSpawnPoints: [[-2.4, .2, 0], [0, .2, 0], [2.4, .2, 0]] },
]
