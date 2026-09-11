import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '../hooks/useKeyboardControls'

const POOL_SIZE = 12

function Dust({ characterRef }) {
  const keys = useKeyboardControls()
  const meshRefs = useRef([])
  const particles = useRef(Array.from({ length: POOL_SIZE }, () => ({ life: 0, active: false, x: 0, z: 0 })))
  const spawnTimer = useRef(0)

  useFrame((state, delta) => {
    if (!characterRef.current) return
    const { forward, backward, left, right } = keys.current
    const isMoving = forward || backward || left || right

    spawnTimer.current += delta
    if (isMoving && spawnTimer.current > 0.12) {
      spawnTimer.current = 0
      const p = particles.current.find((p) => !p.active)
      if (p) {
        p.active = true
        p.life = 0
        p.x = characterRef.current.position.x + (Math.random() - 0.5) * 0.3
        p.z = characterRef.current.position.z + (Math.random() - 0.5) * 0.3
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
      const duration = 0.6
      if (p.life > duration) {
        p.active = false
        mesh.visible = false
        return
      }
      mesh.visible = true
      mesh.position.set(p.x, 0.1 + p.life * 0.5, p.z)
      const t = p.life / duration
      mesh.scale.setScalar(0.15 + t * 0.3)
      mesh.material.opacity = 1 - t
    })
  })

  return (
    <>
      {Array.from({ length: POOL_SIZE }).map((_, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} visible={false}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#c9b896" roughness={1} transparent opacity={0} />
        </mesh>
      ))}
    </>
  )
}

export default Dust