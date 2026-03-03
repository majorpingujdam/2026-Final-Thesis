import { motion } from 'framer-motion'
import { GameState } from '../types'
import { calcScore } from '../hooks/useGameState'

interface EndScreenProps {
  state: GameState
  onRestart: () => void
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}m ${sec.toString().padStart(2, '0')}s`
}

// Design: =0 🥀 Somber, 1–50 🍂 Reflective, 51–80 🌱 Cautiously hopeful, >80 🌿 Celebratory
function getOutcome(health: number) {
  if (health <= 0)  return { icon: '🥀', color: '#ef4444', title: 'The plant has wilted.',
    body: 'The weight of unfiltered cruelty was too much. Online violence destroys even the most resilient life.' }
  if (health > 80)  return { icon: '🌿', color: '#4ade80', title: 'The plant thrives!',
    body: 'Your protection made all the difference. Kindness is a shield that actually works.' }
  if (health > 50)  return { icon: '🌱', color: '#facc15', title: 'The plant survived — barely.',
    body: 'Scarred but standing. Every negative word that slipped through left its mark.' }
  return { icon: '🍂', color: '#f97316', title: 'The plant is struggling.',
    body: 'There\'s always more harmful content than we expect. Vigilance matters.' }
}

export function EndScreen({ state, onRestart }: EndScreenProps) {
  const { health, commentsFiltered, commentsFed, commentsIgnored, sessionDuration } = state
  const outcome  = getOutcome(health)
  const total    = commentsFed + commentsFiltered + commentsIgnored
  const score    = calcScore(state)
  const accuracy = total > 0
    ? Math.round(((commentsFed + commentsFiltered) / total) * 100)
    : 0

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: 540, width: '92%',
          background: 'rgba(10, 0, 20, 0.95)',
          backdropFilter: 'blur(24px)',
          borderRadius: 22,
          border: `1px solid ${outcome.color}30`,
          boxShadow: `0 0 60px ${outcome.color}15`,
          padding: '40px 36px',
          textAlign: 'center',
        }}
      >
        {/* Outcome */}
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <span style={{ fontSize: '3rem' }}>{outcome.icon}</span>
        </motion.div>

        <h2 style={{ margin: '14px 0 8px', fontSize: '1.4rem', fontWeight: 300,
          letterSpacing: '0.06em', color: outcome.color }}>
          {outcome.title}
        </h2>
        <p style={{ margin: '0 0 28px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.38)',
          lineHeight: 1.7, fontStyle: 'italic' }}>
          {outcome.body}
        </p>

        {/* Score */}
        <div style={{ margin: '0 0 24px' }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#facc15',
            letterSpacing: '-0.02em', lineHeight: 1 }}>
            {score.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>
            Final Score
          </div>
        </div>

        {/* Health bar */}
        <div style={{ margin: '0 0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em', textTransform: 'uppercase' }}>Final Plant Health</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: outcome.color }}>
              {Math.round(health)}%
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${health}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              style={{
                height: '100%', borderRadius: 4,
                background: `linear-gradient(90deg, ${outcome.color}60, ${outcome.color})`,
                boxShadow: `0 0 10px ${outcome.color}60`,
              }}
            />
          </div>
        </div>

        {/* Stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
          {[
            { label: 'Time Survived',   value: formatTime(sessionDuration), color: 'rgba(255,255,255,0.55)' },
            { label: 'Words Fed',        value: commentsFed,      color: '#4ade80' },
            { label: 'Words Blocked',    value: commentsFiltered, color: '#60a5fa' },
            { label: 'Plant Hits',       value: commentsIgnored,  color: '#ef4444' },
            { label: 'Total Words',      value: total,            color: 'rgba(255,255,255,0.4)' },
            { label: 'Protection Rate',  value: `${accuracy}%`,  color: '#a78bfa' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              padding: '12px 10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.57rem', color: 'rgba(255,255,255,0.28)',
                marginTop: 4, letterSpacing: '0.06em', lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Reflection */}
        <div style={{
          padding: '14px 18px', marginBottom: 28,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 10,
        }}>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.7, fontStyle: 'italic' }}>
            "Like a Mimosa pudica, people close themselves when hurt —
            slowly, silently, to protect what little remains."
          </p>
        </div>

        {/* Restart */}
        <motion.button
          onClick={onRestart}
          whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(255,255,255,0.12)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '12px 40px', fontSize: '0.85rem', fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 50, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Play Again
        </motion.button>
      </motion.div>
    </div>
  )
}
