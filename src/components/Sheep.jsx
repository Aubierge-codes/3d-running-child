import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const sheepData = [
  { origin: [14, 0, 26], range: 3.5, speed: 0.22, offset: 0 },
  { origin: [19, 0, 29], range: 2.8, speed: 0.3, offset: 2.4 },
  { origin: [11, 0, 31], range: 4.2, speed: 0.18, offset: 4.1 },
  { origin: [-16, 0, -28], range: 3.0, speed: 0.26, offset: 1.3 },
]

function Sheep({ origin, range, speed, offset }) {
  const groupRef = useRef()
  const headRef = useRef()
  const prev = useRef({ x: origin[0], z: origin[2] })

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    const x = origin[0] + Math.sin(t) * range
    const z = origin[2] + Math.sin(t * 0.7 + 1.3) * range

    const dx = x - prev.current.x
    const dz = z - prev.current.z
    prev.current = { x, z }

    groupRef.current.position.x = x
    groupRef.current.position.z = z
    groupRef.current.position.y = Math.abs(Math.sin(t * 6)) * 0.03

    if (Math.abs(dx) > 0.0001 || Math.abs(dz) > 0.0001) {
      groupRef.current.rotation.y = Math.atan2(dx, dz)
    }
    if (headRef.current) {
      headRef.current.rotation.x = 0.35 + Math.sin(t * 1.8) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={origin}>
      {[[-0.16, 0.18], [0.16, 0.18], [-0.16, -0.18], [0.16, -0.18]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.16, z]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.32, 5]} />
          <meshStandardMaterial color="#3a3028" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.34, 10, 8]} />
        <meshStandardMaterial color="#f0ece2" roughness={1} />
      </mesh>
      <mesh position={[0.1, 0.55, 0.22]} castShadow>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#efe9de" roughness={1} />
      </mesh>
      <group ref={headRef} position={[0, 0.52, 0.42]}>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#2e2820" roughness={0.95} />
        </mesh>
      </group>
    </group>
  )
}

function Flock() {
  return (
    <>
      {sheepData.map((s, i) => (
        <Sheep key={i} {...s} />
      ))}
    </>
  )
}

export default Flock