import { useState } from 'react'
import Scene from './components/Scene'

function App() {
  const [score, setScore] = useState(0)

  return (
    <>
      <Scene onScoreChange={setScore} />
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: '28px',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.6)',
        pointerEvents: 'none',
      }}>
        🪙 {score}
      </div>
    </>
  )
}

export default App