import { useEffect, useRef } from 'react'
import { inputState } from './inputState'

const keyMap = {
  KeyW: 'forward', ArrowUp: 'forward',
  KeyS: 'backward', ArrowDown: 'backward',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  Space: 'jump',
}

export function useKeyboardControls() {
  const keys = useRef(inputState)

  useEffect(() => {
    const handleKeyDown = (e) => {
      const action = keyMap[e.code]
      if (action) inputState[action] = true
      if (e.shiftKey) inputState.sprint = true
    }
    const handleKeyUp = (e) => {
      const action = keyMap[e.code]
      if (action) inputState[action] = false
      if (!e.shiftKey) inputState.sprint = false
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