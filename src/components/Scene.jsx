import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Character from './Character'
import Coin from './Coin'
import Landmarks from './Landmarks'

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

function CoinManager({ characterRef, coins, onCollect }) {
  useFrame(() => {
    if (!characterRef.current) return

    const charPos = characterRef.current.position

    coins.forEach((coin) => {
      const dx = charPos.x - coin.position[0]
      const dz = charPos.z - coin.position[2]
      const distance = Math.sqrt(dx * dx + dz * dz)

      if (distance < 1) {
        onCollect(coin.id)
      }
    })
  })

  return null
}

const initialCoins = [
  { id: 0, position: [3, 0.5, -3] },
  { id: 1, position: [-4, 0.5, -6] },
  { id: 2, position: [5, 0.5, 2] },
  { id: 3, position: [-3, 0.5, 4] },
  { id: 4, position: [0, 0.5, -8] },
]

function Scene() {
  const characterRef = useRef()
  const [coins, setCoins] = useState(initialCoins)
  const [score, setScore] = useState(0)

  function handleCollect(id) {
    setCoins((prev) => prev.filter((coin) => coin.id !== id))
    setScore((prev) => prev + 1)
  }

  useEffect(() => {
    console.log('Score:', score)
  }, [score])

  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Character characterRef={characterRef} />
      <FollowCamera target={characterRef} />
      <CoinManager characterRef={characterRef} coins={coins} onCollect={handleCollect} />

      {coins.map((coin) => (
        <Coin key={coin.id} position={coin.position} />
      ))}

      <Landmarks />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </Canvas>
  )
}

export default Scene