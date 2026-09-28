import { houseColliders, fenceColliders } from '../world/layout'

function House({ position, rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2.5, 2, 2.5]} />
        <meshStandardMaterial color="#d8c9a3" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[2, 1.4, 4]} />
        <meshStandardMaterial color="#8a3a2e" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Village() {
  return (
    <>
      {houseColliders.map((h, i) => (
        <House key={i} position={h.position} rotationY={h.rotationY} />
      ))}
    </>
  )
}

function FencePost({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.15, 1, 0.15]} />
      <meshStandardMaterial color="#6b4a35" roughness={0.9} />
    </mesh>
  )
}

export function Fence() {
  return (
    <>
      {fenceColliders.map((post, i) => (
        <FencePost key={i} position={post.position} />
      ))}
    </>
  )
}

export default Village