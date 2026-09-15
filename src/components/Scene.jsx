import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
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
import Bridge from './Bridge'
import Villagers from './Villager'
import Leaves from './Leaves'
import Sparkles from './Sparkles'

const COIN_SOUND_DATA = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='
const COMBO_WINDOW_MS = 2000

function getTimeOfDayValues(timeOfDay) {
  const t = timeOfDay / 24
  const angle = t * Math.PI * 2 - Math.PI / 2

  const sunHeight = Math.sin(angle)
  const sunX = Math.cos(angle) * 100
  const sunY = sunHeight * 60
  const sunZ = 50

  const brightness = Math.max(0, sunHeight)
  const lightIntensity = 0.15 + brightness * 0.85
  const ambientIntensity = 0.1 + brightness * 0.4

  const dayColor = { r: 168, g: 200, b: 224 }
  const nightColor = { r: 10, g: 16, b: 48 }
  const mix = brightness
  const fogColor = `rgb(${Math.round(nightColor.r + (dayColor.r - nightColor.r) * mix)}, ${Math.round(nightColor.g + (dayColor.g - nightColor.g) * mix)}, ${Math.round(nightColor.b + (dayColor.b - nightColor.b) * mix)})`

  const groundDay = { r: 0, g: 128, b: 0 }
  const groundNight = { r: 26, g: 58, b: 26 }
  const groundColor = `rgb(${Math.round(groundNight.r + (groundDay.r - groundNight.r) * mix)}, ${Math.round(groundNight.g + (groundDay.g - groundNight.g) * mix)}, ${Math.round(groundNight.b + (groundDay.b - groundNight.b) * mix)})`

  return {
    sunPosition: [sunX, Math.max(sunY, -20), sunZ],
    lightIntensity,
    ambientIntensity,
    fogColor,
    groundColor,
    isNightTime: brightness < 0.15,
  }
}

function FPSCounter({ onFpsChange }) {
  const smoothedFps = useRef(60)
  const reportTimer = useRef(0)

  useFrame((state, delta) => {
    const instantFps = 1 / delta
    smoothedFps.current += (instantFps - smoothedFps.current) * 0.1

    reportTimer.current += delta
    if (reportTimer.current > 0.3) {
      reportTimer.current = 0
      if (onFpsChange) onFpsChange(Math.round(smoothedFps.current))
    }
  })

  return null
}

function ScreenshotHandler({ screenshotSignal }) {
  const { gl, scene, camera } = useThree()
  const lastSignal = useRef(0)

  useFrame(() => {
    if (screenshotSignal > lastSignal.current) {
      lastSignal.current = screenshotSignal
      gl.render(scene, camera)
      const dataUrl = gl.domElement.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `screenshot-${Date.now()}.png`
      link.click()
    }
  })

  return null
}

function CameraRig({ target, shakeRef, onZoomChange }) {
  const controlsRef = useRef()
  const zoomReportTimer = useRef(0)

  useFrame((state, delta) => {
    if (!target.current || !controlsRef.current) return
    controlsRef.current.target.copy(target.current.position)
    controlsRef.current.update()

    if (shakeRef && shakeRef.current > performance.now()) {
      state.camera.position.x += (Math.random() - 0.5) * 0.1
      state.camera.position.y += (Math.random() - 0.5) * 0.1
    }

    zoomReportTimer.current += delta
    if (zoomReportTimer.current > 0.2) {
      zoomReportTimer.current = 0
      if (onZoomChange) onZoomChange(controlsRef.current.getDistance())
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
        onCollect(coin.id, coin.position)
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

function Scene({ onScoreChange, onCoinsLeftChange, resetSignal, onScoreReset, timeOfDay, isRaining, paused, baseSpeed, onSpeedChange, onRotationChange, onPositionChange, onInPond, dustEnabled, shakeEnabled, fogEnabled, onFpsChange, onStreakChange, screenshotSignal, onZoomChange }) {
  const characterRef = useRef()
  const [coins, setCoins] = useState(initialCoins)
  const shakeUntilRef = useRef(0)
  const magnetUntilRef = useRef(0)
  const coinAudioRef = useRef(null)
  const lastCollectTime = useRef(0)
  const streakCount = useRef(0)
  const sparkleBurstsRef = useRef([])
  const nextBurstId = useRef(1)

  const tod = getTimeOfDayValues(timeOfDay)

  useEffect(() => {
    coinAudioRef.current = new Audio(COIN_SOUND_DATA)
  }, [])

  function handleCollect(id, coinPosition) {
    const collected = coins.find((c) => c.id === id)
    const now = performance.now()

    if (now - lastCollectTime.current < COMBO_WINDOW_MS) {
      streakCount.current += 1
    } else {
      streakCount.current = 1
    }
    lastCollectTime.current = now
    if (onStreakChange) onStreakChange(streakCount.current)

    const comboBonus = streakCount.current >= 3 ? Math.floor(streakCount.current / 3) : 0

    if (coinPosition) {
      sparkleBurstsRef.current = [
        ...sparkleBurstsRef.current.slice(-10),
        { id: nextBurstId.current++, x: coinPosition[0], y: coinPosition[1], z: coinPosition[2] },
      ]
    }

    setCoins((prev) => {
      const next = prev.filter((coin) => coin.id !== id)
      if (onCoinsLeftChange) onCoinsLeftChange(next.length)
      return next
    })
    if (onScoreChange) onScoreChange((prevScore) => prevScore + (collected?.value || 1) + comboBonus)
    if (collected?.type === 'star') {
      magnetUntilRef.current = performance.now() + 5000
    }
    if (coinAudioRef.current) {
      const sound = coinAudioRef.current.cloneNode()
      sound.volume = 0.4
      sound.play().catch(() => {})
    }
  }

  function triggerShake() {
    if (shakeEnabled) shakeUntilRef.current = performance.now() + 300
  }

  useEffect(() => {
    if (resetSignal > 0 && characterRef.current) {
      characterRef.current.position.set(0, 0, 0)
      setCoins(initialCoins)
      streakCount.current = 0
      if (onCoinsLeftChange) onCoinsLeftChange(initialCoins.length)
      if (onScoreReset) onScoreReset()
    }
  }, [resetSignal])

  return (
    <Canvas shadows camera={{ position: [3, 3, 5], fov: 50 }}>
      <ambientLight intensity={tod.ambientIntensity} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={tod.lightIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-camera-near={1}
        shadow-camera-far={60}
      />
      {fogEnabled && <fog attach="fog" args={[tod.fogColor, 30, 150]} />}
      <Sky sunPosition={tod.sunPosition} turbidity={2} rayleigh={1} />

      <FPSCounter onFpsChange={onFpsChange} />
      <ScreenshotHandler screenshotSignal={screenshotSignal} />

      <Suspense fallback={null}>
        <Character
          characterRef={characterRef}
          paused={paused}
          baseSpeed={baseSpeed}
          onLand={triggerShake}
          onSpeedChange={onSpeedChange}
          onRotationChange={onRotationChange}
          onPositionChange={onPositionChange}
        />
      </Suspense>
      <CameraRig target={characterRef} shakeRef={shakeUntilRef} onZoomChange={onZoomChange} />
      <CoinManager characterRef={characterRef} coins={coins} setCoins={setCoins} onCollect={handleCollect} magnetUntilRef={magnetUntilRef} />
      <ObstacleManager characterRef={characterRef} />
      <PondZone characterRef={characterRef} onInPond={onInPond} />
      {dustEnabled && <Dust characterRef={characterRef} />}
      <SprintTrail characterRef={characterRef} />
      <Sparkles burstsRef={sparkleBurstsRef} />
      {tod.isNightTime && <Fireflies />}
      {isRaining && <Rain />}

      <SoilPatches />
      <Mountains />
      <Village />
      <Fence />
      <Villagers />
      <Clouds />
      <Birds />
      <Trees />
      <Leaves />
      <Pond />
      <Bridge />
      <Flora />
      <Butterflies />

      {coins.map((coin) => (
        <Coin key={coin.id} position={coin.position} type={coin.type} />
      ))}

      <Landmarks />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={tod.groundColor} roughness={1} />
      </mesh>
    </Canvas>
  )
}

export default Scene