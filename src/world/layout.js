// Single source of truth for where static world objects sit and how large their
// collision circles are. Components render from this data, and ObstacleManager
// (Scene.jsx) pushes the character out of every entry in `colliders`.
// Coordinates are [x, y, z] in metres; the ground is the XZ plane at y = 0.
import { seededRandom } from './random'

export const WORLD_SIZE = 200

export const POND_CENTER = [35, 0, -35]
export const POND_RADIUS = 8

export const BARN_POS = [30, 0, 10]
export const WELL_POS = [22, 0, -8]
export const WINDMILL_POS = [-30, 0, 22]
export const WATERFALL_POS = [-55, 0, -60]
export const TREEHOUSE_POS = [-7, 0, -20]
export const SCARECROW_POS = [-30, 0, 13]

function generatePositions(count, worldSize, clearRadius, seed) {
  const rand = seededRandom(seed)
  const positions = []
  for (let i = 0; i < count; i++) {
    let x, z, distFromCenter
    do {
      x = (rand() - 0.5) * worldSize
      z = (rand() - 0.5) * worldSize
      distFromCenter = Math.sqrt(x * x + z * z)
    } while (distFromCenter < clearRadius)
    positions.push([x, 0, z])
  }
  return positions
}

function generateScattered(count, worldSize, clearRadius, seed, radiusRange) {
  const rand = seededRandom(seed)
  const result = []
  for (let i = 0; i < count; i++) {
    let x, z, dist
    do {
      x = (rand() - 0.5) * worldSize
      z = (rand() - 0.5) * worldSize
      dist = Math.sqrt(x * x + z * z)
    } while (dist < clearRadius)
    const scale = radiusRange[0] + rand() * (radiusRange[1] - radiusRange[0])
    result.push({ position: [x, 0, z], scale, radius: scale * 0.65 })
  }
  return result
}

function generateFenceRing(center, radius, count) {
  const posts = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const x = center[0] + Math.cos(angle) * radius
    const z = center[2] + Math.sin(angle) * radius
    posts.push({ position: [x, 0.5, z], radius: 0.3 })
  }
  return posts
}

export const treeColliders = generatePositions(40, 180, 10, 42).map((pos, i) => ({
  position: pos,
  radius: 0.5,
  scale: 0.8 + ((i * 13) % 10) / 10,
}))

// Rocks and bushes (Landmarks.jsx). Entries with type 'bush' render as bushes.
export const obstacles = [
  { position: [6, 0, -2], scale: 1.0, radius: 0.7 },
  { position: [-8, 0, 3], scale: 1.1, radius: 0.75 },
  { position: [10, 0, 6], scale: 0.9, radius: 0.65 },
  { position: [-5, 0, -9], scale: 1.2, radius: 0.8 },
  { position: [2, 0, 9], scale: 0.8, radius: 0.6 },
  { position: [-12, 0, -4], scale: 1.0, radius: 0.7 },
  { position: [15, 0, -10], scale: 1.3, radius: 0.85 },
  { position: [-18, 0, 8], scale: 0.85, radius: 0.6 },
  { position: [4, 0, 5], scale: 0.9, radius: 0.7, type: 'bush' },
  { position: [-6, 0, -3], scale: 1.0, radius: 0.75, type: 'bush' },
  { position: [8, 0, -7], scale: 1.1, radius: 0.8, type: 'bush' },
  { position: [-3, 0, 8], scale: 0.85, radius: 0.65, type: 'bush' },
  { position: [12, 0, 1], scale: 1.0, radius: 0.75, type: 'bush' },
  { position: [-10, 0, 6], scale: 0.9, radius: 0.7, type: 'bush' },
  { position: [16, 0, 4], scale: 0.95, radius: 0.7, type: 'bush' },
  { position: [-14, 0, -8], scale: 1.05, radius: 0.75, type: 'bush' },
  { position: [3, 0, -14], scale: 0.9, radius: 0.7, type: 'bush' },
  { position: [-2, 0, 15], scale: 1.1, radius: 0.8, type: 'bush' },
  ...generateScattered(15, 190, 12, 777, [0.7, 1.3]),
  ...generateScattered(15, 190, 12, 888, [0.75, 1.25]).map((b) => ({ ...b, type: 'bush' })),
]

export const houseColliders = [
  { position: [20, 0, 15], rotationY: 0.3, radius: 1.8 },
  { position: [24, 0, 18], rotationY: 1.1, radius: 1.8 },
  { position: [18, 0, 20], rotationY: -0.4, radius: 1.8 },
  { position: [-20, 0, -15], rotationY: 0.8, radius: 1.8 },
  { position: [-24, 0, -18], rotationY: -1.0, radius: 1.8 },
]

export const fenceColliders = [
  ...generateFenceRing([22, 0, 17], 6, 16),
  ...generateFenceRing([-22, 0, -17], 6, 16),
]

export const lampPositions = [
  [18, 0, 12],
  [26, 0, 22],
  [-18, 0, -12],
  [-26, 0, -22],
  [0, 0, 16],
  [12, 0, -14],
]

export const signData = [
  { position: [6, 0, 14], rotationY: 0.4, arms: [{ dir: 1, label: 'village' }, { dir: -1, label: 'pond' }] },
  { position: [-12, 0, -6], rotationY: -0.8, arms: [{ dir: 1, label: 'forest' }] },
  { position: [20, 0, 4], rotationY: 1.4, arms: [{ dir: -1, label: 'well' }, { dir: 1, label: 'farm' }] },
]

export const colliders = [
  ...obstacles,
  ...treeColliders,
  ...houseColliders,
  ...fenceColliders,
  ...lampPositions.map((p) => ({ position: p, radius: 0.35 })),
  ...signData.map((s) => ({ position: s.position, radius: 0.3 })),
  { position: WINDMILL_POS, radius: 2.2 },
  { position: WELL_POS, radius: 1.4 },
  { position: WATERFALL_POS, radius: 3.5 },
  { position: TREEHOUSE_POS, radius: 0.7 },
  { position: SCARECROW_POS, radius: 0.4 },
  { position: BARN_POS, radius: 3.2 },
]
