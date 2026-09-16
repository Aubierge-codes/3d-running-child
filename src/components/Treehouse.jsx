const TREEHOUSE_POS = [-7, 0, -20]

function Treehouse() {
  return (
    <group position={TREEHOUSE_POS}>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.5, 4, 7]} />
        <meshStandardMaterial color="#5a3d2b" roughness={0.95} />
      </mesh>
      <mesh position={[0, 4.6, 0]} castShadow>
        <coneGeometry args={[2.2, 3, 7]} />
        <meshStandardMaterial color="#3f6b3a" roughness={0.9} />
      </mesh>

      <mesh position={[0.9, 3.1, 0.4]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.3, 1.6]} />
        <meshStandardMaterial color="#8a6b45" roughness={0.9} />
      </mesh>
      <mesh position={[0.9, 3.9, 0.4]} rotation={[0, 0.3, Math.PI / 4]} castShadow>
        <boxGeometry args={[1.5, 0.12, 1.5]} />
        <meshStandardMaterial color="#6b4a35" roughness={0.9} />
      </mesh>

      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0.55, 1.2 + i * 0.42, 0.75]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.35, 0.08, 0.08]} />
          <meshStandardMaterial color="#4a3222" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

export const treehouseColliders = [{ position: TREEHOUSE_POS, radius: 0.7 }]

export default Treehouse