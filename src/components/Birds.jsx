import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Bird({ center, radius, height, speed, offset }) {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    meshRef.current.position.x = center[0] + Math.cos(t) * radius
    meshRef.current.position.z = center[2] + Math.sin(t) * radius
    meshRef.current.position.y = height + Math.sin(t * 3) * 0.3
    meshRef.current.rotation.y = -t + Math.PI / 2
  })

  return (
    <mesh ref={meshRef}>
      <coneGeometry args={[0.15, 0.5, 4]} />
      <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
    </mesh>
  )
}

const birdData = [
  { center: [0, 0, 0], radius: 12, height: 8, speed: 0.6, offset: 0 },
  { center: [0, 0, 0], radius: 12, height: 8.5, speed: 0.6, offset: 2 },
  { center: [0, 0, 0], radius: 15, height: 9, speed: 0.45, offset: 4 },
]

function Birds() {
  return (
    <>
      {birdData.map((b, i) => (
        <Bird key={i} {...b} />
      ))}
    </>
  )
}

export default Birds