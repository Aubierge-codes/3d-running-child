import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Campfire({ position = [-8, 0, 12] }) {
  const lightRef = useRef()
  const flameRefs = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (lightRef.current) {
      lightRef.current.intensity = 2.2 + Math.sin(t * 12) * 0.5 + Math.sin(t * 27) * 0.3
    }
    flameRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const phase = i * 1.7
      mesh.scale.y = 1 + Math.sin(t * 9 + phase) * 0.25
      mesh.scale.x = 1 + Math.cos(t * 7 + phase) * 0.12
      mesh.position.y = 0.35 + i * 0.22 + Math.sin(t * 6 + phase) * 0.05
    })
  })

  return (
    <group position={position}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.55, 0.08, Math.sin(angle) * 0.55]} rotation={[0, -angle, 0]} castShadow>
            <boxGeometry args={[0.32, 0.16, 0.16]} />
            <meshStandardMaterial color="#6b6b6b" roughness={1} />
          </mesh>
        )
      })}

      {[0, 1, 2].map((i) => (
        <mesh
          key={`log-${i}`}
          position={[0, 0.16, 0]}
          rotation={[Math.PI / 2.4, (i / 3) * Math.PI, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.07, 0.09, 0.9, 6]} />
          <meshStandardMaterial color="#4a3222" roughness={0.95} />
        </mesh>
      ))}

      {[0, 1, 2].map((i) => (
        <mesh key={`flame-${i}`} ref={(el) => (flameRefs.current[i] = el)} position={[0, 0.35 + i * 0.22, 0]}>
          <coneGeometry args={[0.26 - i * 0.06, 0.55 - i * 0.1, 7]} />
          <meshStandardMaterial
            color={i === 0 ? '#ff6b1a' : i === 1 ? '#ffa33d' : '#ffe066'}
            emissive={i === 0 ? '#ff4500' : i === 1 ? '#ff9500' : '#ffdd44'}
            emissiveIntensity={1.6}
            transparent
            opacity={0.88}
          />
        </mesh>
      ))}

      <pointLight ref={lightRef} position={[0, 0.8, 0]} color="#ff8c3a" intensity={2.2} distance={14} decay={2} />
    </group>
  )
}

export default Campfire