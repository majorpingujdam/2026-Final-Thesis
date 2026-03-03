import { motion } from 'framer-motion'
import { GameState } from '../types'

interface EndScreenProps {
  state: GameState
  onRestart: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}分${s.toString().padStart(2, '0')}秒`
}

function getOutcomeMessage(health: number, filtered: number, fed: number): {
  zh: string; en: string; color: string; icon: string
} {
  if (health <= 0) {
    return {
      zh: '植物已枯萎。网络暴力摧毁了最敏感的生命。',
      en: 'The plant has wilted. Online violence destroys even the most sensitive life.',
      color: '#ef4444',
      icon: '🥀',
    }
  }
  if (health > 80) {
    return {
      zh: '植物茁壮成长！你的守护让它充满活力。',
      en: 'The plant thrives! Your protection filled it with vitality.',
      color: '#4ade80',
      icon: '🌿',
    }
  }
  if (health > 50) {
    return {
      zh: '植物还活着，但伤痕累累。每一条评论都留下了痕迹。',
      en: 'The plant survives, but scarred. Every comment left its mark.',
      color: '#facc15',
      icon: '🌱',
    }
  }
  return {
    zh: '植物在挣扎。善意的关怀永远不嫌多。',
    en: 'The plant is struggling. Kindness is never enough.',
    color: '#f97316',
    icon: '🍂',
  }
}

export function EndScreen({ state, onRestart }: EndScreenProps) {
  const { health, commentsFiltered, commentsFed, commentsIgnored, sessionDuration } = state
  const outcome = getOutcomeMessage(health, commentsFiltered, commentsFed)
  const total = commentsFiltered + commentsFed + commentsIgnored

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 50%, #0d0010 0%, #060008 60%, #000000 100%)',
      zIndex: 100,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          maxWidth: 560,
          width: '90%',
          padding: '44px 40px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px)',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: `0 0 60px ${outcome.color}15`,
        }}
      >
        {/* Outcome icon + message */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '3rem', marginBottom: 16 }}
          >
            {outcome.icon}
          </motion.div>
          <h2 style={{
            margin: '0 0 12px',
            fontSize: '1.4rem',
            fontWeight: 300,
            letterSpacing: '0.12em',
            color: outcome.color,
          }}>
            {outcome.zh}
          </h2>
          <p style={{
            margin: 0,
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}>
            {outcome.en}
          </p>
        </div>

        {/* Final health bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              最终生命值
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: outcome.color }}>
              {Math.round(health)}%
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${health}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${outcome.color}80, ${outcome.color})`,
                boxShadow: `0 0 10px ${outcome.color}60`,
                borderRadius: 4,
              }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 32,
        }}>
          {[
            { label: '坚持时长', value: formatTime(sessionDuration), color: 'rgba(255,255,255,0.6)' },
            { label: '总评论数', value: total, color: 'rgba(255,255,255,0.6)' },
            { label: '喂养次数', value: commentsFed, color: '#4ade80', sub: '正向评论接受' },
            { label: '过滤次数', value: commentsFiltered, color: '#60a5fa', sub: '负向评论屏蔽' },
            { label: '植物受击', value: commentsIgnored, color: '#ef4444', sub: '未处理的伤害' },
            {
              label: '保护率',
              value: total > 0
                ? `${Math.round(((commentsFed + commentsFiltered) / total) * 100)}%`
                : '—',
              color: '#a78bfa',
            },
          ].map(({ label, value, color, sub }) => (
            <div key={label} style={{
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color, lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.06em' }}>
                {label}
              </div>
              {sub && (
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>
                  {sub}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reflection note */}
        <div style={{
          padding: '14px 18px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 10,
          marginBottom: 28,
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}>
            "网络暴力不只是文字。它像含羞草一样，
            让人慢慢地、无声地合拢。"
          </p>
          <p style={{
            margin: '6px 0 0',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.2)',
          }}>
            "Cyberbullying isn't just words. Like a Mimosa,
            it makes people slowly, silently close."
          </p>
        </div>

        {/* Restart button */}
        <div style={{ textAlign: 'center' }}>
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(255,255,255,0.12)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '12px 40px',
              fontSize: '0.9rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.8)',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 50,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            再来一次 · Play Again
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
