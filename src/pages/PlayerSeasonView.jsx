import { ChevronLeft, Shield, User, FileText } from 'lucide-react'
import { getPlayerStats, GOAL_ZONES, SHOT_TYPES } from '../data/store'
import { printPlayerSeasonReport } from '../reports/generateReport'
import { t, tv } from '../i18n'

const s = { bg: '#030712', card: '#0d1117', border: '#1f2937', muted: '#6b7280', text: 'white', accent: '#7eb3ff' }

export default function PlayerSeasonView({ player, allMatches, lang = 'es', onBack }) {
  if (!player) return null

  const isGK = player.role === 'goalkeeper'

  // Same logic as buildPlayerSeasonReport in generateReport.js
  const matchRows = allMatches
  .filter(m => Array.isArray(m.events))
  .map(m => {
    const st = getPlayerStats(m, player.id)
    return { match: m, stats: st }
  }).filter(({ stats: st }) =>
    st.goals + st.misses + st.saves + st.conceded + st.exclusions + st.turnovers > 0
  ).sort((a, b) => (b.match.createdAt ?? 0) - (a.match.createdAt ?? 0))

  let totalGoals = 0, totalMisses = 0, totalSaves = 0, totalConceded = 0, totalExcl = 0, totalTurn = 0
  matchRows.forEach(({ stats: st }) => {
    totalGoals    += st.goals
    totalMisses   += st.misses
    totalSaves    += st.saves
    totalConceded += st.conceded
    totalExcl     += st.exclusions
    totalTurn     += st.turnovers
  })

  const effPct  = totalGoals + totalMisses > 0 ? Math.round(totalGoals / (totalGoals + totalMisses) * 100) : null
  const savePct = totalSaves + totalConceded > 0 ? Math.round(totalSaves / (totalSaves + totalConceded) * 100) : null

  const allSuccessEvents = matchRows.flatMap(r => isGK ? r.stats.saveEvents    : r.stats.goalEvents)
  const allTotalEvents   = matchRows.flatMap(r => isGK
    ? [...r.stats.saveEvents, ...r.stats.concededEvents]
    : [...r.stats.goalEvents, ...r.stats.missEvents])

  // Matches list for PDF export (uses same filter as generateReport)
  const matchesForPdf = matchRows.map(r => r.match)

  return (
    <div style={{ minHeight: '100dvh', background: s.bg, color: s.text, fontFamily: 'system-ui, sans-serif', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ padding: '48px 16px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <button onClick={onBack} style={{ color: s.muted, background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} /> {t('back', lang)}
          </button>
          {matchesForPdf.length > 0 && (
            <button onClick={() => printPlayerSeasonReport(player, matchesForPdf, lang)}
              style={{ background: '#0d2456', color: s.accent, border: '1px solid #1e3a7a', borderRadius: 8, padding: '6px 10px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <FileText size={13} /> PDF
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#0d2456', border: '1px solid #1e3a7a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isGK ? <Shield size={24} color="#7eb3ff" /> : <User size={24} color="#7eb3ff" />}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>#{player.number} {player.name}</div>
            <div style={{ color: s.muted, fontSize: 13, marginTop: 2 }}>
              {isGK ? t('squad.role_gk', lang) : t('squad.role_player', lang)}
              {' · '}{matchRows.length} {lang === 'en' ? 'matches' : 'partidos'}
            </div>
          </div>
        </div>
      </div>

      {matchRows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#4b5563', fontSize: 14 }}>
          {lang === 'en' ? 'No match data recorded yet.' : 'Sin datos de partido registrados.'}
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>

          {/* Season totals */}
          <SectionTitle>{lang === 'en' ? 'Season summary' : 'Resumen de temporada'}</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
            {isGK ? [
              { label: lang === 'en' ? 'Saves' : 'Paradas',    value: totalSaves,    color: '#3b82f6' },
              { label: lang === 'en' ? 'Conceded' : 'Encajados', value: totalConceded, color: '#ef4444' },
              { label: lang === 'en' ? 'Save %' : '% paradas',  value: savePct != null ? `${savePct}%` : '—', color: '#7eb3ff' },
            ] : [
              { label: lang === 'en' ? 'Goals' : 'Goles',        value: totalGoals,  color: '#22c55e' },
              { label: lang === 'en' ? 'Misses' : 'Fallos',      value: totalMisses, color: '#facc15' },
              { label: lang === 'en' ? 'Efficiency' : 'Eficacia', value: effPct != null ? `${effPct}%` : '—', color: '#4ade80' },
            ].map(({ label, value, color }) => (
              <StatBox key={label} label={label} value={value} color={color} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
            <StatBox label={lang === 'en' ? 'Excl.' : 'Exclusiones'} value={totalExcl} color="#ef4444" small />
            <StatBox label={lang === 'en' ? 'Turnovers' : 'Pérdidas'} value={totalTurn} color="#f97316" small />
            <StatBox label={lang === 'en' ? 'Goals/match' : 'Goles/partido'}
              value={isGK ? '—' : (totalGoals / matchRows.length).toFixed(1)} color="#a78bfa" small />
          </div>

          {/* Zone heatmap */}
          {allTotalEvents.length > 0 && (
            <>
              <SectionTitle>{lang === 'en' ? 'Zone efficiency map (season)' : 'Mapa de eficacia por zona (temporada)'}</SectionTitle>
              <div style={{ marginBottom: 20 }}>
                <ZoneHeatmap successEvents={allSuccessEvents} totalEvents={allTotalEvents} color={isGK ? '#2563eb' : '#16a34a'} lang={lang} />
              </div>
            </>
          )}

          {/* Shot type breakdown */}
          {allTotalEvents.length > 0 && (
            <>
              <SectionTitle>{isGK
                ? (lang === 'en' ? 'Received shot type — season' : 'Tipo de disparo recibido — temporada')
                : (lang === 'en' ? 'Shot type — season' : 'Tipo de lanzamiento — temporada')
              }</SectionTitle>
              <div style={{ marginBottom: 20 }}>
                <ShotTypeChart
                  events={allTotalEvents}
                  goals={allSuccessEvents}
                  color={isGK ? '#3b82f6' : '#22c55e'}
                  lang={lang}
                  hitsLabel={isGK ? (lang === 'en' ? 'Saves' : 'Paradas') : (lang === 'en' ? 'Goals' : 'Goles')}
                />
              </div>
            </>
          )}

          {/* Per-match history */}
          <SectionTitle>{lang === 'en' ? 'Match history' : 'Historial de partidos'}</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matchRows.map(({ match: m, stats: st }) => {
              const eff = isGK
                ? (st.saves + st.conceded > 0 ? `${Math.round(st.saves / (st.saves + st.conceded) * 100)}%` : null)
                : (st.goals + st.misses > 0 ? `${Math.round(st.goals / (st.goals + st.misses) * 100)}%` : null)
              const ourGoals = m.events.filter(e => e.type === 'goal').length
              return (
                <div key={m.id} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 14, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>vs {m.rival}</div>
                      <div style={{ color: s.muted, fontSize: 12, marginTop: 1 }}>{m.date}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{ourGoals} — {m.rivalGoals ?? 0}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {isGK ? (
                      <>
                        <Pill label={lang === 'en' ? 'Saves' : 'Paradas'} value={st.saves} color="#3b82f6" />
                        <Pill label={lang === 'en' ? 'Conceded' : 'Encaj.'} value={st.conceded} color="#ef4444" />
                        {eff && <Pill label="%" value={eff} color="#7eb3ff" />}
                      </>
                    ) : (
                      <>
                        <Pill label={lang === 'en' ? 'Goals' : 'Goles'} value={st.goals} color="#22c55e" />
                        {st.misses > 0 && <Pill label={lang === 'en' ? 'Miss' : 'Fallos'} value={st.misses} color="#facc15" />}
                        {eff && <Pill label="%" value={eff} color="#4ade80" />}
                      </>
                    )}
                    {st.exclusions > 0 && <Pill label="Excl." value={st.exclusions} color="#ef4444" />}
                    {st.turnovers  > 0 && <Pill label={lang === 'en' ? 'TO' : 'Pérd.'} value={st.turnovers} color="#f97316" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────

function SectionTitle({ children }) {
  return <div style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{children}</div>
}

function StatBox({ label, value, color, small }) {
  return (
    <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 14, padding: small ? '10px 8px' : '16px 8px', textAlign: 'center' }}>
      <div style={{ color, fontSize: small ? 18 : 26, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ color: '#6b7280', fontSize: 11, marginTop: small ? 4 : 6 }}>{label}</div>
    </div>
  )
}

function Pill({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: color + '18', border: `1px solid ${color}33`, borderRadius: 8, padding: '3px 8px' }}>
      <span style={{ color, fontWeight: 700, fontSize: 13 }}>{value}</span>
      <span style={{ color: '#6b7280', fontSize: 11 }}>{label}</span>
    </div>
  )
}

// ── ZoneHeatmap (goal frame SVG) ─────────────────────────────────

function ZoneHeatmap({ successEvents, totalEvents, color, lang }) {
  const zones = GOAL_ZONES.slice(0, 6)
  const isBlue = color.includes('2563')

  const data = zones.map(z => {
    const success = successEvents.filter(e => e.details?.zone === z).length
    const total   = totalEvents.filter(e => e.details?.zone === z).length
    const pct     = total > 0 ? Math.round(success / total * 100) : null
    return { success, total, pct }
  })
  const maxSuccess = Math.max(...data.map(d => d.success), 1)

  function cellFill(success) {
    if (success === 0) return 'rgba(255,255,255,0.04)'
    const t = success / maxSuccess
    if (isBlue) return t < 0.35 ? '#1e3a5f' : t < 0.65 ? '#1d4ed8' : '#3b82f6'
    return t < 0.35 ? '#14532d' : t < 0.65 ? '#15803d' : '#22c55e'
  }

  const W = 300, H = 160, pad = 20
  const gW = W - pad * 2, gH = H - 30
  const zW = gW / 3, zH = gH / 2, post = 4

  const cells = [
    { x: pad,          y: 0,  w: zW, h: zH, i: 0 },
    { x: pad + zW,     y: 0,  w: zW, h: zH, i: 1 },
    { x: pad + zW * 2, y: 0,  w: zW, h: zH, i: 2 },
    { x: pad,          y: zH, w: zW, h: zH, i: 3 },
    { x: pad + zW,     y: zH, w: zW, h: zH, i: 4 },
    { x: pad + zW * 2, y: zH, w: zW, h: zH, i: 5 },
  ]

  return (
    <div style={{ background: '#111827', borderRadius: 14, padding: '14px 12px 10px' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        {cells.map(({ x, y, w, h, i }) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill={cellFill(data[i].success)} />
            {i !== 0 && i !== 3 && <line x1={x} y1={y} x2={x} y2={y + h} stroke="#1f2937" strokeWidth={1} />}
            {i < 3 && <line x1={x} y1={zH} x2={x + w} y2={zH} stroke="#1f2937" strokeWidth={1} />}
            {data[i].total > 0 ? (
              <>
                <text x={x + w / 2} y={y + h / 2 - 7} textAnchor="middle" fill="white" fontSize={14} fontWeight="700">{data[i].success}/{data[i].total}</text>
                <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={12}>{data[i].pct}%</text>
              </>
            ) : (
              <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize={13}>—</text>
            )}
          </g>
        ))}
        <rect x={pad - post} y={-2} width={post} height={gH + 2} fill="#6b7280" rx={2} />
        <rect x={pad + gW}   y={-2} width={post} height={gH + 2} fill="#6b7280" rx={2} />
        <rect x={pad - post} y={-2} width={gW + post * 2} height={post} fill="#6b7280" rx={2} />
        <line x1={pad - post} y1={gH} x2={pad + gW + post} y2={gH} stroke="#374151" strokeWidth={1.5} />
        {['Izq', 'Centro', 'Der'].map((lbl, i) => (
          <text key={lbl} x={pad + zW * i + zW / 2} y={gH + 20} textAnchor="middle" fill="#4b5563" fontSize={10}>
            {lang === 'en' ? ['Left','Centre','Right'][i] : lbl}
          </text>
        ))}
      </svg>
    </div>
  )
}

// ── ShotTypeChart ────────────────────────────────────────────────

function ShotTypeChart({ events, goals, color, lang, hitsLabel }) {
  const goalIds = new Set(goals.map(e => e.id))
  const types = events.map(e => e.details?.shotType).filter(Boolean)
  if (types.length === 0) return <div style={{ color: '#4b5563', fontSize: 13, padding: '8px 0' }}>{t('mstats.no_type', lang)}</div>

  const counts = SHOT_TYPES.map(s => {
    const evs = events.filter(e => e.details?.shotType === s)
    return { key: s, label: tv('shot', s, lang), total: evs.length, success: evs.filter(e => goalIds.has(e.id)).length }
  }).filter(x => x.total > 0)
  const max = Math.max(...counts.map(c => c.total))

  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: 16 }}>
      {counts.map(({ key, label, total, success }) => (
        <div key={key} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>{label}</span>
            <span style={{ color: '#6b7280', fontSize: 12 }}>{success}/{total}</span>
          </div>
          <div style={{ background: '#374151', borderRadius: 999, height: 8, position: 'relative' }}>
            <div style={{ width: `${(total / max) * 100}%`, background: '#4b5563', height: 8, borderRadius: 999, position: 'absolute' }} />
            <div style={{ width: `${(success / max) * 100}%`, background: color, height: 8, borderRadius: 999, position: 'absolute' }} />
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
          <span style={{ color: '#6b7280', fontSize: 11 }}>{hitsLabel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: '#4b5563', borderRadius: 2 }} />
          <span style={{ color: '#6b7280', fontSize: 11 }}>Total</span>
        </div>
      </div>
    </div>
  )
}
