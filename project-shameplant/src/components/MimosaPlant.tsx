import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MimosaPlantProps {
  health: number // 0–100
}

interface BranchConfig {
  height: number
  angle: number    // rotation around Z axis (radians)
  length: number
  leafCount: number
}

// ─── Branch configurations ────────────────────────────────────────────────────

const BRANCHES: BranchConfig[] = [
  { height: 0.25, angle:  0.8,  length: 0.65, leafCount: 7 },
  { height: 0.55, angle: -0.75, length: 0.75, leafCount: 8 },
  { height: 0.85, angle:  0.9,  length: 0.80, leafCount: 9 },
  { height: 1.15, angle: -0.85, length: 0.78, leafCount: 8 },
  { height: 1.40, angle:  0.70, length: 0.68, leafCount: 7 },
  { height: 1.60, angle: -0.65, length: 0.55, leafCount: 6 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function healthToLeafColor(health: number): THREE.Color {
  if (health > 70) return new THREE.Color('#22c55e')
  if (health > 40) return new THREE.Color('#86efac')
  if (health > 20) return new THREE.Color('#bbf7d0')
  return new THREE.Color('#d4d4aa') // desaturated / yellowed
}

function healthToFoldAngle(health: number): number {
  // Maps health [0,100] → fold angle [π/2 = closed, 0 = open]
  if (health >= 70) return 0
  if (health >= 40) return THREE.MathUtils.mapLinear(health, 70, 40, 0, Math.PI / 4)
  if (health >= 10) return THREE.MathUtils.mapLinear(health, 40, 10, Math.PI / 4, Math.PI / 2)
  return Math.PI / 2
}

// ─── Leaflet ──────────────────────────────────────────────────────────────────

interface LeafletProps {
  color: THREE.Color
  opacity: number
  emissiveIntensity: number
}

function Leaflet({ color, opacity, emissiveIntensity }: LeafletProps) {
  return (
    <mesh scale={[0.045, 0.13, 1]}>
      <circleGeometry args={[1, 7]} />
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={opacity}
        roughness={0.4}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Branch ───────────────────────────────────────────────────────────────────

interface BranchProps extends BranchConfig {
  health: number
  branchIndex: number
}

function Branch({ height, angle, length, leafCount, health, branchIndex }: BranchProps) {
  const leafPairRefs = useRef<(THREE.Group | null)[]>([])
  const branchGroupRef = useRef<THREE.Group>(null)

  const targetFold = useMemo(() => healthToFoldAngle(health), [health])
  const leafColor  = useMemo(() => healthToLeafColor(health), [health])
  const leafOpacity = health > 40 ? 1 : health > 20 ? 0.7 : 0.45
  const emissive    = health > 60 ? 0.25 : health > 30 ? 0.1 : 0.0

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Animate leaf pairs folding toward targetFold
    leafPairRefs.current.forEach((pair, i) => {
      if (!pair) return
      const side = i % 2 === 0 ? 1 : -1
      const target = targetFold * side

      pair.rotation.z = THREE.MathUtils.lerp(pair.rotation.z, target, 0.04)

      // Trembling at low health
      if (health < 30) {
        const trembleAmt = (1 - health / 30) * 0.08
        pair.rotation.z += Math.sin(t * 14 + branchIndex * 1.3 + i * 0.7) * trembleAmt
      }
    })

    // Slight branch droop at low health
    if (branchGroupRef.current) {
      const droop = health < 40
        ? -THREE.MathUtils.mapLinear(health, 40, 0, 0, 0.35)
        : 0
      const baseAngle = angle + droop
      branchGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        branchGroupRef.current.rotation.z, baseAngle, 0.02
      )
    }
  })

  const leafPositions = useMemo(() =>
    Array.from({ length: leafCount }, (_, i) => (i + 0.5) / leafCount * length),
    [leafCount, length]
  )

  return (
    <group ref={branchGroupRef} position={[0, height, 0]} rotation={[0, 0, angle]}>
      {/* Branch stem */}
      <mesh position={[length / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.022, length, 5]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.85} />
      </mesh>

      {/* Leaf pairs along branch axis */}
      {leafPositions.map((xPos, i) =>
        [0, 1].map((side) => {
          const s = side === 0 ? 1 : -1
          const refIndex = i * 2 + side
          return (
            <group
              key={`${i}-${side}`}
              position={[xPos, 0, 0]}
              ref={(el: THREE.Group | null) => {
                leafPairRefs.current[refIndex] = el
              }}
            >
              {/* Pivot at base; leaflet offset from pivot */}
              <group position={[0, s * 0.055, 0]}>
                <Leaflet
                  color={leafColor}
                  opacity={leafOpacity}
                  emissiveIntensity={emissive}
                />
              </group>
            </group>
          )
        })
      )}
    </group>
  )
}

// ─── Main plant ───────────────────────────────────────────────────────────────

export function MimosaPlant({ health }: MimosaPlantProps) {
  const rootRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!rootRef.current) return
    const t = state.clock.getElapsedTime()

    // Gentle whole-plant sway
    const swayAmt = health > 60 ? 0.045 : health > 30 ? 0.02 : 0.008
    rootRef.current.rotation.z = Math.sin(t * 0.65) * swayAmt

    // Progressive forward droop as health declines
    const droop = health < 30
      ? THREE.MathUtils.mapLinear(health, 30, 0, 0, -0.25)
      : 0
    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, droop, 0.01)
  })

  const sparkCount  = Math.round(health / 8)
  const sparkColor  = health > 60 ? '#4ade80' : health > 30 ? '#86efac' : '#d4d4aa'
  const sparkSpeed  = health > 50 ? 0.4 : 0.15

  return (
    <group ref={rootRef} position={[0, -1.6, 0]}>
      {/* ── Ceramic pot ── */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.26, 0.42, 16]} />
        <meshStandardMaterial color="#8b5e3c" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.32, 0.03, 8, 24]} />
        <meshStandardMaterial color="#7c4f2f" roughness={0.9} />
      </mesh>
      {/* Soil surface */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.04, 16]} />
        <meshStandardMaterial color="#2d1b0e" roughness={1} />
      </mesh>

      {/* ── Main stem ── */}
      <mesh position={[0.03, 1.1, 0]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.038, 0.058, 1.8, 8]} />
        <meshStandardMaterial color="#4a7c3f" roughness={0.75} />
      </mesh>

      {/* ── Branches & leaves ── */}
      {BRANCHES.map((cfg, i) => (
        <Branch key={i} {...cfg} health={health} branchIndex={i} />
      ))}

      {/* ── Bioluminescent sparkles (alive plant glow) ── */}
      {health > 15 && (
        <Sparkles
          count={sparkCount * 6}
          scale={[1.8, 2.5, 1.8]}
          size={1.2}
          speed={sparkSpeed}
          color={sparkColor}
          opacity={health > 50 ? 0.65 : 0.3}
          noise={0.5}
        />
      )}
    </group>
  )
}
