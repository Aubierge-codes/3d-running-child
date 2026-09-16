import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function HotAirBalloon() {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.06
    groupRef.current.position.x = Math.cos(t) * 70
    groupRef.current.position.z = Math.sin(t) * 70
    groupRef.current.position.y = 35 + Math.sin(state.clock.elapsedTime * 0.3) * 2
    groupRef.current.rotation.y = -t + Math.PI / 2
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[2.4, 16, 16]} />
        <meshStandardMaterial color="#e05252" roughness={0.6} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.9, 3, Math.sin(angle) * 1.9]}>
            <boxGeometry args={[0.35, 4.6, 0.05]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#f5d488' : '#4a7c9c'} roughness={0.7} />
          </mesh>
        )
      })}
      {[[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]}>
          <cylinderGeometry args={[0.015, 0.015, 1.4, 4]} />
          <meshStandardMaterial color="#3a2a1e" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1, 0.6, 1]} />
        <meshStandardMaterial color="#6b4a35" roughness={0.9} />
      </mesh>
    </group>
  )
}

export default HotAirBalloon