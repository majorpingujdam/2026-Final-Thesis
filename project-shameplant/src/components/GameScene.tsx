import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import * as THREE from 'three'
import { MimosaPlant } from './MimosaPlant'
import { RoboticBody } from './RoboticBody'
import { FallingWord3D } from './FallingWord3D'
import { ActiveWordData } from '../hooks/useWordGame'

const FONT_URL = '/fonts/helvetiker_bold.typeface.json'

// ─── Font preloader (warms the cache inside Suspense) ────────────────────────
function FontPreloader() {
  useLoader(FontLoader, FONT_URL)
  return null
}

// ─── Pinball side walls ───────────────────────────────────────────────────────

function Wall({ x }: { x: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.35 + Math.sin(s.clock.elapsedTime * 1.4 + x) * 0.15
  })
  return (
    <mesh ref={meshRef} position={[x, 0, -0.3]}>
      <boxGeometry args={[0.22, 16, 0.5]} />
      <meshStandardMaterial
        color="#0f172a"
        roughness={0.1}
        metalness={0.95}
        emissive="#1d4ed8"
        emissiveIntensity={0.35}
      />
    </mesh>
  )
}

// ─── Neon edge strip ──────────────────────────────────────────────────────────

function NeonStrip({ x, color }: { x: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.7 + Math.sin(s.clock.elapsedTime * 2 + x) * 0.3
  })
  return (
    <mesh ref={meshRef} position={[x, 0, 0]}>
      <boxGeometry args={[0.04, 15, 0.04]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        roughness={0}
        metalness={0}
      />
    </mesh>
  )
}

// ─── Bumper (decorative) ──────────────────────────────────────────────────────

function Bumper({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.5 + Math.abs(Math.sin(s.clock.elapsedTime * 3)) * 0.5
  })
  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.35, 0.35, 0.2, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

// ─── Top arch ─────────────────────────────────────────────────────────────────

function TopArch() {
  return (
    <group position={[0, 7.2, -0.4]}>
      <mesh>
        <boxGeometry args={[16.5, 0.18, 0.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.95}
          emissive="#7c3aed" emissiveIntensity={0.5} />
      </mesh>
      {/* Center logo text - just a glowing bar */}
      <mesh position={[0, 0, 0.3]}>
        <boxGeometry args={[5, 0.06, 0.02]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

// ─── Floor ────────────────────────────────────────────────────────────────────

function Floor() {
  return (
    <>
      <mesh position={[0, -6.5, -0.6]}>
        <boxGeometry args={[16.5, 0.18, 0.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9}
          emissive="#1d4ed8" emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.4, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#020006" roughness={0.9} metalness={0.1} />
      </mesh>
    </>
  )
}

// ─── Plant health light ───────────────────────────────────────────────────────

function PlantLight({ health }: { health: number }) {
  const lightRef = useRef<THREE.PointLight>(null)
  useFrame((s) => {
    if (!lightRef.current) return
    const pulse = 0.8 + Math.sin(s.clock.elapsedTime * 2) * 0.2
    lightRef.current.intensity = (health / 100) * 1.2 * pulse
  })
  return (
    <pointLight
      ref={lightRef}
      position={[-1.5, -3.5, 2]}
      color="#22c55e"
      intensity={1}
      distance={7}
    />
  )
}

// ─── Scene interior ───────────────────────────────────────────────────────────

interface SceneProps {
  health: number
  stress: number
  words: ActiveWordData[]
  fallSpeed: number
  onWordExit: (id: string, hitBottom: boolean) => void
}

function SceneContent({ health, stress, words, fallSpeed, onWordExit }: SceneProps) {
  return (
    <>
      {/* Font warm-up */}
      <FontPreloader />

      {/* Lighting */}
      <ambientLight intensity={0.15} color="#0a0015" />
      <directionalLight position={[2, 8, 5]} intensity={1.0} color="#e8d5ff" castShadow />
      <pointLight position={[0, 5, 4]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-6, 0, 3]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[ 6, 0, 3]} intensity={0.4} color="#8b5cf6" />
      <PlantLight health={health} />

      {/* Pinball frame */}
      <Wall x={-7.8} />
      <Wall x={ 7.8} />
      <NeonStrip x={-7.55} color="#3b82f6" />
      <NeonStrip x={ 7.55} color="#8b5cf6" />
      <TopArch />
      <Floor />

      {/* Decorative bumpers at the sides */}
      <Bumper position={[-5.5, -4.2, 0]} color="#f43f5e" />
      <Bumper position={[ 5.5, -4.2, 0]} color="#f43f5e" />
      <Bumper position={[-6.2, -2.5, 0]} color="#fb923c" />
      <Bumper position={[ 6.2, -2.5, 0]} color="#fb923c" />

      {/* Ground contact shadow */}
      <ContactShadows
        position={[0, -6.35, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={2}
        color="#000000"
      />

      {/* Plant + Robot at bottom-center */}
      <group position={[-1.5, -2.8, 0]}>
        <MimosaPlant health={health} />
      </group>
      <group position={[1.2, -2.2, 0]} scale={[0.85, 0.85, 0.85]}>
        <RoboticBody health={health} stress={stress} />
      </group>

      {/* Falling words */}
      {words.map(w => (
        <Suspense key={w.instanceId} fallback={null}>
          <FallingWord3D
            instanceId={w.instanceId}
            text={w.text}
            category={w.category}
            spawnX={w.spawnX}
            fallSpeed={fallSpeed}
            onExit={onWordExit}
          />
        </Suspense>
      ))}
    </>
  )
}

// ─── Exported canvas ─────────────────────────────────────────────────────────

interface GameSceneProps {
  health: number
  stress: number
  words: ActiveWordData[]
  fallSpeed: number
  onWordExit: (id: string, hitBottom: boolean) => void
}

export function GameScene({ health, stress, words, fallSpeed, onWordExit }: GameSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 52, near: 0.1, far: 100 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#050008']} />
      <Suspense fallback={null}>
        <SceneContent
          health={health}
          stress={stress}
          words={words}
          fallSpeed={fallSpeed}
          onWordExit={onWordExit}
        />
      </Suspense>
    </Canvas>
  )
}
