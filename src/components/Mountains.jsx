const mountainPositions = [
  { position: [-60, 0, -80], scale: [25, 30, 25] },
  { position: [-20, 0, -95], scale: [30, 38, 30] },
  { position: [30, 0, -90], scale: [28, 34, 28] },
  { position: [70, 0, -75], scale: [24, 28, 24] },
  { position: [90, 0, -40], scale: [26, 32, 26] },
  { position: [-90, 0, -30], scale: [25, 30, 25] },
]

function Mountains() {
  return (
    <>
      {mountainPositions.map((m, i) => (
        <mesh key={i} position={m.position} scale={m.scale}>
          <coneGeometry args={[1, 1, 6]} />
          <meshStandardMaterial color="#7c8a9c" roughness={1} />
        </mesh>
      ))}
    </>
  )
}

export default Mountains