const STORAGE_KEY = 'handball_data'

const defaultData = { squad: [], matches: [] }

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData
    const parsed = JSON.parse(raw)
    return { ...defaultData, ...parsed, squad: parsed.squad ?? [] }
  } catch {
    return defaultData
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function createMatch({ teamName, rival, date, players }) {
  return { id: uid(), teamName, rival, date, createdAt: Date.now(), players: players ?? [], events: [], finished: false }
}

export function createPlayer(name, number, role = 'player') {
  return { id: uid(), name, number: String(number), role }
}

export function createEvent({ type, playerId, minute, period, details }) {
  return { id: uid(), type, playerId, minute, period: period ?? 1, details: details ?? {}, timestamp: Date.now() }
}

export const GOAL_ZONES = ['Izq. alto', 'Centro alto', 'Der. alto', 'Izq. bajo', 'Centro bajo', 'Der. bajo', '7 metros']
export const SHOT_TYPES = ['Posicional', 'Contraataque', '7 metros', 'Extremo', 'Pivote']
export const MISS_REASONS = ['Fuera', 'Parada rival', 'Bloqueado', 'Al palo']
export const EXCLUSION_TYPES = ['2 minutos', 'Tarjeta roja', 'Tarjeta azul']
export const TURNOVER_TYPES = ['Pérdida técnica', 'Interceptada', 'Pasos', 'Dobles', 'Pasivo']
export const ROLES = { player: 'Jugadora', goalkeeper: 'Portera' }

export function calcPlayerRating(stats, role) {
  if (role === 'goalkeeper') {
    const total = stats.saves + stats.conceded
    if (total < 3) return null
    let r = 5.0
    const pct = stats.savePct ?? 0
    if (pct >= 50) r += 3.0
    else if (pct >= 40) r += 2.0
    else if (pct >= 33) r += 1.0
    else if (pct < 25) r -= 1.0
    r += Math.min(stats.saves * 0.1, 1.5)
    return Math.min(10, Math.max(1, Math.round(r * 10) / 10))
  } else {
    const shots = stats.goals + stats.misses
    if (shots === 0 && stats.exclusions === 0 && stats.turnovers === 0) return null
    let r = 6.0
    r += Math.min(stats.goals * 0.4, 2.5)
    if (shots >= 3) {
      const pct = stats.shootingPct ?? 0
      if (pct >= 70) r += 0.8
      else if (pct >= 50) r += 0.3
      else if (pct < 30) r -= 0.8
      else r -= 0.3
    }
    r -= Math.min(stats.turnovers * 0.4, 2.0)
    r -= Math.min(stats.exclusions * 0.5, 1.5)
    return Math.min(10, Math.max(1, Math.round(r * 10) / 10))
  }
}

export function ratingLabel(rating) {
  if (rating == null) return null
  if (rating >= 8.5) return 'Sobresaliente'
  if (rating >= 7.5) return 'Muy buena'
  if (rating >= 6.5) return 'Buena actuación'
  if (rating >= 5.5) return 'Correcta'
  if (rating >= 4.5) return 'Regular'
  return 'Mala actuación'
}

export function ratingColor(rating) {
  if (rating == null) return '#6b7280'
  if (rating >= 7.5) return '#16a34a'
  if (rating >= 6.0) return '#ca8a04'
  return '#dc2626'
}

export function getPlayerStats(match, playerId) {
  const evs = match.events.filter(e => e.playerId === playerId)
  const goals = evs.filter(e => e.type === 'goal').length
  const misses = evs.filter(e => e.type === 'miss').length
  const saves = evs.filter(e => e.type === 'save').length
  const conceded = evs.filter(e => e.type === 'conceded').length
  return {
    goals,
    misses,
    saves,
    conceded,
    exclusions: evs.filter(e => e.type === 'exclusion').length,
    turnovers: evs.filter(e => e.type === 'turnover').length,
    shootingPct: goals + misses > 0 ? Math.round((goals / (goals + misses)) * 100) : null,
    savePct: saves + conceded > 0 ? Math.round((saves / (saves + conceded)) * 100) : null,
    goalEvents: evs.filter(e => e.type === 'goal'),
    missEvents: evs.filter(e => e.type === 'miss'),
    saveEvents: evs.filter(e => e.type === 'save'),
    concededEvents: evs.filter(e => e.type === 'conceded'),
  }
}
