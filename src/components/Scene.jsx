import { Canvas } from '@react-three/fiber'

function Scene() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}

export default Scene