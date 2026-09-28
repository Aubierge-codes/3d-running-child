import { useState, useEffect, useRef, useCallback } from 'react'
import { useProgress } from '@react-three/drei'
import Scene from './components/Scene'
import TouchJoystick from './components/TouchJoystick'
import ErrorBoundary from './components/ErrorBoundary'
import { WORLD_SIZE } from './world/layout'

const MUSIC_DATA = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='
const WIND_DATA = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// localStorage can throw (private browsing, storage disabled, quota full), so
// every read and write is guarded; the game still runs, it just won't remember.
function loadSetting(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved === null ? fallback : JSON.parse(saved)
  } catch {
    return fallback
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable; ignore.
  }
}

function getNightIntensity(timeOfDay) {
  const t = timeOfDay / 24
  const angle = t * Math.PI * 2 - Math.PI / 2
  const brightness = Math.max(0, Math.sin(angle))
  return 1 - brightness
}

const MAP_SIZE = 110
const MAP_SIZE_TOUCH = 80

// Offsets from the screen edge that respect the notch / home indicator.
const safe = (side, px) => `calc(${px}px + env(safe-area-inset-${side}, 0px))`

// iPhone Safari has no Fullscreen API at all; hide the button there.
const canFullscreen = !!document.documentElement.requestFullscreen

const panel = {
  background: 'rgba(18,22,18,0.55)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.12)',
  boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
  color: 'white',
  fontFamily: "'Segoe UI', sans-serif",
}

const button = {
  ...panel,
  padding: '9px 14px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid rgba(255,255,255,0.18)',
  transition: 'background 0.15s',
}

function App() {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => loadSetting('highScore', 0))
  const [coinsLeft, setCoinsLeft] = useState(6)
  const [resetSignal, setResetSignal] = useState(0)
  const [screenshotSignal, setScreenshotSignal] = useState(0)
  const [timeOfDay, setTimeOfDay] = useState(12)
  const [isRaining, setIsRaining] = useState(false)
  const [paused, setPaused] = useState(false)
  const [baseSpeed, setBaseSpeed] = useState(() => loadSetting('baseSpeed', 3))
  const [speed, setSpeed] = useState(0)
  const [facing, setFacing] = useState(0)
  const [inPond, setInPond] = useState(false)
  const [playTime, setPlayTime] = useState(0)
  const [position, setPosition] = useState({ x: 0, z: 0 })
  const [toasts, setToasts] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [dustEnabled, setDustEnabled] = useState(() => loadSetting('dustEnabled', true))
  const [shakeEnabled, setShakeEnabled] = useState(() => loadSetting('shakeEnabled', true))
  const [fogEnabled, setFogEnabled] = useState(() => loadSetting('fogEnabled', true))
  const [musicOn, setMusicOn] = useState(() => loadSetting('musicOn', false))
  const [fps, setFps] = useState(60)
  const [streak, setStreak] = useState(0)
  const [isTouchDevice] = useState(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomDistance, setZoomDistance] = useState(5)
  const hasShownFirstCoin = useRef(false)
  const hasShownHighScore = useRef(false)
  const initialHighScore = useRef(highScore)
  const musicRef = useRef(null)
  const windRef = useRef(null)
  const { progress, active } = useProgress()

  const showToast = useCallback((message) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  function toggleFullscreen() {
    if (!canFullscreen) return
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    saveSetting('baseSpeed', baseSpeed)
  }, [baseSpeed])

  useEffect(() => {
    saveSetting('dustEnabled', dustEnabled)
  }, [dustEnabled])

  useEffect(() => {
    saveSetting('shakeEnabled', shakeEnabled)
  }, [shakeEnabled])

  useEffect(() => {
    saveSetting('fogEnabled', fogEnabled)
  }, [fogEnabled])

  useEffect(() => {
    saveSetting('musicOn', musicOn)
  }, [musicOn])

  useEffect(() => {
    const music = new Audio(MUSIC_DATA)
    music.loop = true
    music.volume = 0.3
    musicRef.current = music

    const wind = new Audio(WIND_DATA)
    wind.loop = true
    wind.volume = 0.1
    wind.play().catch(() => {})
    windRef.current = wind

    return () => {
      music.pause()
      wind.pause()
    }
  }, [])

  useEffect(() => {
    if (!windRef.current) return
    const distFromNoon = Math.abs(timeOfDay - 12)
    const windStrength = Math.min(distFromNoon / 12, 1)
    windRef.current.volume = 0.05 + windStrength * 0.2
  }, [timeOfDay])

  useEffect(() => {
    if (!musicRef.current) return
    if (musicOn) {
      musicRef.current.play().catch(() => {})
    } else {
      musicRef.current.pause()
    }
  }, [musicOn])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') setPaused((p) => !p)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const levelComplete = coinsLeft === 0

  useEffect(() => {
    if (paused || levelComplete) return
    const interval = setInterval(() => setPlayTime((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [paused, levelComplete])

  // Derived-state update during render (React's recommended alternative to
  // syncing state in an effect); persisted below.
  if (score > highScore) setHighScore(score)

  useEffect(() => {
    saveSetting('highScore', highScore)
  }, [highScore])

  // Callbacks passed to <Scene> must stay stable or its memo is defeated.
  const handleScoreChange = useCallback((updater) => {
    setScore((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      // Refs make these one-shot even when StrictMode double-invokes the updater.
      if (next > prev && !hasShownFirstCoin.current) {
        hasShownFirstCoin.current = true
        showToast('🪙 First coin collected!')
      }
      if (next > initialHighScore.current && !hasShownHighScore.current) {
        hasShownHighScore.current = true
        showToast('🏆 New high score!')
      }
      return next
    })
  }, [showToast])

  const handleScoreReset = useCallback(() => {
    setScore(0)
    setPlayTime(0)
  }, [])

  function handlePlayAgain() {
    setResetSignal((n) => n + 1)
  }

  // Touch layout: the joystick and jump/sprint buttons own the bottom corners,
  // so the minimap moves under the score and the speed/time sliders move into
  // the settings sheet.
  const mapSize = isTouchDevice ? MAP_SIZE_TOUCH : MAP_SIZE
  const dotX = (position.x / WORLD_SIZE) * mapSize + mapSize / 2
  const dotZ = (position.z / WORLD_SIZE) * mapSize + mapSize / 2
  const nightIntensity = getNightIntensity(timeOfDay)

  const minimap = (
    <div style={{ ...panel, position: 'relative', width: mapSize, height: mapSize, padding: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        left: Math.min(Math.max(dotX, 5), mapSize - 5),
        top: Math.min(Math.max(dotZ, 5), mapSize - 5),
        width: 8, height: 8, borderRadius: '50%', background: '#ff5252',
        boxShadow: '0 0 6px #ff5252',
        transform: 'translate(-50%, -50%)',
      }} />
    </div>
  )

  const sliders = (
    <>
      <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Speed: {baseSpeed}</label>
      <input style={{ width: '100%' }} type="range" min="1" max="8" step="0.5" value={baseSpeed} onChange={(e) => setBaseSpeed(Number(e.target.value))} />

      <label style={{ display: 'block', fontSize: '13px', margin: '12px 0 4px' }}>Time: {Math.floor(timeOfDay)}:00</label>
      <input style={{ width: '100%' }} type="range" min="0" max="24" step="0.25" value={timeOfDay} onChange={(e) => setTimeOfDay(Number(e.target.value))} />
    </>
  )

  return (
    <>
      <ErrorBoundary>
        <Scene
          onScoreChange={handleScoreChange}
          onCoinsLeftChange={setCoinsLeft}
          resetSignal={resetSignal}
          onScoreReset={handleScoreReset}
          timeOfDay={timeOfDay}
          isRaining={isRaining}
          paused={paused}
          baseSpeed={baseSpeed}
          onSpeedChange={setSpeed}
          onRotationChange={setFacing}
          onPositionChange={setPosition}
          onInPond={setInPond}
          dustEnabled={dustEnabled}
          shakeEnabled={shakeEnabled}
          fogEnabled={fogEnabled}
          levelComplete={levelComplete}
          onFpsChange={setFps}
          onStreakChange={setStreak}
          screenshotSignal={screenshotSignal}
          onZoomChange={setZoomDistance}
        />
      </ErrorBoundary>

      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none',
        background: `radial-gradient(circle, transparent 40%, rgba(0,0,10,${nightIntensity * 0.55}) 100%)`,
      }} />

      {active && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: '#0a1a0a', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', color: 'white',
          fontFamily: 'sans-serif', zIndex: 1000,
        }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>Loading world...</div>
          <div style={{ width: '200px', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#4ade80', transition: 'width 0.2s' }} />
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', top: safe('top', 16), left: safe('left', 16), display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
        <div style={{ ...panel, padding: isTouchDevice ? '10px 14px' : '14px 18px', minWidth: isTouchDevice ? 0 : '190px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: 700 }}>
            🪙 {score}
            {streak > 1 && <span style={{ fontSize: '15px', color: '#ffd54f' }}>🔥×{streak}</span>}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>Best: {highScore}</div>

          {isTouchDevice ? (
            <div style={{ marginTop: '6px', fontSize: '12px', opacity: 0.9 }}>⏱ {formatTime(playTime)} · {fps} FPS</div>
          ) : (
            <>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', opacity: 0.9 }}>
                <div>Speed: {speed.toFixed(1)} m/s</div>
                <div>Zoom: {zoomDistance.toFixed(1)}</div>
                <div>⏱ {formatTime(playTime)} &nbsp;·&nbsp; {fps} FPS</div>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 18, height: 18, transform: `rotate(${facing}rad)` }}>
                  <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '12px solid #4ade80' }} />
                </div>
                <span style={{ fontSize: '11px', opacity: 0.6 }}>facing</span>
              </div>
            </>
          )}
        </div>
        {isTouchDevice && minimap}
      </div>

      {!isTouchDevice && (
        <div style={{ position: 'absolute', bottom: safe('bottom', 16), left: safe('left', 16), pointerEvents: 'none' }}>
          {minimap}
        </div>
      )}

      <div style={{
        position: 'absolute', top: safe('top', 16), right: safe('right', 16), display: 'flex', gap: '8px', flexWrap: 'wrap',
        maxWidth: isTouchDevice ? 'calc(100% - 170px)' : '340px', justifyContent: 'flex-end',
      }}>
        <button style={button} onClick={() => setPaused((p) => !p)} aria-label="Pause">⏸</button>
        <button style={button} onClick={handlePlayAgain} aria-label="Respawn">{isTouchDevice ? '↺' : '↺ Respawn'}</button>
        <button style={button} onClick={() => setIsRaining((r) => !r)} aria-label={isRaining ? 'Stop Rain' : 'Rain'}>
          {isTouchDevice ? (isRaining ? '☀' : '🌧') : (isRaining ? '☀ Stop Rain' : '🌧 Rain')}
        </button>
        <button style={button} onClick={() => setMusicOn((m) => !m)} aria-label={musicOn ? 'Music on' : 'Music off'}>
          {isTouchDevice ? (musicOn ? '🔊' : '🔇') : (musicOn ? '🔊 Music' : '🔇 Music')}
        </button>
        <button style={button} onClick={() => setScreenshotSignal((n) => n + 1)} aria-label="Screenshot">📸</button>
        {canFullscreen && <button style={button} onClick={toggleFullscreen} aria-label="Fullscreen">{isFullscreen ? '🡼' : '⛶'}</button>}
        <button style={button} onClick={() => setShowSettings((s) => !s)} aria-label="Settings">⚙️</button>
      </div>

      {showSettings && (
        <div style={isTouchDevice
          ? { ...panel, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '18px 20px', fontSize: '15px', width: 'min(280px, calc(100% - 48px))', zIndex: 500 }
          : { ...panel, position: 'absolute', top: 68, right: 16, padding: '14px 18px', fontSize: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input type="checkbox" checked={dustEnabled} onChange={(e) => setDustEnabled(e.target.checked)} /> Dust particles
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input type="checkbox" checked={shakeEnabled} onChange={(e) => setShakeEnabled(e.target.checked)} /> Camera shake
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={fogEnabled} onChange={(e) => setFogEnabled(e.target.checked)} /> Fog
          </label>
          {isTouchDevice && (
            <>
              <div style={{ marginTop: '14px' }}>{sliders}</div>
              <button style={{ ...button, width: '100%', marginTop: '16px' }} onClick={() => setShowSettings(false)}>Done</button>
            </>
          )}
        </div>
      )}

      {!isTouchDevice && (
        <div style={{ ...panel, position: 'absolute', bottom: safe('bottom', 16), right: safe('right', 16), padding: '14px 18px', width: '200px' }}>
          {sliders}
        </div>
      )}

      <div style={isTouchDevice
        ? { position: 'absolute', top: '24%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', pointerEvents: 'none' }
        : { position: 'absolute', top: 68, right: 16, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', pointerEvents: 'none' }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ ...panel, padding: '10px 16px', fontSize: '14px' }}>
            {toast.message}
          </div>
        ))}
      </div>

      {levelComplete && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif',
          padding: '16px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 'clamp(28px, 8vw, 48px)', fontWeight: 'bold', marginBottom: '12px', textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
            🎉 Level Complete!
          </div>
          <div style={{ fontSize: '20px', marginBottom: '24px' }}>Final score: {score}</div>
          <button
            onClick={handlePlayAgain}
            style={{ ...button, padding: '12px 28px', fontSize: '18px', background: '#4ade80', color: '#0a1a0a' }}
          >
            Play Again
          </button>
        </div>
      )}

      {paused && (
        <div
          onClick={() => setPaused(false)}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
            color: 'white', fontFamily: 'sans-serif', textAlign: 'center', cursor: 'pointer', zIndex: 600,
          }}
        >
          <div style={{ fontSize: 'clamp(32px, 9vw, 48px)', fontWeight: 'bold' }}>PAUSED</div>
          <div style={{ fontSize: '16px', opacity: 0.85 }}>{isTouchDevice ? 'Tap anywhere to resume' : 'Press Esc or click to resume'}</div>
        </div>
      )}

      {inPond && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(50,120,200,0.25)', pointerEvents: 'none' }} />
      )}

      {isTouchDevice && <TouchJoystick />}
    </>
  )
}

export default App