import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'

function Character({ characterRef }) {
  const { scene, animations } = useGLTF('/models/child.glb')
  const { actions } = useAnimations(animations, characterRef)

  useEffect(() => {
    const runAction = actions['Run']
    runAction.reset().play()

    return () => {
      runAction.stop()
    }
  }, [actions])

  useFrame((state, delta) => {
    characterRef.current.position.z -= delta * 2
  })

  return <primitive ref={characterRef} object={scene} />
}

export default Character