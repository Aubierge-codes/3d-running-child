import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const SCARECROW_POS = [-30, 0, 13]

function Scarecrow() {
  const armsRef = useRef()

  useFrame((state) => {
    if (armsRef.current) {
      armsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.06
    }
  })

  return (
    <group position={SCARECROW_POS}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 1.8, 6]} />
        <meshStandardMaterial color="#6b4a35" roughness={0.95} />
      </mesh>

      <group ref={armsRef} position={[0, 1.35, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.3, 6]} />
          <meshStandardMaterial color="#6b4a35" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.1, 0.3, 0.25]} />
          <meshStandardMaterial color="#8a6b45" roughness={0.9} />
        </mesh>
      </group>

      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color="#8a3a2e" roughness={0.9} />
      </mesh>

      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#e8d4a0" roughness={1} />
      </mesh>
      <mesh position={[0, 1.72, 0]} rotation={[0, 0, 0.1]} castShadow>
        <coneGeometry args={[0.3, 0.2, 8]} />
        <meshStandardMaterial color="#c9a03a" roughness={1} />
      </mesh>

      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.15 + i * 0.15, 0.42, 0]} rotation={[0, 0, (Math.random() - 0.5) * 0.6]}>
          <cylinderGeometry args={[0.015, 0.015, 0.5, 4]} />
          <meshStandardMaterial color="#c9a03a" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export const scarecrowColliders = [{ position: SCARECROW_POS, radius: 0.4 }]

export default Scarecrow