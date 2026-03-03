import { useReducer, useCallback } from 'react'
import { GameState, GameAction } from '../types'

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_MAX_SECONDS = 300  // 5-minute hard cap
const RAMP_SECONDS        = 200  // time to reach max speed level

// ─── Score / level helpers ────────────────────────────────────────────────────

export function calcScore(state: GameState): number {
  const fed      = state.commentsFed      * 150
  const filtered = state.commentsFiltered * 80
  const penalty  = state.commentsIgnored  * 60
  const bonus    = Math.round(state.health) * 10
  return Math.max(0, fed + filtered - penalty + bonus)
}

export function calcLevel(elapsedSeconds: number): number {
  return Math.min(10, 1 + Math.floor((elapsedSeconds / RAMP_SECONDS) * 9))
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: GameState = {
  phase: 'intro',
  health: 100,
  stress: 0,
  commentsFiltered: 0,
  commentsFed: 0,
  commentsIgnored: 0,
  sessionStartTime: 0,
  sessionDuration: 0,
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        phase: 'playing',
        sessionStartTime: Date.now(),
      }

    case 'END_GAME':
      return {
        ...state,
        phase: 'ended',
        sessionDuration: (Date.now() - state.sessionStartTime) / 1000,
      }

    case 'FEED_PLANT': {
      // Swipe right on a positive comment → nourish plant
      const gain = Math.max(0, action.severity) * 1.5
      const newHealth = Math.min(100, state.health + gain)
      return {
        ...state,
        health: newHealth,
        stress: Math.max(0, state.stress - 3),
        commentsFed: state.commentsFed + 1,
      }
    }

    case 'FILTER_COMMENT': {
      // Swipe left on a negative comment → protect plant, small stress cost
      const stressIncrease = Math.abs(action.severity) * 0.6
      return {
        ...state,
        stress: Math.min(100, state.stress + stressIncrease),
        commentsFiltered: state.commentsFiltered + 1,
      }
    }

    case 'COMMENT_IGNORED': {
      // Negative comment ignored → hits the plant
      const damage = Math.abs(action.severity) * 1.2
      const newHealth = Math.max(0, state.health - damage)
      const stressDamage = Math.abs(action.severity) * 0.5
      const ended = newHealth <= 0

      return {
        ...state,
        health: newHealth,
        stress: Math.min(100, state.stress + stressDamage),
        commentsIgnored: state.commentsIgnored + 1,
        phase: ended ? 'ended' : state.phase,
        sessionDuration: ended
          ? (Date.now() - state.sessionStartTime) / 1000
          : state.sessionDuration,
      }
    }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const endGame = useCallback(() => dispatch({ type: 'END_GAME' }), [])
  const resetGame = useCallback(() => dispatch({ type: 'RESET' }), [])

  const feedPlant = useCallback(
    (severity: number) => dispatch({ type: 'FEED_PLANT', severity }),
    [],
  )
  const filterComment = useCallback(
    (severity: number) => dispatch({ type: 'FILTER_COMMENT', severity }),
    [],
  )
  const commentIgnored = useCallback(
    (severity: number) => dispatch({ type: 'COMMENT_IGNORED', severity }),
    [],
  )

  // Compute elapsed time without extra state
  const elapsedSeconds = state.phase === 'playing'
    ? Math.floor((Date.now() - state.sessionStartTime) / 1000)
    : Math.floor(state.sessionDuration)

  const shouldAutoEnd = state.phase === 'playing' && elapsedSeconds >= SESSION_MAX_SECONDS

  const score = calcScore(state)
  const level = calcLevel(elapsedSeconds)

  return {
    state, score, level,
    elapsedSeconds, shouldAutoEnd,
    startGame, endGame, resetGame,
    feedPlant, filterComment, commentIgnored,
    dispatch,
  }
}
