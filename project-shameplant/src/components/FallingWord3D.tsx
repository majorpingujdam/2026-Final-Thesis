import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'
import { CommentCategory } from '../types'

// ─── Config ───────────────────────────────────────────────────────────────────

const FONT_URL  = '/fonts/helvetiker_bold.typeface.json'
const GRAVITY   = 1.2   // world-units / s²  — acceleration added to fall
const EXIT_X    = 8.5   // side exit threshold
const BOTTOM_Y  = -6.2  // floor exit threshold
const SPAWN_Y   = 7.5   // words enter from this Y

const CATEGORY_COLOR: Record<CommentCategory, string> = {
  positive: '#4ade80',
  neutral:  '#22d3ee',
  negative: '#fb923c',
  severe:   '#f43f5e',
}

const CATEGORY_EMISSIVE: Record<CommentCategory, number> = {
  positive: 0.45,
  neutral:  0.35,
  negative: 0.5,
  severe:   0.65,
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FallingWordProps {
  instanceId: string
  text: string
  category: CommentCategory
  spawnX: number
  fallSpeed: number  // current game speed in world-units/s
  onExit: (id: string, hitBottom: boolean) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FallingWord3D({
  instanceId, text, category, spawnX, fallSpeed, onExit,
}: FallingWordProps) {

  const groupRef  = useRef<THREE.Group>(null)
  const posRef    = useRef({ x: spawnX, y: SPAWN_Y })
  const velRef    = useRef({ x: 0, y: -fallSpeed })
  const rotZRef   = useRef((Math.random() - 0.5) * 0.3)
  const dragging  = useRef(false)
  const exited    = useRef(false)

  // Recent pointer positions for throw-velocity calculation
  const moves = useRef<Array<{ x: number; y: number; t: number }>>([])
  const lastPt = useRef({ x: 0, y: 0 })

  const { gl, camera, size } = useThree()

  // Screen-pixel → world-unit conversion factor
  const pxToWorld = useMemo(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      return vh / size.height
    }
    return 0.012
  }, [camera, size])

  const color    = CATEGORY_COLOR[category]
  const emissive = CATEGORY_EMISSIVE[category]

  // ── Physics loop ────────────────────────────────────────────────────────────

  useFrame((_, delta) => {
    if (!groupRef.current || exited.current) return

    if (!dragging.current) {
      velRef.current.y = Math.max(-10, velRef.current.y - GRAVITY * delta)
      velRef.current.x *= Math.pow(0.85, delta * 10) // horizontal damping
      posRef.current.x += velRef.current.x * delta
      posRef.current.y += velRef.current.y * delta
      rotZRef.current  += velRef.current.x * delta * 0.35
    }

    groupRef.current.position.x = posRef.current.x
    groupRef.current.position.y = posRef.current.y
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z, rotZRef.current, 0.12
    )

    if (exited.current) return
    const { x, y } = posRef.current
    if (Math.abs(x) > EXIT_X) {
      exited.current = true
      onExit(instanceId, false)
    } else if (y < BOTTOM_Y) {
      exited.current = true
      onExit(instanceId, true)
    }
  })

  // ── Drag & throw via canvas pointer events ──────────────────────────────────

  const handlePointerDown = (e: { stopPropagation: () => void; nativeEvent: PointerEvent }) => {
    e.stopPropagation()
    if (exited.current) return

    dragging.current = true
    velRef.current   = { x: 0, y: 0 }

    const { clientX, clientY } = e.nativeEvent
    lastPt.current = { x: clientX, y: clientY }
    moves.current  = [{ x: clientX, y: clientY, t: Date.now() }]

    const onMove = (ev: PointerEvent) => {
      if (!dragging.current) return
      const dx =  (ev.clientX - lastPt.current.x) * pxToWorld
      const dy = -(ev.clientY - lastPt.current.y) * pxToWorld
      posRef.current.x += dx
      posRef.current.y += dy
      lastPt.current    = { x: ev.clientX, y: ev.clientY }

      moves.current.push({ x: ev.clientX, y: ev.clientY, t: Date.now() })
      if (moves.current.length > 10) moves.current.shift()
    }

    const onUp = (ev: PointerEvent) => {
      dragging.current = false

      // Compute throw velocity from the last ~100 ms of movement
      const recent = moves.current.filter(m => Date.now() - m.t < 120)
      if (recent.length >= 2) {
        const first = recent[0]
        const last  = recent[recent.length - 1]
        const dt    = Math.max(0.016, (last.t - first.t) / 1000)
        const vx    = ((last.x - first.x) / dt) * pxToWorld * 1.5
        const vy    = -((last.y - first.y) / dt) * pxToWorld * 0.7
        velRef.current = { x: vx, y: vy - fallSpeed * 0.4 }
        rotZRef.current += vx * 0.15
      } else {
        // No real drag — just resume falling
        velRef.current = { x: 0, y: -fallSpeed }
      }
      moves.current = []

      gl.domElement.removeEventListener('pointermove', onMove)
      gl.domElement.removeEventListener('pointerup',   onUp)
    }

    gl.domElement.addEventListener('pointermove', onMove)
    gl.domElement.addEventListener('pointerup',   onUp)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <group ref={groupRef} position={[spawnX, SPAWN_Y, 0]}>
      <Center>
        <Text3D
          font={FONT_URL}
          size={0.44}
          height={0.22}       // extrusion depth
          curveSegments={2}   // LOW POLY — very angular curves
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.03}
          bevelSegments={1}   // sharp bevel edges = low poly
          onPointerDown={handlePointerDown as unknown as (e: THREE.Event) => void}
        >
          {text}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissive}
            roughness={0.25}
            metalness={0.5}
            flatShading       // ← the key low-poly look
          />
        </Text3D>
      </Center>

      {/* Glow halo ring behind the word */}
      <mesh position={[0, 0, -0.18]} rotation={[0, 0, 0]}>
        <planeGeometry args={[3.2, 0.7]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
