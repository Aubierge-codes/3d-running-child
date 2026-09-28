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
      if (action) {
        inputState[action] = true
        // After clicking a HUD button or slider it keeps focus, and Space/arrows
        // would press it or move it while the player is moving. Release focus.
        const el = document.activeElement
        if (el && (el.tagName === 'BUTTON' || el.tagName === 'INPUT')) {
          e.preventDefault()
          el.blur()
        }
      }
      if (e.shiftKey) inputState.sprint = true
    }
    const handleKeyUp = (e) => {
      const action = keyMap[e.code]
      if (action) inputState[action] = false
      if (!e.shiftKey) inputState.sprint = false
    }

    // Keyup never arrives if the window loses focus mid-press (alt-tab), which
    // would leave the character running forever.
    const handleBlur = () => {
      for (const key in inputState) inputState[key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return keys
}