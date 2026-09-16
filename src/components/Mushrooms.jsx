import { treeColliders } from './Trees'

function seededRandom(seed) {
  let value = seed
  return function () {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

const capColors = ['#c94f4f', '#d98a3a', '#e8dcc0', '#9c6ad9']

const mushroomData = (() => {
  const rand = seededRandom(13579)
  const result = []
  for (let i = 0; i < 26; i++) {
    const tree = treeColliders[Math.floor(rand() * treeColliders.length)]
    result.push({
      x: tree.position[0] + (rand() - 0.5) * 3,
      z: tree.position[2] + (rand() - 0.5) * 3,
      scale: 0.55 + rand() * 0.6,
      color: capColors[Math.floor(rand() * capColors.length)],
      spotted: rand() > 0.45,
      tilt: (rand() - 0.5) * 0.3,
    })
  }
  return result
})()

function Mushroom({ x, z, scale, color, spotted, tilt }) {
  return (
    <group position={[x, 0, z]} scale={scale} rotation={[tilt, 0, tilt * 0.6]}>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.075, 0.26, 7]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.17, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={color} roughness={0.85} side={2} />
      </mesh>
      {spotted &&
        [0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.09, 0.33, Math.sin(a) * 0.09]}>
              <sphereGeometry args={[0.028, 6, 6]} />
              <meshStandardMaterial color="#f5f0e2" roughness={0.9} />
            </mesh>
          )
        })}
    </group>
  )
}

function Mushrooms() {
  return (
    <>
      {mushroomData.map((m, i) => (
        <Mushroom key={i} {...m} />
      ))}
    </>
  )
}

export default Mushrooms