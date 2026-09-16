import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const lampPositions = [
  [18, 0, 12],
  [26, 0, 22],
  [-18, 0, -12],
  [-26, 0, -22],
  [0, 0, 16],
  [12, 0, -14],
]

function LampPost({ position, isNight }) {
  const bulbRef = useRef()
  const lightRef = useRef()

  useFrame((state) => {
    const flicker = 1 + Math.sin(state.clock.elapsedTime * 3.3) * 0.04
    if (lightRef.current) lightRef.current.intensity = isNight ? 1.6 * flicker : 0
    if (bulbRef.current) {
      bulbRef.current.material.emissiveIntensity = isNight ? 2.2 * flicker : 0.05
    }
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.34, 0.24, 8]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 3.2, 8]} />
        <meshStandardMaterial color="#2e2e34" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[0, 3.35, 0]} castShadow>
        <coneGeometry args={[0.34, 0.3, 8]} />
        <meshStandardMaterial color="#2e2e34" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh ref={bulbRef} position={[0, 3.12, 0]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshStandardMaterial color="#fff6d0" emissive="#ffd98a" emissiveIntensity={0.05} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 3.1, 0]} color="#ffd98a" intensity={0} distance={12} decay={2} />
    </group>
  )
}

export const lampColliders = lampPositions.map((p) => ({ position: p, radius: 0.35 }))

function LampPosts({ isNight }) {
  return (
    <>
      {lampPositions.map((p, i) => (
        <LampPost key={i} position={p} isNight={isNight} />
      ))}
    </>
  )
}

export default LampPosts