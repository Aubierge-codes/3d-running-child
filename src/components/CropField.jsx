import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const FIELD_ORIGIN = [-34, 0, 8]
const ROWS = 7
const COLS = 12
const SPACING = 0.85

function CropField() {
  const cropRefs = useRef([])

  const crops = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      crops.push({
        x: FIELD_ORIGIN[0] + c * SPACING,
        z: FIELD_ORIGIN[2] + r * SPACING,
        phase: (r * COLS + c) * 0.35,
        height: 0.55 + ((r * 7 + c * 3) % 5) * 0.06,
      })
    }
  }

  useFrame((state) => {
    const t = state.clock.elapsedTime
    crops.forEach((crop, i) => {
      const mesh = cropRefs.current[i]
      if (!mesh) return
      mesh.rotation.z = Math.sin(t * 1.6 + crop.phase) * 0.12
      mesh.rotation.x = Math.cos(t * 1.1 + crop.phase) * 0.06
    })
  })

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[FIELD_ORIGIN[0] + (COLS * SPACING) / 2 - SPACING / 2, 0.015, FIELD_ORIGIN[2] + (ROWS * SPACING) / 2 - SPACING / 2]} receiveShadow>
        <planeGeometry args={[COLS * SPACING + 1, ROWS * SPACING + 1]} />
        <meshStandardMaterial color="#5c4028" roughness={1} />
      </mesh>

      {crops.map((crop, i) => (
        <group key={i} position={[crop.x, 0, crop.z]}>
          <mesh ref={(el) => (cropRefs.current[i] = el)} position={[0, crop.height / 2, 0]} castShadow>
            <coneGeometry args={[0.13, crop.height, 5]} />
            <meshStandardMaterial color="#b8a03a" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </>
  )
}

export default CropField