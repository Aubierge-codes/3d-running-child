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

const rockPositions = [
  [6, 0, -2],
  [-8, 0, 3],
  [10, 0, 6],
  [-5, 0, -9],
  [2, 0, 9],
  [-12, 0, -4],
]

const bushPositions = [
  [4, 0, 5],
  [-6, 0, -3],
  [8, 0, -7],
  [-3, 0, 8],
  [12, 0, 1],
  [-10, 0, 6],
]

function Landmarks() {
  return (
    <>
      {rockPositions.map((pos, i) => (
        <Rock key={`rock-${i}`} position={pos} scale={0.7 + Math.random() * 0.6} />
      ))}
      {bushPositions.map((pos, i) => (
        <Bush key={`bush-${i}`} position={pos} scale={0.8 + Math.random() * 0.4} />
      ))}
    </>
  )
}

export default Landmarks