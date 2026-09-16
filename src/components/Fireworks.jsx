import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const PARTICLES_PER_BURST = 40
const COLORS = ['#ff5252', '#ffd54f', '#69f0ae', '#40c4ff', '#e040fb']

function Fireworks({ active }) {
  const meshRefs = useRef([])
  const particles = useRef(
    Array.from({ length: PARTICLES_PER_BURST * 3 }, () => ({ active: false, life: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, color: '#fff' }))
  )
  const wasActive = useRef(false)
  const launchTimer = useRef(0)

  function launchBurst() {
    const center = { x: (Math.random() - 0.5) * 10, y: 8 + Math.random() * 4, z: (Math.random() - 0.5) * 10 }
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    for (let i = 0; i < PARTICLES_PER_BURST; i++) {
      const p = particles.current.find((p) => !p.active)
      if (!p) continue
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const speed = 2.5 + Math.random() * 2
      p.active = true
      p.life = 0
      p.x = center.x
      p.y = center.y
      p.z = center.z
      p.vx = Math.sin(phi) * Math.cos(theta) * speed
      p.vy = Math.cos(phi) * speed
      p.vz = Math.sin(phi) * Math.sin(theta) * speed
      p.color = color
    }
  }

  useFrame((state, delta) => {
    if (active && !wasActive.current) {
      launchBurst()
      launchTimer.current = 0
    }
    if (active) {
      launchTimer.current += delta
      if (launchTimer.current > 0.6) {
        launchTimer.current = 0
        launchBurst()
      }
    }
    wasActive.current = active

    particles.current.forEach((p, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return
      if (!p.active) {
        mesh.visible = false
        return
      }
      p.life += delta
      const duration = 1.1
      if (p.life > duration) {
        p.active = false
        mesh.visible = false
        return
      }
      p.vy -= 2.5 * delta
      p.x += p.vx * delta
      p.y += p.vy * delta
      p.z += p.vz * delta

      mesh.visible = true
      mesh.position.set(p.x, p.y, p.z)
      const t = p.life / duration
      mesh.scale.setScalar(0.12 * (1 - t * 0.6))
      mesh.material.opacity = 1 - t
    })
  })

  return (
    <>
      {particles.current.map((_, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} visible={false}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.4} transparent opacity={0} />
        </mesh>
      ))}
    </>
  )
}

export default Fireworks