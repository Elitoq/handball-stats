import { ChevronLeft, Shield, User, FileText } from 'lucide-react'
import { getPlayerStats, GOAL_ZONES, SHOT_TYPES } from '../data/store'
import { printPlayerSeasonReport } from '../reports/generateReport'
import { t, tv } from '../i18n'

const bg = '#030712'
const card = '#0d1117'
const border = '#1f2937'
const muted = '#6b7280'

export default function PlayerSeasonView({ player, allMatches, lang = 'es', onBack }) {
  if (!player) return null

  const isGK = player.role === 'goalkeeper'

  const matchRows = allMatches
    .filter(m => Array.isArray(m.events))
    .map(m => ({ match: m, stats: getPlayerStats(m, player.id) }))
    .filter(({ stats: s }) => s.goals + s.misses + s.saves + s.conceded + s.exclusions + s.turnovers > 0)
    .sort((a, b) => (b.match.createdAt ?? 0) - (a.match.createdAt ?? 0))

  let totalGoals = 0, totalMisses = 0, totalSaves = 0, totalConceded = 0, totalExcl = 0, totalTurn = 0
  matchRows.forEach(({ stats: s }) => {
    totalGoals += s.goals; totalMisses += s.misses
    totalSaves += s.saves; totalConceded += s.conceded
    totalExcl  += s.exclusions; totalTurn += s.turnovers
  })

  const effPct  = totalGoals + totalMisses   > 0 ? Math.round(totalGoals  / (totalGoals  + totalMisses)   * 100) : null
  const savePct = totalSaves + totalConceded > 0 ? Math.round(totalSaves  / (totalSaves  + totalConceded) * 100) : null

  const successEvents = matchRows.flatMap(r => isGK ? r.stats.saveEvents    : r.stats.goalEvents)
  const totalEvents   = matchRows.flatMap(r => isGK
    ? [...r.stats.saveEvents, ...r.stats.concededEvents]
    : [...r.stats.goalEvents, ...r.stats.missEvents])

  return (
    <div style={{ minHeight: '100dvh', background: bg, color: 'white', fontFamily: 'system-ui, sans-serif', paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ padding: '48px 16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button onClick={onBack} style={{ color: muted, background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} /> {t('back', lang)}
          </button>
          {matchRows.length > 0 && (
            <button onClick={() => printPlayerSeasonReport(player, matchRows.map(r => r.match), lang)}
              style={{ background: '#0d2456', color: '#7eb3ff', border: '1px solid #1e3a7a', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
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
            <div style={{ color: muted, fontSize: 13, marginTop: 2 }}>
              {isGK ? t('squad.role_gk', lang) : t('squad.role_player', lang)}
              {' · '}{matchRows.length} {lang === 'en' ? 'matches' : 'partidos'}
            </div>
          </div>
        </div>
      </div>

      {matchRows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 16px', color: '#6b7280', fontSize: 15 }}>
          {lang === 'en' ? 'No match data recorded yet.' : 'Sin datos de partido registrados aún.'}
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>

          {/* Totals */}
          <Label>{lang === 'en' ? 'Season summary' : 'Resumen de temporada'}</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
            {isGK ? (
              <>
                <Box label={lang === 'en' ? 'Saves' : 'Paradas'}     value={totalSaves}    color="#3b82f6" />
                <Box label={lang === 'en' ? 'Conceded' : 'Encajados'} value={totalConceded} color="#ef4444" />
                <Box label={lang === 'en' ? 'Save %' : '% paradas'}   value={savePct != null ? `${savePct}%` : '—'} color="#7eb3ff" />
              </>
            ) : (
              <>
                <Box label={lang === 'en' ? 'Goals' : 'Goles'}        value={totalGoals}  color="#22c55e" />
                <Box label={lang === 'en' ? 'Misses' : 'Fallos'}      value={totalMisses} color="#facc15" />
                <Box label={lang === 'en' ? 'Efficiency' : 'Eficacia'} value={effPct != null ? `${effPct}%` : '—'} color="#4ade80" />
              </>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 24 }}>
            <Box label={lang === 'en' ? 'Excl.' : 'Exclusiones'}    value={totalExcl}  color="#ef4444" small />
            <Box label={lang === 'en' ? 'Turnovers' : 'Pérdidas'}   value={totalTurn}  color="#f97316" small />
            <Box label={lang === 'en' ? 'Per match' : 'Por partido'}
              value={isGK
                ? (savePct != null ? `${savePct}%` : '—')
                : (matchRows.length > 0 ? (totalGoals / matchRows.length).toFixed(1) : '—')}
              color="#a78bfa" small />
          </div>

          {/* Zone heatmap */}
          {totalEvents.length > 0 && (
            <>
              <Label>{lang === 'en' ? 'Zone efficiency (season)' : 'Eficacia por zona (temporada)'}</Label>
              <div style={{ marginBottom: 24 }}>
                <ZoneHeatmap successEvents={successEvents} totalEvents={totalEvents} isGK={isGK} lang={lang} />
              </div>
            </>
          )}

          {/* Shot type */}
          {totalEvents.length > 0 && (
            <>
              <Label>{isGK
                ? (lang === 'en' ? 'Shots received by type' : 'Disparos recibidos por tipo')
                : (lang === 'en' ? 'Shot type breakdown' : 'Desglose por tipo de lanzamiento')}
              </Label>
              <div style={{ marginBottom: 24 }}>
                <ShotTypeChart
                  events={totalEvents}
                  successEvents={successEvents}
                  isGK={isGK}
                  lang={lang}
                />
              </div>
            </>
          )}

          {/* Per-match history */}
          <Label>{lang === 'en' ? 'Match history' : 'Historial de partidos'}</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matchRows.map(({ match: m, stats: s }) => {
              const eff = isGK
                ? (s.saves + s.conceded > 0 ? `${Math.round(s.saves / (s.saves + s.conceded) * 100)}%` : null)
                : (s.goals + s.misses  > 0 ? `${Math.round(s.goals  / (s.goals  + s.misses)  * 100)}%` : null)
              const ourGoals = m.events.filter(e => e.type === 'goal').length
              return (
                <div key={m.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>vs {m.rival}</div>
                      <div style={{ color: muted, fontSize: 12, marginTop: 1 }}>{m.date}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#7eb3ff' }}>{ourGoals} — {m.rivalGoals ?? 0}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {isGK ? (
                      <>
                        <Pill label={lang === 'en' ? 'Saves' : 'Paradas'}   value={s.saves}    color="#3b82f6" />
                        <Pill label={lang === 'en' ? 'Conceded' : 'Encaj.'} value={s.conceded} color="#ef4444" />
                        {eff && <Pill label="%" value={eff} color="#7eb3ff" />}
                      </>
                    ) : (
                      <>
                        <Pill label={lang === 'en' ? 'Goals' : 'Goles'} value={s.goals} color="#22c55e" />
                        {s.misses > 0 && <Pill label={lang === 'en' ? 'Miss' : 'Fallos'} value={s.misses} color="#facc15" />}
                        {eff && <Pill label="%" value={eff} color="#4ade80" />}
                      </>
                    )}
                    {s.exclusions > 0 && <Pill label="Excl." value={s.exclusions} color="#ef4444" />}
                    {s.turnovers  > 0 && <Pill label={lang === 'en' ? 'TO' : 'Pérd.'} value={s.turnovers} color="#f97316" />}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}
      <div style={{ textAlign: 'center', padding: '24px 0 8px', color: '#374151', fontSize: 12 }}>
        Crafted by <span style={{ color: '#4b5563', fontWeight: 600 }}>Eliot</span>
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────

function Label({ children }) {
  return <div style={{ color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{children}</div>
}

function Box({ label, value, color, small }) {
  return (
    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: small ? '10px 8px' : '16px 8px', textAlign: 'center' }}>
      <div style={{ color, fontSize: small ? 18 : 26, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ color: muted, fontSize: 11, marginTop: small ? 4 : 6 }}>{label}</div>
    </div>
  )
}

function Pill({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: color + '18', border: `1px solid ${color}33`, borderRadius: 8, padding: '3px 8px' }}>
      <span style={{ color, fontWeight: 700, fontSize: 13 }}>{value}</span>
      <span style={{ color: muted, fontSize: 11 }}>{label}</span>
    </div>
  )
}

// ── ZoneHeatmap ───────────────────────────────────────────────────

function ZoneHeatmap({ successEvents, totalEvents, isGK, lang }) {
  const zones = GOAL_ZONES.slice(0, 6)
  const color = isGK ? '#2563eb' : '#16a34a'

  const data = zones.map(z => {
    const succ  = successEvents.filter(e => e.details?.zone === z).length
    const total = totalEvents.filter(e => e.details?.zone === z).length
    return { succ, total, pct: total > 0 ? Math.round(succ / total * 100) : null }
  })
  const maxSucc = Math.max(...data.map(d => d.succ), 1)

  function fill(succ) {
    if (succ === 0) return 'rgba(255,255,255,0.04)'
    const t = succ / maxSucc
    return isGK
      ? (t < 0.35 ? '#1e3a5f' : t < 0.65 ? '#1d4ed8' : '#3b82f6')
      : (t < 0.35 ? '#14532d' : t < 0.65 ? '#15803d' : '#22c55e')
  }

  const W = 300, H = 160, pad = 20
  const gW = W - pad * 2, gH = H - 30
  const zW = gW / 3, zH = gH / 2, post = 4
  const cells = [
    { x: pad,          y: 0,  i: 0 }, { x: pad + zW,     y: 0,  i: 1 }, { x: pad + zW * 2, y: 0,  i: 2 },
    { x: pad,          y: zH, i: 3 }, { x: pad + zW,     y: zH, i: 4 }, { x: pad + zW * 2, y: zH, i: 5 },
  ]

  return (
    <div style={{ background: '#111827', borderRadius: 14, padding: '14px 12px 10px' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        {cells.map(({ x, y, i }) => (
          <g key={i}>
            <rect x={x} y={y} width={zW} height={zH} fill={fill(data[i].succ)} />
            {i !== 0 && i !== 3 && <line x1={x} y1={y} x2={x} y2={y + zH} stroke="#1f2937" strokeWidth={1} />}
            {i < 3 && <line x1={x} y1={zH} x2={x + zW} y2={zH} stroke="#1f2937" strokeWidth={1} />}
            {data[i].total > 0 ? (
              <>
                <text x={x + zW / 2} y={y + zH / 2 - 7}  textAnchor="middle" fill="white" fontSize={14} fontWeight="700">{data[i].succ}/{data[i].total}</text>
                <text x={x + zW / 2} y={y + zH / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={12}>{data[i].pct}%</text>
              </>
            ) : (
              <text x={x + zW / 2} y={y + zH / 2 + 5} textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize={13}>—</text>
            )}
          </g>
        ))}
        <rect x={pad - post} y={-2} width={post}            height={gH + 2}      fill="#6b7280" rx={2} />
        <rect x={pad + gW}   y={-2} width={post}            height={gH + 2}      fill="#6b7280" rx={2} />
        <rect x={pad - post} y={-2} width={gW + post * 2}   height={post}        fill="#6b7280" rx={2} />
        <line x1={pad - post} y1={gH} x2={pad + gW + post} y2={gH} stroke="#374151" strokeWidth={1.5} />
        {['Izq', 'Centro', 'Der'].map((lbl, i) => (
          <text key={i} x={pad + zW * i + zW / 2} y={gH + 20} textAnchor="middle" fill="#4b5563" fontSize={10}>
            {lang === 'en' ? ['Left', 'Centre', 'Right'][i] : lbl}
          </text>
        ))}
      </svg>
    </div>
  )
}

// ── ShotTypeChart ─────────────────────────────────────────────────

function ShotTypeChart({ events, successEvents, isGK, lang }) {
  const successIds = new Set(successEvents.map(e => e.id))
  const color = isGK ? '#3b82f6' : '#22c55e'
  const hitsLabel = isGK ? (lang === 'en' ? 'Saves' : 'Paradas') : (lang === 'en' ? 'Goals' : 'Goles')

  const counts = SHOT_TYPES
    .map(s => {
      const evs = events.filter(e => e.details?.shotType === s)
      return { key: s, label: tv('shot', s, lang), total: evs.length, success: evs.filter(e => successIds.has(e.id)).length }
    })
    .filter(x => x.total > 0)

  if (counts.length === 0) return (
    <div style={{ color: muted, fontSize: 13, padding: '8px 0' }}>{t('mstats.no_type', lang)}</div>
  )

  const max = Math.max(...counts.map(c => c.total))
  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: 16 }}>
      {counts.map(({ key, label, total, success }) => (
        <div key={key} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>{label}</span>
            <span style={{ color: muted, fontSize: 12 }}>{success}/{total}</span>
          </div>
          <div style={{ background: '#374151', borderRadius: 999, height: 8, position: 'relative' }}>
            <div style={{ width: `${(total    / max) * 100}%`, background: '#4b5563', height: 8, borderRadius: 999, position: 'absolute' }} />
            <div style={{ width: `${(success  / max) * 100}%`, background: color,    height: 8, borderRadius: 999, position: 'absolute' }} />
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: color,    borderRadius: 2 }} />
          <span style={{ color: muted, fontSize: 11 }}>{hitsLabel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: '#4b5563', borderRadius: 2 }} />
          <span style={{ color: muted, fontSize: 11 }}>Total</span>
        </div>
      </div>
    </div>
  )
}
