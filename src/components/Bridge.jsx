function Bridge() {
  const plankCount = 10
  const bridgeLength = 18
  const startZ = -35 - bridgeLength / 2

  return (
    <group position={[35, 0, 0]}>
      {Array.from({ length: plankCount }).map((_, i) => (
        <mesh
          key={i}
          position={[0, 0.55, startZ + (i * bridgeLength) / plankCount]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[2.2, 0.15, bridgeLength / plankCount + 0.05]} />
          <meshStandardMaterial color="#7a5a3a" roughness={0.9} />
        </mesh>
      ))}

      {[-1.15, 1.15].map((xOffset, side) => (
        <group key={side}>
          {[startZ, startZ + bridgeLength * 0.33, startZ + bridgeLength * 0.66, startZ + bridgeLength].map((z, i) => (
            <mesh key={i} position={[xOffset, 1.0, z]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.9, 6]} />
              <meshStandardMaterial color="#5a4028" roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[xOffset, 1.4, startZ + bridgeLength / 2]} castShadow>
            <boxGeometry args={[0.08, 0.08, bridgeLength + 0.4]} />
            <meshStandardMaterial color="#5a4028" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default Bridge