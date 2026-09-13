import { useRef, useEffect } from 'react'
import { inputState } from '../hooks/inputState'

function TouchJoystick() {
  const baseRef = useRef(null)
  const knobRef = useRef(null)
  const activeTouch = useRef(null)
  const centerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const base = baseRef.current
    const knob = knobRef.current
    if (!base || !knob) return

    function getCenter() {
      const rect = base.getBoundingClientRect()
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    }

    function updateFromPoint(x, y) {
      const center = centerRef.current
      const dx = x - center.x
      const dy = y - center.y
      const maxDist = 40
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist)
      const angle = Math.atan2(dy, dx)
      const knobX = Math.cos(angle) * dist
      const knobY = Math.sin(angle) * dist
      knob.style.transform = `translate(${knobX}px, ${knobY}px)`

      const threshold = 12
      inputState.right = knobX > threshold
      inputState.left = knobX < -threshold
      inputState.backward = knobY > threshold
      inputState.forward = knobY < -threshold
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

    base.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      base.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [])

  function handleJumpStart(e) {
    inputState.jump = true
    e.preventDefault()
  }
  function handleJumpEnd() {
    inputState.jump = false
  }

  return (
    <>
      <div
        ref={baseRef}
        style={{
          position: 'absolute', bottom: 30, left: 30, width: 100, height: 100,
          borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)',
          touchAction: 'none',
        }}
      >
        <div
          ref={knobRef}
          style={{
            position: 'absolute', top: '50%', left: '50%', width: 44, height: 44,
            marginTop: -22, marginLeft: -22, borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)', transition: 'transform 0.05s linear',
          }}
        />
      </div>

      <div
        onTouchStart={handleJumpStart}
        onTouchEnd={handleJumpEnd}
        style={{
          position: 'absolute', bottom: 40, right: 30, width: 70, height: 70,
          borderRadius: '50%', background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14px',
          touchAction: 'none', userSelect: 'none',
        }}
      >
        JUMP
      </div>
    </>
  )
}

export default TouchJoystick