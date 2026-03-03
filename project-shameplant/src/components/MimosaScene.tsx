import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { MimosaPlant } from './MimosaPlant'
import { RoboticBody } from './RoboticBody'

interface MimosaSceneProps {
  health: number
  stress: number
}

// ─── Ground plane ─────────────────────────────────────────────────────────────

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

// ─── Ambient particle field ───────────────────────────────────────────────────

function AtmosphericLight({ health }: { health: number }) {
  const intensity = THREE.MathUtils.mapLinear(health, 0, 100, 0.1, 0.5)
  const color = health > 60 ? '#1a4a1a' : health > 30 ? '#2a3a10' : '#2a1010'
  return <pointLight position={[0, 2, 2]} intensity={intensity} color={color} distance={8} />
}

// ─── Scene content ────────────────────────────────────────────────────────────

function SceneContent({ health, stress }: MimosaSceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#1a1a2e" />
      <directionalLight
        position={[3, 5, 2]}
        intensity={0.8}
        color="#e8d5b7"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-2, 3, -1]} intensity={0.2} color="#4060ff" />
      <AtmosphericLight health={health} />

      {/* Plant glow light */}
      <pointLight
        position={[0, -0.5, 0.8]}
        intensity={health > 50 ? 0.4 : 0.1}
        color="#22c55e"
        distance={4}
      />

      {/* Environment */}
      <fog attach="fog" args={['#080010', 8, 20]} />
      <Ground />

      <ContactShadows
        position={[0, -2.04, 0]}
        opacity={0.5}
        scale={5}
        blur={2}
        far={3}
        color="#000000"
      />

      {/* ── Robotic body (guardian) ── */}
      <group position={[0.1, 0.15, 0]}>
        <RoboticBody health={health} stress={stress} />
      </group>

      {/* ── Mimosa plant (protected) ── */}
      <group position={[-0.15, 0, 0.3]}>
        <MimosaPlant health={health} />
      </group>

      {/* Subtle orbit control for desktop testing (disable touch pan) */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={health < 15}
        autoRotateSpeed={0.5}
        target={[0, 0.2, 0]}
      />
    </>
  )
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────

export function MimosaScene({ health, stress }: MimosaSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4.5], fov: 45, near: 0.1, far: 50 }}
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <SceneContent health={health} stress={stress} />
      </Suspense>
    </Canvas>
  )
}
