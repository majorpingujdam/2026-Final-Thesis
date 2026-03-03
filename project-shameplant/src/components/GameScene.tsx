import { Suspense } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import * as THREE from 'three'
import { FallingWord3D } from './FallingWord3D'
import { ActiveWordData } from '../hooks/useWordGame'

const FONT_URL = '/fonts/helvetiker_bold.typeface.json'

// ─── Font preloader (warms the cache inside Suspense) ────────────────────────
function FontPreloader() {
  useLoader(FontLoader, FONT_URL)
  return null
}

// ─── Scene interior ───────────────────────────────────────────────────────────

interface SceneProps {
  words: ActiveWordData[]
  fallSpeed: number
  onWordExit: (id: string, hitBottom: boolean) => void
}

function SceneContent({ words, fallSpeed, onWordExit }: SceneProps) {
  return (
    <>
      {/* Font warm-up */}
      <FontPreloader />

      {/* Lighting */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[2, 8, 5]} intensity={0.5} color="#ffffff" />

      {/* Falling words */}
      {words.map(w => (
        <Suspense key={w.instanceId} fallback={null}>
          <FallingWord3D
            instanceId={w.instanceId}
            text={w.text}
            category={w.category}
            severity={w.severity}
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
  words: ActiveWordData[]
  fallSpeed: number
  onWordExit: (id: string, hitBottom: boolean) => void
}

export function GameScene({ words, fallSpeed, onWordExit }: GameSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 52, near: 0.1, far: 100 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#ffffff']} />
      <Suspense fallback={null}>
        <SceneContent
          words={words}
          fallSpeed={fallSpeed}
          onWordExit={onWordExit}
        />
      </Suspense>
    </Canvas>
  )
}
