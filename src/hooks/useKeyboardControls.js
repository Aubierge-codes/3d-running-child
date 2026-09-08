import { useEffect, useRef } from 'react'

const keyMap = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
}

export function useKeyboardControls() {
  const keys = useRef({ forward: false, backward: false, left: false, right: false })

  useEffect(() => {
    const handleKeyDown = (e) => {
      const action = keyMap[e.code]
      if (action) {
        keys.current[action] = true
        console.log('KEY DOWN:', e.code, '->', action, keys.current)
      }
    }
    const handleKeyUp = (e) => {
      const action = keyMap[e.code]
      if (action) {
        keys.current[action] = false
        console.log('KEY UP:', e.code, '->', action, keys.current)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}