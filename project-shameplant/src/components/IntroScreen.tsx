import { motion } from 'framer-motion'

interface IntroScreenProps {
  onStart: () => void
}

const stagger = {
  hidden:  {},
  show:    { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 40% 55%, #12001f 0%, #05000a 65%, #000000 100%)',
    }}>
      {/* Pulsing neon rings */}
      {[180, 310, 460].map((d, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.05, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 3.5 + i, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: d, height: d, borderRadius: '50%',
            border: '1px solid rgba(167, 139, 250, 0.25)', pointerEvents: 'none',
          }}
        />
      ))}

      <motion.div
        variants={stagger} initial="hidden" animate="show"
        style={{
          maxWidth: 580, width: '92%', position: 'relative', zIndex: 1,
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(22px)',
          borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 0 80px rgba(124, 58, 237, 0.12)',
          padding: '44px 40px',
          textAlign: 'center',
        }}
      >
        <motion.div variants={fadeUp} style={{ fontSize: '3rem', marginBottom: 12 }}>🌿</motion.div>

        {/* Title */}
        <motion.h1 variants={fadeUp} style={{
          margin: '0 0 6px', fontSize: '2.4rem', fontWeight: 200,
          letterSpacing: '0.3em', color: '#a78bfa', textTransform: 'uppercase',
        }}>
          SHAMEPLANT
        </motion.h1>
        <motion.p variants={fadeUp} style={{
          margin: '0 0 30px', fontSize: '0.72rem',
          letterSpacing: '0.22em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
        }}>
          An interactive installation on cyberbullying
        </motion.p>

        {/* Content warning */}
        <motion.div variants={fadeUp} style={{
          margin: '0 0 24px', padding: '14px 18px',
          background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.28)',
          borderRadius: 10, textAlign: 'left',
        }}>
          <p style={{ margin: '0 0 5px', fontSize: '0.62rem', fontWeight: 700,
            color: '#ef4444', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            ⚠ Content Warning
          </p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.65 }}>
            This installation simulates real cyberbullying language including hate speech
            and harmful comments — for artistic and educational purposes only.
          </p>
        </motion.div>

        {/* Mechanic tiles */}
        <motion.div variants={fadeUp} style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 32,
        }}>
          {[
            { icon: '↓', color: '#4ade80', title: 'Let through',    desc: 'Positive words reach the plant' },
            { icon: '←→', color: '#60a5fa', title: 'Throw away',   desc: 'Drag & fling negative words off screen' },
            { icon: '!', color: '#ef4444', title: 'Avoid impact',   desc: "Don't let bad words hit the plant" },
          ].map(({ icon, color, title, desc }) => (
            <div key={title} style={{
              padding: '14px 12px',
              background: `${color}09`,
              border: `1px solid ${color}30`,
              borderRadius: 10, textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Extra hint */}
        <motion.p variants={fadeUp} style={{
          margin: '0 0 28px', fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.28)', lineHeight: 1.6,
        }}>
          Words fall faster over time. Protect your Mimosa — it closes its leaves
          when hurt, just like people do.
        </motion.p>

        <motion.button
          variants={fadeUp}
          onClick={onStart}
          whileHover={{ scale: 1.05, boxShadow: '0 0 36px rgba(167,139,250,0.45)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '14px 52px', fontSize: '0.95rem', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#0a0012',
            background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
            border: 'none', borderRadius: 50,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 0 24px rgba(124,58,237,0.35)',
          }}
        >
          START
        </motion.button>
      </motion.div>
    </div>
  )
}
