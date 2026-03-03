import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RoboticBodyProps {
  health: number
  stress: number
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GlowingEye({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.8 + Math.sin(state.clock.getElapsedTime() * 2) * 0.3
  })
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        roughness={0}
        metalness={0.3}
      />
    </mesh>
  )
}

// ─── Main robotic body ────────────────────────────────────────────────────────

export function RoboticBody({ health, stress }: RoboticBodyProps) {
  const bodyRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)

  const eyeColor = health > 60 ? '#4ade80' : health > 30 ? '#facc15' : '#ef4444'

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Subtle idle breathing animation
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(t * 1.2) * 0.012
      // Stress makes body tremble slightly
      if (stress > 60) {
        bodyRef.current.rotation.z = Math.sin(t * 18) * (stress / 100) * 0.015
      } else {
        bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, 0, 0.05)
      }
    }

    // Arm sway
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.3 + Math.sin(t * 0.9 + 1) * 0.06
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.3 - Math.sin(t * 0.9) * 0.06
    }
  })

  const metalColor = health > 50 ? '#334155' : '#1e293b'
  const accentColor = health > 60 ? '#4ade80' : health > 30 ? '#facc15' : '#ef4444'

  return (
    <group ref={bodyRef} position={[0, -0.4, 0]}>
      {/* ── Head ── */}
      <group position={[0, 1.55, 0]}>
        {/* Head box */}
        <mesh>
          <boxGeometry args={[0.42, 0.38, 0.32]} />
          <meshStandardMaterial color={metalColor} roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Face plate */}
        <mesh position={[0, 0, 0.17]}>
          <boxGeometry args={[0.36, 0.30, 0.02]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.6} />
        </mesh>
        {/* Eyes */}
        <GlowingEye position={[-0.1, 0.03, 0.19]} color={eyeColor} />
        <GlowingEye position={[ 0.1, 0.03, 0.19]} color={eyeColor} />
        {/* Mouth slit */}
        <mesh position={[0, -0.08, 0.19]}>
          <boxGeometry args={[0.18, 0.02, 0.01]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.02, 0.015, 0.28, 6]} />
          <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.41, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* ── Neck ── */}
      <mesh position={[0, 1.27, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.22, 8]} />
        <meshStandardMaterial color={metalColor} roughness={0.25} metalness={0.85} />
      </mesh>

      {/* ── Torso ── */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.72, 0.8, 0.38]} />
        <meshStandardMaterial color={metalColor} roughness={0.22} metalness={0.88} />
      </mesh>
      {/* Chest panel */}
      <mesh position={[0, 0.8, 0.2]}>
        <boxGeometry args={[0.52, 0.52, 0.03]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.5} />
      </mesh>
      {/* Chest accent light */}
      <mesh position={[0, 0.8, 0.23]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.7}
          roughness={0}
        />
      </mesh>
      {/* Torso panel lines */}
      {[-0.18, 0, 0.18].map((x, i) => (
        <mesh key={i} position={[x, 0.65, 0.2]}>
          <boxGeometry args={[0.02, 0.3, 0.02]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* ── Left arm ── */}
      <group ref={leftArmRef} position={[-0.48, 0.9, 0]}>
        <mesh position={[-0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.07, 0.44, 7]} />
          <meshStandardMaterial color={metalColor} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[-0.52, -0.1, 0]} rotation={[0.2, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.065, 0.06, 0.38, 7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.73, -0.2, 0]}>
          <boxGeometry args={[0.12, 0.14, 0.1]} />
          <meshStandardMaterial color={metalColor} roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* ── Right arm ── */}
      <group ref={rightArmRef} position={[0.48, 0.9, 0]}>
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.07, 0.44, 7]} />
          <meshStandardMaterial color={metalColor} roughness={0.25} metalness={0.85} />
        </mesh>
        <mesh position={[0.52, -0.1, 0]} rotation={[-0.2, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.065, 0.06, 0.38, 7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.73, -0.2, 0]}>
          <boxGeometry args={[0.12, 0.14, 0.1]} />
          <meshStandardMaterial color={metalColor} roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* ── Waist / hip connector ── */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.28, 0.18, 10]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  )
}
