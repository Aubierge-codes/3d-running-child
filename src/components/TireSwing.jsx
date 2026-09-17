import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { treeColliders } from './Trees'

const anchorTree = treeColliders[Math.floor(treeColliders.length / 3)]
const SWING_POS = anchorTree ? anchorTree.position : [0, 0, 0]

function TireSwing() {
  const swingRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (swingRef.current) {
      swingRef.current.rotation.z = Math.sin(t * 0.9) * 0.18
    }
  })

  return (
    <group position={[SWING_POS[0] + 1.4, 3.4, SWING_POS[2] + 0.6]}>
      <group ref={swingRef}>
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.8, 4]} />
          <meshStandardMaterial color="#5a4a3a" roughness={1} />
        </mesh>
        <mesh position={[0.1, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.8, 4]} />
          <meshStandardMaterial color="#5a4a3a" roughness={1} />
        </mesh>
        <mesh position={[0, -1.85, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.35, 0.13, 10, 20]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
        </mesh>
      </group>
    </group>
  )
}

export default TireSwing