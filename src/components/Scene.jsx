import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky, OrbitControls } from '@react-three/drei'
import Character from './Character'
import Coin from './Coin'
import Landmarks, { obstacles } from './Landmarks'
import SoilPatches from './SoilPatches'
import Mountains from './Mountains'

function CameraRig({ target }) {
  const controlsRef = useRef()

  useFrame(() => {
    if (!target.current || !controlsRef.current) return
    controlsRef.current.target.copy(target.current.position)
    controlsRef.current.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.1}
      minDistance={2}
      maxDistance={40}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI - 0.15}
    />
  )
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
      <CameraRig target={characterRef} />
      <CoinManager characterRef={characterRef} coins={coins} onCollect={handleCollect} />
      <ObstacleManager characterRef={characterRef} />
      <SoilPatches />
      <Sky sunPosition={[100, 20, 100]} turbidity={2} rayleigh={1} />
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