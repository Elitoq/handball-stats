import { getPlayerStats, calcPlayerRating, ratingLabel, loadData, GOAL_ZONES, SHOT_TYPES } from '../data/store'

// ── Translations ─────────────────────────────────────────────────

const RT = {
  es: {
    victory: 'VICTORIA', defeat: 'DERROTA', draw: 'EMPATE',
    W: 'V', L: 'D', D: 'E',
    match_summary: 'Resumen del partido',
    goals: 'Goles', misses: 'Fallos', efficiency: 'Eficacia',
    saves: 'Paradas', conceded: 'Encajados', save_pct: '% Paradas',
    exclusions: 'Exclusiones', turnovers: 'Pérdidas',
    shots: 'Lanzamientos', shots_rec: 'Disparos rec.',
    player_of_match: 'Jugador del partido',
    match_notes: 'Notas del partido',
    period_breakdown: 'Desglose por partes',
    p1: '1ª Parte', p2: '2ª Parte',
    goal_map: 'Mapa de lanzamientos del equipo',
    save_map: 'Mapa de paradas del equipo',
    players_title: 'Estadísticas por jugador',
    col_player: 'Jugador', col_role: 'Rol', col_excl: 'Excl.', col_turn: 'Pérd.',
    col_note: 'Nota', col_matches: 'Partidos',
    role_gk: 'Portero/a', role_player: 'Jugador/a',
    timeline_title: 'Timeline del partido',
    ev_goal: 'Gol', ev_miss: 'Fallo', ev_save: 'Parada',
    ev_conceded: 'Encajado', ev_excl: 'Exclusión', ev_turn: 'Pérdida',
    season_report: 'Informe de temporada',
    matches_label: 'partidos', results: 'Resultados',
    wins: 'Victorias', draws: 'Empates', losses: 'Derrotas',
    team_stats: 'Estadísticas de equipo',
    scorers: 'Ranking goleadores/as',
    keepers: 'Ranking porteros/as',
    match_history: 'Historial de partidos',
    col_date: 'Fecha', col_rival: 'Rival', col_result: 'Resultado',
    off_stats: 'Estadísticas ofensivas',
    gk_stats: 'Estadísticas bajo palos',
    match_rating: 'Valoración del partido',
    zone_eff: 'Mapa de eficacia por zona',
    shot_type: 'Tipo de lanzamiento',
    shot_recv: 'Tipo de disparo recibido',
    per_match: 'Partido a partido',
    season_summary: 'Resumen de temporada',
    zone_season: 'Mapa de eficacia por zona (acumulado temporada)',
    shot_season_field: 'Tipo de lanzamiento — temporada',
    shot_season_gk: 'Tipo de disparo recibido — temporada',
    net: 'Portería',
    no_type: 'Sin tipo registrado',
    hits: 'Éxitos',
    generated: 'Generado el',
    goal_label: (g, t) => `${g} Goles de ${t} lanzamientos`,
    save_label: (s, t) => `${s} Paradas de ${t} disparos`,
  },
  en: {
    victory: 'WIN', defeat: 'LOSS', draw: 'DRAW',
    W: 'W', L: 'L', D: 'D',
    match_summary: 'Match summary',
    goals: 'Goals', misses: 'Misses', efficiency: 'Efficiency',
    saves: 'Saves', conceded: 'Conceded', save_pct: 'Save %',
    exclusions: 'Exclusions', turnovers: 'Turnovers',
    shots: 'Shots', shots_rec: 'Shots received',
    player_of_match: 'Player of the match',
    match_notes: 'Match notes',
    period_breakdown: 'Half-time breakdown',
    p1: '1st Half', p2: '2nd Half',
    goal_map: 'Team shot map',
    save_map: 'Team save map',
    players_title: 'Player statistics',
    col_player: 'Player', col_role: 'Role', col_excl: 'Excl.', col_turn: 'Turn.',
    col_note: 'Rating', col_matches: 'Matches',
    role_gk: 'Goalkeeper', role_player: 'Player',
    timeline_title: 'Match timeline',
    ev_goal: 'Goal', ev_miss: 'Miss', ev_save: 'Save',
    ev_conceded: 'Conceded', ev_excl: 'Exclusion', ev_turn: 'Turnover',
    season_report: 'Season report',
    matches_label: 'matches', results: 'Results',
    wins: 'Wins', draws: 'Draws', losses: 'Losses',
    team_stats: 'Team statistics',
    scorers: 'Top scorers',
    keepers: 'Top goalkeepers',
    match_history: 'Match history',
    col_date: 'Date', col_rival: 'Opponent', col_result: 'Result',
    off_stats: 'Offensive statistics',
    gk_stats: 'Goalkeeper statistics',
    match_rating: 'Match rating',
    zone_eff: 'Zone efficiency map',
    shot_type: 'Shot type',
    shot_recv: 'Received shot type',
    per_match: 'Match by match',
    season_summary: 'Season summary',
    zone_season: 'Zone efficiency map (season total)',
    shot_season_field: 'Shot type — season',
    shot_season_gk: 'Received shot type — season',
    net: 'Goal',
    no_type: 'No type recorded',
    hits: 'Hits',
    generated: 'Generated on',
    goal_label: (g, t) => `${g} goals from ${t} shots`,
    save_label: (s, t) => `${s} saves from ${t} shots`,
  },
}

function tr(lang) { return RT[lang] ?? RT.es }

// Shot type display translations for the PDF
const SHOT_LABELS = {
  es: { 'Posicional': 'Posicional', '9 metros': '9 metros', 'Contraataque': 'Contraataque', '7 metros': '7 metros', 'Extremo': 'Extremo', 'Pivote': 'Pivote' },
  en: { 'Posicional': 'Positional', '9 metros': '9m shot', 'Contraataque': 'Fast break', '7 metros': 'Penalty (7m)', 'Extremo': 'Wing', 'Pivote': 'Pivot' },
}

// ── Entry points ────────────────────────────────────────────────

export function printMatchReport(match, lang = 'es') {
  const html = buildMatchReport(match, lang)
  openPrint(html)
}

export function printPlayerMatchReport(match, playerId, lang = 'es') {
  const player = match.players.find(p => p.id === playerId)
  const stats = getPlayerStats(match, playerId)
  const html = buildPlayerMatchReport(match, player, stats, lang)
  openPrint(html)
}

export function printSeasonReport(matches, squadMap, lang = 'es') {
  const html = buildSeasonReport(matches, squadMap, lang)
  openPrint(html)
}

export function printPlayerSeasonReport(player, matches, lang = 'es') {
  const html = buildPlayerSeasonReport(player, matches, lang)
  openPrint(html)
}

// ── Print helper ────────────────────────────────────────────────

function openPrint(bodyHtml) {
  const win = window.open('', '_blank')
  win.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Report</title>
    <style>${printCSS()}</style>
  </head><body>${bodyHtml}</body></html>`)
  win.document.close()
  win.onload = () => { win.focus(); win.print() }
}

// ── Match report ────────────────────────────────────────────────

function buildMatchReport(match, lang) {
  const T = tr(lang)
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
    ? ourGoals > match.rivalGoals ? T.victory : ourGoals < match.rivalGoals ? T.defeat : T.draw
    : null

  return `
    ${header(`${match.teamName} vs ${match.rival}`, match.date, result ? `${result} · ${ourGoals}-${rivalGoals}` : `${ourGoals}-${rivalGoals}`)}

    <div class="section">
      <h2>${T.match_summary}</h2>
      <div class="stats-grid-3">
        ${statBox(T.goals, goals.length, 'green')}
        ${statBox(T.misses, misses.length, 'orange')}
        ${statBox(shootingPct != null ? `${T.efficiency} ${shootingPct}%` : T.shots, goals.length + misses.length, 'purple')}
      </div>
      <div class="stats-grid-3" style="margin-top:8px">
        ${statBox(T.saves, saves.length, 'blue')}
        ${statBox(T.conceded, conceded.length, 'red')}
        ${statBox(savePct != null ? `${T.save_pct} ${savePct}%` : T.shots_rec, saves.length + conceded.length, 'indigo')}
      </div>
      <div class="stats-grid-2" style="margin-top:8px">
        ${statBox(T.exclusions, exclusions.length, 'red')}
        ${statBox(T.turnovers, turnovers.length, 'orange')}
      </div>
    </div>

    ${mvpBlock(match, T)}

    ${match.notes ? `
    <div class="section">
      <h2>${T.match_notes}</h2>
      <div style="background:#f9fafb;border-radius:8px;padding:14px 16px;font-size:13px;color:#374151;line-height:1.6;border:1px solid #e5e7eb;white-space:pre-wrap">${match.notes}</div>
    </div>` : ''}

    ${periodBreakdown(match, T)}

    ${goals.length + misses.length > 0 ? `
    <div class="section">
      <h2>${T.goal_map}</h2>
      ${zoneMap([...goals, ...misses], goals, T.shots, T.goals, T.net)}
    </div>` : ''}

    ${saves.length + conceded.length > 0 ? `
    <div class="section">
      <h2>${T.save_map}</h2>
      ${zoneMap([...saves, ...conceded], saves, T.shots_rec, T.saves, T.net)}
    </div>` : ''}

    ${playersWithStats.length > 0 ? `
    <div class="section">
      <h2>${T.players_title}</h2>
      <table class="player-table">
        <thead>
          <tr>
            <th>#</th><th>${T.col_player}</th><th>${T.col_role}</th>
            <th class="num green">${T.goals}</th>
            <th class="num orange">${T.misses}</th>
            <th class="num purple">${T.efficiency}</th>
            <th class="num blue">${T.saves}</th>
            <th class="num red">${T.conceded}</th>
            <th class="num indigo">${T.save_pct}</th>
            <th class="num">${T.col_excl}</th>
            <th class="num">${T.col_turn}</th>
            ${loadData().settings?.showRatings ?? true ? `<th class="num">${T.col_note}</th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${playersWithStats.map(p => {
            const s = p.stats
            const showRatings = loadData().settings?.showRatings ?? true
            const eff = s.goals + s.misses > 0 ? `${Math.round(s.goals/(s.goals+s.misses)*100)}%` : '-'
            const sav = s.saves + s.conceded > 0 ? `${Math.round(s.saves/(s.saves+s.conceded)*100)}%` : '-'
            const rating = calcPlayerRating(s, p.role)
            const rCell = rating != null ? ratingBadge(rating) : '-'
            return `<tr>
              <td class="num">${p.number}</td>
              <td>${p.name}</td>
              <td class="role">${p.role === 'goalkeeper' ? T.role_gk : T.role_player}</td>
              <td class="num green">${s.goals}</td>
              <td class="num orange">${s.misses}</td>
              <td class="num purple">${eff}</td>
              <td class="num blue">${s.saves}</td>
              <td class="num red">${s.conceded}</td>
              <td class="num indigo">${sav}</td>
              <td class="num">${s.exclusions}</td>
              <td class="num">${s.turnovers}</td>
              ${showRatings ? `<td class="num">${rCell}</td>` : ''}
            </tr>`
          }).join('')}
        </tbody>
      </table>
    </div>` : ''}

    ${match.events.length > 0 ? `
    <div class="section">
      <h2>${T.timeline_title}</h2>
      <div class="timeline">
        ${[...match.events].sort((a,b) => a.minute - b.minute).map(ev => {
          const player = match.players.find(p => p.id === ev.playerId)
          const labels = { goal: T.ev_goal, miss: T.ev_miss, save: T.ev_save, conceded: T.ev_conceded, exclusion: T.ev_excl, turnover: T.ev_turn }
          const dotColors = { goal:'#16a34a', miss:'#ca8a04', save:'#2563eb', conceded:'#dc2626', exclusion:'#dc2626', turnover:'#f97316' }
          return `<div class="timeline-row ${ev.type}">
            <span class="min">${ev.minute}'</span>
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${dotColors[ev.type]};flex-shrink:0"></span>
            <span class="label">${labels[ev.type]}</span>
            ${player ? `<span class="player">#${player.number} ${player.name}</span>` : ''}
          </div>`
        }).join('')}
      </div>
    </div>` : ''}

    ${footer(T, lang)}
  `
}

// ── Player match report ──────────────────────────────────────────

function buildPlayerMatchReport(match, player, stats, lang) {
  const T = tr(lang)
  if (!player) return `<p>${T.role_player} not found</p>`
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
      `${match.teamName} vs ${match.rival} · ${isGK ? T.role_gk : T.role_player}`
    )}

    <div class="section">
      <h2>${isGK ? T.gk_stats : T.off_stats}</h2>
      ${isGK ? `
        <div class="stats-grid-3">
          ${statBox(T.saves, stats.saves, 'blue')}
          ${statBox(T.conceded, stats.conceded, 'red')}
          ${statBox(eff != null ? `${T.save_pct} ${eff}%` : T.shots_rec, stats.saves + stats.conceded, 'indigo')}
        </div>` : `
        <div class="stats-grid-3">
          ${statBox(T.goals, stats.goals, 'green')}
          ${statBox(T.misses, stats.misses, 'orange')}
          ${statBox(eff != null ? `${T.efficiency} ${eff}%` : T.shots, stats.goals + stats.misses, 'purple')}
        </div>`}
      <div class="stats-grid-2" style="margin-top:8px">
        ${statBox(T.exclusions, stats.exclusions, 'red')}
        ${statBox(T.turnovers, stats.turnovers, 'orange')}
      </div>
    </div>

    ${(() => {
      if (!(loadData().settings?.showRatings ?? true)) return ''
      const rating = calcPlayerRating(stats, player.role)
      if (rating == null) return ''
      return `<div class="section">
        <h2>${T.match_rating}</h2>
        <div class="rating-block">
          <div class="rating-number" style="color:${rating >= 7.5 ? '#15803d' : rating >= 6.0 ? '#b45309' : '#dc2626'}">${rating.toFixed(1)}</div>
          <div class="rating-label">${ratingLabel(rating)}</div>
        </div>
      </div>`
    })()}

    ${totalEvents.length > 0 ? `
    <div class="section">
      <h2>${T.zone_eff}</h2>
      ${zoneMap(totalEvents, successEvents, isGK ? T.shots_rec : T.shots, isGK ? T.saves : T.goals, T.net)}
    </div>` : ''}

    ${totalEvents.length > 0 ? `
    <div class="section">
      <h2>${isGK ? T.shot_recv : T.shot_type}</h2>
      ${shotTypeTable(totalEvents, successEvents, T, lang)}
    </div>` : ''}

    ${footer(T, lang)}
  `
}

// ── Season report ────────────────────────────────────────────────

function buildSeasonReport(matches, squadMap, lang) {
  const T = tr(lang)
  if (matches.length === 0) return `<p>${lang === 'en' ? 'No matches recorded.' : 'Sin partidos registrados.'}</p>`
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
    const result = rival === null ? null : our > rival ? 'W' : our < rival ? 'L' : 'D'
    return { ...m, ourGoals: our, result }
  })
  const wins  = results.filter(m => m.result === 'W').length
  const draws = results.filter(m => m.result === 'D').length
  const losses = results.filter(m => m.result === 'L').length

  const players = Object.values(squadMap ?? {})
  const scorers = players
    .filter(p => p.role !== 'goalkeeper' && p.stats.goals + p.stats.misses > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals)
  const goalkeepers = players
    .filter(p => p.role === 'goalkeeper' && p.stats.saves + p.stats.conceded > 0)
    .sort((a, b) => (b.stats.savePct ?? 0) - (a.stats.savePct ?? 0))

  return `
    ${header(teamName, T.season_report, `${matches.length} ${T.matches_label} · ${wins}${T.W} ${draws}${T.D} ${losses}${T.L}`)}

    <div class="section">
      <h2>${T.results}</h2>
      <div class="stats-grid-3">
        ${statBox(T.wins, wins, 'green')}
        ${statBox(T.draws, draws, 'orange')}
        ${statBox(T.losses, losses, 'red')}
      </div>
      <div class="result-bar">
        ${wins > 0 ? `<div class="rb-win" style="flex:${wins}"></div>` : ''}
        ${draws > 0 ? `<div class="rb-draw" style="flex:${draws}"></div>` : ''}
        ${losses > 0 ? `<div class="rb-loss" style="flex:${losses}"></div>` : ''}
      </div>
    </div>

    <div class="section">
      <h2>${T.team_stats}</h2>
      <div class="stats-grid-3">
        ${statBox(T.goals, goals, 'green')}
        ${statBox(T.misses, misses, 'orange')}
        ${statBox(shootingPct != null ? `${T.efficiency} ${shootingPct}%` : T.shots, goals + misses, 'purple')}
      </div>
      <div class="stats-grid-3" style="margin-top:8px">
        ${statBox(T.saves, saves, 'blue')}
        ${statBox(T.conceded, conceded, 'red')}
        ${statBox(savePct != null ? `${T.save_pct} ${savePct}%` : T.shots_rec, saves + conceded, 'indigo')}
      </div>
    </div>

    ${scorers.length > 0 ? `
    <div class="section">
      <h2>${T.scorers}</h2>
      <table class="player-table">
        <thead><tr><th>#</th><th>${T.col_player}</th><th class="num">${T.col_matches}</th><th class="num green">${T.goals}</th><th class="num orange">${T.misses}</th><th class="num purple">${T.efficiency}</th><th class="num">${T.col_excl}</th><th class="num">${T.col_turn}</th></tr></thead>
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
      <h2>${T.keepers}</h2>
      <table class="player-table">
        <thead><tr><th>#</th><th>${T.role_gk}</th><th class="num">${T.col_matches}</th><th class="num blue">${T.saves}</th><th class="num red">${T.conceded}</th><th class="num indigo">${T.save_pct}</th></tr></thead>
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
      <h2>${T.match_history}</h2>
      <table class="player-table">
        <thead><tr><th>${T.col_date}</th><th>${T.col_rival}</th><th class="num">${T.col_result}</th><th class="num green">${T.goals}</th><th class="num blue">${T.saves}</th><th class="num">${T.col_excl}</th><th class="num">${T.col_turn}</th></tr></thead>
        <tbody>
          ${[...results].sort((a,b) => new Date(a.date)-new Date(b.date)).map(m => {
            const mSaves = m.events.filter(e => e.type === 'save').length
            const mExcl  = m.events.filter(e => e.type === 'exclusion').length
            const mTurn  = m.events.filter(e => e.type === 'turnover').length
            const resLabel = m.result ? T[m.result] : '?'
            const resColor = m.result === 'W' ? 'green' : m.result === 'L' ? 'red' : 'orange'
            return `<tr>
              <td>${m.date}</td>
              <td>${m.rival}</td>
              <td class="num ${resColor}">${resLabel} ${m.ourGoals}-${m.rivalGoals ?? '?'}</td>
              <td class="num green">${m.ourGoals}</td>
              <td class="num blue">${mSaves}</td>
              <td class="num">${mExcl}</td>
              <td class="num">${mTurn}</td>
            </tr>`
          }).join('')}
        </tbody>
      </table>
    </div>

    ${footer(T, lang)}
  `
}

// ── Player season report ─────────────────────────────────────────

function buildPlayerSeasonReport(player, matches, lang) {
  const T = tr(lang)
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

  const allSuccessEvents = matchRows.flatMap(r => isGK ? r.stats.saveEvents : r.stats.goalEvents)
  const allTotalEvents = matchRows.flatMap(r => isGK
    ? [...r.stats.saveEvents, ...r.stats.concededEvents]
    : [...r.stats.goalEvents, ...r.stats.missEvents])

  return `
    ${header(
      `#${player.number} ${player.name}`,
      T.season_report,
      `${isGK ? T.role_gk : T.role_player} · ${matchRows.length} ${T.matches_label}`
    )}

    <div class="section">
      <h2>${T.season_summary}</h2>
      ${isGK ? `
        <div class="stats-grid-3">
          ${statBox(T.saves, totalSaves, 'blue')}
          ${statBox(T.conceded, totalConceded, 'red')}
          ${statBox(savePct != null ? `${T.save_pct} ${savePct}%` : T.shots_rec, totalSaves + totalConceded, 'indigo')}
        </div>` : `
        <div class="stats-grid-3">
          ${statBox(T.goals, totalGoals, 'green')}
          ${statBox(T.misses, totalMisses, 'orange')}
          ${statBox(shootingPct != null ? `${T.efficiency} ${shootingPct}%` : T.shots, totalGoals + totalMisses, 'purple')}
        </div>`}
      <div class="stats-grid-2" style="margin-top:8px">
        ${statBox(T.exclusions, totalExcl, 'red')}
        ${statBox(T.turnovers, totalTurn, 'orange')}
      </div>
    </div>

    ${allTotalEvents.length > 0 ? `
    <div class="section">
      <h2>${T.zone_season}</h2>
      ${zoneMap(allTotalEvents, allSuccessEvents, isGK ? T.shots_rec : T.shots, isGK ? T.saves : T.goals, T.net)}
    </div>` : ''}

    ${allTotalEvents.length > 0 ? `
    <div class="section">
      <h2>${isGK ? T.shot_season_gk : T.shot_season_field}</h2>
      ${shotTypeTable(allTotalEvents, allSuccessEvents, T, lang)}
    </div>` : ''}

    ${matchRows.length > 0 ? `
    <div class="section">
      <h2>${T.per_match}</h2>
      <table class="player-table">
        <thead>
          <tr>
            <th>${T.col_date}</th><th>${T.col_rival}</th>
            ${isGK
              ? `<th class="num blue">${T.saves}</th><th class="num red">${T.conceded}</th><th class="num indigo">%</th>`
              : `<th class="num green">${T.goals}</th><th class="num orange">${T.misses}</th><th class="num purple">${T.efficiency}</th>`}
            <th class="num">${T.col_excl}</th>
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

    ${footer(T, lang)}
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

function footer(T, lang) {
  const locale = lang === 'en' ? 'en-GB' : 'es-ES'
  const now = new Date().toLocaleDateString(locale, { day:'2-digit', month:'long', year:'numeric' })
  return `<div class="report-footer">${T.generated} ${now} · Handball Stats App</div>`
}

function statBox(label, value, color) {
  return `<div class="stat-box ${color}"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`
}

const ZONE_LABELS_SHORT = ['L↑','C↑','R↑','L↓','C↓','R↓']

function zoneMap(totalEvents, successEvents, totalLabel, successLabel, netLabel) {
  const successIds = new Set(successEvents.map(e => e.id))
  const zones6 = GOAL_ZONES.slice(0, 6)

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

  return `
    <div class="zone-map-wrap">
      <div class="zone-map-label">▲ ${netLabel}</div>
      <table class="zone-table">
        <tr>${cells6.slice(0,3).join('')}</tr>
        <tr>${cells6.slice(3,6).join('')}</tr>
      </table>
      <div class="zone-legend">
        ${[['#15803d','>70%'],['#65a30d','50-70%'],['#d97706','30-50%'],['#dc2626','<30%'],['#f3f4f6','-']].map(([c,l]) =>
          `<span><span style="display:inline-block;width:12px;height:12px;background:${c};border-radius:2px;border:1px solid #e5e7eb;vertical-align:middle;margin-right:3px"></span>${l}</span>`
        ).join('')}
      </div>
      <div style="font-size:11px;color:#6b7280;margin-top:4px;text-align:center">${successLabel} / ${totalLabel}</div>
    </div>
  `
}

function shotTypeTable(totalEvents, successEvents, T, lang) {
  const successIds = new Set(successEvents.map(e => e.id))
  const shotLabels = SHOT_LABELS[lang] ?? SHOT_LABELS.es
  const rows = SHOT_TYPES.map(type => {
    const total = totalEvents.filter(e => e.details?.shotType === type).length
    const success = totalEvents.filter(e => e.details?.shotType === type && successIds.has(e.id)).length
    if (total === 0) return null
    const pct = Math.round(success / total * 100)
    return { type, label: shotLabels[type] ?? type, total, success, pct }
  }).filter(Boolean)

  if (rows.length === 0) return `<p style="color:#6b7280;font-size:13px">${T.no_type}</p>`

  const max = Math.max(...rows.map(r => r.total))
  return `<table class="player-table">
    <thead><tr><th>${T.shot_type}</th><th class="num">Total</th><th class="num green">${T.hits}</th><th class="num purple">%</th><th style="width:40%"></th></tr></thead>
    <tbody>
      ${rows.map(r => `<tr>
        <td>${r.label}</td>
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

function mvpBlock(match, T) {
  if (!(loadData().settings?.showRatings ?? true)) return ''
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
      <h2>${T.player_of_match}</h2>
      <div style="display:flex;align-items:center;gap:16px;background:linear-gradient(135deg,#0a1628,#0d2456);border-radius:12px;padding:16px 20px;color:white">
        <div style="font-size:32px;color:#7eb3ff">★</div>
        <div style="flex:1">
          <div style="font-weight:800;font-size:18px">#${mvp.number} ${mvp.name}</div>
          <div style="color:#7eb3ff;font-size:12px;margin-top:2px">${mvp.role === 'goalkeeper' ? T.role_gk : T.role_player}</div>
        </div>
        <div style="text-align:center;background:${bg};border-radius:10px;padding:8px 16px">
          <div style="color:${color};font-weight:900;font-size:36px;line-height:1">${mvp.rating.toFixed(1)}</div>
          <div style="color:${color};font-size:11px;margin-top:2px">${ratingLabel(mvp.rating)}</div>
        </div>
      </div>
    </div>
  `
}

function periodBreakdown(match, T) {
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
      <h2>${T.period_breakdown}</h2>
      <table class="player-table">
        <thead><tr><th></th><th class="num">${T.p1}</th><th class="num">${T.p2}</th></tr></thead>
        <tbody>
          ${row(T.goals, p1.goals, p2.goals, 'green')}
          ${row(T.misses, p1.misses, p2.misses, 'orange')}
          ${row(T.efficiency, p1.eff, p2.eff, 'purple')}
          ${row(T.saves, p1.saves, p2.saves, 'blue')}
          ${row(T.conceded, p1.conceded, p2.conceded, 'red')}
          ${row(T.save_pct, p1.sav, p2.sav, 'indigo')}
          ${row(T.exclusions, p1.excl, p2.excl)}
          ${row(T.turnovers, p1.turn, p2.turn)}
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

    .report-header { background: linear-gradient(135deg, #0a1628 0%, #0d2456 60%, #1e3a7a 100%); color: white; padding: 28px 32px 24px; margin-bottom: 0; }
    .report-badge { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #7eb3ff; margin-bottom: 6px; }
    .report-header h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: white; margin-bottom: 4px; }
    .report-sub { font-size: 13px; color: #93c5fd; }

    .section { padding: 20px 32px; border-bottom: 1px solid #f3f4f6; }
    .section h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1e3a7a; margin-bottom: 14px; }

    .stats-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
    .stats-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }

    .stat-box { border-radius: 8px; padding: 14px 12px; text-align: center; border: 1px solid; }
    .stat-box.green  { background: #f0fdf4; border-color: #86efac; }
    .stat-box.blue   { background: #eff6ff; border-color: #93c5fd; }
    .stat-box.red    { background: #fef2f2; border-color: #fca5a5; }
    .stat-box.orange { background: #fff7ed; border-color: #fdba74; }
    .stat-box.purple { background: #eff6ff; border-color: #93c5fd; }
    .stat-box.indigo { background: #eff6ff; border-color: #93c5fd; }
    .stat-value { font-size: 28px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
    .stat-box.green  .stat-value { color: #15803d; }
    .stat-box.blue   .stat-value { color: #1d4ed8; }
    .stat-box.red    .stat-value { color: #dc2626; }
    .stat-box.orange .stat-value { color: #c2410c; }
    .stat-box.purple .stat-value { color: #1d4ed8; }
    .stat-box.indigo .stat-value { color: #1d4ed8; }
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
    .orange { color: #c2410c; } .purple { color: #1d4ed8; } .indigo { color: #1d4ed8; }

    .zone-map-wrap { max-width: 340px; }
    .zone-map-label { font-size: 11px; color: #6b7280; text-align: center; margin-bottom: 4px; }
    .zone-table { width: 100%; border-collapse: collapse; border: 2px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
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
