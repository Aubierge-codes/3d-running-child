import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const PARTICLES_PER_BURST = 8
const POOL_SIZE = 24

function Sparkles({ burstsRef }) {
  const meshRefs = useRef([])
  const particles = useRef(Array.from({ length: POOL_SIZE }, () => ({ active: false, life: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 })))
  const lastProcessedBurst = useRef(0)

  useFrame((state, delta) => {
    const bursts = burstsRef.current
    bursts.forEach((burst) => {
      if (burst.id <= lastProcessedBurst.current) return
    })
    const newBursts = bursts.filter((b) => b.id > lastProcessedBurst.current)
    if (newBursts.length > 0) {
      newBursts.forEach((burst) => {
        for (let i = 0; i < PARTICLES_PER_BURST; i++) {
          const p = particles.current.find((p) => !p.active)
          if (!p) continue
          const angle = (i / PARTICLES_PER_BURST) * Math.PI * 2
          const upSpeed = 1.5 + Math.random() * 1
          p.active = true
          p.life = 0
          p.x = burst.x
          p.y = burst.y
          p.z = burst.z
          p.vx = Math.cos(angle) * 1.5
          p.vz = Math.sin(angle) * 1.5
          p.vy = upSpeed
        }
      })
      lastProcessedBurst.current = newBursts[newBursts.length - 1].id
    }

    particles.current.forEach((p, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return
      if (!p.active) {
        mesh.visible = false
        return
      }
      p.life += delta
      const duration = 0.5
      if (p.life > duration) {
        p.active = false
        mesh.visible = false
        return
      }
      p.vy -= 3 * delta
      p.x += p.vx * delta
      p.y += p.vy * delta
      p.z += p.vz * delta

      mesh.visible = true
      mesh.position.set(p.x, p.y, p.z)
      const t = p.life / duration
      mesh.scale.setScalar(0.1 * (1 - t))
      mesh.material.opacity = 1 - t
    })
  })

  return (
    <>
      {Array.from({ length: POOL_SIZE }).map((_, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} visible={false}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#fff2a8" emissive="#ffe066" emissiveIntensity={1.5} transparent opacity={0} />
        </mesh>
      ))}
    </>
  )
}

export default Sparkles