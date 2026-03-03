interface StatsPanelProps {
  commentsFiltered: number
  commentsFed: number
  commentsIgnored: number
  elapsedSeconds: number
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface StatItemProps {
  value: number | string
  label: string
  color: string
}

function StatItem({ value, label, color }: StatItemProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
    }}>
      <span style={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color,
        lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{
        fontSize: '0.58rem',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
  )
}

export function StatsPanel({
  commentsFiltered,
  commentsFed,
  commentsIgnored,
  elapsedSeconds,
}: StatsPanelProps) {
  return (
    <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'center',
    }}>
      <StatItem value={formatTime(elapsedSeconds)} label="时间" color="rgba(255,255,255,0.6)" />
      <StatItem value={commentsFed}      label="喂养" color="#4ade80" />
      <StatItem value={commentsFiltered} label="过滤" color="#60a5fa" />
      <StatItem value={commentsIgnored}  label="受击" color="#ef4444" />
    </div>
  )
}
