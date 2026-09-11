import { useState, useEffect } from 'react'
import Scene from './components/Scene'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function App() {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('highScore')
    return saved ? Number(saved) : 0
  })
  const [coinsLeft, setCoinsLeft] = useState(6)
  const [resetSignal, setResetSignal] = useState(0)
  const [isNight, setIsNight] = useState(false)
  const [isRaining, setIsRaining] = useState(false)
  const [paused, setPaused] = useState(false)
  const [baseSpeed, setBaseSpeed] = useState(3)
  const [speed, setSpeed] = useState(0)
  const [facing, setFacing] = useState(0)
  const [inPond, setInPond] = useState(false)
  const [playTime, setPlayTime] = useState(0)

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
    }
  }, [score])

  return (
    <>
      <Scene
        onScoreChange={setScore}
        onCoinsLeftChange={setCoinsLeft}
        resetSignal={resetSignal}
        isNight={isNight}
        isRaining={isRaining}
        paused={paused}
        baseSpeed={baseSpeed}
        onSpeedChange={setSpeed}
        onRotationChange={setFacing}
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

      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '8px' }}>
        <button onClick={() => setResetSignal((n) => n + 1)}>Respawn</button>
        <button onClick={() => setIsNight((n) => !n)}>{isNight ? 'Day' : 'Night'}</button>
        <button onClick={() => setIsRaining((r) => !r)}>{isRaining ? 'Stop Rain' : 'Rain'}</button>
      </div>

      <div style={{ position: 'absolute', bottom: 20, right: 20, color: 'white', fontFamily: 'sans-serif' }}>
        <label style={{ display: 'block', fontSize: '14px', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>Speed: {baseSpeed}</label>
        <input type="range" min="1" max="8" step="0.5" value={baseSpeed} onChange={(e) => setBaseSpeed(Number(e.target.value))} />
      </div>

      {coinsLeft === 0 && (
        <div style={{ position: 'absolute', top: '40%', width: '100%', textAlign: 'center', color: 'white', fontSize: '40px', fontWeight: 'bold', textShadow: '0 2px 6px rgba(0,0,0,0.7)', pointerEvents: 'none' }}>
          All coins collected! 🎉
        </div>
      )}

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