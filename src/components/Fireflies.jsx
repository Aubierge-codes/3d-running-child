import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Firefly({ center, radius, height, speed, offset }) {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    meshRef.current.position.x = center[0] + Math.cos(t) * radius
    meshRef.current.position.z = center[2] + Math.sin(t) * radius
    meshRef.current.position.y = height + Math.sin(t * 2.5) * 0.3
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 6, 6]} />
      <meshStandardMaterial color="#c8ff6b" emissive="#c8ff6b" emissiveIntensity={2} />
    </mesh>
  )
}

const fireflyData = [
  { center: [2, 0, 3], radius: 2, height: 0.8, speed: 0.5, offset: 0 },
  { center: [-3, 0, -2], radius: 2.5, height: 1.0, speed: 0.4, offset: 1.5 },
  { center: [5, 0, -5], radius: 1.8, height: 0.7, speed: 0.6, offset: 3 },
  { center: [-5, 0, 5], radius: 2.2, height: 0.9, speed: 0.45, offset: 4.5 },
]

function Fireflies() {
  return (
    <>
      {fireflyData.map((f, i) => (
        <Firefly key={i} {...f} />
      ))}
    </>
  )
}

export default Fireflies