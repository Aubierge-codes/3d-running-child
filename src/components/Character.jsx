import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'

function Character() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/child.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const runAction = actions['Run']
    runAction.reset().play()

    return () => {
      runAction.stop()
    }
  }, [actions])

  useFrame((state, delta) => {
    group.current.position.z -= delta * 2
  })

  return <primitive ref={group} object={scene} />
}

export default Character