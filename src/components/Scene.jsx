import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Character from './Character'

function RotatingCube() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 1
  })

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

function Scene() {
  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Character />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </Canvas>
  )
}

export default Scene