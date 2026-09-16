const signData = [
  { position: [6, 0, 14], rotationY: 0.4, arms: [{ dir: 1, label: 'village' }, { dir: -1, label: 'pond' }] },
  { position: [-12, 0, -6], rotationY: -0.8, arms: [{ dir: 1, label: 'forest' }] },
  { position: [20, 0, 4], rotationY: 1.4, arms: [{ dir: -1, label: 'well' }, { dir: 1, label: 'farm' }] },
]

function Signpost({ position, rotationY, arms }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.1, 1.8, 7]} />
        <meshStandardMaterial color="#5a4028" roughness={0.95} />
      </mesh>

      {arms.map((arm, i) => (
        <group key={i} position={[0, 1.5 - i * 0.38, 0]}>
          <mesh position={[arm.dir * 0.42, 0, 0]} castShadow>
            <boxGeometry args={[0.8, 0.22, 0.05]} />
            <meshStandardMaterial color="#8a6b45" roughness={0.9} />
          </mesh>
          <mesh position={[arm.dir * 0.86, 0, 0]} rotation={[0, 0, arm.dir > 0 ? -Math.PI / 4 : Math.PI / 4]} castShadow>
            <boxGeometry args={[0.16, 0.16, 0.05]} />
            <meshStandardMaterial color="#8a6b45" roughness={0.9} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[0.26, 0.3, 0.12, 8]} />
        <meshStandardMaterial color="#6b6b6b" roughness={1} />
      </mesh>
    </group>
  )
}

export const signColliders = signData.map((s) => ({ position: s.position, radius: 0.3 }))

function Signposts() {
  return (
    <>
      {signData.map((s, i) => (
        <Signpost key={i} {...s} />
      ))}
    </>
  )
}

export default Signposts