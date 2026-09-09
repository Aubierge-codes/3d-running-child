import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Butterfly({ center, radius, height, speed, offset, color }) {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    meshRef.current.position.x = center[0] + Math.cos(t) * radius
    meshRef.current.position.z = center[2] + Math.sin(t * 1.3) * radius
    meshRef.current.position.y = height + Math.sin(t * 4) * 0.4
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.15, 0.02, 0.1]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  )
}

const butterflyData = [
  { center: [-2, 0, 2], radius: 3, height: 1.2, speed: 1.5, offset: 0, color: '#ffb347' },
  { center: [3, 0, -3], radius: 2.5, height: 1.0, speed: 1.8, offset: 2, color: '#ff6961' },
  { center: [-4, 0, -4], radius: 3.5, height: 1.4, speed: 1.3, offset: 4, color: '#77dd77' },
]

function Butterflies() {
  return (
    <>
      {butterflyData.map((b, i) => (
        <Butterfly key={i} {...b} />
      ))}
    </>
  )
}

export default Butterflies