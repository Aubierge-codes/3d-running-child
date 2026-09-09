function seededRandom(seed) {
  let value = seed
  return function () {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function Flower({ position, color }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
        <meshStandardMaterial color="#3f6b3a" />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  )
}

const flowerColors = ['#e05252', '#e8c14a', '#c060d0', '#ffffff']

function generateFlowers(count, worldSize, seed) {
  const rand = seededRandom(seed)
  const result = []
  for (let i = 0; i < count; i++) {
    const x = (rand() - 0.5) * worldSize
    const z = (rand() - 0.5) * worldSize
    const color = flowerColors[Math.floor(rand() * flowerColors.length)]
    result.push({ position: [x, 0, z], color })
  }
  return result
}

const flowerData = generateFlowers(60, 170, 555)

function Flora() {
  return (
    <>
      {flowerData.map((f, i) => (
        <Flower key={i} position={f.position} color={f.color} />
      ))}
    </>
  )
}

export default Flora