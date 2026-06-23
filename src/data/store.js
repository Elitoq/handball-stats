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

export function createEvent({ type, playerId, minute, details }) {
  return { id: uid(), type, playerId, minute, details: details ?? {}, timestamp: Date.now() }
}

export const GOAL_ZONES = ['Izq. alto', 'Centro alto', 'Der. alto', 'Izq. bajo', 'Centro bajo', 'Der. bajo', '7 metros']
export const SHOT_TYPES = ['Posicional', 'Contraataque', '7 metros', 'Extremo', 'Pivote']
export const MISS_REASONS = ['Fuera', 'Parada rival', 'Bloqueado', 'Al palo']
export const EXCLUSION_TYPES = ['2 minutos', 'Tarjeta roja', 'Tarjeta azul']
export const TURNOVER_TYPES = ['Pérdida técnica', 'Interceptada', 'Pasos', 'Dobles', 'Pasivo']
export const ROLES = { player: 'Jugadora', goalkeeper: 'Portera' }

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
