function Pond() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[35, 0.02, -35]}>
      <circleGeometry args={[8, 32]} />
      <meshStandardMaterial color="#3a7ca8" roughness={0.15} metalness={0.3} transparent opacity={0.85} />
    </mesh>
  )
}

export default Pond
