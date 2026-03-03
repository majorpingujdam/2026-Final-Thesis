import { useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GameScene }    from './components/GameScene'
import { HUD }          from './components/HUD'
import { IntroScreen }  from './components/IntroScreen'
import { EndScreen }    from './components/EndScreen'
import { useGameState } from './hooks/useGameState'
import { useWordGame }  from './hooks/useWordGame'
import { COMMENTS }     from './data/comments'

// ─── Filter to English-only comments for 3D text (font supports Latin only) ──
const EN_COMMENTS = COMMENTS.filter(c => c.language === 'en')

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const {
    state, score, level, elapsedSeconds, shouldAutoEnd,
    startGame, endGame, resetGame,
    feedPlant, filterComment, commentIgnored,
  } = useGameState()

  const isPlaying = state.phase === 'playing'

  // ── Word game ──────────────────────────────────────────────────────────────
  const { words, removeWord, getFallSpeed, startTimeRef } = useWordGame(EN_COMMENTS, isPlaying)

  const fallSpeed = isPlaying
    ? getFallSpeed(Date.now() - startTimeRef.current)
    : 1.5

  // ── Auto-end ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (shouldAutoEnd) endGame()
  }, [shouldAutoEnd, endGame])

  // ── Word exit handler ──────────────────────────────────────────────────────
  // hitBottom=true  → word reached bottom of field
  // hitBottom=false → word was thrown off the sides
  const handleWordExit = useCallback((id: string, hitBottom: boolean) => {
    const word = words.find(w => w.instanceId === id)
    if (!word) return

    if (hitBottom) {
      if (word.category === 'positive' || word.category === 'neutral') {
        // Good: positive word reached the plant naturally
        feedPlant(word.severity)
      } else {
        // Bad: negative/severe word hit the plant
        commentIgnored(word.severity)
      }
    } else {
      // Thrown off screen
      if (word.category === 'negative' || word.category === 'severe') {
        // Correctly blocked a bad word
        filterComment(word.severity)
      }
      // Throwing a positive off screen: no special effect (just missed)
    }

    removeWord(id)
  }, [words, feedPlant, commentIgnored, filterComment, removeWord])

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#050008' }}>

      {/* ── Full-screen 3D game (always rendered, visible behind overlays) ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <GameScene
          health={state.health}
          stress={state.stress}
          words={words}
          fallSpeed={fallSpeed}
          onWordExit={handleWordExit}
        />
      </div>

      {/* ── HUD overlay (only while playing) ── */}
      {isPlaying && (
        <HUD
          health={state.health}
          stress={state.stress}
          score={score}
          level={level}
          wordsCaught={state.commentsFed}
          wordsFiltered={state.commentsFiltered}
          wordsHit={state.commentsIgnored}
          elapsedSeconds={elapsedSeconds}
          onEnd={endGame}
        />
      )}

      {/* ── Intro screen ── */}
      <AnimatePresence>
        {state.phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            style={{ position: 'absolute', inset: 0, zIndex: 50 }}
          >
            <IntroScreen onStart={startGame} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── End screen ── */}
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
    </div>
  )
}
