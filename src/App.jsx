import { useState, useEffect, useRef } from 'react'
import Scene from './components/Scene'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const WORLD_SIZE = 200
const MAP_SIZE = 120

function App() {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('highScore')
    return saved ? Number(saved) : 0
  })
  const [coinsLeft, setCoinsLeft] = useState(6)
  const [resetSignal, setResetSignal] = useState(0)
const [timeOfDay, setTimeOfDay] = useState(12)
  const [isRaining, setIsRaining] = useState(false)
  const [paused, setPaused] = useState(false)
  const [baseSpeed, setBaseSpeed] = useState(3)
  const [speed, setSpeed] = useState(0)
  const [facing, setFacing] = useState(0)
  const [inPond, setInPond] = useState(false)
  const [playTime, setPlayTime] = useState(0)
  const [position, setPosition] = useState({ x: 0, z: 0 })
  const [toasts, setToasts] = useState([])
  const hasShownFirstCoin = useRef(false)
  const hasShownHighScore = useRef(false)

  function showToast(message) {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') setPaused((p) => !p)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setPlayTime((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('highScore', String(score))
      if (!hasShownHighScore.current && score > 0) {
        hasShownHighScore.current = true
        showToast('🏆 New high score!')
      }
    }
  }, [score])

  function handleScoreChange(updater) {
    setScore((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (next > prev && !hasShownFirstCoin.current) {
        hasShownFirstCoin.current = true
        showToast('🪙 First coin collected!')
      }
      return next
    })
  }

  function handleCoinsLeftChange(count) {
    setCoinsLeft(count)
    if (count === 0) showToast('🎉 All coins collected!')
  }

  const dotX = (position.x / WORLD_SIZE) * MAP_SIZE + MAP_SIZE / 2
  const dotZ = (position.z / WORLD_SIZE) * MAP_SIZE + MAP_SIZE / 2

  return (
    <>
      <Scene
        onScoreChange={handleScoreChange}
        onCoinsLeftChange={handleCoinsLeftChange}
        resetSignal={resetSignal}
        isNight={isNight}
        isRaining={isRaining}
        paused={paused}
        baseSpeed={baseSpeed}
        onSpeedChange={setSpeed}
        onRotationChange={setFacing}
        onPositionChange={setPosition}
        onInPond={setInPond}
      />

      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'sans-serif', fontSize: '28px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.6)', pointerEvents: 'none' }}>
        🪙 {score} <span style={{ fontSize: '16px', opacity: 0.8 }}>(best: {highScore})</span>
      </div>

      <div style={{ position: 'absolute', top: 60, left: 20, color: 'white', fontFamily: 'sans-serif', fontSize: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.6)', pointerEvents: 'none' }}>
        Speed: {speed.toFixed(1)} m/s
      </div>

      <div style={{ position: 'absolute', top: 90, left: 20, color: 'white', fontFamily: 'sans-serif', fontSize: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.6)', pointerEvents: 'none' }}>
        ⏱ {formatTime(playTime)}
      </div>

      <div style={{ position: 'absolute', top: 60, left: 160, width: 24, height: 24, pointerEvents: 'none', transform: `rotate(${facing}rad)` }}>
        <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '16px solid white' }} />
      </div>

      <div style={{
        position: 'absolute', bottom: 20, left: 20, width: MAP_SIZE, height: MAP_SIZE,
        background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.6)', borderRadius: '8px',
        overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute',
          left: Math.min(Math.max(dotX, 4), MAP_SIZE - 4),
          top: Math.min(Math.max(dotZ, 4), MAP_SIZE - 4),
          width: 8, height: 8, borderRadius: '50%', background: '#ff5252',
          transform: 'translate(-50%, -50%)',
        }} />
      </div>

      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '8px' }}>
        <button onClick={() => setResetSignal((n) => n + 1)}>Respawn</button>
        <div style={{ position: 'absolute', bottom: 60, right: 20, color: 'white', fontFamily: 'sans-serif' }}>
  <label style={{ display: 'block', fontSize: '14px', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
    Time: {Math.floor(timeOfDay)}:00
  </label>
  <input type="range" min="0" max="24" step="0.25" value={timeOfDay} onChange={(e) => setTimeOfDay(Number(e.target.value))} />
</div>
        <button onClick={() => setIsRaining((r) => !r)}>{isRaining ? 'Stop Rain' : 'Rain'}</button>
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, color: 'white', fontFamily: 'sans-serif' }}>
        <label style={{ display: 'block', fontSize: '14px', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Speed: {baseSpeed}</label>
        <input type="range" min="1" max="8" step="0.5" value={baseSpeed} onChange={(e) => setBaseSpeed(Number(e.target.value))} />
      </div>

      <div style={{ position: 'absolute', top: 100, right: 20, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            background: 'rgba(20,20,20,0.85)', color: 'white', padding: '10px 16px',
            borderRadius: '8px', fontFamily: 'sans-serif', fontSize: '15px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}>
            {toast.message}
          </div>
        ))}
      </div>

      {paused && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '48px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
          PAUSED (press Esc to resume)
        </div>
      )}

      {inPond && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(50,120,200,0.25)', pointerEvents: 'none' }} />
      )}
    </>
  )
}

export default App