// ─── Comment types ───────────────────────────────────────────────────────────

export type CommentCategory = 'positive' | 'neutral' | 'negative' | 'severe'
export type Language = 'zh' | 'en'
export type GamePhase = 'intro' | 'playing' | 'ended'

export interface Comment {
  id: string
  text: string
  category: CommentCategory
  severity: number // -10 (very negative) to +10 (very positive)
  language: Language
}

// A comment currently active on screen
export interface ActiveComment extends Comment {
  instanceId: string  // unique per spawn instance
  yOffset: number     // pixels from bottom of container (increases = moves up)
  xPosition: number   // horizontal center in % (30–70) for lane variation
  spawnTime: number   // Date.now() at spawn
}

// ─── Game state ───────────────────────────────────────────────────────────────

export interface GameState {
  phase: GamePhase
  health: number           // 0–100  (plant vitality)
  stress: number           // 0–100  (accumulated cognitive load)
  commentsFiltered: number // successfully swiped-left on negative
  commentsFed: number      // successfully swiped-right on positive
  commentsIgnored: number  // negative comments that hit the plant
  sessionStartTime: number // Date.now() at game start
  sessionDuration: number  // seconds (set when game ends)
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'FEED_PLANT'; severity: number }
  | { type: 'FILTER_COMMENT'; severity: number }
  | { type: 'COMMENT_IGNORED'; severity: number }
  | { type: 'RESET' }

// ─── Gesture types ────────────────────────────────────────────────────────────

export type SwipeDirection = 'left' | 'right' | null

export interface SwipeResult {
  direction: SwipeDirection
  velocity: number
  distance: number
}

// ─── Component prop helpers ───────────────────────────────────────────────────

export interface PlantState {
  health: number
  stress: number
}
