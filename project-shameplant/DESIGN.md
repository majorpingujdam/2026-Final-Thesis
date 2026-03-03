# Project Shameplant — Design & Architecture Document

> Interactive art installation exploring cyberbullying through the metaphor of a Mimosa pudica (sensitive plant).
> Built as a touch-wall experience for thesis exhibition, 2026.

---

## Table of Contents

1. [Concept](#1-concept)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Design Versions](#4-design-versions)
   - [v1 — Split Panel (original)](#v1--split-panel-original)
   - [v2 — Pinball Machine (current)](#v2--pinball-machine-current)
5. [Game Mechanics](#5-game-mechanics)
6. [Visual Design Language](#6-visual-design-language)
7. [3D Scene Architecture](#7-3d-scene-architecture)
8. [Component Reference](#8-component-reference)
9. [Data & State](#9-data--state)
10. [Comment Database](#10-comment-database)
11. [Performance Notes](#11-performance-notes)
12. [Running the Project](#12-running-the-project)

---

## 1. Concept

**Shameplant** places the viewer in the role of a *digital gardener* protecting a living Mimosa pudica plant from the constant stream of online comments. The Mimosa is the perfect metaphor: it physically folds and closes its leaves when touched or disturbed — a silent, involuntary response to harm.

### Core metaphor
| In the installation | In the real world |
|---|---|
| Words falling from above | Social media feed / comment sections |
| Positive words nourishing the plant | Supportive community interaction |
| Negative words wilting the plant | Cyberbullying and online harassment |
| The player filtering words | Individual and platform-level moderation |
| Plant folding its leaves | People shutting down under sustained harm |
| Speed increasing over time | The escalating, relentless pace of online toxicity |

### Target audience
Exhibition visitors at a thesis show. No prior gaming experience assumed. The interaction must be intuitive from observation.

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI framework | React | 18.3 | Component architecture |
| Language | TypeScript | 5.6 | Type safety |
| Build tool | Vite | 5.4 | Dev server + bundling |
| 3D rendering | Three.js | 0.169 | WebGL scene |
| React 3D bindings | @react-three/fiber | 8.17 | React ↔ Three.js bridge |
| 3D helpers | @react-three/drei | 9.109 | ContactShadows, Text3D, Sparkles |
| Animation | Framer Motion | 11.11 | UI transitions, gesture hints |
| Styling | Tailwind CSS | 3.4 | Utility classes + global reset |
| Font (3D) | Helvetiker Bold | three built-in | Typeface.js for Text3D extrusion |

---

## 3. Project Structure

```
project-shameplant/
├── public/
│   └── fonts/
│       └── helvetiker_bold.typeface.json   ← copied from three/examples/fonts
│
├── src/
│   ├── App.tsx                    ← root: phase routing + GameScene + HUD
│   ├── main.tsx                   ← ReactDOM.createRoot entry
│   ├── index.css                  ← Tailwind directives + global resets
│   │
│   ├── types/
│   │   └── index.ts               ← all shared TypeScript interfaces
│   │
│   ├── data/
│   │   └── comments.ts            ← 110 bilingual comments (zh + en)
│   │
│   ├── hooks/
│   │   ├── useGameState.ts        ← useReducer game state + score/level helpers
│   │   ├── useWordGame.ts         ← word spawning with speed ramp
│   │   └── useGestures.ts         ← (legacy) swipe utility
│   │
│   └── components/
│       │
│       ├── ── ACTIVE (v2) ─────────────────────────────
│       ├── GameScene.tsx          ← full-screen R3F Canvas + pinball frame
│       ├── FallingWord3D.tsx      ← 3D extruded word with physics & drag
│       ├── MimosaPlant.tsx        ← procedural plant, leaves fold by health
│       ├── RoboticBody.tsx        ← robotic guardian figure
│       ├── HUD.tsx                ← transparent overlay (health, score, speed)
│       ├── IntroScreen.tsx        ← start screen with content warning
│       ├── EndScreen.tsx          ← results screen
│       │
│       └── ── LEGACY (v1, unused) ─────────────────────
│           ├── CommentCard.tsx    ← (replaced by FallingWord3D)
│           ├── CommentStream.tsx  ← (replaced by useWordGame + GameScene)
│           ├── MimosaScene.tsx    ← (replaced by GameScene)
│           ├── HealthBar.tsx      ← (absorbed into HUD)
│           └── StatsPanel.tsx     ← (absorbed into HUD)
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── tsconfig.node.json
```

---

## 4. Design Versions

### v1 — Split Panel (original)

The first design used a classic two-panel layout: a 3D scene on the left, and a 2D scrolling comment feed on the right.

```
┌──────────────────────────────────────────────────────────┐
│  LEFT 40%               │  RIGHT 60%                     │
│                         │                                │
│   ┌─────────────────┐   │   ┌──────────────────────┐    │
│   │   3D MIMOSA     │   │   │ "You are amazing!"   │    │
│   │   PLANT         │   │   └──────────────────────┘    │
│   │      +          │   │   ┌──────────────────────┐    │
│   │   ROBOTIC       │   │   │ "Nobody likes you"   │    │
│   │   GUARDIAN      │   │   └──────────────────────┘    │
│   │                 │   │   ┌──────────────────────┐    │
│   └─────────────────┘   │   │ "Keep it up!"        │    │
│                         │   └──────────────────────┘    │
│                         │          ↑ scroll up          │
├─────────────────────────┴──────────────────────────────  │
│  [████████░ Health: 75%]         Filtered: 12           │
└──────────────────────────────────────────────────────────┘
```

**Comment mechanic (v1):**
- Cards float upward from the bottom
- Swipe RIGHT → accept (feed plant with positive words)
- Swipe LEFT → filter (deflect negative words)
- Cards that scroll off-screen without interaction = ignored = damage

**Limitations of v1:**
- 2D card interaction felt flat for a 3D installation
- Scroll direction (upward) was unintuitive for touch walls
- The 3D scene was decorative, not interactive
- Language: mixed Chinese / English UI

---

### v2 — Pinball Machine (current)

A complete redesign. The entire screen is a 3D interactive field styled as a vintage pinball machine. Words are physical 3D objects that the player interacts with directly.

```
┌══════════════════════════════════════════════════════╗
║ [Health ████░] [Speed ▌▌▌▌▌░░░░░ Lv 5]  [1,200 pts]║
╠══════════════════════════════════════════════════════╣
║  │  "amazing!"      "you're worthless"  "keep up!" │║
║  │         "nobody cares"    "believe in you!"      │║
║  │  "give up"        "You inspire me"   "loser"     │║
║  │                                                  │║
║  │       ●  (bumper)            ●  (bumper)         │║
║  │                  🌿🤖                            │║
║  │  ●  (bumper)            ●  (bumper)              │║
╠══════════════════════════════════════════════════════╣
║    [FED: 12]     [BLOCKED: 8]     [HIT PLANT: 3]    ║
╚══════════════════════════════════════════════════════╝
```

**Word mechanic (v2):**
- 3D low-poly text objects fall from the top of the screen
- Drag & fling any word sideways to throw it off-screen
- Positive words that reach the bottom → nourish the plant
- Negative words that reach the bottom → damage the plant
- Speed increases continuously — more words, faster fall

**Design improvements in v2:**
- Full immersive 3D experience (not split)
- Physically intuitive: throw bad things away, let good things fall
- Neon pinball aesthetic makes the content warnings feel contained and "game-like"
- Words are readable and tactile as 3D objects
- Speed escalation mirrors the escalating nature of online abuse

---

## 5. Game Mechanics

### Session flow

```
[Intro Screen]
     │
     │ Player taps "START"
     ▼
[Playing]  ◄────────────────────────────────────────────┐
     │                                                   │
     │ Words fall from top (speed increases over 200s)   │
     │                                                   │
     ├── Positive word reaches bottom ──► feedPlant()    │
     ├── Negative word reaches bottom ──► commentIgnored()
     ├── Any word thrown off sides:                      │
     │     ├── Was negative/severe ──────► filterComment()
     │     └── Was positive ──────────────► (no effect) │
     │                                                   │
     ├── Health drops to 0 ──────────────────────────────┤
     └── 5-minute timer expires ────────────────────────►│
                                                         │
                                                    [End Screen]
                                                    "Play Again" ─► RESET → Intro
```

### Health & damage

| Event | Health change | Stress change |
|---|---|---|
| Positive word reaches plant | `+severity × 1.6` | `−4` |
| Negative word filtered (thrown) | none | `+severity × 0.55` |
| Negative word hits plant (ignored) | `−severity × 1.3` | `+severity × 0.45` |

- Health range: `0–100` (starts at 100)
- Stress range: `0–100` (cosmetic; affects robot eye color and trembling)
- Health `≤ 0` → instant game over

### Speed ramp

```
Time elapsed (seconds)    0      50     100    150    200+
Fall speed (units/sec)   1.4    1.9    2.5    3.4    4.2
Spawn interval (ms)     2200   1890   1430    900    650
Speed level display       1      3      5      7     10
```

### Scoring

```
Score = (commentsFed × 150)
      + (commentsFiltered × 80)
      − (commentsIgnored × 60)
      + (finalHealth × 10)
```

---

## 6. Visual Design Language

### Color palette

| Role | Color | Hex |
|---|---|---|
| Background | Near-black purple-black | `#050008` |
| Positive word | Neon green | `#4ade80` |
| Neutral word | Cyan | `#22d3ee` |
| Negative word | Neon orange | `#fb923c` |
| Severe word | Bright red | `#f43f5e` |
| Pinball walls | Steel blue emissive | `#1d4ed8` |
| Neon left strip | Electric blue | `#3b82f6` |
| Neon right strip | Electric violet | `#8b5cf6` |
| Top arch | Purple | `#7c3aed` |
| Health (good) | Green | `#4ade80` |
| Health (warning) | Yellow | `#facc15` |
| Health (danger) | Red | `#ef4444` |
| Score display | Gold | `#facc15` |

### 3D word material

```
MeshStandardMaterial {
  color:           category color
  emissive:        same color
  emissiveIntensity: 0.35 – 0.65 (severity-dependent)
  roughness:       0.25
  metalness:       0.5
  flatShading:     true    ← KEY: creates low-poly faceted look
}

Text3D geometry {
  size:            0.44
  height:          0.22   ← extrusion depth
  curveSegments:   2       ← KEY: very angular, low-poly curves
  bevelEnabled:    true
  bevelThickness:  0.05
  bevelSize:       0.03
  bevelSegments:   1       ← sharp bevel = low poly
}
```

### Plant health states

| Health range | Leaf state | Color | Motion |
|---|---|---|---|
| 70 – 100 | Fully open | Vivid `#22c55e` | Gentle sway (±0.045 rad) |
| 40 – 70 | Partially folded | Muted `#86efac` | Reduced sway |
| 10 – 40 | Mostly closed | Pale `#bbf7d0` | Trembling |
| 0 – 10 | Wilted / collapsed | Gray-green `#d4d4aa` | Near-still droop |

Leaf fold is implemented as a smooth `THREE.MathUtils.lerp` toward a target angle computed from health:
```
health ≥ 70  →  foldAngle = 0          (open)
health 40–70 →  foldAngle = 0 … π/4    (partial)
health 10–40 →  foldAngle = π/4 … π/2  (mostly closed)
health < 10  →  foldAngle = π/2        (fully closed)
```

### Robot guardian states

| Health | Eye color | Body behavior |
|---|---|---|
| > 60 | Green `#4ade80` | Normal idle breathing |
| 30 – 60 | Yellow `#facc15` | Slightly faster breathing |
| < 30 | Red `#ef4444` | Trembling (stress-driven) |

---

## 7. 3D Scene Architecture

### Camera
```
position: (0, 0, 14)
fov:       52°
near/far:  0.1 / 100
```

### Play field bounds (world units)
```
Horizontal: −7.8 (left wall) to +7.8 (right wall)
Vertical:   +7.5 (spawn / entry) to −6.2 (floor / exit)
Word exit:  |x| > 8.5 (side throw) or y < −6.2 (bottom)
```

### Coordinate system
Words spawn at `y = +7.5` (above visible field) and fall downward (negative Y). The plant and robot sit at approximately `y = −2.8`.

### Physics model (per-word, ref-based)

All physics runs inside `useFrame` using plain JavaScript refs — never React state. This avoids re-renders during animation.

```
Each frame:
  if not dragging:
    velocity.y -= GRAVITY × delta          // 1.2 units/s²
    velocity.y  = max(velocity.y, −10)     // terminal velocity cap
    velocity.x *= pow(0.85, delta × 10)    // horizontal damping
    position   += velocity × delta

    rotation.z += velocity.x × delta × 0.35  // spin from lateral motion

  group.position = position
  group.rotation.z = lerp(current, rotZ, 0.12)

  if |x| > 8.5 → exit(hitBottom=false)
  if  y < −6.2 → exit(hitBottom=true)
```

### Drag & throw implementation

Pointer capture is handled via native DOM events added to `gl.domElement` (the canvas). This ensures tracking continues even when the pointer moves off the word mesh.

```
onPointerDown (R3F mesh event):
  1. stopPropagation()
  2. Set dragging=true, zero velocity
  3. Add pointermove + pointerup listeners to gl.domElement

pointermove:
  1. Convert pixel delta → world delta using pxToWorld factor
  2. Update posRef directly (no state, no re-render)
  3. Record recent moves with timestamps (rolling 120ms window)

pointerup:
  1. Set dragging=false
  2. Compute throw velocity from last 120ms of movement:
       vx = (Δx / Δt) × pxToWorld × 1.5
       vy = (−Δy / Δt) × pxToWorld × 0.7 − fallSpeed × 0.4
  3. Remove event listeners

pxToWorld = (2 × tan(fov/2) × camera.z) / screenHeight
```

### Lighting setup

| Light | Position | Color | Purpose |
|---|---|---|---|
| Ambient | — | `#0a0015` (dim) | Prevent pure black |
| Directional | (2, 8, 5) | `#e8d5ff` | Main scene fill |
| Point | (0, 5, 4) | White | Front fill |
| Point | (−6, 0, 3) | `#3b82f6` blue | Left neon ambiance |
| Point | (6, 0, 3) | `#8b5cf6` purple | Right neon ambiance |
| Point (dynamic) | (−1.5, −3.5, 2) | `#22c55e` green | Plant glow, pulses with health |

---

## 8. Component Reference

### `App.tsx`
Root component. Manages phase transitions. Passes word exit events to game state handlers.

```
Word exits bottom:
  positive/neutral → feedPlant(severity)
  negative/severe  → commentIgnored(severity)

Word thrown off sides:
  negative/severe  → filterComment(severity)
  positive         → (no penalty; opportunity missed)
```

---

### `GameScene.tsx`
The R3F `<Canvas>` and all 3D scene content.

Sub-components defined inline:
- `FontPreloader` — calls `useLoader(FontLoader, url)` inside Suspense to warm the font cache before any word spawns
- `Wall` — chrome side walls with pulsing emissive
- `NeonStrip` — thin glowing edge lines
- `Bumper` — cylindrical decorative bumpers with pulsing glow
- `TopArch` — purple header bar
- `Floor` — dark ground plane + contact shadows
- `PlantLight` — green point light that pulses with plant health

---

### `FallingWord3D.tsx`
Single falling word object. Uses `Text3D` from drei with the local font file.

Props:
```typescript
instanceId: string      // unique key
text:        string      // the comment text
category:    CommentCategory
spawnX:      number      // horizontal spawn position
fallSpeed:   number      // current game speed (units/s)
onExit:      (id, hitBottom) => void
```

Key implementation notes:
- All position/velocity stored in `useRef` — no `useState`
- `pxToWorld` recomputed from camera fov + size via `useMemo`
- Drag uses `gl.domElement` native events for full pointer capture

---

### `MimosaPlant.tsx`
Procedural plant. 6 branch configurations hardcoded as `BRANCH_CONFIG[]`. Each branch has 6–9 leaf pairs.

Leaf folding is animated in `useFrame` via lerp on each leaf pair group's `rotation.z`. The fold target is computed from health in the parent `Branch` component via `useMemo`.

Bioluminescent sparkles (`<Sparkles>` from drei) fade out as health drops.

---

### `RoboticBody.tsx`
Procedural humanoid torso. ~12 meshes (head, face plate, eyes, antenna, neck, torso, panel, two full arms with three segments each, waist).

Eye color and body trembling driven by `health` and `stress` props. Idle breathing via `scale.y` oscillation in `useFrame`.

---

### `HUD.tsx`
Absolutely positioned overlay (`pointerEvents: none` by default). Only the "End Session" button re-enables pointer events.

Sections:
- Top left: Plant health bar + stress bar (Framer Motion animated width)
- Top center: Speed level indicator (10 bars, green → yellow → red)
- Top right: Score (large) + timer
- Bottom center: FED / BLOCKED / HIT PLANT counters
- Bottom right: End Session button
- Full-screen: red pulse animation when health < 20

---

### `IntroScreen.tsx`
Animated entry screen with staggered fade-up children. Contains:
- Content warning box (red border)
- Three mechanic tiles (let through / throw away / avoid impact)
- START button (purple gradient)

---

### `EndScreen.tsx`
Results screen. Outcome message and icon determined by final health:

| Health | Icon | Tone |
|---|---|---|
| = 0 | 🥀 | Somber |
| 1–50 | 🍂 | Reflective |
| 51–80 | 🌱 | Cautiously hopeful |
| > 80 | 🌿 | Celebratory |

Shows: final score, health bar, 6-stat grid, reflection quote, Play Again button.

---

### `useGameState.ts`
`useReducer`-based state machine. Exported helpers:

```typescript
calcScore(state: GameState): number
calcLevel(elapsedSeconds: number): number  // returns 1–10
```

Actions: `START_GAME` `END_GAME` `FEED_PLANT` `FILTER_COMMENT` `COMMENT_IGNORED` `RESET`

---

### `useWordGame.ts`
Manages the active word list and spawn scheduling.

```typescript
// Spawn interval ramp (ms):
2200 → 650  over RAMP_SECONDS (200s)

// Fall speed ramp (world-units/s):
1.4  → 4.2  over RAMP_SECONDS

// Max simultaneous words: 10
// Recursive setTimeout (not setInterval) — allows dynamic intervals
```

Returns: `{ words, removeWord, getFallSpeed, startTimeRef }`

---

## 9. Data & State

### TypeScript interfaces (`src/types/index.ts`)

```typescript
type CommentCategory = 'positive' | 'neutral' | 'negative' | 'severe'
type Language = 'zh' | 'en'
type GamePhase = 'intro' | 'playing' | 'ended'

interface Comment {
  id:        string
  text:      string
  category:  CommentCategory
  severity:  number   // −10 (very harmful) to +10 (very positive)
  language:  Language
}

interface ActiveComment extends Comment {
  instanceId: string  // unique per spawn
  yOffset:    number  // (legacy v1 field)
  xPosition:  number
  spawnTime:  number
}

interface GameState {
  phase:              GamePhase
  health:             number   // 0–100
  stress:             number   // 0–100
  commentsFiltered:   number
  commentsFed:        number
  commentsIgnored:    number
  sessionStartTime:   number
  sessionDuration:    number   // seconds (set on end)
}
```

### State flow

```
intro ──[START_GAME]──► playing ──[END_GAME / health=0]──► ended
  ▲                                                          │
  └──────────────────[RESET]────────────────────────────────┘
```

---

## 10. Comment Database

**File:** `src/data/comments.ts`

**Total:** 110 comments across 4 categories and 2 languages.

| Category | Chinese | English | Total |
|---|---|---|---|
| Positive | 20 | 15 | 35 |
| Neutral | 6 | 4 | 10 |
| Negative | 20 | 15 | 35 |
| Severe | 10 | 10 | 20 |
| **Total** | **56** | **54** | **110** |

**Active in v2:** English only (54 comments). This is because the 3D font (helvetiker) only supports Latin characters. Chinese text would render as empty geometry.

**Severity scale:**

| Range | Meaning |
|---|---|
| +8 to +10 | Strongly affirming, life-affirming |
| +5 to +7 | Encouragement, compliments |
| +1 to +4 | Mild positive / neutral |
| −1 to −4 | Dismissive, mildly negative |
| −5 to −7 | Clear bullying, insults |
| −8 to −9 | Severe emotional harm |
| −10 | Extreme / suicidal ideation territory |

**Warning:** Severe comments (`severity ≤ −9`) reflect documented real-world cyberbullying patterns. Their inclusion is intentional and necessary for the installation's educational impact. Content warnings are shown before any gameplay begins.

---

## 11. Performance Notes

### Bundle size
```
Total JS (minified):  ~1.13 MB
Gzipped:              ~318 KB
CSS:                  ~7.4 KB
```

The large JS size is expected for a Three.js application. Three.js + @react-three/fiber + @react-three/drei account for the majority of the bundle. Code-splitting is possible but not necessary for a single-page installation.

### Render performance

- **Words:** Use `useRef` for all physics state. No React state updates per frame. Only `removeWord()` (list mutation) triggers re-renders.
- **Plant leaves:** Each leaf pair uses a direct ref callback (`ref={(el) => { arr[i] = el }}`). `useFrame` modifies `rotation.z` directly on the Three.js object.
- **DPR:** Canvas uses `dpr={[1, 2]}` — capped at 2× for 4K screens to prevent overdraw.
- **Suspense:** Each `FallingWord3D` is wrapped in `<Suspense fallback={null}>`. Font loads once via `useLoader` (cached by React's Suspense + Loader cache). Subsequent words render immediately.

### Font loading
The `FontPreloader` component inside `GameScene` warms the font cache before any words spawn, preventing a flash of invisible words on first spawn.

---

## 12. Running the Project

### Development
```bash
cd project-shameplant
npm install       # first time only
npm run dev       # → http://localhost:5173
```

### Production build
```bash
npm run build     # outputs to dist/
npm run preview   # preview the built version
```

### Font dependency
The 3D font is stored at `public/fonts/helvetiker_bold.typeface.json`. It was copied from the `three` npm package:
```bash
cp node_modules/three/examples/fonts/helvetiker_bold.typeface.json public/fonts/
```
This file is committed to the project and does **not** require a CDN connection. The installation will work fully offline.

### Touch wall deployment
- Set screen resolution to the display's native resolution
- Open `http://localhost:5173` in Chromium (fullscreen: F11)
- `touch-action: none` is set globally in `index.css`
- The canvas fills 100vw × 100vh with no scrollbars

---

*Project Shameplant · 羞耻花园 · Thesis 2026*
