import { motion } from 'framer-motion'

interface HealthBarProps {
  health: number  // 0–100
  stress: number  // 0–100
}

function getHealthColor(health: number): string {
  if (health > 70) return '#4ade80'
  if (health > 40) return '#facc15'
  if (health > 20) return '#f97316'
  return '#ef4444'
}

function getHealthLabel(health: number): string {
  if (health > 80) return '茁壮成长'
  if (health > 60) return '状态良好'
  if (health > 40) return '有些疲惫'
  if (health > 20) return '正在萎缩'
  if (health > 5)  return '奄奄一息'
  return '濒临枯萎'
}

export function HealthBar({ health, stress }: HealthBarProps) {
  const healthColor = getHealthColor(health)
  const healthLabel = getHealthLabel(health)
  const isLow = health < 30

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1,
    }}>
      {/* Health row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: '0.7rem',
          color: healthColor,
          fontWeight: 600,
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          minWidth: 56,
          textTransform: 'uppercase',
        }}>
          生命值
        </span>
        <div style={{
          flex: 1,
          height: 10,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 5,
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
        }}>
          <motion.div
            animate={{ width: `${health}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              borderRadius: 5,
              background: isLow
                ? `linear-gradient(90deg, #dc2626, ${healthColor})`
                : `linear-gradient(90deg, ${healthColor}99, ${healthColor})`,
              boxShadow: `0 0 8px ${healthColor}80`,
            }}
          />
        </div>
        <span style={{
          fontSize: '0.75rem',
          color: healthColor,
          fontWeight: 700,
          minWidth: 36,
          textAlign: 'right',
        }}>
          {Math.round(health)}%
        </span>
        <span style={{
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.35)',
          minWidth: 54,
        }}>
          {healthLabel}
        </span>
      </div>

      {/* Stress row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          fontSize: '0.7rem',
          color: '#a78bfa',
          fontWeight: 600,
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          minWidth: 56,
          textTransform: 'uppercase',
        }}>
          压力值
        </span>
        <div style={{
          flex: 1,
          height: 6,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${stress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              height: '100%',
              borderRadius: 3,
              background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
              boxShadow: '0 0 6px rgba(167, 139, 250, 0.5)',
            }}
          />
        </div>
        <span style={{
          fontSize: '0.7rem',
          color: 'rgba(167, 139, 250, 0.7)',
          minWidth: 36,
          textAlign: 'right',
        }}>
          {Math.round(stress)}%
        </span>
      </div>
    </div>
  )
}
