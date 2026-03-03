import { useRef, useState } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { ActiveComment, CommentCategory } from '../types'

interface CommentCardProps {
  comment: ActiveComment
  onSwipeRight: () => void
  onSwipeLeft: () => void
}

// ─── Styling helpers ──────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<CommentCategory, {
  border: string
  bg: string
  glow: string
  label: string
  labelColor: string
}> = {
  positive: {
    border: 'rgba(74, 222, 128, 0.7)',
    bg: 'rgba(74, 222, 128, 0.08)',
    glow: 'rgba(74, 222, 128, 0.3)',
    label: '正向',
    labelColor: '#4ade80',
  },
  neutral: {
    border: 'rgba(148, 163, 184, 0.5)',
    bg: 'rgba(148, 163, 184, 0.06)',
    glow: 'rgba(148, 163, 184, 0.15)',
    label: '中立',
    labelColor: '#94a3b8',
  },
  negative: {
    border: 'rgba(239, 68, 68, 0.7)',
    bg: 'rgba(239, 68, 68, 0.1)',
    glow: 'rgba(239, 68, 68, 0.3)',
    label: '负向',
    labelColor: '#ef4444',
  },
  severe: {
    border: 'rgba(220, 38, 38, 0.9)',
    bg: 'rgba(220, 38, 38, 0.15)',
    glow: 'rgba(220, 38, 38, 0.5)',
    label: '严重',
    labelColor: '#dc2626',
  },
}

// ─── Swipe hint overlay ───────────────────────────────────────────────────────

function SwipeHint({ direction, opacity }: { direction: 'left' | 'right'; opacity: number }) {
  const isRight = direction === 'right'
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isRight ? 'flex-start' : 'flex-end',
        padding: '0 16px',
        background: isRight
          ? `rgba(74, 222, 128, ${opacity * 0.25})`
          : `rgba(239, 68, 68, ${opacity * 0.25})`,
        pointerEvents: 'none',
      }}
    >
      <span style={{
        fontSize: '1.4rem',
        fontWeight: 700,
        color: isRight ? '#4ade80' : '#ef4444',
        opacity: Math.min(1, opacity * 1.5),
      }}>
        {isRight ? '✓ 喂养' : '✗ 过滤'}
      </span>
    </div>
  )
}

// ─── Comment card ─────────────────────────────────────────────────────────────

export function CommentCard({ comment, onSwipeRight, onSwipeLeft }: CommentCardProps) {
  const [dismissed, setDismissed] = useState(false)
  const [dragX, setDragX] = useState(0)
  const isDragging = useRef(false)
  const styles = CATEGORY_STYLES[comment.category]

  const handleDragStart = () => {
    isDragging.current = true
  }

  const handleDrag = (_: unknown, info: PanInfo) => {
    setDragX(info.offset.x)
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    isDragging.current = false
    setDragX(0)
    const absOffset = Math.abs(info.offset.x)
    const absVel    = Math.abs(info.velocity.x)

    if (absOffset > 90 || absVel > 400) {
      setDismissed(true)
      if (info.offset.x > 0) {
        onSwipeRight()
      } else {
        onSwipeLeft()
      }
    }
  }

  // Determine hint opacity from drag distance
  const hintOpacity = Math.min(1, Math.abs(dragX) / 80)
  const hintDirection = dragX >= 0 ? 'right' : 'left'

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -250, right: 250 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={dismissed
        ? { opacity: 0, scale: 0.85, x: dragX > 0 ? 300 : -300 }
        : { opacity: 1, scale: 1 }
      }
      transition={dismissed ? { duration: 0.25 } : { type: 'spring', stiffness: 300, damping: 30 }}
      whileTap={{ scale: 0.97 }}
      style={{
        position: 'relative',
        padding: '14px 18px',
        borderRadius: 12,
        border: `1px solid ${styles.border}`,
        background: styles.bg,
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 18px ${styles.glow}, inset 0 1px 0 rgba(255,255,255,0.07)`,
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        WebkitUserSelect: 'none',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      {/* Swipe hints */}
      {Math.abs(dragX) > 15 && (
        <SwipeHint direction={hintDirection} opacity={hintOpacity} />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Category tag */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: styles.labelColor,
            textTransform: 'uppercase',
          }}>
            {styles.label}
          </span>
          <span style={{
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.25)',
          }}>
            {comment.language === 'zh' ? '中文' : 'EN'}
          </span>
        </div>

        {/* Comment text */}
        <p style={{
          margin: 0,
          color: 'rgba(255,255,255,0.92)',
          fontSize: '1rem',
          lineHeight: 1.55,
          fontWeight: 400,
          letterSpacing: comment.language === 'zh' ? '0.04em' : '0.01em',
        }}>
          {comment.text}
        </p>

        {/* Swipe instruction hint (very subtle) */}
        <p style={{
          margin: '8px 0 0',
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'right',
        }}>
          ← 过滤 · 喂养 →
        </p>
      </div>
    </motion.div>
  )
}
