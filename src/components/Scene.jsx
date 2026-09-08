import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Character from './Character'
import Coin from './Coin'
import Landmarks, { obstacles } from './Landmarks'
import SoilPatches from './SoilPatches'
import Mountains from './Mountains'

function FollowCamera({ target }) {
  const radius = useRef(5)
  const azimuth = useRef(0)
  const polar = useRef(1.0)
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleWheel = (e) => {
      radius.current += e.deltaY * 0.01
      radius.current = Math.min(Math.max(radius.current, 2), 40)
    }

    const handlePointerDown = (e) => {
  isDragging.current = true
  lastPointer.current = { x: e.clientX, y: e.clientY }
}

    const handlePointerUp = () => {
      isDragging.current = false
    }

    const handlePointerMove = (e) => {
  if (!isDragging.current) return

  const deltaX = e.clientX - lastPointer.current.x
  const deltaY = e.clientY - lastPointer.current.y
  lastPointer.current = { x: e.clientX, y: e.clientY }

  azimuth.current -= deltaX * 0.005
  polar.current -= deltaY * 0.005
  polar.current = Math.min(Math.max(polar.current, 0.15), Math.PI - 0.15)
}

    window.addEventListener('wheel', handleWheel)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  useFrame((state) => {
    if (!target.current) return

    const targetPosition = target.current.position
    const r = radius.current
    const a = azimuth.current
    const p = polar.current

    const desiredCameraPos = {
      x: targetPosition.x + r * Math.sin(p) * Math.sin(a),
      y: targetPosition.y + r * Math.cos(p),
      z: targetPosition.z + r * Math.sin(p) * Math.cos(a),
    }

    state.camera.position.x += (desiredCameraPos.x - state.camera.position.x) * 0.08
    state.camera.position.y += (desiredCameraPos.y - state.camera.position.y) * 0.08
    state.camera.position.z += (desiredCameraPos.z - state.camera.position.z) * 0.08

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

const CHARACTER_RADIUS = 0.4

function ObstacleManager({ characterRef }) {
  useFrame(() => {
    if (!characterRef.current) return

    const charPos = characterRef.current.position

    obstacles.forEach((obs) => {
      const dx = charPos.x - obs.position[0]
      const dz = charPos.z - obs.position[2]
      const distance = Math.sqrt(dx * dx + dz * dz)
      const minDistance = obs.radius + CHARACTER_RADIUS

      if (distance < minDistance && distance > 0) {
        const pushX = (dx / distance) * (minDistance - distance)
        const pushZ = (dz / distance) * (minDistance - distance)
        charPos.x += pushX
        charPos.z += pushZ
      }
    })
  })

  return null
}

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
      <fog attach="fog" args={['#a8c8e0', 30, 150]} />
      <Character characterRef={characterRef} />
      <FollowCamera target={characterRef} />
      <CoinManager characterRef={characterRef} coins={coins} onCollect={handleCollect} />
      <ObstacleManager characterRef={characterRef} />
      <SoilPatches />
      <Mountains />

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