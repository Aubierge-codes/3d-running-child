import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '../hooks/useKeyboardControls'

const POOL_SIZE = 16

function SprintTrail({ characterRef }) {
  const keys = useKeyboardControls()
  const meshRefs = useRef([])
  const particles = useRef(Array.from({ length: POOL_SIZE }, () => ({ life: 0, active: false, x: 0, y: 0, z: 0 })))
  const spawnTimer = useRef(0)

  useFrame((state, delta) => {
    if (!characterRef.current) return
    const { forward, backward, left, right, sprint } = keys.current
    const isMoving = forward || backward || left || right

    spawnTimer.current += delta
    if (isMoving && sprint && spawnTimer.current > 0.05) {
      spawnTimer.current = 0
      const p = particles.current.find((p) => !p.active)
      if (p) {
        p.active = true
        p.life = 0
        p.x = characterRef.current.position.x
        p.y = characterRef.current.position.y + 0.6
        p.z = characterRef.current.position.z
      }
    }

    particles.current.forEach((p, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return
      if (!p.active) {
        mesh.visible = false
        return
      }
      p.life += delta
      const duration = 0.4
      if (p.life > duration) {
        p.active = false
        mesh.visible = false
        return
      }
      mesh.visible = true
      mesh.position.set(p.x, p.y, p.z)
      const t = p.life / duration
      mesh.scale.setScalar(0.2 * (1 - t * 0.5))
      mesh.material.opacity = 0.6 * (1 - t)
    })
  })

  return (
    <>
      {Array.from({ length: POOL_SIZE }).map((_, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} visible={false}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#7ec8ff" emissive="#7ec8ff" emissiveIntensity={0.6} transparent opacity={0} />
        </mesh>
      ))}
    </>
  )
}

export default SprintTrail