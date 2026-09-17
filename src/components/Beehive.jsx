import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const HIVE_POS = [-25, 0, -2]

const beeData = [
  { radius: 0.6, speed: 3, offset: 0, height: 0.9 },
  { radius: 0.5, speed: 3.6, offset: 2, height: 1.1 },
  { radius: 0.7, speed: 2.6, offset: 4, height: 0.8 },
]

function Bee({ radius, speed, offset, height }) {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    meshRef.current.position.x = HIVE_POS[0] + Math.cos(t) * radius
    meshRef.current.position.z = HIVE_POS[2] + Math.sin(t * 1.4) * radius
    meshRef.current.position.y = height + Math.sin(t * 5) * 0.08
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.045, 6, 6]} />
      <meshStandardMaterial color="#2a2418" emissive="#f0c419" emissiveIntensity={0.3} />
    </mesh>
  )
}

function Beehive() {
  return (
    <group position={HIVE_POS}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 10]} />
        <meshStandardMaterial color="#d8a13a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.22, 10]} />
        <meshStandardMaterial color="#c9922e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.22, 10]} />
        <meshStandardMaterial color="#d8a13a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <coneGeometry args={[0.3, 0.25, 10]} />
        <meshStandardMaterial color="#8a6320" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.06, 0.45]} />
        <meshStandardMaterial color="#6b4a35" roughness={0.95} />
      </mesh>

      {beeData.map((b, i) => (
        <Bee key={i} {...b} />
      ))}
    </group>
  )
}

export default Beehive