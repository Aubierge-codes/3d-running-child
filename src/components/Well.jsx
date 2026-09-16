import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const WELL_POS = [22, 0, -8]

function Well() {
  const bucketRef = useRef()

  useFrame((state) => {
    if (bucketRef.current) {
      bucketRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.4) * 0.12
    }
  })

  return (
    <group position={WELL_POS}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.05, 0.35, Math.sin(angle) * 1.05]} rotation={[0, -angle, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.36, 0.7, 0.28]} />
            <meshStandardMaterial color="#8a8378" roughness={0.95} />
          </mesh>
        )
      })}

      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.04, 16]} />
        <meshStandardMaterial color="#20303a" roughness={0.2} metalness={0.25} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.9, 1.3, 0]} castShadow>
          <boxGeometry args={[0.14, 1.9, 0.14]} />
          <meshStandardMaterial color="#5a4028" roughness={0.9} />
        </mesh>
      ))}

      <mesh position={[0, 2.35, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.6, 0.9, 4]} />
        <meshStandardMaterial color="#8a3a2e" roughness={0.85} />
      </mesh>

      <mesh position={[0, 2.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.8, 8]} />
        <meshStandardMaterial color="#4a3222" roughness={0.9} />
      </mesh>

      <group ref={bucketRef} position={[0, 2.15, 0]}>
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.2, 4]} />
          <meshStandardMaterial color="#6b5a45" roughness={1} />
        </mesh>
        <mesh position={[0, -1.3, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.16, 0.3, 10]} />
          <meshStandardMaterial color="#5a4028" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

export const wellColliders = [{ position: WELL_POS, radius: 1.4 }]

export default Well