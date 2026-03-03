import { motion } from 'framer-motion'

interface HUDProps {
  health: number
  stress: number
  score: number
  level: number
  wordsCaught: number
  wordsFiltered: number
  wordsHit: number
  elapsedSeconds: number
  onEnd: () => void
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function getHealthColor(h: number) {
  if (h > 65) return '#4ade80'
  if (h > 35) return '#facc15'
  if (h > 15) return '#f97316'
  return '#ef4444'
}

export function HUD({
  health, stress, score, level,
  wordsCaught, wordsFiltered, wordsHit,
  elapsedSeconds, onEnd,
}: HUDProps) {
  const hc = getHealthColor(health)

  return (
    <div style={{
      position: 'fixed', inset: 0,
      pointerEvents: 'none',
      zIndex: 20,
      fontFamily: '"Inter", system-ui, sans-serif',
    }}>

      {/* ── TOP LEFT — Health ── */}
      <div style={{
        position: 'absolute', top: 18, left: 20,
        display: 'flex', flexDirection: 'column', gap: 8,
        background: 'rgba(5, 0, 10, 0.7)',
        backdropFilter: 'blur(12px)',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.07)',
        minWidth: 200,
      }}>
        {/* Plant health */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: '0.62rem', color: hc, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
              Plant Health
            </span>
            <span style={{ fontSize: '0.72rem', color: hc, fontWeight: 700 }}>
              {Math.round(health)}%
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${health}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                height: '100%', borderRadius: 4,
                background: `linear-gradient(90deg, ${hc}80, ${hc})`,
                boxShadow: `0 0 8px ${hc}80`,
              }}
            />
          </div>
        </div>

        {/* Stress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.58rem', color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Stress
            </span>
            <span style={{ fontSize: '0.65rem', color: '#a78bfa80' }}>
              {Math.round(stress)}%
            </span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${stress}%` }}
              transition={{ duration: 0.4 }}
              style={{
                height: '100%', borderRadius: 2,
                background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── TOP CENTER — Speed Level ── */}
      <div style={{
        position: 'absolute', top: 18, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(5, 0, 10, 0.7)',
        backdropFilter: 'blur(12px)',
        padding: '8px 20px',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Speed
        </span>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{
            width: 7, height: 14,
            borderRadius: 2,
            background: i < level
              ? (i < 4 ? '#4ade80' : i < 7 ? '#facc15' : '#ef4444')
              : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }} />
        ))}
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>
          Lv {level}
        </span>
      </div>

      {/* ── TOP RIGHT — Score & Timer ── */}
      <div style={{
        position: 'absolute', top: 18, right: 20,
        textAlign: 'right',
        background: 'rgba(5, 0, 10, 0.7)',
        backdropFilter: 'blur(12px)',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#facc15', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {score.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>
          Score
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
          {formatTime(elapsedSeconds)}
        </div>
      </div>

      {/* ── BOTTOM CENTER — Stats ── */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 20, alignItems: 'center',
        background: 'rgba(5, 0, 10, 0.72)',
        backdropFilter: 'blur(12px)',
        padding: '10px 24px',
        borderRadius: 50,
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        {[
          { v: wordsCaught,   label: 'FED',      color: '#4ade80' },
          { v: wordsFiltered, label: 'BLOCKED',   color: '#60a5fa' },
          { v: wordsHit,      label: 'HIT PLANT', color: '#f43f5e' },
        ].map(({ v, label, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color, lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Bottom right — End button (pointer-events re-enabled) ── */}
      <button
        style={{ pointerEvents: 'auto' }}
        onClick={onEnd}
      >
        <div style={{
          position: 'fixed', bottom: 20, right: 20,
          padding: '8px 20px',
          fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          background: 'rgba(5, 0, 10, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, cursor: 'pointer',
        }}>
          End Session
        </div>
      </button>

      {/* ── Low health warning pulse ── */}
      {health < 20 && (
        <motion.div
          animate={{ opacity: [0, 0.18, 0] }}
          transition={{ duration: 1.0, repeat: Infinity }}
          style={{
            position: 'absolute', inset: 0,
            background: '#ef4444',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
