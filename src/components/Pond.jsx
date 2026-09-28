import { POND_CENTER, POND_RADIUS } from '../world/layout'

function Pond() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[POND_CENTER[0], 0.02, POND_CENTER[2]]}>
      <circleGeometry args={[POND_RADIUS, 32]} />
      <meshStandardMaterial color="#3a7ca8" roughness={0.15} metalness={0.3} transparent opacity={0.85} />
    </mesh>
  )
}

export default Pond
