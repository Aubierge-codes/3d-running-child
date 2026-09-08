function Rock({ position, scale = 1 }) {
  return (
    <mesh position={position} scale={scale}>
      <dodecahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial color="#8a8378" roughness={0.9} />
    </mesh>
  )
}

function Bush({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#4a7c3a" roughness={0.8} />
      </mesh>
      <mesh position={[0.35, 0.15, 0.2]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#548a41" roughness={0.8} />
      </mesh>
      <mesh position={[-0.3, 0.15, -0.15]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#3f6d32" roughness={0.8} />
      </mesh>
    </group>
  )
}

export const obstacles = [
  { position: [6, 0, -2], scale: 1.0, radius: 0.7 },
  { position: [-8, 0, 3], scale: 1.1, radius: 0.75 },
  { position: [10, 0, 6], scale: 0.9, radius: 0.65 },
  { position: [-5, 0, -9], scale: 1.2, radius: 0.8 },
  { position: [2, 0, 9], scale: 0.8, radius: 0.6 },
  { position: [-12, 0, -4], scale: 1.0, radius: 0.7 },
  { position: [15, 0, -10], scale: 1.3, radius: 0.85 },
  { position: [-18, 0, 8], scale: 0.85, radius: 0.6 },
  { position: [4, 0, 5], scale: 0.9, radius: 0.7, type: 'bush' },
  { position: [-6, 0, -3], scale: 1.0, radius: 0.75, type: 'bush' },
  { position: [8, 0, -7], scale: 1.1, radius: 0.8, type: 'bush' },
  { position: [-3, 0, 8], scale: 0.85, radius: 0.65, type: 'bush' },
  { position: [12, 0, 1], scale: 1.0, radius: 0.75, type: 'bush' },
  { position: [-10, 0, 6], scale: 0.9, radius: 0.7, type: 'bush' },
  { position: [16, 0, 4], scale: 0.95, radius: 0.7, type: 'bush' },
  { position: [-14, 0, -8], scale: 1.05, radius: 0.75, type: 'bush' },
  { position: [3, 0, -14], scale: 0.9, radius: 0.7, type: 'bush' },
  { position: [-2, 0, 15], scale: 1.1, radius: 0.8, type: 'bush' },
]

function Landmarks() {
  return (
    <>
      {obstacles.map((obs, i) =>
        obs.type === 'bush' ? (
          <Bush key={`obs-${i}`} position={obs.position} scale={obs.scale} />
        ) : (
          <Rock key={`obs-${i}`} position={obs.position} scale={obs.scale} />
        )
      )}
    </>
  )
}

export default Landmarks