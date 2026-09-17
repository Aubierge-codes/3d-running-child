const DOCK_ORIGIN = [43, 0, -30]
const PLANK_COUNT = 6

function Dock() {
  return (
    <group position={DOCK_ORIGIN} rotation={[0, -Math.PI / 5, 0]}>
      {Array.from({ length: PLANK_COUNT }).map((_, i) => (
        <mesh key={i} position={[i * 0.75, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.1, 1.6]} />
          <meshStandardMaterial color="#8a6b45" roughness={0.9} />
        </mesh>
      ))}
      {[0, PLANK_COUNT - 1].map((i) => (
        <group key={i}>
          {[-0.7, 0.7].map((z, j) => (
            <mesh key={j} position={[i * 0.75, 0.05, z]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.8, 6]} />
              <meshStandardMaterial color="#4a3222" roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export default Dock