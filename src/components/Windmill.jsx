import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Windmill({ position = [-30, 0, 22] }) {
  const bladesRef = useRef()

  useFrame((state, delta) => {
    if (bladesRef.current) bladesRef.current.rotation.z += delta * 0.8
  })

  return (
    <group position={position}>
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.8, 6, 8]} />
        <meshStandardMaterial color="#d8c9a3" roughness={0.9} />
      </mesh>

      <mesh position={[0, 6.4, 0]} castShadow>
        <coneGeometry args={[1.5, 1.3, 8]} />
        <meshStandardMaterial color="#8a3a2e" roughness={0.85} />
      </mesh>

      <mesh position={[0, 4.4, 1.15]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.6, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#5a4028" roughness={0.9} />
      </mesh>

      <group ref={bladesRef} position={[0, 4.4, 1.5]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, 0, (i / 4) * Math.PI * 2]}>
            <mesh position={[0, 1.5, 0]} castShadow>
              <boxGeometry args={[0.12, 3, 0.08]} />
              <meshStandardMaterial color="#6b4a35" roughness={0.9} />
            </mesh>
            <mesh position={[0.35, 1.6, 0]} castShadow>
              <boxGeometry args={[0.6, 2.2, 0.04]} />
              <meshStandardMaterial color="#e8e0cc" roughness={0.85} side={2} />
            </mesh>
          </group>
        ))}
      </group>

      <mesh position={[0, 0.2, 2.2]} receiveShadow>
        <boxGeometry args={[2.4, 0.4, 1.6]} />
        <meshStandardMaterial color="#7a5a3a" roughness={0.95} />
      </mesh>
    </group>
  )
}

export const windmillColliders = [{ position: [-30, 0, 22], radius: 2.2 }]

export default Windmill