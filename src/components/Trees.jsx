import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function seededRandom(seed) {
  let value = seed
  return function () {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function generatePositions(count, worldSize, clearRadius, seed) {
  const rand = seededRandom(seed)
  const positions = []

  for (let i = 0; i < count; i++) {
    let x, z, distFromCenter

    do {
      x = (rand() - 0.5) * worldSize
      z = (rand() - 0.5) * worldSize
      distFromCenter = Math.sqrt(x * x + z * z)
    } while (distFromCenter < clearRadius)

    positions.push([x, 0, z])
  }

  return positions
}

const treePositions = generatePositions(40, 180, 10, 42)

export const treeColliders = treePositions.map((pos, i) => ({
  position: pos,
  radius: 0.5,
  scale: 0.8 + ((i * 13) % 10) / 10,
}))

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