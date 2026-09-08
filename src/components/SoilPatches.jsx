const patchPositions = [
  { position: [2, 0.01, 3], size: 3 },
  { position: [-5, 0.01, -4], size: 4 },
  { position: [8, 0.01, -3], size: 2.5 },
  { position: [-9, 0.01, 5], size: 3.5 },
  { position: [0, 0.01, -10], size: 3 },
  { position: [-3, 0.01, 10], size: 4 },
  { position: [14, 0.01, 8], size: 3 },
]

function SoilPatches() {
  return (
    <>
      {patchPositions.map((patch, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={patch.position}
        >
          <circleGeometry args={[patch.size, 16]} />
          <meshStandardMaterial color="#6b4a35" roughness={1} />
        </mesh>
      ))}
    </>
  )
}

export default SoilPatches