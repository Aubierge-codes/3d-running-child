import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { treeColliders } from './Trees'

const LEAF_COUNT = 30

function seededRandom(seed) {
  let value = seed
  return function () {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function Leaves() {
  const meshRefs = useRef([])
  const leaves = useRef((() => {
    const rand = seededRandom(9001)
    return Array.from({ length: LEAF_COUNT }, () => {
      const tree = treeColliders[Math.floor(rand() * treeColliders.length)]
      return {
        x: tree.position[0] + (rand() - 0.5) * 4,
        z: tree.position[2] + (rand() - 0.5) * 4,
        y: 2 + rand() * 3,
        fallSpeed: 0.4 + rand() * 0.4,
        driftPhase: rand() * Math.PI * 2,
        driftSpeed: 0.5 + rand() * 0.5,
        rotSpeed: 1 + rand() * 2,
      }
    })
  })())

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    leaves.current.forEach((leaf, i) => {
      leaf.y -= leaf.fallSpeed * delta
      if (leaf.y < 0) {
        leaf.y = 4 + Math.random() * 2
      }
      const driftX = Math.sin(t * leaf.driftSpeed + leaf.driftPhase) * 0.02
      leaf.x += driftX

      const mesh = meshRefs.current[i]
      if (mesh) {
        mesh.position.set(leaf.x, leaf.y, leaf.z)
        mesh.rotation.x = t * leaf.rotSpeed
        mesh.rotation.z = t * leaf.rotSpeed * 0.7
      }
    })
  })

  return (
    <>
      {leaves.current.map((leaf, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} position={[leaf.x, leaf.y, leaf.z]}>
          <planeGeometry args={[0.15, 0.15]} />
          <meshStandardMaterial color="#c9a54a" side={2} roughness={0.9} />
        </mesh>
      ))}
    </>
  )
}

export default Leaves