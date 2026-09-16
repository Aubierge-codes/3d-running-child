import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const STAR_COUNT = 140

function seededRandom(seed) {
  let value = seed
  return function () {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

const starData = (() => {
  const rand = seededRandom(24680)
  return Array.from({ length: STAR_COUNT }, () => {
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(rand() * 0.85)
    const r = 160
    return {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.cos(phi) + 20,
      z: r * Math.sin(phi) * Math.sin(theta),
      size: 0.4 + rand() * 0.9,
      twinkleSpeed: 0.8 + rand() * 2.2,
      twinklePhase: rand() * Math.PI * 2,
    }
  })
})()

function Stars({ nightIntensity }) {
  const meshRefs = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    starData.forEach((star, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return
      if (nightIntensity < 0.25) {
        mesh.visible = false
        return
      }
      mesh.visible = true
      const twinkle = 0.55 + Math.sin(t * star.twinkleSpeed + star.twinklePhase) * 0.45
      mesh.material.opacity = twinkle * nightIntensity
    })
  })

  return (
    <>
      {starData.map((star, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} position={[star.x, star.y, star.z]} visible={false}>
          <sphereGeometry args={[star.size, 5, 5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} />
        </mesh>
      ))}
    </>
  )
}

export default Stars