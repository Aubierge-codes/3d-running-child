import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useKeyboardControls } from '../hooks/useKeyboardControls'

const GRAVITY = 20
const JUMP_STRENGTH = 7

function Character({ characterRef }) {
  const { scene, animations } = useGLTF('/models/child.glb')
  const { actions } = useAnimations(animations, characterRef)
  const keys = useKeyboardControls()
  const activeAction = useRef(null)
  const targetRotation = useRef(0)
  const verticalVelocity = useRef(0)
  const isGrounded = useRef(true)

  useEffect(() => {
    activeAction.current = actions['Idle']
    activeAction.current.reset().play()
  }, [actions])

  function fadeToAction(name, duration = 0.3) {
    const nextAction = actions[name]
    if (activeAction.current === nextAction) return

    nextAction.reset().fadeIn(duration).play()
    activeAction.current.fadeOut(duration)
    activeAction.current = nextAction
  }

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump } = keys.current

    const moveX = (right ? 1 : 0) - (left ? 1 : 0)
    const moveZ = (backward ? 1 : 0) - (forward ? 1 : 0)
    const isMoving = moveX !== 0 || moveZ !== 0

    if (isMoving) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ)
      const speed = 3
      characterRef.current.position.x += (moveX / length) * speed * delta
      characterRef.current.position.z += (moveZ / length) * speed * delta

      targetRotation.current = Math.atan2(moveX, -moveZ)
      fadeToAction('Run')
    } else {
      fadeToAction('Idle')
    }

    let diff = targetRotation.current - characterRef.current.rotation.y
    diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI
    characterRef.current.rotation.y += diff * 0.15

    if (jump && isGrounded.current) {
      verticalVelocity.current = JUMP_STRENGTH
      isGrounded.current = false
    }

    verticalVelocity.current -= GRAVITY * delta
    characterRef.current.position.y += verticalVelocity.current * delta

    if (characterRef.current.position.y <= 0) {
      characterRef.current.position.y = 0
      verticalVelocity.current = 0
      isGrounded.current = true
    }
  })

  return <primitive ref={characterRef} object={scene} />
}

export default Character