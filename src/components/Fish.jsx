import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const POND_CENTER = [35, 0, -35]

const fishData = [
  { radius: 4.5, speed: 0.45, offset: 0, depth: -0.25, color: '#e8734a', scale: 1 },
  { radius: 6.2, speed: 0.32, offset: 2.1, depth: -0.4, color: '#e8b54a', scale: 0.8 },
  { radius: 3.2, speed: 0.6, offset: 4.4, depth: -0.18, color: '#9ad2e8', scale: 0.7 },
  { radius: 5.4, speed: 0.38, offset: 1.2, depth: -0.32, color: '#d84a6b', scale: 0.9 },
]

function Fish({ radius, speed, offset, depth, color, scale }) {
  const groupRef = useRef()
  const tailRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    const wobble = Math.sin(t * 2.5) * 0.6
    groupRef.current.position.x = POND_CENTER[0] + Math.cos(t) * (radius + wobble)
    groupRef.current.position.z = POND_CENTER[2] + Math.sin(t) * (radius + wobble)
    groupRef.current.position.y = depth + Math.sin(t * 3) * 0.04
    groupRef.current.rotation.y = -t + Math.PI / 2
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 9) * 0.55
  })

  return (
    <group ref={groupRef} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.1, 0.24, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh ref={tailRef} position={[-0.24, 0, 0]}>
        <coneGeometry args={[0.12, 0.2, 4]} />
        <meshStandardMaterial color={color} roughness={0.4} side={2} />
      </mesh>
    </group>
  )
}

function FishSchool() {
  return (
    <>
      {fishData.map((f, i) => (
        <Fish key={i} {...f} />
      ))}
    </>
  )
}

export default FishSchool