import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useKeyboardControls } from '../hooks/useKeyboardControls'

const GRAVITY = 20
const JUMP_STRENGTH = 7

function shortestAngleDiff(target, current) {
  const twoPi = Math.PI * 2
  let diff = (target - current) % twoPi
  if (diff < -Math.PI) diff += twoPi
  if (diff > Math.PI) diff -= twoPi
  return diff
}

function Character({ characterRef, paused, baseSpeed = 3, onLand, onSpeedChange, onRotationChange, onPositionChange }) {
  const { scene, animations } = useGLTF('/models/child.glb')
  const { actions } = useAnimations(animations, characterRef)
  const keys = useKeyboardControls()
  const activeAction = useRef(null)
  const targetRotation = useRef(0)
  const verticalVelocity = useRef(0)
  const isGrounded = useRef(true)
  const jumpsUsed = useRef(0)
  const jumpKeyWasDown = useRef(false)
  const lastPos = useRef({ x: 0, z: 0 })
  const reportTimer = useRef(0)

  useEffect(() => {
    activeAction.current = actions['Idle']
    activeAction.current.reset().play()
  }, [actions])

  useEffect(() => {
    const colorOverrides = {
      Shirt: '#e05252', UnderShirt: '#f5d488', Pants: '#4a4a68',
      Boots: '#3a2a1e', Hair: '#2b1a10', Skin: '#d9a679',
    }
    scene.traverse((child) => {
      if (child.isMesh && child.material?.name in colorOverrides) {
        child.material.color.set(colorOverrides[child.material.name])
        if (child.material.name === 'Skin') {
          child.material.roughness = 0.85
          child.material.metalness = 0
        }
      }
    })

    const boneScales = { Head: 0.85, 'UpperLeg.L': 1.15, 'UpperLeg.R': 1.15, 'LowerLeg.L': 1.15, 'LowerLeg.R': 1.15 }
    scene.traverse((child) => {
      if (child.isBone && child.name in boneScales) {
        const s = boneScales[child.name]
        child.scale.set(s, s, s)
      }
    })
  }, [scene])

  function fadeToAction(name, duration = 0.3) {
    const nextAction = actions[name]
    if (activeAction.current === nextAction) return
    nextAction.reset().fadeIn(duration).play()
    activeAction.current.fadeOut(duration)
    activeAction.current = nextAction
  }

  useFrame((state, delta) => {
    if (paused) return

    const { forward, backward, left, right, jump, sprint } = keys.current

    const moveX = (right ? 1 : 0) - (left ? 1 : 0)
    const moveZ = (backward ? 1 : 0) - (forward ? 1 : 0)
    const isMoving = moveX !== 0 || moveZ !== 0

    if (isMoving) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ)
      const speed = sprint ? baseSpeed * 1.8 : baseSpeed
      characterRef.current.position.x += (moveX / length) * speed * delta
      characterRef.current.position.z += (moveZ / length) * speed * delta
      targetRotation.current = Math.atan2(-moveX, -moveZ) + Math.PI
      fadeToAction('Run')
    } else {
      fadeToAction('Idle')
    }

    const diff = shortestAngleDiff(targetRotation.current, characterRef.current.rotation.y)
    characterRef.current.rotation.y += diff * 0.15

    const jumpPressed = jump && !jumpKeyWasDown.current
    jumpKeyWasDown.current = jump

    if (jumpPressed && jumpsUsed.current < 2) {
      verticalVelocity.current = JUMP_STRENGTH
      isGrounded.current = false
      jumpsUsed.current += 1
    }

    verticalVelocity.current -= GRAVITY * delta
    characterRef.current.position.y += verticalVelocity.current * delta

    if (characterRef.current.position.y <= 0) {
      if (!isGrounded.current && onLand) onLand()
      characterRef.current.position.y = 0
      verticalVelocity.current = 0
      isGrounded.current = true
      jumpsUsed.current = 0
    }

    reportTimer.current += delta
    if (reportTimer.current > 0.15) {
      reportTimer.current = 0
      const dx = characterRef.current.position.x - lastPos.current.x
      const dz = characterRef.current.position.z - lastPos.current.z
      const dist = Math.sqrt(dx * dx + dz * dz)
      lastPos.current = { x: characterRef.current.position.x, z: characterRef.current.position.z }
      if (onSpeedChange) onSpeedChange(dist / 0.15)
      if (onRotationChange) onRotationChange(characterRef.current.rotation.y)
      if (onPositionChange) onPositionChange({ x: characterRef.current.position.x, z: characterRef.current.position.z })
    }
  })

  return <primitive ref={characterRef} object={scene} />
}

export default Character