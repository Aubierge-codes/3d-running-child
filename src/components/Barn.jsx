const BARN_POS = [30, 0, 10]

function Barn() {
  return (
    <group position={BARN_POS}>
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 3.2, 4]} />
        <meshStandardMaterial color="#a13c33" roughness={0.9} />
      </mesh>

      <mesh position={[0, 3.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.55, 1.9, 4]} />
        <meshStandardMaterial color="#6b2c26" roughness={0.85} />
      </mesh>

      <mesh position={[0, 2, 2.01]} castShadow>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.8} />
      </mesh>
      {[-1.1, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 2.02]} castShadow>
          <boxGeometry args={[1.6, 2.2, 0.06]} />
          <meshStandardMaterial color="#8a3a2e" roughness={0.85} />
        </mesh>
      ))}

      <mesh position={[0, 2.6, 2.03]}>
        <circleGeometry args={[0.5, 12]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.6, 2.035]}>
        <ringGeometry args={[0.02, 0.5, 12]} />
        <meshStandardMaterial color="#5a4028" roughness={0.9} />
      </mesh>

      {[-1.6, 1.6].map((x, i) => (
        <mesh key={i} position={[x, 1.6, -2.01]}>
          <boxGeometry args={[0.7, 0.7, 0.05]} />
          <meshStandardMaterial color="#e8e0cc" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

export const barnColliders = [{ position: BARN_POS, radius: 3.2 }]

export default Barn