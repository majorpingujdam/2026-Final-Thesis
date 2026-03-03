import { useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MimosaScene } from './components/MimosaScene'
import { CommentStream } from './components/CommentStream'
import { HealthBar } from './components/HealthBar'
import { StatsPanel } from './components/StatsPanel'
import { IntroScreen } from './components/IntroScreen'
import { EndScreen } from './components/EndScreen'
import { useGameState } from './hooks/useGameState'
import { COMMENTS, getShuffledComments } from './data/comments'

// ─── Comment pool (shuffled once) ─────────────────────────────────────────────

const SHUFFLED_COMMENTS = getShuffledComments()

// ─── Layout constants ─────────────────────────────────────────────────────────

const BOTTOM_BAR_HEIGHT = 72
const STREAM_CONTAINER_HEIGHT_VH = 100 // percentage

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const { state, elapsedSeconds, shouldAutoEnd, startGame, endGame, resetGame, feedPlant, filterComment, commentIgnored } = useGameState()

  const streamContainerRef = useRef<HTMLDivElement>(null)
  const containerHeightRef = useRef(600)

  // ── Measure stream container height ────────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      if (streamContainerRef.current) {
        containerHeightRef.current = streamContainerRef.current.clientHeight
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // ── Auto-end when time runs out ─────────────────────────────────────────────
  useEffect(() => {
    if (shouldAutoEnd) endGame()
  }, [shouldAutoEnd, endGame])

  // ── Comment handlers ────────────────────────────────────────────────────────
  const handleFeed    = useCallback((s: number) => feedPlant(s), [feedPlant])
  const handleFilter  = useCallback((s: number) => filterComment(s), [filterComment])
  const handleIgnored = useCallback((s: number) => commentIgnored(s), [commentIgnored])

  const isPlaying = state.phase === 'playing'

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(ellipse at 20% 80%, #1a0010 0%, #08000f 45%, #000508 100%)',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── Intro overlay ── */}
      <AnimatePresence>
        {state.phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, zIndex: 50 }}
          >
            <IntroScreen onStart={startGame} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── End overlay ── */}
      <AnimatePresence>
        {state.phase === 'ended' && (
          <motion.div
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, zIndex: 50 }}
          >
            <EndScreen state={state} onRestart={resetGame} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main game layout ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
        paddingBottom: BOTTOM_BAR_HEIGHT,
      }}>

        {/* LEFT PANEL — 3D scene (40%) */}
        <div style={{
          width: '40%',
          position: 'relative',
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}>
          {/* Ambient fog gradient on left edge */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(8,0,16,0.6) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }} />
          <MimosaScene health={state.health} stress={state.stress} />

          {/* Health pulse indicator at low health */}
          {state.health < 25 && isPlaying && (
            <motion.div
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: 0,
                background: '#ef4444',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
          )}
        </div>

        {/* RIGHT PANEL — Comment stream (60%) */}
        <div
          ref={streamContainerRef}
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Panel header */}
          <div style={{
            padding: '16px 24px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            flexShrink: 0,
          }}>
            <p style={{
              fontSize: '0.65rem',
              letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
            }}>
              实时评论流 · Live Comment Feed
            </p>
          </div>

          {/* Instruction chips */}
          {isPlaying && (
            <div style={{
              padding: '8px 24px',
              display: 'flex',
              gap: 8,
              flexShrink: 0,
            }}>
              {[
                { label: '← 过滤负向', color: '#60a5fa' },
                { label: '正向 →',     color: '#4ade80' },
              ].map(({ label, color }) => (
                <div key={label} style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: `1px solid ${color}40`,
                  background: `${color}10`,
                  fontSize: '0.65rem',
                  color: `${color}cc`,
                  letterSpacing: '0.06em',
                }}>
                  {label}
                </div>
              ))}
            </div>
          )}

          {/* Scrolling comment area */}
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <CommentStream
              comments={SHUFFLED_COMMENTS}
              isPlaying={isPlaying}
              containerHeight={containerHeightRef.current}
              onFeed={handleFeed}
              onFilter={handleFilter}
              onIgnored={handleIgnored}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: BOTTOM_BAR_HEIGHT,
        background: 'rgba(8, 0, 16, 0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 32,
        zIndex: 20,
      }}>
        <HealthBar health={state.health} stress={state.stress} />
        <div style={{
          width: 1,
          height: 36,
          background: 'rgba(255,255,255,0.08)',
          flexShrink: 0,
        }} />
        <StatsPanel
          commentsFiltered={state.commentsFiltered}
          commentsFed={state.commentsFed}
          commentsIgnored={state.commentsIgnored}
          elapsedSeconds={elapsedSeconds}
        />

        {/* End session button */}
        {isPlaying && (
          <button
            onClick={endGame}
            style={{
              marginLeft: 'auto',
              padding: '6px 16px',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'
            }}
          >
            结束 · End
          </button>
        )}
      </div>
    </div>
  )
}
