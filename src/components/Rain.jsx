import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const DROP_COUNT = 60

function seededRandom(seed) {
  let value = seed
  return function () {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function Rain() {
  const meshRefs = useRef([])
  const drops = useRef((() => {
    const rand = seededRandom(321)
    return Array.from({ length: DROP_COUNT }, () => ({
      x: (rand() - 0.5) * 60,
      z: (rand() - 0.5) * 60,
      y: rand() * 20,
      speed: 8 + rand() * 6,
    }))
  })())

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
      {drops.current.map((d, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} position={[d.x, d.y, d.z]}>
          <cylinderGeometry args={[0.01, 0.01, 0.4, 4]} />
          <meshStandardMaterial color="#aaccee" transparent opacity={0.5} />
        </mesh>
      ))}
    </>
  )
}

export default Rain
