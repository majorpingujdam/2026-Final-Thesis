import { motion } from 'framer-motion'

interface IntroScreenProps {
  onStart: () => void
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 40% 60%, #1a0a0a 0%, #08000f 60%, #000000 100%)',
      zIndex: 100,
    }}>
      {/* Atmospheric background rings */}
      {[200, 340, 480].map((size, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.04, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            border: '1px solid rgba(74, 222, 128, 0.15)',
            pointerEvents: 'none',
          }}
        />
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          maxWidth: 620,
          width: '90%',
          textAlign: 'center',
          padding: '48px 40px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 0 60px rgba(74, 222, 128, 0.08)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Plant icon */}
        <motion.div variants={item} style={{ marginBottom: 20 }}>
          <span style={{ fontSize: '3.5rem' }}>🌿</span>
        </motion.div>

        {/* Title */}
        <motion.h1 variants={item} style={{
          margin: '0 0 8px',
          fontSize: '2.2rem',
          fontWeight: 300,
          letterSpacing: '0.2em',
          color: '#4ade80',
          textTransform: 'uppercase',
        }}>
          羞耻花园
        </motion.h1>
        <motion.p variants={item} style={{
          margin: '0 0 28px',
          fontSize: '0.85rem',
          letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
        }}>
          Project Shameplant
        </motion.p>

        {/* Content warning */}
        <motion.div variants={item} style={{
          margin: '0 0 24px',
          padding: '14px 20px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 10,
          textAlign: 'left',
        }}>
          <p style={{
            margin: '0 0 6px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#ef4444',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            ⚠ 内容警告 · Content Warning
          </p>
          <p style={{
            margin: 0,
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.6,
          }}>
            本装置包含模拟网络霸凌内容，包括仇恨性言论和有害评论，
            仅供艺术与教育目的使用。
          </p>
          <p style={{
            margin: '8px 0 0',
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.5,
          }}>
            This installation contains simulated cyberbullying content including
            hateful language and harmful comments, for artistic and educational purposes only.
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={item} style={{ marginBottom: 32, textAlign: 'left' }}>
          <p style={{
            margin: '0 0 12px',
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            互动方式
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '→', color: '#4ade80', text: '向右滑动正向评论 · 给植物喂食正能量' },
              { icon: '←', color: '#60a5fa', text: '向左滑动负向评论 · 过滤有害内容' },
              { icon: '!', color: '#ef4444', text: '忽略负向评论 · 植物将受到伤害' },
            ].map(({ icon, color, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: `${color}20`,
                  border: `1px solid ${color}60`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  color,
                  flexShrink: 0,
                  fontWeight: 700,
                }}>
                  {icon}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Start button */}
        <motion.button
          variants={item}
          onClick={onStart}
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(74, 222, 128, 0.4)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '14px 48px',
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#000',
            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
            border: 'none',
            borderRadius: 50,
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(74, 222, 128, 0.25)',
            fontFamily: 'inherit',
          }}
        >
          开始 · Start
        </motion.button>
      </motion.div>
    </div>
  )
}
