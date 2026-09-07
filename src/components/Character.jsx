import { useGLTF } from '@react-three/drei'

function Character() {
  const { scene, animations } = useGLTF('/models/child.glb')

  console.log('Loaded scene:', scene)
  console.log('Available animations:', animations)

  return <primitive object={scene} />
}

export default Character