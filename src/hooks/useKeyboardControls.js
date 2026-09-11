import { useEffect, useRef } from 'react'

const keyMap = {
  KeyW: 'forward', ArrowUp: 'forward',
  KeyS: 'backward', ArrowDown: 'backward',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  Space: 'jump',
}

export function useKeyboardControls() {
  const keys = useRef({ forward: false, backward: false, left: false, right: false, jump: false, sprint: false })

  useEffect(() => {
    const handleKeyDown = (e) => {
      const action = keyMap[e.code]
      if (action) keys.current[action] = true
      if (e.shiftKey) keys.current.sprint = true
    }
    const handleKeyUp = (e) => {
      const action = keyMap[e.code]
      if (action) keys.current[action] = false
      if (!e.shiftKey) keys.current.sprint = false
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