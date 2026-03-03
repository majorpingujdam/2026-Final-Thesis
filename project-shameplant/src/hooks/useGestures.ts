import { useRef, useCallback } from 'react'
import { SwipeResult } from '../types'

/**
 * Lightweight swipe detection hook.
 * Framer Motion handles the actual drag animation;
 * this hook provides utilities for interpreting PanInfo from Framer Motion.
 */
export function useGestures(threshold = 80) {
  const startX = useRef(0)
  const startY = useRef(0)
  const startTime = useRef(0)

  const onDragStart = useCallback((x: number, y: number) => {
    startX.current = x
    startY.current = y
    startTime.current = Date.now()
  }, [])

  const onDragEnd = useCallback(
    (x: number, y: number): SwipeResult => {
      const dx = x - startX.current
      const dy = y - startY.current
      const dt = Math.max(1, Date.now() - startTime.current)
      const velocity = Math.abs(dx) / dt
      const distance = Math.abs(dx)

      // Horizontal swipe: dx must dominate dy
      if (distance > threshold && Math.abs(dx) > Math.abs(dy) * 1.2) {
        return { direction: dx > 0 ? 'right' : 'left', velocity, distance }
      }
      return { direction: null, velocity, distance }
    },
    [threshold],
  )

  /**
   * Convenience: evaluate a Framer Motion PanInfo object directly.
   * Returns the swipe direction based on offset and velocity.
   */
  const evaluatePan = useCallback(
    (offsetX: number, velocityX: number): 'left' | 'right' | null => {
      const fastEnough = Math.abs(velocityX) > 0.3
      const farEnough = Math.abs(offsetX) > threshold

      if (farEnough || fastEnough) {
        return offsetX > 0 ? 'right' : 'left'
      }
      return null
    },
    [threshold],
  )

  return { onDragStart, onDragEnd, evaluatePan }
}
