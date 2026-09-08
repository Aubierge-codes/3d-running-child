import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import Character from './Character'
import Coin from './Coin'

function FollowCamera({ target }) {
  const zoomDistance = useRef(5)

  useEffect(() => {
    const handleWheel = (e) => {
      zoomDistance.current += e.deltaY * 0.01
      zoomDistance.current = Math.min(Math.max(zoomDistance.current, 2), 12)
    }

    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useFrame((state) => {
    if (!target.current) return

    const targetPosition = target.current.position
    const dist = zoomDistance.current

    const desiredCameraPos = {
      x: targetPosition.x,
      y: targetPosition.y + dist * 0.5,
      z: targetPosition.z + dist,
    }

    state.camera.position.x += (desiredCameraPos.x - state.camera.position.x) * 0.05
    state.camera.position.y += (desiredCameraPos.y - state.camera.position.y) * 0.05
    state.camera.position.z += (desiredCameraPos.z - state.camera.position.z) * 0.05

    state.camera.lookAt(targetPosition)
  })

  return null
}

const coinPositions = [
  [3, 0.5, -3],
  [-4, 0.5, -6],
  [5, 0.5, 2],
  [-3, 0.5, 4],
  [0, 0.5, -8],
]

function Scene() {
  const characterRef = useRef()

  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Character characterRef={characterRef} />
      <FollowCamera target={characterRef} />

      {coinPositions.map((pos, i) => (
        <Coin key={i} position={pos} />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </Canvas>
  )
}

export default Scene