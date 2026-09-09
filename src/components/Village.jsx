function House({ position, rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2.5, 2, 2.5]} />
        <meshStandardMaterial color="#d8c9a3" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[2, 1.4, 4]} />
        <meshStandardMaterial color="#8a3a2e" roughness={0.8} />
      </mesh>
    </group>
  )
}

export const houseColliders = [
  { position: [20, 0, 15], rotationY: 0.3, radius: 1.8 },
  { position: [24, 0, 18], rotationY: 1.1, radius: 1.8 },
  { position: [18, 0, 20], rotationY: -0.4, radius: 1.8 },
  { position: [-20, 0, -15], rotationY: 0.8, radius: 1.8 },
  { position: [-24, 0, -18], rotationY: -1.0, radius: 1.8 },
]

function Village() {
  return (
    <>
      {houseColliders.map((h, i) => (
        <House key={i} position={h.position} rotationY={h.rotationY} />
      ))}
    </>
  )
}

export default Village