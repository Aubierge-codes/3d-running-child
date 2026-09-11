import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Coin({ position, type = 'coin' }) {
  const meshRef = useRef()

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 2
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15
  })

  if (type === 'star') {
    return (
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#ffe066" emissive="#ffaa00" emissiveIntensity={0.4} roughness={0.4} />
      </mesh>
    )
  }

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[0.3, 0.12, 16, 32]} />
      <meshStandardMaterial color="gold" metalness={0.6} roughness={0.3} />
    </mesh>
  )
}

export default Coin