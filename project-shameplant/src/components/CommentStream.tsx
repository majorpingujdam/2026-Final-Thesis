import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Comment, ActiveComment } from '../types'
import { CommentCard } from './CommentCard'

// ─── Constants ────────────────────────────────────────────────────────────────

const SPAWN_INTERVAL_MS   = 2200   // how often a new comment appears
const COMMENT_LIFETIME_MS = 11000  // auto-expire time for ignored comments
const SCROLL_SPEED_PX_S   = 48    // pixels per second upward movement
const TICK_INTERVAL_MS    = 50    // position update rate (~20fps for positions)
const MAX_VISIBLE          = 6     // cap simultaneous cards on screen

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommentStreamProps {
  comments: Comment[]
  isPlaying: boolean
  containerHeight: number
  onFeed: (severity: number) => void
  onFilter: (severity: number) => void
  onIgnored: (severity: number) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CommentStream({
  comments,
  isPlaying,
  containerHeight,
  onFeed,
  onFilter,
  onIgnored,
}: CommentStreamProps) {
  const [activeComments, setActiveComments] = useState<ActiveComment[]>([])
  const commentIndexRef = useRef(0)
  const dismissedSet = useRef<Set<string>>(new Set())

  // ── Spawn new comments ────────────────────────────────────────────────────

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      if (activeComments.length >= MAX_VISIBLE) return

      const comment = comments[commentIndexRef.current % comments.length]
      commentIndexRef.current++

      const active: ActiveComment = {
        ...comment,
        instanceId: `${comment.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        yOffset: -130, // start just below the container bottom
        xPosition: 30 + Math.random() * 40, // % — visible range 30–70%
        spawnTime: Date.now(),
      }
      setActiveComments(prev => [...prev, active])
    }, SPAWN_INTERVAL_MS)

    return () => clearInterval(id)
  }, [isPlaying, comments, activeComments.length])

  // ── Scroll comments upward + auto-expire ──────────────────────────────────

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      const now = Date.now()
      const pxPerTick = SCROLL_SPEED_PX_S * (TICK_INTERVAL_MS / 1000)

      setActiveComments(prev => {
        const next: ActiveComment[] = []
        for (const c of prev) {
          if (dismissedSet.current.has(c.instanceId)) continue

          const newY = c.yOffset + pxPerTick
          const age  = now - c.spawnTime

          if (newY > containerHeight + 50 || age > COMMENT_LIFETIME_MS) {
            // Comment reached the top or timed out → ignored
            if (!dismissedSet.current.has(c.instanceId)) {
              onIgnored(c.severity)
              dismissedSet.current.add(c.instanceId)
            }
            continue
          }
          next.push({ ...c, yOffset: newY })
        }
        return next
      })
    }, TICK_INTERVAL_MS)

    return () => clearInterval(id)
  }, [isPlaying, containerHeight, onIgnored])

  // ── Reset on stop ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isPlaying) {
      setActiveComments([])
      dismissedSet.current.clear()
      commentIndexRef.current = 0
    }
  }, [isPlaying])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const dismiss = useCallback((instanceId: string) => {
    dismissedSet.current.add(instanceId)
    setActiveComments(prev => prev.filter(c => c.instanceId !== instanceId))
  }, [])

  const handleSwipeRight = useCallback((comment: ActiveComment) => {
    if (comment.category === 'positive' || comment.category === 'neutral') {
      onFeed(comment.severity)
    } else {
      // Tried to "feed" a negative comment → it hits the plant
      onIgnored(comment.severity)
    }
    dismiss(comment.instanceId)
  }, [onFeed, onIgnored, dismiss])

  const handleSwipeLeft = useCallback((comment: ActiveComment) => {
    if (comment.category === 'negative' || comment.category === 'severe') {
      onFilter(comment.severity)
    }
    // Swiping left on positive = missed opportunity (no extra penalty)
    dismiss(comment.instanceId)
  }, [onFilter, dismiss])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ position: 'relative', width: '100%', height: containerHeight, overflow: 'hidden' }}>

      {/* Gradient fades at top and bottom */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(to bottom, rgba(8,0,16,0.95), transparent)',
        zIndex: 10, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(to top, rgba(8,0,16,0.95), transparent)',
        zIndex: 10, pointerEvents: 'none',
      }} />

      {/* Comment cards */}
      <AnimatePresence>
        {activeComments.map(comment => (
          <motion.div
            key={comment.instanceId}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              bottom: comment.yOffset,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100% - 48px)',
              maxWidth: 440,
              zIndex: 5,
            }}
          >
            <CommentCard
              comment={comment}
              onSwipeRight={() => handleSwipeRight(comment)}
              onSwipeLeft={() => handleSwipeLeft(comment)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Empty state hint */}
      {activeComments.length === 0 && isPlaying && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
            评论正在涌入…
          </p>
        </div>
      )}
    </div>
  )
}
