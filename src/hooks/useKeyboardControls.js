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
  Space: 'jump',
}

export function useKeyboardControls() {
  const keys = useRef({ forward: false, backward: false, left: false, right: false, jump: false })

  useEffect(() => {
    const handleKeyDown = (e) => {
      const action = keyMap[e.code]
      if (action) keys.current[action] = true
    }
    const handleKeyUp = (e) => {
      const action = keyMap[e.code]
      if (action) keys.current[action] = false
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