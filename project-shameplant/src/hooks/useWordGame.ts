import { useState, useEffect, useRef, useCallback } from 'react'
import { Comment, CommentCategory, Language } from '../types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActiveWordData {
  instanceId: string
  text: string
  category: CommentCategory
  severity: number
  language: Language
  spawnX: number
  spawnTime: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_WORDS_ON_SCREEN = 6
const SPAWN_INTERVAL_START = 3200  // ms between spawns at start — less crowded
const SPAWN_INTERVAL_MIN   = 900   // ms at max speed
const RAMP_SECONDS         = 200   // time (s) to reach max speed
const SPAWN_X_MIN = -7.2
const SPAWN_X_MAX = 7.2
const SPAWN_INTERVAL_JITTER = 600  // ±ms so spawns don't align in a line

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWordGame(comments: Comment[], isPlaying: boolean) {
  const [words, setWords] = useState<ActiveWordData[]>([])
  const indexRef     = useRef(0)
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef(0)

  // Constant fall speed — all words drop at the same rate
  const getFallSpeed = useCallback((elapsedMs: number): number => {
    void elapsedMs
    return 0.9
  }, [])

  const getSpawnInterval = (elapsedMs: number): number => {
    const t = Math.min(1, elapsedMs / 1000 / RAMP_SECONDS)
    return SPAWN_INTERVAL_START - t * (SPAWN_INTERVAL_START - SPAWN_INTERVAL_MIN)
  }

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setWords([])
      indexRef.current = 0
      startTimeRef.current = Date.now()
      return
    }

    startTimeRef.current = Date.now()

    const scheduleNext = () => {
      const elapsed = Date.now() - startTimeRef.current
      const baseInterval = getSpawnInterval(elapsed)
      const jitter = (Math.random() - 0.5) * SPAWN_INTERVAL_JITTER
      const interval = Math.max(400, baseInterval + jitter)

      timerRef.current = setTimeout(() => {
        setWords(prev => {
          if (prev.length >= MAX_WORDS_ON_SCREEN) {
            scheduleNext()
            return prev
          }
          const comment = comments[indexRef.current % comments.length]
          indexRef.current++

          const word: ActiveWordData = {
            instanceId: `w-${comment.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            text: comment.text,
            category: comment.category,
            severity: comment.severity,
            language: comment.language,
            spawnX: SPAWN_X_MIN + Math.random() * (SPAWN_X_MAX - SPAWN_X_MIN),
            spawnTime: Date.now(),
          }
          scheduleNext()
          return [...prev, word]
        })
      }, interval)
    }

    // First word appears after a short delay
    timerRef.current = setTimeout(scheduleNext, 400)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPlaying, comments])

  const removeWord = useCallback((instanceId: string) => {
    setWords(prev => prev.filter(w => w.instanceId !== instanceId))
  }, [])

  return { words, removeWord, getFallSpeed, startTimeRef }
}
