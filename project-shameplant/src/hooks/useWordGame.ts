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

const MAX_WORDS_ON_SCREEN = 10
const SPAWN_INTERVAL_START = 2200  // ms between spawns at start
const SPAWN_INTERVAL_MIN   = 650   // ms at max speed
const RAMP_SECONDS         = 200   // time (s) to reach max speed

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWordGame(comments: Comment[], isPlaying: boolean) {
  const [words, setWords] = useState<ActiveWordData[]>([])
  const indexRef     = useRef(0)
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef(0)

  // Current fall speed — read by FallingWord3D via prop
  const getFallSpeed = useCallback((elapsedMs: number): number => {
    const t = Math.min(1, elapsedMs / 1000 / RAMP_SECONDS)
    return 1.4 + t * 2.8 // 1.4 → 4.2 world-units/second
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
      const interval = getSpawnInterval(elapsed)

      timerRef.current = setTimeout(() => {
        setWords(prev => {
          if (prev.length >= MAX_WORDS_ON_SCREEN) {
            // skip this tick, retry sooner
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
            spawnX: (Math.random() - 0.5) * 11,  // -5.5 … +5.5
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
