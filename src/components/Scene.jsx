import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky, OrbitControls } from '@react-three/drei'
import Character from './Character'
import Coin from './Coin'
import Landmarks, { obstacles } from './Landmarks'
import SoilPatches from './SoilPatches'
import Mountains from './Mountains'
import Trees, { treeColliders } from './Trees'
import Village, { houseColliders, Fence, fenceColliders } from './Village'
import Clouds from './Clouds'
import Birds from './Birds'
import Pond from './Pond'
import Flora from './Flora'
import Butterflies from './Butterflies'
import Dust from './Dust'
import Fireflies from './Fireflies'
import Rain from './Rain'
import SprintTrail from './SprintTrail'

function CameraRig({ target, shakeRef }) {
  const controlsRef = useRef()

  useFrame((state) => {
    if (!target.current || !controlsRef.current) return
    controlsRef.current.target.copy(target.current.position)
    controlsRef.current.update()

    if (shakeRef && shakeRef.current > performance.now()) {
      state.camera.position.x += (Math.random() - 0.5) * 0.1
      state.camera.position.y += (Math.random() - 0.5) * 0.1
    }
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

function CoinManager({ characterRef, coins, setCoins, onCollect, magnetUntilRef }) {
  useFrame((state, delta) => {
    if (!characterRef.current) return
    const charPos = characterRef.current.position
    const magnetActive = magnetUntilRef.current > performance.now()

    coins.forEach((coin) => {
      const dx = charPos.x - coin.position[0]
      const dz = charPos.z - coin.position[2]
      const distance = Math.sqrt(dx * dx + dz * dz)

      if (distance < 1) {
        onCollect(coin.id)
        return
      }

      if (magnetActive && distance < 10) {
        setCoins((prev) =>
          prev.map((c) => {
            if (c.id !== coin.id) return c
            const pullSpeed = 6
            const nx = c.position[0] + (dx / distance) * pullSpeed * delta
            const nz = c.position[2] + (dz / distance) * pullSpeed * delta
            return { ...c, position: [nx, c.position[1], nz] }
          })
        )
      }
    })
  })

  return null
}

function PondZone({ characterRef, onInPond }) {
  const wasInside = useRef(false)

  useFrame(() => {
    if (!characterRef.current) return
    const dx = characterRef.current.position.x - 35
    const dz = characterRef.current.position.z - -35
    const dist = Math.sqrt(dx * dx + dz * dz)
    const inside = dist < 8
    if (inside !== wasInside.current) {
      wasInside.current = inside
      if (onInPond) onInPond(inside)
    }
  })

  return null
}

const initialCoins = [
  { id: 0, position: [3, 0.5, -3], value: 1, type: 'coin' },
  { id: 1, position: [-4, 0.5, -6], value: 1, type: 'coin' },
  { id: 2, position: [5, 0.5, 2], value: 1, type: 'coin' },
  { id: 3, position: [-3, 0.5, 4], value: 1, type: 'coin' },
  { id: 4, position: [0, 0.5, -8], value: 1, type: 'coin' },
  { id: 5, position: [10, 0.5, 10], value: 5, type: 'star' },
]

const CHARACTER_RADIUS = 0.4

function ObstacleManager({ characterRef }) {
  const allObstacles = [...obstacles, ...treeColliders, ...houseColliders, ...fenceColliders]

  useFrame(() => {
    if (!characterRef.current) return
    const charPos = characterRef.current.position

    allObstacles.forEach((obs) => {
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

function Scene({ onScoreChange, onCoinsLeftChange, resetSignal, isNight, isRaining, paused, baseSpeed, onSpeedChange, onRotationChange, onPositionChange, onInPond }) {
  const characterRef = useRef()
  const [coins, setCoins] = useState(initialCoins)
  const shakeUntilRef = useRef(0)
  const magnetUntilRef = useRef(0)

  function handleCollect(id) {
    const collected = coins.find((c) => c.id === id)
    setCoins((prev) => {
      const next = prev.filter((coin) => coin.id !== id)
      if (onCoinsLeftChange) onCoinsLeftChange(next.length)
      return next
    })
    if (onScoreChange) onScoreChange((prevScore) => prevScore + (collected?.value || 1))
    if (collected?.type === 'star') {
      magnetUntilRef.current = performance.now() + 5000
    }
  }

  function triggerShake() {
    shakeUntilRef.current = performance.now() + 300
  }

  useEffect(() => {
    if (resetSignal > 0 && characterRef.current) {
      characterRef.current.position.set(0, 0, 0)
    }
  }, [resetSignal])

  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
      <ambientLight intensity={isNight ? 0.15 : 0.5} />
      <directionalLight position={[5, 5, 5]} intensity={isNight ? 0.15 : 1} />
      <fog attach="fog" args={[isNight ? '#0a1030' : '#a8c8e0', 30, 150]} />
      <Sky sunPosition={isNight ? [0, -10, 0] : [100, 20, 100]} turbidity={2} rayleigh={1} />

      <Character
        characterRef={characterRef}
        paused={paused}
        baseSpeed={baseSpeed}
        onLand={triggerShake}
        onSpeedChange={onSpeedChange}
        onRotationChange={onRotationChange}
        onPositionChange={onPositionChange}
      />
      <CameraRig target={characterRef} shakeRef={shakeUntilRef} />
      <CoinManager characterRef={characterRef} coins={coins} setCoins={setCoins} onCollect={handleCollect} magnetUntilRef={magnetUntilRef} />
      <ObstacleManager characterRef={characterRef} />
      <PondZone characterRef={characterRef} onInPond={onInPond} />
      <Dust characterRef={characterRef} />
      <SprintTrail characterRef={characterRef} />
      {isNight && <Fireflies />}
      {isRaining && <Rain />}

      <SoilPatches />
      <Mountains />
      <Village />
      <Fence />
      <Clouds />
      <Birds />
      <Trees />
      <Pond />
      <Flora />
      <Butterflies />

      {coins.map((coin) => (
        <Coin key={coin.id} position={coin.position} type={coin.type} />
      ))}

      <Landmarks />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={isNight ? '#1a3a1a' : 'green'} roughness={1} />
      </mesh>
    </Canvas>
  )
}

export default Scene