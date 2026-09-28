import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { seededRandom } from '../world/random'

const DROP_COUNT = 60

function createDrops() {
  const rand = seededRandom(321)
  return Array.from({ length: DROP_COUNT }, () => ({
    x: (rand() - 0.5) * 60,
    z: (rand() - 0.5) * 60,
    y: rand() * 20,
    speed: 8 + rand() * 6,
  }))
}

function Rain() {
  const meshRefs = useRef([])
  const drops = useRef(null)
  if (drops.current === null) drops.current = createDrops()

  useFrame((state, delta) => {
    drops.current.forEach((drop, i) => {
      drop.y -= drop.speed * delta
      if (drop.y < 0) drop.y = 20
      const mesh = meshRefs.current[i]
      if (mesh) mesh.position.set(drop.x, drop.y, drop.z)
    })
  })

  return (
    <>
      {Array.from({ length: DROP_COUNT }).map((_, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)}>
          <cylinderGeometry args={[0.01, 0.01, 0.4, 4]} />
          <meshStandardMaterial color="#aaccee" transparent opacity={0.5} />
        </mesh>
      ))}
    </>
  )
}

export default Rain
