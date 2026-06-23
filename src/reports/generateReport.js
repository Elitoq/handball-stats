import { getPlayerStats, calcPlayerRating, ratingLabel, GOAL_ZONES, SHOT_TYPES } from '../data/store'

// ── Entry points ────────────────────────────────────────────────

export function printMatchReport(match) {
  const html = buildMatchReport(match)
  openPrint(html)
}

export function printPlayerMatchReport(match, playerId) {
  const player = match.players.find(p => p.id === playerId)
  const stats = getPlayerStats(match, playerId)
  const html = buildPlayerMatchReport(match, player, stats)
  openPrint(html)
}

export function printSeasonReport(matches, squadMap) {
  const html = buildSeasonReport(matches, squadMap)
  openPrint(html)
}

export function printPlayerSeasonReport(player, matches) {
  const html = buildPlayerSeasonReport(player, matches)
  openPrint(html)
}

// ── Print helper ────────────────────────────────────────────────

function openPrint(bodyHtml) {
  const win = window.open('', '_blank')
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Informe</title>
    <style>${printCSS()}</style>
  </head><body>${bodyHtml}</body></html>`)
  win.document.close()
  win.onload = () => { win.focus(); win.print() }
}

// ── Match report ────────────────────────────────────────────────

function buildMatchReport(match) {
  const goals = match.events.filter(e => e.type === 'goal')
  const misses = match.events.filter(e => e.type === 'miss')
  const saves = match.events.filter(e => e.type === 'save')
  const conceded = match.events.filter(e => e.type === 'conceded')
  const exclusions = match.events.filter(e => e.type === 'exclusion')
  const turnovers = match.events.filter(e => e.type === 'turnover')
  const shootingPct = goals.length + misses.length > 0
    ? Math.round(goals.length / (goals.length + misses.length) * 100) : null
  const savePct = saves.length + conceded.length > 0
    ? Math.round(saves.length / (saves.length + conceded.length) * 100) : null

  const playersWithStats = match.players
    .map(p => ({ ...p, stats: getPlayerStats(match, p.id) }))
    .filter(p => {
      const s = p.stats
      return s.goals + s.misses + s.saves + s.conceded + s.exclusions + s.turnovers > 0
    })
    .sort((a, b) => b.stats.goals - a.stats.goals)

  const ourGoals = goals.length
  const rivalGoals = match.rivalGoals ?? '?'
  const result = match.rivalGoals != null
    ? ourGoals > match.rivalGoals ? 'VICTORIA' : ourGoals < match.rivalGoals ? 'DERROTA' : 'EMPATE'
    : null

  return `
    ${header(`${match.teamName} vs ${match.rival}`, match.date, result ? `${result} · ${ourGoals}-${rivalGoals}` : `${ourGoals}-${rivalGoals}`)}

    <div class="section">
      <h2>Resumen del partido</h2>
      <div class="stats-grid-3">
        ${statBox('Goles', goals.length, 'green')}
        ${statBox('Fallos', misses.length, 'orange')}
        ${statBox(shootingPct != null ? `Eficacia ${shootingPct}%` : 'Lanzamientos', goals.length + misses.length, 'purple')}
      </div>
      <div class="stats-grid-3" style="margin-top:8px">
        ${statBox('Paradas', saves.length, 'blue')}
        ${statBox('Encajados', conceded.length, 'red')}
        ${statBox(savePct != null ? `% Paradas ${savePct}%` : 'Disparos rec.', saves.length + conceded.length, 'indigo')}
      </div>
      <div class="stats-grid-2" style="margin-top:8px">
        ${statBox('Exclusiones', exclusions.length, 'red')}
        ${statBox('Pérdidas', turnovers.length, 'orange')}
      </div>
    </div>

    ${mvpBlock(match)}

    ${match.notes ? `
    <div class="section">
      <h2>Notas del partido</h2>
      <div style="background:#f9fafb;border-radius:8px;padding:14px 16px;font-size:13px;color:#374151;line-height:1.6;border:1px solid #e5e7eb;white-space:pre-wrap">${match.notes}</div>
    </div>` : ''}

    ${periodBreakdown(match)}

    ${goals.length + misses.length > 0 ? `
    <div class="section">
      <h2>Mapa de lanzamientos del equipo</h2>
      ${zoneMap([...goals, ...misses], goals, 'Lanzamientos', 'Goles')}
    </div>` : ''}

    ${saves.length + conceded.length > 0 ? `
    <div class="section">
      <h2>Mapa de paradas del equipo</h2>
      ${zoneMap([...saves, ...conceded], saves, 'Disparos recibidos', 'Paradas')}
    </div>` : ''}

    ${playersWithStats.length > 0 ? `
    <div class="section">
      <h2>Estadísticas por jugadora</h2>
      <table class="player-table">
        <thead>
          <tr>
            <th>#</th><th>Jugadora</th><th>Rol</th>
            <th class="num green">Goles</th>
            <th class="num orange">Fallos</th>
            <th class="num purple">Eficacia</th>
            <th class="num blue">Paradas</th>
            <th class="num red">Encajados</th>
            <th class="num indigo">% Par.</th>
            <th class="num">Excl.</th>
            <th class="num">Pérd.</th>
            <th class="num">Nota</th>
          </tr>
        </thead>
        <tbody>
          ${playersWithStats.map(p => {
            const s = p.stats
            const eff = s.goals + s.misses > 0 ? `${Math.round(s.goals/(s.goals+s.misses)*100)}%` : '-'
            const sav = s.saves + s.conceded > 0 ? `${Math.round(s.saves/(s.saves+s.conceded)*100)}%` : '-'
            const rating = calcPlayerRating(s, p.role)
            const rCell = rating != null ? ratingBadge(rating) : '-'
            return `<tr>
              <td class="num">${p.number}</td>
              <td>${p.name}</td>
              <td class="role">${p.role === 'goalkeeper' ? '🧤 Portera' : '🤾 Jugadora'}</td>
              <td class="num green">${s.goals}</td>
              <td class="num orange">${s.misses}</td>
              <td class="num purple">${eff}</td>
              <td class="num blue">${s.saves}</td>
              <td class="num red">${s.conceded}</td>
              <td class="num indigo">${sav}</td>
              <td class="num">${s.exclusions}</td>
              <td class="num">${s.turnovers}</td>
              <td class="num">${rCell}</td>
            </tr>`
          }).join('')}
        </tbody>
      </table>
    </div>` : ''}

    ${match.events.length > 0 ? `
    <div class="section">
      <h2>Timeline del partido</h2>
      <div class="timeline">
        ${[...match.events].sort((a,b) => a.minute - b.minute).map(ev => {
          const player = match.players.find(p => p.id === ev.playerId)
          const icons = { goal:'⚽', miss:'🎯', save:'🧤', conceded:'😔', exclusion:'🟥', turnover:'❌' }
          const labels = { goal:'Gol', miss:'Fallo', save:'Parada', conceded:'Encajado', exclusion:'Exclusión', turnover:'Pérdida' }
          return `<div class="timeline-row ${ev.type}">
            <span class="min">${ev.minute}'</span>
            <span class="icon">${icons[ev.type]}</span>
            <span class="label">${labels[ev.type]}</span>
            ${player ? `<span class="player">#${player.number} ${player.name}</span>` : ''}
          </div>`
        }).join('')}
      </div>
    </div>` : ''}

    ${footer()}
  `
}

// ── Player match report ──────────────────────────────────────────

function buildPlayerMatchReport(match, player, stats) {
  if (!player) return '<p>Jugadora no encontrada</p>'
  const isGK = player.role === 'goalkeeper'
  const eff = isGK
    ? (stats.saves + stats.conceded > 0 ? Math.round(stats.saves/(stats.saves+stats.conceded)*100) : null)
    : (stats.goals + stats.misses > 0 ? Math.round(stats.goals/(stats.goals+stats.misses)*100) : null)

  const successEvents = isGK ? stats.saveEvents : stats.goalEvents
  const totalEvents = isGK
    ? [...stats.saveEvents, ...stats.concededEvents]
    : [...stats.goalEvents, ...stats.missEvents]

  return `
    ${header(
      `#${player.number} ${player.name}`,
      match.date,
      `${match.teamName} vs ${match.rival} · ${isGK ? '🧤 Portera' : '🤾 Jugadora'}`
    )}

    <div class="section">
      <h2>${isGK ? 'Estadísticas bajo palos' : 'Estadísticas ofensivas'}</h2>
      ${isGK ? `
        <div class="stats-grid-3">
          ${statBox('Paradas', stats.saves, 'blue')}
          ${statBox('Encajados', stats.conceded, 'red')}
          ${statBox(eff != null ? `% Paradas ${eff}%` : 'Disparos', stats.saves + stats.conceded, 'indigo')}
        </div>` : `
        <div class="stats-grid-3">
          ${statBox('Goles', stats.goals, 'green')}
          ${statBox('Fallos', stats.misses, 'orange')}
          ${statBox(eff != null ? `Eficacia ${eff}%` : 'Lanzamientos', stats.goals + stats.misses, 'purple')}
        </div>`}
      <div class="stats-grid-2" style="margin-top:8px">
        ${statBox('Exclusiones', stats.exclusions, 'red')}
        ${statBox('Pérdidas', stats.turnovers, 'orange')}
      </div>
    </div>

    ${(() => {
      const rating = calcPlayerRating(stats, player.role)
      if (rating == null) return ''
      return `<div class="section">
        <h2>Valoración del partido</h2>
        <div class="rating-block">
          <div class="rating-number" style="color:${rating >= 7.5 ? '#15803d' : rating >= 6.0 ? '#b45309' : '#dc2626'}">${rating.toFixed(1)}</div>
          <div class="rating-label">${ratingLabel(rating)}</div>
        </div>
      </div>`
    })()}

    ${totalEvents.length > 0 ? `
    <div class="section">
      <h2>${isGK ? 'Mapa de eficacia por zona (paradas)' : 'Mapa de eficacia por zona (lanzamientos)'}</h2>
      ${zoneMap(totalEvents, successEvents, isGK ? 'Disparos' : 'Lanzamientos', isGK ? 'Paradas' : 'Goles')}
    </div>` : ''}

    ${totalEvents.length > 0 ? `
    <div class="section">
      <h2>Tipo de ${isGK ? 'disparo recibido' : 'lanzamiento'}</h2>
      ${shotTypeTable(totalEvents, successEvents)}
    </div>` : ''}

    ${footer()}
  `
}

// ── Season report ────────────────────────────────────────────────

function buildSeasonReport(matches, squadMap) {
  if (matches.length === 0) return '<p>Sin partidos registrados.</p>'
  const teamName = matches[0]?.teamName ?? 'Mi equipo'

  const allEvents = matches.flatMap(m => m.events)
  const goals = allEvents.filter(e => e.type === 'goal').length
  const misses = allEvents.filter(e => e.type === 'miss').length
  const saves = allEvents.filter(e => e.type === 'save').length
  const conceded = allEvents.filter(e => e.type === 'conceded').length
  const exclusions = allEvents.filter(e => e.type === 'exclusion').length
  const turnovers = allEvents.filter(e => e.type === 'turnover').length
  const shootingPct = goals + misses > 0 ? Math.round(goals/(goals+misses)*100) : null
  const savePct = saves + conceded > 0 ? Math.round(saves/(saves+conceded)*100) : null

  const results = matches.map(m => {
    const our = m.events.filter(e => e.type === 'goal').length
    const rival = m.rivalGoals ?? null
    const result = rival === null ? null : our > rival ? 'V' : our < rival ? 'D' : 'E'
    return { ...m, ourGoals: our, result }
  })
  const wins = results.filter(m => m.result === 'V').length
  const draws = results.filter(m => m.result === 'E').length
  const losses = results.filter(m => m.result === 'D').length

  // Acumular por jugadora
  const players = Object.values(squadMap ?? {})
  const scorers = players
    .filter(p => p.role !== 'goalkeeper' && p.stats.goals + p.stats.misses > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals)
  const goalkeepers = players
    .filter(p => p.role === 'goalkeeper' && p.stats.saves + p.stats.conceded > 0)
    .sort((a, b) => (b.stats.savePct ?? 0) - (a.stats.savePct ?? 0))

  return `
    ${header(teamName, 'Informe de temporada', `${matches.length} partidos · ${wins}V ${draws}E ${losses}D`)}

    <div class="section">
      <h2>Resultados</h2>
      <div class="stats-grid-3">
        ${statBox('Victorias', wins, 'green')}
        ${statBox('Empates', draws, 'orange')}
        ${statBox('Derrotas', losses, 'red')}
      </div>
      <div class="result-bar">
        ${wins > 0 ? `<div class="rb-win" style="flex:${wins}"></div>` : ''}
        ${draws > 0 ? `<div class="rb-draw" style="flex:${draws}"></div>` : ''}
        ${losses > 0 ? `<div class="rb-loss" style="flex:${losses}"></div>` : ''}
      </div>
    </div>

    <div class="section">
      <h2>Estadísticas de equipo</h2>
      <div class="stats-grid-3">
        ${statBox('Goles', goals, 'green')}
        ${statBox('Fallos', misses, 'orange')}
        ${statBox(shootingPct != null ? `Eficacia ${shootingPct}%` : 'Lanz.', goals + misses, 'purple')}
      </div>
      <div class="stats-grid-3" style="margin-top:8px">
        ${statBox('Paradas', saves, 'blue')}
        ${statBox('Encajados', conceded, 'red')}
        ${statBox(savePct != null ? `% Paradas ${savePct}%` : 'Dispar.', saves + conceded, 'indigo')}
      </div>
    </div>

    ${scorers.length > 0 ? `
    <div class="section">
      <h2>Ranking goleadoras</h2>
      <table class="player-table">
        <thead><tr><th>#</th><th>Jugadora</th><th class="num">Partidos</th><th class="num green">Goles</th><th class="num orange">Fallos</th><th class="num purple">Eficacia</th><th class="num">Excl.</th><th class="num">Pérd.</th></tr></thead>
        <tbody>
          ${scorers.map((p, i) => {
            const s = p.stats
            const eff = s.goals + s.misses > 0 ? `${Math.round(s.goals/(s.goals+s.misses)*100)}%` : '-'
            return `<tr>
              <td class="num">${i+1}</td>
              <td>${p.name} <small>#${p.number}</small></td>
              <td class="num">${p.matchCount}</td>
              <td class="num green">${s.goals}</td>
              <td class="num orange">${s.misses}</td>
              <td class="num purple">${eff}</td>
              <td class="num">${s.exclusions}</td>
              <td class="num">${s.turnovers}</td>
            </tr>`
          }).join('')}
        </tbody>
      </table>
    </div>` : ''}

    ${goalkeepers.length > 0 ? `
    <div class="section">
      <h2>Ranking porteras</h2>
      <table class="player-table">
        <thead><tr><th>#</th><th>Portera</th><th class="num">Partidos</th><th class="num blue">Paradas</th><th class="num red">Encajados</th><th class="num indigo">% Paradas</th></tr></thead>
        <tbody>
          ${goalkeepers.map((p, i) => {
            const s = p.stats
            const sav = s.saves + s.conceded > 0 ? `${Math.round(s.saves/(s.saves+s.conceded)*100)}%` : '-'
            return `<tr>
              <td class="num">${i+1}</td>
              <td>${p.name} <small>#${p.number}</small></td>
              <td class="num">${p.matchCount}</td>
              <td class="num blue">${s.saves}</td>
              <td class="num red">${s.conceded}</td>
              <td class="num indigo">${sav}</td>
            </tr>`
          }).join('')}
        </tbody>
      </table>
    </div>` : ''}

    <div class="section">
      <h2>Historial de partidos</h2>
      <table class="player-table">
        <thead><tr><th>Fecha</th><th>Rival</th><th class="num">Resultado</th><th class="num green">Goles</th><th class="num blue">Paradas</th><th class="num">Excl.</th><th class="num">Pérd.</th></tr></thead>
        <tbody>
          ${[...results].sort((a,b) => new Date(a.date)-new Date(b.date)).map(m => {
            const saves = m.events.filter(e => e.type === 'save').length
            const exclusions = m.events.filter(e => e.type === 'exclusion').length
            const turnovers = m.events.filter(e => e.type === 'turnover').length
            const resColor = m.result === 'V' ? 'green' : m.result === 'D' ? 'red' : 'orange'
            return `<tr>
              <td>${m.date}</td>
              <td>${m.rival}</td>
              <td class="num ${resColor}">${m.result ?? '?'} ${m.ourGoals}-${m.rivalGoals ?? '?'}</td>
              <td class="num green">${m.ourGoals}</td>
              <td class="num blue">${saves}</td>
              <td class="num">${exclusions}</td>
              <td class="num">${turnovers}</td>
            </tr>`
          }).join('')}
        </tbody>
      </table>
    </div>

    ${footer()}
  `
}

// ── Player season report ─────────────────────────────────────────

function buildPlayerSeasonReport(player, matches) {
  const isGK = player.role === 'goalkeeper'
  let totalGoals = 0, totalMisses = 0, totalSaves = 0, totalConceded = 0, totalExcl = 0, totalTurn = 0

  const matchRows = matches.map(m => {
    const s = getPlayerStats(m, player.id)
    totalGoals += s.goals; totalMisses += s.misses
    totalSaves += s.saves; totalConceded += s.conceded
    totalExcl += s.exclusions; totalTurn += s.turnovers
    return { match: m, stats: s }
  }).filter(r => {
    const s = r.stats
    return s.goals + s.misses + s.saves + s.conceded + s.exclusions + s.turnovers > 0
  })

  const shootingPct = totalGoals + totalMisses > 0
    ? Math.round(totalGoals/(totalGoals+totalMisses)*100) : null
  const savePct = totalSaves + totalConceded > 0
    ? Math.round(totalSaves/(totalSaves+totalConceded)*100) : null

  // Acumular eventos para el mapa
  const allSuccessEvents = matchRows.flatMap(r => isGK ? r.stats.saveEvents : r.stats.goalEvents)
  const allTotalEvents = matchRows.flatMap(r => isGK
    ? [...r.stats.saveEvents, ...r.stats.concededEvents]
    : [...r.stats.goalEvents, ...r.stats.missEvents])

  return `
    ${header(
      `#${player.number} ${player.name}`,
      'Informe de temporada',
      `${isGK ? '🧤 Portera' : '🤾 Jugadora'} · ${matchRows.length} partidos`
    )}

    <div class="section">
      <h2>Resumen de temporada</h2>
      ${isGK ? `
        <div class="stats-grid-3">
          ${statBox('Paradas', totalSaves, 'blue')}
          ${statBox('Encajados', totalConceded, 'red')}
          ${statBox(savePct != null ? `% Paradas ${savePct}%` : 'Disparos', totalSaves + totalConceded, 'indigo')}
        </div>` : `
        <div class="stats-grid-3">
          ${statBox('Goles', totalGoals, 'green')}
          ${statBox('Fallos', totalMisses, 'orange')}
          ${statBox(shootingPct != null ? `Eficacia ${shootingPct}%` : 'Lanz.', totalGoals + totalMisses, 'purple')}
        </div>`}
      <div class="stats-grid-2" style="margin-top:8px">
        ${statBox('Exclusiones', totalExcl, 'red')}
        ${statBox('Pérdidas', totalTurn, 'orange')}
      </div>
    </div>

    ${allTotalEvents.length > 0 ? `
    <div class="section">
      <h2>Mapa de eficacia por zona (acumulado temporada)</h2>
      ${zoneMap(allTotalEvents, allSuccessEvents, isGK ? 'Disparos' : 'Lanzamientos', isGK ? 'Paradas' : 'Goles')}
    </div>` : ''}

    ${allTotalEvents.length > 0 ? `
    <div class="section">
      <h2>Tipo de ${isGK ? 'disparo recibido' : 'lanzamiento'} — temporada</h2>
      ${shotTypeTable(allTotalEvents, allSuccessEvents)}
    </div>` : ''}

    ${matchRows.length > 0 ? `
    <div class="section">
      <h2>Partido a partido</h2>
      <table class="player-table">
        <thead>
          <tr>
            <th>Fecha</th><th>Rival</th>
            ${isGK
              ? '<th class="num blue">Paradas</th><th class="num red">Encajados</th><th class="num indigo">%</th>'
              : '<th class="num green">Goles</th><th class="num orange">Fallos</th><th class="num purple">Efic.</th>'}
            <th class="num">Excl.</th>
          </tr>
        </thead>
        <tbody>
          ${matchRows.map(({ match: m, stats: s }) => {
            const eff = isGK
              ? (s.saves + s.conceded > 0 ? `${Math.round(s.saves/(s.saves+s.conceded)*100)}%` : '-')
              : (s.goals + s.misses > 0 ? `${Math.round(s.goals/(s.goals+s.misses)*100)}%` : '-')
            return `<tr>
              <td>${m.date}</td>
              <td>${m.rival}</td>
              ${isGK
                ? `<td class="num blue">${s.saves}</td><td class="num red">${s.conceded}</td><td class="num indigo">${eff}</td>`
                : `<td class="num green">${s.goals}</td><td class="num orange">${s.misses}</td><td class="num purple">${eff}</td>`}
              <td class="num">${s.exclusions}</td>
            </tr>`
          }).join('')}
        </tbody>
      </table>
    </div>` : ''}

    ${footer()}
  `
}

// ── HTML helpers ────────────────────────────────────────────────

function header(title, subtitle, badge) {
  return `
    <div class="report-header">
      <div class="report-badge">${badge ?? ''}</div>
      <h1>${title}</h1>
      <div class="report-sub">${subtitle}</div>
    </div>
  `
}

function footer() {
  const now = new Date().toLocaleDateString('es-ES', { day:'2-digit', month:'long', year:'numeric' })
  return `<div class="report-footer">Generado el ${now} · Handball Stats App</div>`
}

function statBox(label, value, color) {
  return `<div class="stat-box ${color}"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`
}

const ZONE_LABELS_SHORT = ['I↑','C↑','D↑','I↓','C↓','D↓']

function zoneMap(totalEvents, successEvents, totalLabel, successLabel) {
  const successIds = new Set(successEvents.map(e => e.id))
  const zones6 = GOAL_ZONES.slice(0, 6)
  const special = GOAL_ZONES[6]

  function zoneData(z) {
    const total = totalEvents.filter(e => e.details?.zone === z).length
    const success = totalEvents.filter(e => e.details?.zone === z && successIds.has(e.id)).length
    const pct = total > 0 ? Math.round(success / total * 100) : null
    return { total, success, pct }
  }

  function cellColor(pct, total) {
    if (total === 0) return '#f3f4f6'
    if (pct >= 70) return '#15803d'
    if (pct >= 50) return '#65a30d'
    if (pct >= 30) return '#d97706'
    return '#dc2626'
  }

  function textColor(total) { return total === 0 ? '#9ca3af' : 'white' }

  const cells6 = zones6.map((z, i) => {
    const d = zoneData(z)
    const bg = cellColor(d.pct, d.total)
    const tc = textColor(d.total)
    return `<td style="background:${bg};color:${tc};text-align:center;padding:12px 6px;border:1px solid #e5e7eb;font-weight:700">
      ${d.total > 0 ? `<div style="font-size:15px">${d.success}/${d.total}</div><div style="font-size:13px">${d.pct}%</div>` : '<div style="color:#d1d5db">-</div>'}
      <div style="font-size:10px;opacity:0.7;margin-top:2px">${ZONE_LABELS_SHORT[i]}</div>
    </td>`
  })

  const specialData = zoneData(special)
  const specBg = cellColor(specialData.pct, specialData.total)

  return `
    <div class="zone-map-wrap">
      <div class="zone-map-label">▲ Portería</div>
      <table class="zone-table">
        <tr>${cells6.slice(0,3).join('')}</tr>
        <tr>${cells6.slice(3,6).join('')}</tr>
      </table>
      ${specialData.total > 0 ? `
        <div class="zone-7m" style="background:${specBg}">
          <strong>7 metros:</strong> ${specialData.success}/${specialData.total} · ${specialData.pct}%
        </div>` : ''}
      <div class="zone-legend">
        ${[['#15803d','>70%'],['#65a30d','50-70%'],['#d97706','30-50%'],['#dc2626','<30%'],['#f3f4f6','Sin datos']].map(([c,l]) =>
          `<span><span style="display:inline-block;width:12px;height:12px;background:${c};border-radius:2px;border:1px solid #e5e7eb;vertical-align:middle;margin-right:3px"></span>${l}</span>`
        ).join('')}
      </div>
      <div style="font-size:11px;color:#6b7280;margin-top:4px;text-align:center">${successLabel} / ${totalLabel} por zona</div>
    </div>
  `
}

function shotTypeTable(totalEvents, successEvents) {
  const successIds = new Set(successEvents.map(e => e.id))
  const rows = SHOT_TYPES.map(t => {
    const total = totalEvents.filter(e => e.details?.shotType === t).length
    const success = totalEvents.filter(e => e.details?.shotType === t && successIds.has(e.id)).length
    if (total === 0) return null
    const pct = Math.round(success / total * 100)
    return { t, total, success, pct }
  }).filter(Boolean)

  if (rows.length === 0) return '<p style="color:#6b7280;font-size:13px">Sin tipo registrado</p>'

  const max = Math.max(...rows.map(r => r.total))
  return `<table class="player-table">
    <thead><tr><th>Tipo</th><th class="num">Total</th><th class="num green">Éxitos</th><th class="num purple">%</th><th style="width:40%">Distribución</th></tr></thead>
    <tbody>
      ${rows.map(r => `<tr>
        <td>${r.t}</td>
        <td class="num">${r.total}</td>
        <td class="num green">${r.success}</td>
        <td class="num purple">${r.pct}%</td>
        <td>
          <div style="background:#f3f4f6;border-radius:4px;height:10px;overflow:hidden">
            <div style="background:#6366f1;width:${(r.total/max)*100}%;height:10px;float:left"></div>
            <div style="background:#22c55e;width:${(r.success/max)*100}%;height:10px;float:left;margin-left:-${(r.total/max)*100}%;position:relative;z-index:1"></div>
          </div>
        </td>
      </tr>`).join('')}
    </tbody>
  </table>`
}

function mvpBlock(match) {
  const rated = match.players
    .map(p => ({ ...p, stats: getPlayerStats(match, p.id), rating: null }))
    .map(p => ({ ...p, rating: calcPlayerRating(p.stats, p.role) }))
    .filter(p => p.rating != null)
    .sort((a, b) => b.rating - a.rating)
  const mvp = rated[0]
  if (!mvp) return ''
  const color = mvp.rating >= 7.5 ? '#15803d' : mvp.rating >= 6.0 ? '#b45309' : '#dc2626'
  const bg = mvp.rating >= 7.5 ? '#f0fdf4' : mvp.rating >= 6.0 ? '#fff7ed' : '#fef2f2'
  return `
    <div class="section">
      <h2>Jugadora del partido</h2>
      <div style="display:flex;align-items:center;gap:16px;background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:12px;padding:16px 20px;color:white">
        <div style="font-size:32px">🏅</div>
        <div style="flex:1">
          <div style="font-weight:800;font-size:18px">#${mvp.number} ${mvp.name}</div>
          <div style="color:#a5b4fc;font-size:12px;margin-top:2px">${mvp.role === 'goalkeeper' ? '🧤 Portera' : '🤾 Jugadora'}</div>
        </div>
        <div style="text-align:center;background:${bg};border-radius:10px;padding:8px 16px">
          <div style="color:${color};font-weight:900;font-size:36px;line-height:1">${mvp.rating.toFixed(1)}</div>
          <div style="color:${color};font-size:11px;margin-top:2px">${ratingLabel(mvp.rating)}</div>
        </div>
      </div>
    </div>
  `
}

function periodBreakdown(match) {
  const hasSecond = match.events.some(e => e.period === 2)
  if (!hasSecond) return ''

  function periodStats(period) {
    const evs = match.events.filter(e => (e.period ?? 1) === period)
    const goals = evs.filter(e => e.type === 'goal').length
    const misses = evs.filter(e => e.type === 'miss').length
    const saves = evs.filter(e => e.type === 'save').length
    const conceded = evs.filter(e => e.type === 'conceded').length
    const eff = goals + misses > 0 ? `${Math.round(goals/(goals+misses)*100)}%` : '-'
    const sav = saves + conceded > 0 ? `${Math.round(saves/(saves+conceded)*100)}%` : '-'
    return { goals, misses, saves, conceded, eff, sav, excl: evs.filter(e => e.type === 'exclusion').length, turn: evs.filter(e => e.type === 'turnover').length }
  }

  const p1 = periodStats(1)
  const p2 = periodStats(2)

  function row(label, v1, v2, cls = '') {
    return `<tr><td class="pb-label">${label}</td><td class="num ${cls}">${v1}</td><td class="num ${cls}">${v2}</td></tr>`
  }

  return `
    <div class="section">
      <h2>Desglose por partes</h2>
      <table class="player-table">
        <thead><tr><th></th><th class="num">1ª Parte</th><th class="num">2ª Parte</th></tr></thead>
        <tbody>
          ${row('Goles', p1.goals, p2.goals, 'green')}
          ${row('Fallos', p1.misses, p2.misses, 'orange')}
          ${row('Eficacia', p1.eff, p2.eff, 'purple')}
          ${row('Paradas', p1.saves, p2.saves, 'blue')}
          ${row('Encajados', p1.conceded, p2.conceded, 'red')}
          ${row('% Paradas', p1.sav, p2.sav, 'indigo')}
          ${row('Exclusiones', p1.excl, p2.excl)}
          ${row('Pérdidas', p1.turn, p2.turn)}
        </tbody>
      </table>
    </div>
  `
}

function ratingBadge(rating) {
  const color = rating >= 7.5 ? '#15803d' : rating >= 6.0 ? '#b45309' : '#dc2626'
  const bg = rating >= 7.5 ? '#f0fdf4' : rating >= 6.0 ? '#fff7ed' : '#fef2f2'
  return `<span style="display:inline-block;background:${bg};color:${color};font-weight:800;font-size:13px;padding:2px 8px;border-radius:6px;border:1px solid ${color}33">${rating.toFixed(1)}</span>`
}

// ── CSS ─────────────────────────────────────────────────────────

function printCSS() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #1f2937; background: white; padding: 0; }

    .report-header { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%); color: white; padding: 28px 32px 24px; margin-bottom: 0; }
    .report-badge { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #a5b4fc; margin-bottom: 6px; }
    .report-header h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: white; margin-bottom: 4px; }
    .report-sub { font-size: 13px; color: #c7d2fe; }

    .section { padding: 20px 32px; border-bottom: 1px solid #f3f4f6; }
    .section h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6366f1; margin-bottom: 14px; }

    .stats-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
    .stats-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }

    .stat-box { border-radius: 8px; padding: 14px 12px; text-align: center; border: 1px solid; }
    .stat-box.green  { background: #f0fdf4; border-color: #86efac; }
    .stat-box.blue   { background: #eff6ff; border-color: #93c5fd; }
    .stat-box.red    { background: #fef2f2; border-color: #fca5a5; }
    .stat-box.orange { background: #fff7ed; border-color: #fdba74; }
    .stat-box.purple { background: #faf5ff; border-color: #d8b4fe; }
    .stat-box.indigo { background: #eef2ff; border-color: #a5b4fc; }
    .stat-value { font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
    .stat-box.green  .stat-value { color: #15803d; }
    .stat-box.blue   .stat-value { color: #1d4ed8; }
    .stat-box.red    .stat-value { color: #dc2626; }
    .stat-box.orange .stat-value { color: #c2410c; }
    .stat-box.purple .stat-value { color: #7c3aed; }
    .stat-box.indigo .stat-value { color: #4338ca; }
    .stat-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; }

    .result-bar { display: flex; height: 8px; border-radius: 99px; overflow: hidden; gap: 2px; margin-top: 10px; }
    .rb-win  { background: #16a34a; border-radius: 99px; }
    .rb-draw { background: #ca8a04; border-radius: 99px; }
    .rb-loss { background: #dc2626; border-radius: 99px; }

    .player-table { width: 100%; border-collapse: collapse; font-size: 12px; }
    .player-table th { background: #f9fafb; border-bottom: 2px solid #e5e7eb; padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; }
    .player-table td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; }
    .player-table tr:last-child td { border-bottom: none; }
    .player-table tr:nth-child(even) td { background: #fafafa; }
    .num { text-align: center; font-weight: 700; }
    .role { color: #6b7280; font-size: 11px; }
    .green { color: #15803d; } .blue { color: #1d4ed8; } .red { color: #dc2626; }
    .orange { color: #c2410c; } .purple { color: #7c3aed; } .indigo { color: #4338ca; }

    .zone-map-wrap { max-width: 340px; }
    .zone-map-label { font-size: 11px; color: #6b7280; text-align: center; margin-bottom: 4px; }
    .zone-table { width: 100%; border-collapse: collapse; border: 2px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
    .zone-7m { margin-top: 6px; padding: 8px 14px; border-radius: 6px; color: white; font-size: 13px; font-weight: 600; }
    .zone-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; font-size: 11px; color: #6b7280; }

    .timeline { display: flex; flex-direction: column; gap: 2px; }
    .timeline-row { display: flex; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 6px; font-size: 12px; }
    .timeline-row.goal     { background: #f0fdf4; }
    .timeline-row.miss     { background: #fff7ed; }
    .timeline-row.save     { background: #eff6ff; }
    .timeline-row.conceded { background: #fef2f2; }
    .timeline-row.exclusion{ background: #fef2f2; }
    .timeline-row.turnover { background: #fff7ed; }
    .timeline-row .min    { color: #9ca3af; font-size: 11px; min-width: 28px; font-weight: 700; }
    .timeline-row .icon   { font-size: 14px; }
    .timeline-row .label  { font-weight: 600; flex: 1; }
    .timeline-row .player { color: #6b7280; font-size: 11px; }

    .rating-block { display: flex; align-items: center; gap: 16px; padding: 16px; background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb; }
    .rating-number { font-size: 48px; font-weight: 900; line-height: 1; }
    .rating-label { font-size: 15px; font-weight: 700; color: #374151; }
    .pb-label { font-weight: 600; color: #374151; }

    .report-footer { text-align: center; color: #9ca3af; font-size: 10px; padding: 16px 32px 24px; }

    @media print {
      body { padding: 0; }
      .section { break-inside: avoid; }
      .player-table tr { break-inside: avoid; }
    }
  `
}
