import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Cloud({ startPos, speed }) {
  const groupRef = useRef()

  useFrame((state) => {
    groupRef.current.position.x = startPos[0] + Math.sin(state.clock.elapsedTime * speed * 0.1) * 30
  })

  return (
    <group ref={groupRef} position={startPos}>
      <mesh position={[0, 0, 0]}><sphereGeometry args={[3, 8, 8]} /><meshStandardMaterial color="white" roughness={1} /></mesh>
      <mesh position={[3, 0.3, 0.5]}><sphereGeometry args={[2.2, 8, 8]} /><meshStandardMaterial color="white" roughness={1} /></mesh>
      <mesh position={[-3, 0.2, -0.5]}><sphereGeometry args={[2.5, 8, 8]} /><meshStandardMaterial color="white" roughness={1} /></mesh>
    </group>
  )
}

const cloudData = [
  { startPos: [0, 35, -40], speed: 1 },
  { startPos: [40, 32, -20], speed: 0.7 },
  { startPos: [-40, 38, -30], speed: 0.9 },
  { startPos: [20, 34, 30], speed: 1.2 },
]

function Clouds() {
  return (
    <>
      {cloudData.map((c, i) => (
        <Cloud key={i} {...c} />
      ))}
    </>
  )
}

export default Clouds