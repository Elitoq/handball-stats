import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const STORAGE_KEY = 'handball_data'
const defaultData = { squad: [], matches: [] }

let _uid = null
export function setFirebaseUser(uid) { _uid = uid }

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
  if (_uid) {
    setDoc(doc(db, 'users', _uid), data).catch(() => {})
  }
}

// Pull from Firestore on login. If cloud is empty, push local data up.
export async function syncOnLogin(uid) {
  setFirebaseUser(uid)
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) {
      const cloudData = { ...defaultData, ...snap.data(), squad: snap.data().squad ?? [] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData))
    } else {
      const localData = loadData()
      await setDoc(doc(db, 'users', uid), localData)
    }
  } catch (e) {
    console.error('Firebase sync error:', e)
  }
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

export const GOAL_ZONES = ['Izq. alto', 'Centro alto', 'Der. alto', 'Izq. bajo', 'Centro bajo', 'Der. bajo']
export const SHOT_TYPES = ['Posicional', '9 metros', 'Contraataque', '7 metros', 'Extremo', 'Pivote']
export const MISS_REASONS = ['Fuera', 'Parada rival', 'Bloqueado', 'Al palo']
export const EXCLUSION_TYPES = ['2 minutos', 'Tarjeta roja', 'Tarjeta azul']
export const TURNOVER_TYPES = ['Pérdida técnica', 'Interceptada', 'Pasos', 'Dobles', 'Pasivo']
export const ROLES = { player: 'Jugadora', goalkeeper: 'Portera' }

// ── Rating algorithm ─────────────────────────────────────────────
// Benchmarks from EHF Champions League / Bundesliga data
//
// Shooting efficiency by type (league averages):
//   Posicional 48% · 9 metros 42% · Contraataque 73% · 7 metros 76%
//   Extremo 55%    · Pivote 64%
//
// Goal value by type (how hard it is to score):
//   Extremo > 9 metros > Pivote > Posicional > 7 metros > Contraataque
//
// Goalkeeper save rates by shot type:
//   Extremo 43% · 9 metros 40% · Posicional 36% · Pivote 31%
//   7 metros 22% (saving a penalty is exceptional)
//   Contraataque 20% (hardest to save)
//   Overall league average: ~30-33%
//   A 35% overall game is a good game for any goalkeeper.

const EXPECTED_SHOT_PCT = {
  Posicional:   0.48,
  '9 metros':   0.42,
  Contraataque: 0.73,
  '7 metros':   0.76,
  Extremo:      0.55,
  Pivote:       0.64,
}
const DEFAULT_SHOT_PCT = 0.52

const GOAL_VALUE = {
  Posicional:   0.38,
  '9 metros':   0.44, // long range — technically demanding
  Contraataque: 0.26, // easy — expected to score, less impressive
  '7 metros':   0.30, // should score — penalized if missed, not celebrated if scored
  Extremo:      0.48, // hard angle — impressive
  Pivote:       0.42, // contested close range
}
const DEFAULT_GOAL_VALUE = 0.38

const EXPECTED_SAVE_PCT = {
  Posicional:   0.36,
  '9 metros':   0.40, // long range — goalkeeper has time to react
  Contraataque: 0.20, // very hard — shooter has momentum and open goal
  '7 metros':   0.22, // hard — but saving one is exceptional
  Extremo:      0.43, // angle advantage for goalkeeper
  Pivote:       0.31,
}
const DEFAULT_SAVE_PCT = 0.30

function groupByShotType(events, successIds) {
  const map = {}
  for (const ev of events) {
    const t = ev.details?.shotType ?? '__none__'
    if (!map[t]) map[t] = { n: 0, s: 0 }
    map[t].n++
    if (successIds.has(ev.id)) map[t].s++
  }
  return map
}

export function calcPlayerRating(stats, role) {
  if (role === 'goalkeeper') {
    const total = stats.saves + stats.conceded
    if (total < 3) return null

    const allEvs = [...(stats.saveEvents ?? []), ...(stats.concededEvents ?? [])]
    const saveIds = new Set((stats.saveEvents ?? []).map(e => e.id))
    const byType = groupByShotType(allEvs, saveIds)

    // Expected saves given the shot type distribution faced
    let expectedSaves = 0
    let penaltiesFaced = 0
    let penaltiesSaved = 0
    let fastBreaksFaced = 0

    for (const [type, { n, s }] of Object.entries(byType)) {
      const key = type === '__none__' ? null : type
      expectedSaves += n * (EXPECTED_SAVE_PCT[key] ?? DEFAULT_SAVE_PCT)
      if (key === '7 metros') { penaltiesFaced += n; penaltiesSaved += s }
      if (key === 'Contraataque') fastBreaksFaced += n
    }

    let r = 5.0

    // Core: how many saves above/below what was statistically expected
    const saveDiff = stats.saves - expectedSaves
    r += Math.max(-2.8, Math.min(3.8, saveDiff * 0.8))

    // Volume: facing more shots under pressure is harder, rewards busy goalkeepers
    r += Math.min(total * 0.05, 1.2)

    // Penalty saves: saving a 7m is exceptional (+0.9 each, capped)
    r += Math.min(penaltiesSaved * 0.9, 1.8)

    // Fast break stops: stopping a counterattack is extremely hard
    const fastBreakSaves = (byType['Contraataque']?.s ?? 0)
    r += Math.min(fastBreakSaves * 0.4, 1.0)

    // Exclusions cost the team dearly
    r -= Math.min((stats.exclusions ?? 0) * 0.8, 1.5)

    return Math.min(10, Math.max(1, Math.round(r * 10) / 10))

  } else {
    const totalShots = stats.goals + stats.misses
    if (totalShots === 0 && !stats.exclusions && !stats.turnovers) return null

    const allShotEvs = [...(stats.goalEvents ?? []), ...(stats.missEvents ?? [])]
    const goalIds = new Set((stats.goalEvents ?? []).map(e => e.id))
    const byType = groupByShotType(allShotEvs, goalIds)

    // 1. Goal contribution — weighted by shot difficulty
    let goalContrib = 0
    for (const ev of (stats.goalEvents ?? [])) {
      goalContrib += GOAL_VALUE[ev.details?.shotType] ?? DEFAULT_GOAL_VALUE
    }

    // 2. Efficiency vs expected per shot type
    // Compares actual vs league-average for each type.
    // Needs ≥2 shots per type to be meaningful.
    let effScore = 0
    for (const [type, { n, s }] of Object.entries(byType)) {
      if (n < 2) continue
      const key = type === '__none__' ? null : type
      const actual = s / n
      const expected = EXPECTED_SHOT_PCT[key] ?? DEFAULT_SHOT_PCT
      const weight = n >= 5 ? 1.0 : n >= 3 ? 0.7 : 0.5
      effScore += (actual - expected) * 2.5 * weight
    }

    // 3. Miss penalty on 7m (missing a penalty is a significant event)
    const missedPenalties = (byType['7 metros']?.n ?? 0) - (byType['7 metros']?.s ?? 0)
    const missedPenaltyPenalty = missedPenalties * 0.4

    // 4. Miss quality: penalize unforced errors more than pressured misses
    // Fuera = worst (uncontrolled), Bloqueado = bad luck, Parada rival = ok, Al palo = least bad
    const MISS_PENALTY = { 'Fuera': 0.25, 'Bloqueado': 0.10, 'Parada rival': 0.05, 'Al palo': 0.0 }
    let missQualityPenalty = 0
    for (const ev of (stats.missEvents ?? [])) {
      const reason = ev.details?.missReason
      if (reason) missQualityPenalty += MISS_PENALTY[reason] ?? 0.10
    }

    let r = 6.0
    r += Math.min(goalContrib, 3.0)
    r += Math.max(-1.5, Math.min(2.0, effScore))
    r -= missedPenaltyPenalty
    r -= Math.min(missQualityPenalty, 1.5)
    r -= Math.min((stats.turnovers ?? 0) * 0.45, 2.5)
    r -= Math.min((stats.exclusions ?? 0) * 0.6, 1.5)

    return Math.min(10, Math.max(1, Math.round(r * 10) / 10))
  }
}

export function ratingLabel(rating) {
  if (rating == null) return null
  if (rating >= 9.0) return 'Excepcional'
  if (rating >= 8.0) return 'Sobresaliente'
  if (rating >= 7.0) return 'Muy buena'
  if (rating >= 6.0) return 'Buena actuación'
  if (rating >= 5.0) return 'Correcta'
  if (rating >= 4.0) return 'Por debajo'
  return 'Mala actuación'
}

export function ratingColor(rating) {
  if (rating == null) return '#6b7280'
  if (rating >= 7.0) return '#16a34a'
  if (rating >= 5.5) return '#ca8a04'
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
