import { useEffect, useRef } from 'react'
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

  return <primitive ref={group} object={scene} />
}

export default Character