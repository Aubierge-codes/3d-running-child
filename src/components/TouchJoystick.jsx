import { useRef, useEffect, useState } from 'react'
import { inputState } from '../hooks/inputState'

const MAX_KNOB_DIST = 40
const DEAD_ZONE = 12

// Offsets from the screen edge that respect the notch / home indicator.
const safe = (side, px) => `calc(${px}px + env(safe-area-inset-${side}, 0px))`

const roundButton = {
  position: 'absolute', borderRadius: '50%',
  border: '2px solid rgba(255,255,255,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'white', fontFamily: 'sans-serif', fontWeight: 'bold',
  touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none',
}

// On-screen controls for touch devices. Writes into the same shared
// `inputState` object the keyboard hook uses, so Character, Dust and
// SprintTrail don't know or care which input device is active.
function TouchJoystick() {
  const baseRef = useRef(null)
  const knobRef = useRef(null)
  const jumpRef = useRef(null)
  const activeTouch = useRef(null)
  const centerRef = useRef({ x: 0, y: 0 })
  const [sprintOn, setSprintOn] = useState(false)

  useEffect(() => {
    inputState.sprint = sprintOn
  }, [sprintOn])

  useEffect(() => {
    const base = baseRef.current
    const knob = knobRef.current
    const jumpBtn = jumpRef.current
    if (!base || !knob || !jumpBtn) return

    function getCenter() {
      const rect = base.getBoundingClientRect()
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    }

    function updateFromPoint(x, y) {
      const center = centerRef.current
      const dx = x - center.x
      const dy = y - center.y
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), MAX_KNOB_DIST)
      const angle = Math.atan2(dy, dx)
      const knobX = Math.cos(angle) * dist
      const knobY = Math.sin(angle) * dist
      knob.style.transform = `translate(${knobX}px, ${knobY}px)`

      inputState.right = knobX > DEAD_ZONE
      inputState.left = knobX < -DEAD_ZONE
      inputState.backward = knobY > DEAD_ZONE
      inputState.forward = knobY < -DEAD_ZONE
    }

    function resetJoystick() {
      knob.style.transform = 'translate(0px, 0px)'
      inputState.forward = false
      inputState.backward = false
      inputState.left = false
      inputState.right = false
    }

    function handleTouchStart(e) {
      const touch = e.changedTouches[0]
      activeTouch.current = touch.identifier
      centerRef.current = getCenter()
      updateFromPoint(touch.clientX, touch.clientY)
      e.preventDefault()
    }

    function handleTouchMove(e) {
      for (const touch of e.changedTouches) {
        if (touch.identifier === activeTouch.current) {
          updateFromPoint(touch.clientX, touch.clientY)
          e.preventDefault()
        }
      }
    }

    function handleTouchEnd(e) {
      for (const touch of e.changedTouches) {
        if (touch.identifier === activeTouch.current) {
          activeTouch.current = null
          resetJoystick()
        }
      }
    }

    // React registers touch handlers as passive, so preventDefault() there is
    // ignored (and warns). Native non-passive listeners stop the browser from
    // also firing a synthetic click / double-tap zoom on the jump button.
    function handleJumpStart(e) {
      inputState.jump = true
      e.preventDefault()
    }
    function handleJumpEnd() {
      inputState.jump = false
    }

    // A phone call, app switch or notification can swallow the touchend; don't
    // leave the character running when the player comes back.
    function handleBlur() {
      activeTouch.current = null
      resetJoystick()
      inputState.jump = false
      setSprintOn(false)
    }
    function handleVisibility() {
      if (document.hidden) handleBlur()
    }

    base.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)
    jumpBtn.addEventListener('touchstart', handleJumpStart, { passive: false })
    jumpBtn.addEventListener('touchend', handleJumpEnd)
    jumpBtn.addEventListener('touchcancel', handleJumpEnd)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      base.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
      jumpBtn.removeEventListener('touchstart', handleJumpStart)
      jumpBtn.removeEventListener('touchend', handleJumpEnd)
      jumpBtn.removeEventListener('touchcancel', handleJumpEnd)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('visibilitychange', handleVisibility)
      resetJoystick()
      inputState.jump = false
      inputState.sprint = false
    }
  }, [])

  return (
    <>
      <div
        ref={baseRef}
        aria-label="Movement joystick"
        style={{
          position: 'absolute', bottom: safe('bottom', 28), left: safe('left', 28), width: 110, height: 110,
          borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)',
          touchAction: 'none',
        }}
      >
        <div
          ref={knobRef}
          style={{
            position: 'absolute', top: '50%', left: '50%', width: 48, height: 48,
            marginTop: -24, marginLeft: -24, borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)', transition: 'transform 0.05s linear',
          }}
        />
      </div>

      <div
        ref={jumpRef}
        role="button"
        aria-label="Jump"
        style={{
          ...roundButton, bottom: safe('bottom', 36), right: safe('right', 28), width: 78, height: 78,
          background: 'rgba(255,255,255,0.25)', fontSize: '14px',
        }}
      >
        JUMP
      </div>

      <button
        type="button"
        aria-label="Toggle sprint"
        aria-pressed={sprintOn}
        onClick={() => setSprintOn((s) => !s)}
        style={{
          ...roundButton, bottom: safe('bottom', 124), right: safe('right', 40), width: 56, height: 56, padding: 0,
          background: sprintOn ? 'rgba(255,193,7,0.7)' : 'rgba(255,255,255,0.18)', fontSize: '11px',
        }}
      >
        SPRINT
      </button>
    </>
  )
}

export default TouchJoystick
