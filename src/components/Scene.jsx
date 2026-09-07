import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Character from './Character'

function FollowCamera({ target }) {
  useFrame((state) => {
    if (!target.current) return

    const targetPosition = target.current.position

    const desiredCameraPos = {
      x: targetPosition.x,
      y: targetPosition.y + 2.5,
      z: targetPosition.z + 5,
    }

    state.camera.position.x += (desiredCameraPos.x - state.camera.position.x) * 0.05
    state.camera.position.y += (desiredCameraPos.y - state.camera.position.y) * 0.05
    state.camera.position.z += (desiredCameraPos.z - state.camera.position.z) * 0.05

    state.camera.lookAt(targetPosition)
  })

  return null
}

function Scene() {
  const characterRef = useRef()

  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Character characterRef={characterRef} />
      <FollowCamera target={characterRef} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </Canvas>
  )
}

export default Scene