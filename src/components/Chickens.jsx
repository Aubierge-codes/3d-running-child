import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const chickenData = [
  { origin: [31, 0, 15], range: 2.2, speed: 0.5, offset: 0, color: '#f0ece0' },
  { origin: [28, 0, 16], range: 1.8, speed: 0.65, offset: 2.5, color: '#c9622e' },
  { origin: [33, 0, 13], range: 2.0, speed: 0.4, offset: 4.8, color: '#8a5a3a' },
]

function Chicken({ origin, range, speed, offset, color }) {
  const groupRef = useRef()
  const headRef = useRef()
  const prev = useRef({ x: origin[0], z: origin[2] })
  const peckTimer = useRef(Math.random() * 3)
  const peckPhase = useRef(0)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + offset
    const x = origin[0] + Math.sin(t) * range
    const z = origin[2] + Math.cos(t * 0.8) * range

    const dx = x - prev.current.x
    const dz = z - prev.current.z
    prev.current = { x, z }

    groupRef.current.position.x = x
    groupRef.current.position.z = z

    if (Math.abs(dx) > 0.0001 || Math.abs(dz) > 0.0001) {
      groupRef.current.rotation.y = Math.atan2(dx, dz)
    }

    peckTimer.current -= delta
    if (peckTimer.current <= 0) {
      peckTimer.current = 1.5 + Math.random() * 2
      peckPhase.current = 0.001
    }
    if (peckPhase.current > 0) {
      peckPhase.current += delta * 8
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(peckPhase.current) * 0.9
      }
      if (peckPhase.current > Math.PI) peckPhase.current = 0
    }
  })

  return (
    <group ref={groupRef} position={origin}>
      {[[-0.05, 0.06], [0.05, 0.06], [-0.05, -0.06], [0.05, -0.06]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.08, z]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 4]} />
          <meshStandardMaterial color="#c9922e" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <group ref={headRef} position={[0, 0.32, 0.14]}>
        <mesh castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <coneGeometry args={[0.025, 0.08, 5]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#e8a13a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.03, 0.06, 0.03]} />
          <meshStandardMaterial color="#c9422e" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

function Chickens() {
  return (
    <>
      {chickenData.map((c, i) => (
        <Chicken key={i} {...c} />
      ))}
    </>
  )
}

export default Chickens