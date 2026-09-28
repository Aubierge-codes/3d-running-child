import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { treeColliders } from '../world/layout'

function Tree({ position, scale, phaseOffset }) {
  const foliageRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.8 + phaseOffset
    foliageRef.current.rotation.z = Math.sin(t) * 0.04
    foliageRef.current.rotation.x = Math.cos(t * 0.7) * 0.03
  })

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 2, 6]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.9} />
      </mesh>
      <group ref={foliageRef} position={[0, 2, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <coneGeometry args={[1.1, 1.8, 7]} />
          <meshStandardMaterial color="#3f6b3a" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <coneGeometry args={[0.8, 1.3, 7]} />
          <meshStandardMaterial color="#4a7a42" roughness={0.85} />
        </mesh>
      </group>
    </group>
  )
}

function Trees() {
  return (
    <>
      {treeColliders.map((tree, i) => (
        <Tree key={i} position={tree.position} scale={tree.scale} phaseOffset={i * 0.7} />
      ))}
    </>
  )
}

export default Trees