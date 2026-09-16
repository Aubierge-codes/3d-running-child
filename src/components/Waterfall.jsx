import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const FALL_POS = [-55, 0, -60]

function Waterfall() {
  const streamRefs = useRef([])
  const poolRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    streamRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      mesh.material.opacity = 0.55 + Math.sin(t * 8 + i * 1.7) * 0.15
      mesh.position.y = 5 - ((t * 6 + i * 1.3) % 9)
    })
    if (poolRef.current) {
      poolRef.current.material.opacity = 0.75 + Math.sin(t * 2) * 0.05
    }
  })

  return (
    <group position={FALL_POS}>
      <mesh position={[0, 4.5, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[6, 9, 2]} />
        <meshStandardMaterial color="#6b6358" roughness={1} />
      </mesh>
      <mesh position={[-2.2, 6, 0.6]} rotation={[0.1, 0.2, 0]} castShadow>
        <boxGeometry args={[2.5, 4, 1.8]} />
        <meshStandardMaterial color="#79706280" roughness={1} />
      </mesh>

      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} ref={(el) => (streamRefs.current[i] = el)} position={[(i - 2) * 0.35, 4, 0.6]}>
          <planeGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="#bfe3f0" transparent opacity={0.6} roughness={0.1} metalness={0.1} side={2} />
        </mesh>
      ))}

      <mesh ref={poolRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 2.5]}>
        <circleGeometry args={[3.2, 24]} />
        <meshStandardMaterial color="#5aa8c9" transparent opacity={0.8} roughness={0.15} metalness={0.2} />
      </mesh>
    </group>
  )
}

export const waterfallColliders = [{ position: FALL_POS, radius: 3.5 }]

export default Waterfall