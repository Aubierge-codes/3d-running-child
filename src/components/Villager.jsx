import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Villager({ position, colorShirt = '#4a7c9c', colorPants = '#5a4a3a' }) {
  const bodyRef = useRef()
  const headRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    bodyRef.current.position.y = 0.9 + Math.sin(t * 1.2) * 0.02
    headRef.current.rotation.y = Math.sin(t * 0.4) * 0.5
  })

  return (
    <group position={position} castShadow>
      <mesh position={[-0.15, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.5, 6]} />
        <meshStandardMaterial color={colorPants} roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.5, 6]} />
        <meshStandardMaterial color={colorPants} roughness={0.9} />
      </mesh>

      <mesh ref={bodyRef} position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.5, 4, 8]} />
        <meshStandardMaterial color={colorShirt} roughness={0.85} />
      </mesh>

      <group ref={headRef} position={[0, 1.45, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 10, 10]} />
          <meshStandardMaterial color="#d9a679" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.18, 0]} castShadow>
          <sphereGeometry args={[0.24, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#4a3222" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

const villagerData = [
  { position: [24, 0, 15], colorShirt: '#4a7c9c', colorPants: '#5a4a3a' },
  { position: [-22, 0, -19], colorShirt: '#9c5a4a', colorPants: '#3a4a5a' },
]

function Villagers() {
  return (
    <>
      {villagerData.map((v, i) => (
        <Villager key={i} position={v.position} colorShirt={v.colorShirt} colorPants={v.colorPants} />
      ))}
    </>
  )
}

export default Villagers