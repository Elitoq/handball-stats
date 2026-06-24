import { useState, useMemo } from 'react'
import { User, Shield, Award, FileText, ChevronLeft, Target, ShieldOff, UserMinus, ArrowRightLeft } from 'lucide-react'
import { loadData, getPlayerStats, calcPlayerRating, ratingLabel, ratingColor, GOAL_ZONES, SHOT_TYPES } from '../data/store'
import { printMatchReport, printPlayerMatchReport } from '../reports/generateReport'
import { t, tv } from '../i18n'

const ZONE_LABELS = GOAL_ZONES.slice(0, 6).map(z =>
  z.replace(' alto', '↑').replace(' bajo', '↓').replace('Izq.', 'I').replace('Der.', 'D').replace('Centro', 'C')
)

export default function MatchStats({ matchId, onBack, lang = 'es' }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const data = loadData()
  const match = data.matches.find(m => m.id === matchId)
  if (!match) return null

  if (selectedPlayer) {
    const player = match.players.find(p => p.id === selectedPlayer)
    return (
      <PlayerDetail
        match={match}
        player={player}
        stats={getPlayerStats(match, selectedPlayer)}
        onBack={() => setSelectedPlayer(null)}
        lang={lang}
      />
    )
  }

  return <TeamOverview match={match} onSelectPlayer={setSelectedPlayer} onBack={onBack} lang={lang} />
}

// ── Team overview ──────────────────────────────────────────────

function TeamOverview({ match, onSelectPlayer, onBack, lang }) {
  const [periodFilter, setPeriodFilter] = useState(0)
  const showRatings = loadData().settings?.showRatings ?? true

  const hasPeriods = match.events.some(e => e.period === 2)

  const evs = useMemo(() =>
    periodFilter === 0 ? match.events : match.events.filter(e => (e.period ?? 1) === periodFilter),
    [match.events, periodFilter]
  )

  const goals = evs.filter(e => e.type === 'goal')
  const misses = evs.filter(e => e.type === 'miss')
  const saves = evs.filter(e => e.type === 'save')
  const conceded = evs.filter(e => e.type === 'conceded')
  const exclusions = evs.filter(e => e.type === 'exclusion')
  const turnovers = evs.filter(e => e.type === 'turnover')

  const filteredMatch = periodFilter === 0 ? match : { ...match, events: evs }
  const playersWithStats = match.players
    .map(p => ({ ...p, stats: getPlayerStats(filteredMatch, p.id) }))
    .filter(p => {
      const s = p.stats
      return s.goals + s.saves + s.exclusions + s.turnovers > 0
    })
    .sort((a, b) => (b.stats.goals + b.stats.saves) - (a.stats.goals + a.stats.saves))

  return (
    <div style={{ minHeight: '100dvh', background: '#030712', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '48px 16px 12px', position: 'sticky', top: 0, background: '#030712', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <button onClick={onBack} style={linkBtn}><ChevronLeft size={16} /> {t('back', lang)}</button>
          <button onClick={() => printMatchReport(match, lang)} style={exportBtn}><FileText size={13} /> {t('export_pdf', lang)}</button>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{match.teamName} vs {match.rival}</div>
        <div style={{ color: '#6b7280', fontSize: 13 }}>{match.date}</div>
        {hasPeriods && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {[[t('mstats.all', lang), 0], [t('mstats.p1', lang), 1], [t('mstats.p2', lang), 2]].map(([label, val]) => (
              <button
                key={val}
                onClick={() => setPeriodFilter(val)}
                style={{
                  padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: periodFilter === val ? '#1e3a7a' : '#1f2937',
                  color: periodFilter === val ? '#7eb3ff' : '#6b7280',
                }}
              >{label}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '0 16px 32px' }}>
        <Section title={t('mstats.summary', lang)}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
            <StatCard label={t('stat.goals', lang)}      value={goals.length}   color="#4ade80" />
            <StatCard label={t('stat.misses', lang)}     value={misses.length}  color="#facc15" />
            <PctStatCard label={t('stat.efficiency', lang)} success={goals.length} total={goals.length + misses.length} color="#7eb3ff" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            <StatCard label={t('stat.saves', lang)}    value={saves.length}   color="#60a5fa" />
            <StatCard label={t('stat.conceded', lang)} value={conceded.length} color="#f87171" />
            <PctStatCard label={t('stat.save_pct', lang)} success={saves.length} total={saves.length + conceded.length} color="#7eb3ff" />
          </div>
        </Section>

        {goals.length > 0 && (
          <Section title={t('mstats.goal_map', lang)}>
            <ZoneHeatmap successEvents={goals} totalEvents={[...goals, ...misses]} color="#16a34a" lang={lang} />
          </Section>
        )}

        {saves.length > 0 && (
          <Section title={t('mstats.save_map', lang)}>
            <ZoneHeatmap successEvents={saves} totalEvents={[...saves, ...conceded]} color="#2563eb" lang={lang} />
          </Section>
        )}

        {showRatings && playersWithStats.length > 0 && (() => {
          const rated = playersWithStats
            .map(p => ({ ...p, rating: calcPlayerRating(p.stats, p.role) }))
            .filter(p => p.rating != null)
            .sort((a, b) => b.rating - a.rating)
          const mvp = rated[0]
          if (!mvp) return null
          const rc = ratingColor(mvp.rating)
          return (
            <Section title={t('mstats.mvp', lang)}>
              <div style={{ background: 'linear-gradient(135deg,#0a1628,#0d2456)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <Award size={36} color="#7eb3ff" strokeWidth={1.5} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>#{mvp.number} {mvp.name}</div>
                  <div style={{ color: '#7eb3ff', fontSize: 12, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {mvp.role === 'goalkeeper' ? <><Shield size={11} /> {t('mstats.gk_role', lang)}</> : <><User size={11} /> {t('mstats.pl_role', lang)}</>}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: rc, fontWeight: 900, fontSize: 32, lineHeight: 1 }}>{mvp.rating.toFixed(1)}</div>
                  <div style={{ color: rc, fontSize: 10, opacity: 0.9 }}>{ratingLabel(mvp.rating)}</div>
                </div>
              </div>
            </Section>
          )
        })()}

        {playersWithStats.length > 0 && (
          <Section title={t('mstats.players', lang)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {playersWithStats.map(p => (
                <PlayerRow key={p.id} player={p} onSelect={() => onSelectPlayer(p.id)} lang={lang} />
              ))}
            </div>
          </Section>
        )}

        {match.notes && (
          <Section title={t('mstats.notes', lang)}>
            <div style={{ background: '#1f2937', borderRadius: 12, padding: '14px 16px', color: '#d1d5db', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {match.notes}
            </div>
          </Section>
        )}

        {evs.length > 0 && (
          <Section title={t('mstats.events', lang)}>
            <Timeline events={evs} players={match.players} lang={lang} />
          </Section>
        )}
      </div>
    </div>
  )
}

// ── Player detail ──────────────────────────────────────────────

function PlayerDetail({ match, player, stats, onBack, lang }) {
  const isGoalkeeper = player?.role === 'goalkeeper'
  const showRatings = loadData().settings?.showRatings ?? true

  return (
    <div style={{ minHeight: '100dvh', background: '#030712', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '48px 16px 12px', position: 'sticky', top: 0, background: '#030712', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <button onClick={onBack} style={linkBtn}><ChevronLeft size={16} /> {t('mstats.team_btn', lang)}</button>
          <button onClick={() => printPlayerMatchReport(match, player?.id, lang)} style={exportBtn}><FileText size={13} /> {t('export_pdf', lang)}</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#7eb3ff', fontWeight: 700, fontSize: 20 }}>#{player?.number}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{player?.name}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>
                {isGoalkeeper
                  ? <><Shield size={12} style={{display:'inline',marginRight:3}} />{t('mstats.gk_role', lang)}</>
                  : <><User size={12} style={{display:'inline',marginRight:3}} />{t('mstats.pl_role', lang)}</>}
              </div>
            </div>
          </div>
          {showRatings && (() => {
            const rating = calcPlayerRating(stats, player?.role)
            if (rating == null) return null
            const rc = ratingColor(rating)
            return (
              <div style={{ textAlign: 'center', background: '#1f2937', borderRadius: 12, padding: '8px 14px' }}>
                <div style={{ color: rc, fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{rating.toFixed(1)}</div>
                <div style={{ color: rc, fontSize: 10, opacity: 0.85, marginTop: 2 }}>{ratingLabel(rating)}</div>
              </div>
            )
          })()}
        </div>
      </div>

      <div style={{ padding: '0 16px 32px' }}>
        {isGoalkeeper
          ? <GoalkeeperStats stats={stats} lang={lang} />
          : <FieldPlayerStats stats={stats} lang={lang} />
        }
      </div>
    </div>
  )
}

function FieldPlayerStats({ stats, lang }) {
  const totalShots = stats.goals + stats.misses
  return (
    <>
      <Section title={t('mstats.off_sum', lang)}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
          <StatCard label={t('stat.goals', lang)}      value={stats.goals}  color="#4ade80" />
          <StatCard label={t('stat.misses', lang)}     value={stats.misses} color="#facc15" />
          <PctStatCard label={t('stat.efficiency', lang)} success={stats.goals} total={totalShots} color="#7eb3ff" />
        </div>
        {stats.shootingPct != null && (
          <EfficiencyBar pct={stats.shootingPct} color="#16a34a" label={`${stats.goals} ${t('stat.goals', lang).toLowerCase()} / ${totalShots} ${t('stat.shots', lang).toLowerCase()}`} />
        )}
      </Section>

      {stats.goalEvents.length + stats.missEvents.length > 0 && (
        <Section title={t('mstats.zone_eff', lang)}>
          <ZoneEfficiencyMap
            successEvents={stats.goalEvents}
            totalEvents={[...stats.goalEvents, ...stats.missEvents]}
            successLabel={t('stat.goals', lang)}
            totalLabel={t('stat.shots', lang)}
          />
        </Section>
      )}
      {stats.goalEvents.length + stats.missEvents.length > 0 && (
        <Section title={t('mstats.shot_type', lang)}>
          <ShotTypeChart events={[...stats.goalEvents, ...stats.missEvents]} goals={stats.goalEvents} color="#16a34a" lang={lang} hitsLabel={t('mstats.hits', lang)} />
        </Section>
      )}

      {(stats.exclusions > 0 || stats.turnovers > 0) && (
        <Section title={t('mstats.discipline', lang)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <StatCard label={t('stat.exclusions', lang)} value={stats.exclusions} color="#f87171" />
            <StatCard label={t('stat.turnovers', lang)}  value={stats.turnovers}  color="#fb923c" />
          </div>
        </Section>
      )}

      {stats.goalEvents.length + stats.missEvents.length > 0 && (
        <Section title={t('mstats.shots_min', lang)}>
          <MinuteChart events={[...stats.goalEvents, ...stats.missEvents]} goals={stats.goalEvents} />
        </Section>
      )}
    </>
  )
}

function GoalkeeperStats({ stats, lang }) {
  const totalShots = stats.saves + stats.conceded
  return (
    <>
      <Section title={t('mstats.gk_sum', lang)}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
          <StatCard label={t('stat.saves', lang)}    value={stats.saves}   color="#60a5fa" />
          <StatCard label={t('stat.conceded', lang)} value={stats.conceded} color="#f87171" />
          <PctStatCard label={t('stat.save_pct', lang)} success={stats.saves} total={totalShots} color="#7eb3ff" />
        </div>
        {stats.savePct != null && (
          <EfficiencyBar pct={stats.savePct} color="#2563eb" label={`${stats.saves} ${t('stat.saves', lang).toLowerCase()} / ${totalShots} ${t('stat.shots_rec', lang).toLowerCase()}`} />
        )}
      </Section>

      {stats.saveEvents.length + stats.concededEvents.length > 0 && (
        <Section title={t('mstats.zone_eff', lang)}>
          <ZoneEfficiencyMap
            successEvents={stats.saveEvents}
            totalEvents={[...stats.saveEvents, ...stats.concededEvents]}
            successLabel={t('stat.saves', lang)}
            totalLabel={t('stat.shots_rec', lang)}
          />
        </Section>
      )}
      {stats.saveEvents.length + stats.concededEvents.length > 0 && (
        <Section title={t('mstats.recv_type', lang)}>
          <ShotTypeChart events={[...stats.saveEvents, ...stats.concededEvents]} goals={stats.saveEvents} color="#2563eb" lang={lang} hitsLabel={t('mstats.hits', lang)} />
        </Section>
      )}

      {stats.saveEvents.length + stats.concededEvents.length > 0 && (
        <Section title={t('mstats.shots_recv', lang)}>
          <MinuteChart events={[...stats.saveEvents, ...stats.concededEvents]} goals={stats.saveEvents} />
        </Section>
      )}
    </>
  )
}

// ── Shared components ──────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ color: '#6b7280', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
      <div style={{ color, fontSize: 24, fontWeight: 700 }}>{value}</div>
      <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{label}</div>
    </div>
  )
}

function PctStatCard({ label, success, total, color }) {
  const pct = total > 0 ? Math.round(success / total * 100) : null
  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
      <div style={{ color, fontSize: 24, fontWeight: 700 }}>{pct != null ? `${pct}%` : '-'}</div>
      <div style={{ color, fontSize: 13, fontWeight: 600, opacity: 0.7 }}>{total > 0 ? `${success}/${total}` : '0/0'}</div>
      <div style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>{label}</div>
    </div>
  )
}

function PlayerRow({ player, onSelect, lang }) {
  const s = player.stats
  const isGK = player.role === 'goalkeeper'
  const showRatings = loadData().settings?.showRatings ?? true
  const rating = showRatings ? calcPlayerRating(s, player.role) : null
  const rColor = ratingColor(rating)
  return (
    <button onClick={onSelect} style={{ width: '100%', background: '#1f2937', border: 'none', borderRadius: 14, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#7eb3ff', fontWeight: 700, fontSize: 16, minWidth: 36 }}>#{player.number}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{player.name}</div>
            <div style={{ color: '#6b7280', fontSize: 12 }}>
              {isGK
                ? <><Shield size={11} style={{display:'inline',marginRight:3}} />{t('mstats.gk_role', lang)}</>
                : <><User size={11} style={{display:'inline',marginRight:3}} />{t('mstats.pl_role', lang)}</>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {rating != null && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: rColor, fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{rating.toFixed(1)}</div>
              <div style={{ color: rColor, fontSize: 9, opacity: 0.8 }}>{ratingLabel(rating)}</div>
            </div>
          )}
          <span style={{ color: '#6b7280', fontSize: 13 }}>→</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', textAlign: 'center' }}>
        {(isGK
          ? [
              { label: t('stat.saves', lang),    value: s.saves,    color: '#60a5fa' },
              { label: t('stat.conceded', lang),  value: s.conceded, color: '#f87171' },
              { label: t('stat.par_short', lang), value: s.savePct != null ? `${s.savePct}%` : '-', color: '#7eb3ff' },
              { label: t('stat.excl_short', lang),value: s.exclusions, color: '#f87171' },
            ]
          : [
              { label: t('stat.goals', lang),      value: s.goals,  color: '#4ade80' },
              { label: t('stat.misses', lang),     value: s.misses, color: '#facc15' },
              { label: t('stat.efficiency', lang), value: s.shootingPct != null ? `${s.shootingPct}%` : '-', color: '#7eb3ff' },
              { label: t('stat.turn_short', lang), value: s.turnovers, color: '#fb923c' },
            ]
        ).map(({ label, value, color }) => (
          <div key={label}>
            <div style={{ color, fontWeight: 700, fontSize: 18 }}>{value}</div>
            <div style={{ color: '#6b7280', fontSize: 11 }}>{label}</div>
          </div>
        ))}
      </div>
    </button>
  )
}

// Goal heatmap — drawn as an actual goal frame (3m × 2m, 6 zones)
// zones order: [IzqAlto, CentroAlto, DerAlto, IzqBajo, CentroBajo, DerBajo]
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

  const hasAny = data.some(d => d.total > 0)
  // SVG dimensions: 300 × 160, goal frame with 3px posts
  const W = 300, H = 160
  const pad = 20                   // side space for post labels
  const gW = W - pad * 2           // goal width
  const gH = H - 30                // goal height (top 30px for labels below)
  const zW = gW / 3, zH = gH / 2
  const post = 4

  const cells = [
    // top row
    { x: pad,           y: 0,   w: zW, h: zH, i: 0 },
    { x: pad + zW,      y: 0,   w: zW, h: zH, i: 1 },
    { x: pad + zW * 2,  y: 0,   w: zW, h: zH, i: 2 },
    // bottom row
    { x: pad,           y: zH,  w: zW, h: zH, i: 3 },
    { x: pad + zW,      y: zH,  w: zW, h: zH, i: 4 },
    { x: pad + zW * 2,  y: zH,  w: zW, h: zH, i: 5 },
  ]

  return (
    <div style={{ background: '#111827', borderRadius: 14, padding: '14px 12px 10px' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        {/* Zone cells */}
        {cells.map(({ x, y, w, h, i }) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill={cellFill(data[i].success)} rx={0} />
            {/* dividers */}
            {i === 0 || i === 3 ? null : <line x1={x} y1={y} x2={x} y2={y + h} stroke="#1f2937" strokeWidth={1} />}
            {i < 3 && <line x1={x} y1={zH} x2={x + w} y2={zH} stroke="#1f2937" strokeWidth={1} />}
            {/* label */}
            {data[i].total > 0 ? (
              <>
                <text x={x + w / 2} y={y + h / 2 - 7} textAnchor="middle" fill="white" fontSize={14} fontWeight="700">{`${data[i].success}/${data[i].total}`}</text>
                <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize={12}>{data[i].pct}%</text>
              </>
            ) : (
              <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize={13}>—</text>
            )}
          </g>
        ))}
        {/* Goal frame — posts and crossbar */}
        <rect x={pad - post} y={-2} width={post} height={gH + 2} fill="#6b7280" rx={2} />
        <rect x={pad + gW} y={-2} width={post} height={gH + 2} fill="#6b7280" rx={2} />
        <rect x={pad - post} y={-2} width={gW + post * 2} height={post} fill="#6b7280" rx={2} />
        {/* Ground line */}
        <line x1={pad - post} y1={gH} x2={pad + gW + post} y2={gH} stroke="#374151" strokeWidth={1.5} />
        {/* Zone labels below */}
        {[lang === 'en' ? 'Left' : 'Izq', lang === 'en' ? 'Centre' : 'Centro', lang === 'en' ? 'Right' : 'Der'].map((lbl, i) => (
          <text key={lbl} x={pad + zW * i + zW / 2} y={gH + 20} textAnchor="middle" fill="#4b5563" fontSize={10}>{lbl}</text>
        ))}
      </svg>
      {!hasAny && (
        <div style={{ color: '#4b5563', fontSize: 12, textAlign: 'center', marginTop: 4 }}>{t('mstats.no_zone', lang)}</div>
      )}
    </div>
  )
}

function ZoneEfficiencyMap({ successEvents, totalEvents, successLabel, totalLabel }) {
  const zones = GOAL_ZONES.slice(0, 6)

  function zoneData(z) {
    const success = successEvents.filter(e => e.details?.zone === z).length
    const total = totalEvents.filter(e => e.details?.zone === z).length
    const pct = total > 0 ? Math.round(success / total * 100) : null
    return { success, total, pct }
  }

  function cellBg(pct, total) {
    if (total === 0) return '#111827'
    if (pct >= 70) return '#15803d'
    if (pct >= 50) return '#4d7c0f'
    if (pct >= 30) return '#b45309'
    return '#b91c1c'
  }

  const zonesData = zones.map(z => ({ zone: z, ...zoneData(z) }))

  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: 12 }}>
      <div style={{ color: '#6b7280', fontSize: 11, textAlign: 'center', marginBottom: 8 }}>{successLabel} / {totalLabel}</div>
      <div style={{ border: '2px solid #374151', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
          {zonesData.slice(0, 3).map((d, i) => (
            <EffCell key={i} data={d} label={ZONE_LABELS[i]} bg={cellBg(d.pct, d.total)} border={i < 2} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid #374151' }}>
          {zonesData.slice(3, 6).map((d, i) => (
            <EffCell key={i+3} data={d} label={ZONE_LABELS[i+3]} bg={cellBg(d.pct, d.total)} border={i < 2} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'center' }}>
        {[['#15803d','>70%'],['#4d7c0f','50-70%'],['#b45309','30-50%'],['#b91c1c','<30%']].map(([c,l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 8, height: 8, background: c, borderRadius: 2 }} />
            <span style={{ color: '#9ca3af', fontSize: 10 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EffCell({ data, label, bg, border }) {
  return (
    <div style={{ background: bg, padding: '12px 6px', textAlign: 'center', borderRight: border ? '1px solid #374151' : 'none' }}>
      {data.total > 0 ? (
        <>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>{data.success}/{data.total}</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600 }}>{data.pct}%</div>
        </>
      ) : (
        <div style={{ color: '#374151', fontSize: 18, fontWeight: 700 }}>-</div>
      )}
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 1 }}>{label}</div>
    </div>
  )
}

function EfficiencyBar({ pct, color, label }) {
  return (
    <div style={{ background: '#1f2937', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#9ca3af', fontSize: 13 }}>{label}</span>
        <span style={{ color, fontWeight: 700, fontSize: 14 }}>{pct}%</span>
      </div>
      <div style={{ background: '#374151', borderRadius: 999, height: 8 }}>
        <div style={{ width: `${pct}%`, background: color, height: 8, borderRadius: 999, transition: 'width 0.4s' }} />
      </div>
    </div>
  )
}

function ShotTypeChart({ events, goals = [], color, lang, hitsLabel }) {
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

function MinuteChart({ events, goals = [] }) {
  const goalIds = new Set(goals.map(e => e.id))
  const sorted = [...events].sort((a, b) => a.minute - b.minute)
  const max = 60
  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: 16 }}>
      <div style={{ position: 'relative', height: 40, marginBottom: 8 }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, background: '#374151', height: 2, borderRadius: 2 }} />
        {sorted.map(ev => (
          <div key={ev.id} style={{
            position: 'absolute',
            left: `${Math.min((ev.minute / max) * 100, 98)}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 10, height: 10,
            background: goalIds.has(ev.id) ? '#4ade80' : '#6b7280',
            borderRadius: '50%',
            border: '2px solid #111827',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: 11 }}>
        <span>0'</span><span>15'</span><span>30'</span><span>45'</span><span>60'</span>
      </div>
    </div>
  )
}

const TYPE_META_KEYS = {
  goal:      { labelKey: 'action.goal_lbl',      Icon: Target,         color: '#22c55e' },
  miss:      { labelKey: 'action.miss_lbl',       Icon: Target,         color: '#f59e0b' },
  save:      { labelKey: 'action.save_lbl',       Icon: Shield,         color: '#3b82f6' },
  conceded:  { labelKey: 'action.conceded_lbl',   Icon: ShieldOff,      color: '#f43f5e' },
  exclusion: { labelKey: 'action.exclusion_lbl',  Icon: UserMinus,      color: '#ef4444' },
  turnover:  { labelKey: 'action.turnover_lbl',   Icon: ArrowRightLeft, color: '#f97316' },
}

function Timeline({ events, players, lang }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {[...events].sort((a, b) => a.minute - b.minute).map(ev => {
        const player = players.find(p => p.id === ev.playerId)
        const meta = TYPE_META_KEYS[ev.type] ?? { labelKey: null, Icon: Target, color: '#6b7280' }
        const label = meta.labelKey ? t(meta.labelKey, lang) : ev.type
        const { Icon, color } = meta
        return (
          <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1f2937', borderRadius: 10, padding: '10px 14px' }}>
            <span style={{ color: '#6b7280', fontSize: 12, minWidth: 28 }}>{ev.minute}'</span>
            <Icon size={15} color={color} />
            <span style={{ color: '#d1d5db', fontSize: 13, flex: 1 }}>{label}</span>
            {player && <span style={{ color: '#6b7280', fontSize: 12 }}>#{player.number} {player.name.split(' ')[0]}</span>}
          </div>
        )
      })}
    </div>
  )
}

const linkBtn = { color: '#9ca3af', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }
const exportBtn = { background: '#0d2456', color: '#7eb3ff', border: '1px solid #1e3a7a', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }
