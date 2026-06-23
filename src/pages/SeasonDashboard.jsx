import { BarChart2, FileText, ChevronLeft, TrendingUp } from 'lucide-react'
import { loadData, getPlayerStats, SHOT_TYPES } from '../data/store'
import { printSeasonReport, printPlayerSeasonReport } from '../reports/generateReport'

export default function SeasonDashboard({ onBack, onOpenMatch }) {
  const data = loadData()
  const matches = data.matches.filter(m => m.finished || m.events.length > 0)

  if (matches.length === 0) {
    return (
      <div style={page}>
        <div style={{ padding: '48px 16px 16px' }}>
          <button onClick={onBack} style={linkBtn}>← Volver</button>
          <h1 style={h1}>Temporada</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '64px 16px', color: '#4b5563' }}>
          <BarChart2 size={48} color="#374151" style={{ margin: '0 auto 16px' }} />
          <p>Registra al menos un partido para ver las estadísticas de temporada</p>
        </div>
      </div>
    )
  }

  // ── Acumular stats ──
  const allEvents = matches.flatMap(m => m.events)
  const totalGoals = allEvents.filter(e => e.type === 'goal').length
  const totalMisses = allEvents.filter(e => e.type === 'miss').length
  const totalSaves = allEvents.filter(e => e.type === 'save').length
  const totalConceded = allEvents.filter(e => e.type === 'conceded').length
  const totalExclusions = allEvents.filter(e => e.type === 'exclusion').length
  const totalTurnovers = allEvents.filter(e => e.type === 'turnover').length
  const shootingPct = totalGoals + totalMisses > 0 ? Math.round(totalGoals / (totalGoals + totalMisses) * 100) : null
  const savePct = totalSaves + totalConceded > 0 ? Math.round(totalSaves / (totalSaves + totalConceded) * 100) : null

  // Resultados
  const results = matches.map(m => {
    const our = m.events.filter(e => e.type === 'goal').length
    const rival = m.rivalGoals ?? null
    const result = rival === null ? null : our > rival ? 'W' : our < rival ? 'L' : 'D'
    return { ...m, ourGoals: our, result }
  })
  const wins = results.filter(m => m.result === 'W').length
  const draws = results.filter(m => m.result === 'D').length
  const losses = results.filter(m => m.result === 'L').length
  const goalsFor = results.reduce((s, m) => s + m.ourGoals, 0)
  const goalsAgainst = results.filter(m => m.rivalGoals != null).reduce((s, m) => s + (m.rivalGoals ?? 0), 0)

  // Ranking jugadoras (todas las que aparecen en cualquier partido)
  const playerMap = {}
  matches.forEach(m => {
    m.players.forEach(p => {
      if (!playerMap[p.id]) playerMap[p.id] = { ...p, stats: { goals: 0, misses: 0, saves: 0, conceded: 0, exclusions: 0, turnovers: 0, shootingPct: null, savePct: null }, matchCount: 0 }
      const s = getPlayerStats(m, p.id)
      const acc = playerMap[p.id].stats
      acc.goals += s.goals
      acc.misses += s.misses
      acc.saves += s.saves
      acc.conceded += s.conceded
      acc.exclusions += s.exclusions
      acc.turnovers += s.turnovers
      playerMap[p.id].matchCount++
    })
  })
  Object.values(playerMap).forEach(p => {
    const { goals, misses, saves, conceded } = p.stats
    p.stats.shootingPct = goals + misses > 0 ? Math.round(goals / (goals + misses) * 100) : null
    p.stats.savePct = saves + conceded > 0 ? Math.round(saves / (saves + conceded) * 100) : null
  })

  const players = Object.values(playerMap)
  const scorers = players.filter(p => p.role !== 'goalkeeper' && p.stats.goals + p.stats.misses > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals)
  const goalkeepers = players.filter(p => p.role === 'goalkeeper' && p.stats.saves + p.stats.conceded > 0)
    .sort((a, b) => (b.stats.savePct ?? 0) - (a.stats.savePct ?? 0))

  // Tendencia: goles por partido (cronológico)
  const trend = [...results].sort((a, b) => a.createdAt - b.createdAt)

  return (
    <div style={page}>
      <div style={{ padding: '48px 16px 12px', position: 'sticky', top: 0, background: '#030712', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <button onClick={onBack} style={linkBtn}><ChevronLeft size={16} /> Volver</button>
          <button onClick={() => printSeasonReport(matches, playerMap)} style={exportBtn}><FileText size={13} /> Exportar PDF</button>
        </div>
        <h1 style={h1}>Temporada</h1>
        <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{matches.length} partido{matches.length !== 1 ? 's' : ''} registrado{matches.length !== 1 ? 's' : ''}</p>
      </div>

      <div style={{ padding: '0 16px 48px' }}>

        {/* Resultados */}
        <Section title="Resultados">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
            <StatCard label="Victorias" value={wins} color="#4ade80" />
            <StatCard label="Empates" value={draws} color="#facc15" />
            <StatCard label="Derrotas" value={losses} color="#f87171" />
          </div>
          {(wins + draws + losses) > 0 && (
            <ResultBar wins={wins} draws={draws} losses={losses} />
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            <StatCard label="Goles a favor" value={goalsFor} color="#4ade80" />
            <StatCard label="Goles en contra" value={goalsAgainst} color="#f87171" />
          </div>
        </Section>

        {/* Stats de equipo */}
        <Section title="Estadísticas de equipo">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
            <StatCard label="Goles" value={totalGoals} color="#4ade80" />
            <StatCard label="Fallos" value={totalMisses} color="#facc15" />
            <PctStatCard label="Eficacia" success={totalGoals} total={totalGoals + totalMisses} color="#a78bfa" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
            <StatCard label="Paradas" value={totalSaves} color="#60a5fa" />
            <StatCard label="Encajados" value={totalConceded} color="#c084fc" />
            <PctStatCard label="% Paradas" success={totalSaves} total={totalSaves + totalConceded} color="#818cf8" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <StatCard label="Exclusiones" value={totalExclusions} color="#f87171" />
            <StatCard label="Pérdidas" value={totalTurnovers} color="#fb923c" />
          </div>
        </Section>

        {/* Tendencia de goles por partido */}
        {trend.length > 1 && (
          <Section title="Goles por partido">
            <GoalTrendChart matches={trend} />
          </Section>
        )}

        {/* Ranking goleadoras */}
        {scorers.length > 0 && (
          <Section title="Ranking goleadoras">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {scorers.map((p, i) => (
                <PlayerRankRow key={p.id} player={p} rank={i + 1} mode="scorer"
                  onExport={() => printPlayerSeasonReport(p, matches.filter(m => m.players.some(pl => pl.id === p.id)))} />
              ))}
            </div>
          </Section>
        )}

        {/* Ranking porteras */}
        {goalkeepers.length > 0 && (
          <Section title="Ranking porteras">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {goalkeepers.map((p, i) => (
                <PlayerRankRow key={p.id} player={p} rank={i + 1} mode="goalkeeper"
                  onExport={() => printPlayerSeasonReport(p, matches.filter(m => m.players.some(pl => pl.id === p.id)))} />
              ))}
            </div>
          </Section>
        )}

        {/* Partidos */}
        <Section title="Partidos">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...results].sort((a, b) => b.createdAt - a.createdAt).map(m => (
              <MatchResultRow key={m.id} match={m} onOpen={() => onOpenMatch(m.id)} />
            ))}
          </div>
        </Section>

      </div>
    </div>
  )
}

// ── Components ──────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ color: '#6b7280', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
      <div style={{ color, fontSize: 22, fontWeight: 700 }}>{value}</div>
      <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{label}</div>
    </div>
  )
}

function PctStatCard({ label, success, total, color }) {
  const pct = total > 0 ? Math.round(success / total * 100) : null
  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
      <div style={{ color, fontSize: 22, fontWeight: 700 }}>{pct != null ? `${pct}%` : '-'}</div>
      <div style={{ color, fontSize: 12, fontWeight: 600, opacity: 0.7 }}>{total > 0 ? `${success}/${total}` : '0/0'}</div>
      <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{label}</div>
    </div>
  )
}

function ResultBar({ wins, draws, losses }) {
  const total = wins + draws + losses
  return (
    <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
      {wins > 0 && <div style={{ flex: wins, background: '#16a34a' }} />}
      {draws > 0 && <div style={{ flex: draws, background: '#ca8a04' }} />}
      {losses > 0 && <div style={{ flex: losses, background: '#dc2626' }} />}
    </div>
  )
}

function PlayerRankRow({ player, rank, mode, onExport }) {
  const s = player.stats
  const isGK = mode === 'goalkeeper'
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`
  return (
    <div style={{ display: 'flex', alignItems: 'center', background: '#1f2937', borderRadius: 12, padding: '12px 14px', gap: 12 }}>
      <span style={{ fontSize: rank <= 3 ? 18 : 14, minWidth: 28, color: '#9ca3af' }}>{medal}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>#{player.number} {player.name}</div>
        <div style={{ color: '#6b7280', fontSize: 12 }}>{player.matchCount} partido{player.matchCount !== 1 ? 's' : ''}</div>
      </div>
      {isGK ? (
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: 18 }}>{s.savePct != null ? `${s.savePct}%` : '-'}</div>
          <div style={{ color: '#6b7280', fontSize: 11 }}>{s.saves} paradas</div>
        </div>
      ) : (
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#4ade80', fontWeight: 700, fontSize: 18 }}>{s.goals} goles</div>
          <div style={{ color: '#6b7280', fontSize: 11 }}>{s.shootingPct != null ? `${s.shootingPct}% eficacia` : `${s.goals + s.misses} lanz.`}</div>
        </div>
      )}
      {onExport && (
        <button onClick={onExport} style={{ background: '#0d2456', color: '#7eb3ff', border: '1px solid #1e3a7a', borderRadius: 8, padding: '6px 10px', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}><FileText size={13} /></button>
      )}
    </div>
  )
}

function MatchResultRow({ match, onOpen }) {
  const res = match.result
  const resColor = res === 'W' ? '#4ade80' : res === 'L' ? '#f87171' : res === 'D' ? '#facc15' : '#6b7280'
  const resLabel = res === 'W' ? 'V' : res === 'L' ? 'D' : res === 'D' ? 'E' : '?'
  return (
    <button onClick={onOpen} style={{ width: '100%', background: '#1f2937', border: 'none', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: 'white', textAlign: 'left' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: resColor + '22', border: `2px solid ${resColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: resColor, fontSize: 13, flexShrink: 0 }}>
        {resLabel}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>vs {match.rival}</div>
        <div style={{ color: '#6b7280', fontSize: 12 }}>{match.date}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>
          <span style={{ color: '#4ade80' }}>{match.ourGoals}</span>
          <span style={{ color: '#6b7280', margin: '0 4px' }}>-</span>
          <span style={{ color: '#f87171' }}>{match.rivalGoals ?? '?'}</span>
        </div>
        <div style={{ color: '#6b7280', fontSize: 11 }}>{match.events.length} acciones</div>
      </div>
    </button>
  )
}

function GoalTrendChart({ matches }) {
  const maxGoals = Math.max(...matches.map(m => Math.max(m.ourGoals, m.rivalGoals ?? 0)), 1)
  const w = 100 / matches.length
  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80, marginBottom: 8 }}>
        {matches.map((m, i) => (
          <div key={m.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ width: '45%', background: '#16a34a', borderRadius: '3px 3px 0 0', height: `${(m.ourGoals / maxGoals) * 100}%`, minHeight: m.ourGoals > 0 ? 4 : 0 }} />
          </div>
        ))}
      </div>
      {/* Labels */}
      <div style={{ display: 'flex', gap: 4 }}>
        {matches.map((m, i) => (
          <div key={m.id} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ color: m.result === 'W' ? '#4ade80' : m.result === 'L' ? '#f87171' : m.result === 'D' ? '#facc15' : '#6b7280', fontSize: 10, fontWeight: 700 }}>
              {m.ourGoals}{m.rivalGoals != null ? `-${m.rivalGoals}` : ''}
            </div>
            <div style={{ color: '#4b5563', fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.rival.slice(0, 5)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <LegendDot color="#4ade80" label="Nuestros goles" />
      </div>
    </div>
  )
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ width: 8, height: 8, background: color, borderRadius: 2 }} />
      <span style={{ color: '#6b7280', fontSize: 11 }}>{label}</span>
    </div>
  )
}

const page = { minHeight: '100dvh', background: '#030712', color: 'white', fontFamily: 'system-ui, sans-serif' }
const linkBtn = { color: '#9ca3af', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', padding: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }
const exportBtn = { background: '#0d2456', color: '#7eb3ff', border: '1px solid #1e3a7a', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }
const h1 = { margin: '4px 0 0', fontSize: 26, fontWeight: 700 }
