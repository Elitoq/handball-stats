import { useState, useEffect, useRef } from 'react'
import { createEvent, loadData, saveData } from '../data/store'
import ActionModal from '../components/ActionModal'

const ACTION_BUTTONS = [
  { type: 'goal',      label: 'GOL',        emoji: '⚽', color: 'bg-green-600 active:bg-green-700' },
  { type: 'miss',      label: 'FALLO',      emoji: '🎯', color: 'bg-yellow-600 active:bg-yellow-700' },
  { type: 'save',      label: 'PARADA',     emoji: '🧤', color: 'bg-blue-600 active:bg-blue-700' },
  { type: 'conceded',  label: 'ENCAJADO',   emoji: '😔', color: 'bg-purple-600 active:bg-purple-700' },
  { type: 'exclusion', label: 'EXCLUSIÓN',  emoji: '🟥', color: 'bg-red-600 active:bg-red-700' },
  { type: 'turnover',  label: 'PÉRDIDA',    emoji: '❌', color: 'bg-orange-500 active:bg-orange-600' },
]

export default function MatchLive({ matchId, onBack, onStats }) {
  const [data, setData] = useState(loadData)
  const [modal, setModal] = useState(null)
  const [minute, setMinute] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  const match = data.matches.find(m => m.id === matchId)

  function updateRivalGoals(delta) {
    const updated = {
      ...data,
      matches: data.matches.map(m =>
        m.id === matchId ? { ...m, rivalGoals: Math.max(0, (m.rivalGoals ?? 0) + delta) } : m
      ),
    }
    setData(updated)
    saveData(updated)
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setMinute(m => m + 1), 60000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  if (!match) return null

  const goals = match.events.filter(e => e.type === 'goal').length
  const misses = match.events.filter(e => e.type === 'miss').length
  const saves = match.events.filter(e => e.type === 'save').length
  const conceded = match.events.filter(e => e.type === 'conceded').length
  const exclusions = match.events.filter(e => e.type === 'exclusion').length
  const turnovers = match.events.filter(e => e.type === 'turnover').length

  function handleConfirm(details) {
    const event = createEvent({ type: modal, playerId: details.playerId, minute, details })
    const updated = {
      ...data,
      matches: data.matches.map(m => {
        if (m.id !== matchId) return m
        const base = { ...m, events: [...m.events, event] }
        if (modal === 'conceded') base.rivalGoals = (m.rivalGoals ?? 0) + 1
        return base
      }),
    }
    setData(updated)
    saveData(updated)
    setModal(null)
  }

  function undoLast() {
    const updated = {
      ...data,
      matches: data.matches.map(m =>
        m.id === matchId ? { ...m, events: m.events.slice(0, -1) } : m
      ),
    }
    setData(updated)
    saveData(updated)
  }

  function finishMatch() {
    const updated = {
      ...data,
      matches: data.matches.map(m =>
        m.id === matchId ? { ...m, finished: true } : m
      ),
    }
    setData(updated)
    saveData(updated)
    onBack()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-1">
          <button onClick={onBack} className="text-gray-400 text-sm">← Volver</button>
          <div className="flex gap-3">
            {onStats && (
              <button onClick={onStats} className="text-indigo-400 text-sm font-medium">
                📊 Stats
              </button>
            )}
            <button onClick={finishMatch} className="text-red-400 text-sm font-medium">
              Finalizar
            </button>
          </div>
        </div>
        <div className="mt-2">
          <div className="text-gray-500 text-xs text-center mb-3">{match.teamName} vs {match.rival}</div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-6xl font-bold tabular-nums text-green-400">{goals}</div>
              <div className="text-gray-600 text-xs mt-1">{match.teamName}</div>
            </div>
            <div className="text-3xl text-gray-700 font-light">-</div>
            <div className="text-center">
              <div className="text-6xl font-bold tabular-nums text-red-400">{match.rivalGoals ?? 0}</div>
              <div className="text-gray-600 text-xs mt-1">{match.rival}</div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setMinute(m => Math.max(0, m - 1))}
            className="bg-gray-800 text-white w-8 h-8 rounded-full text-lg leading-none"
          >−</button>
          <button
            onClick={() => setRunning(r => !r)}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold ${running ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}
          >
            {running ? `⏱ ${minute}'` : `▶ ${minute}'`}
          </button>
          <button
            onClick={() => setMinute(m => m + 1)}
            className="bg-gray-800 text-white w-8 h-8 rounded-full text-lg leading-none"
          >+</button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 bg-gray-900 border-t border-gray-800 text-center">
        {[
          { label: `Goles${misses > 0 ? ` (${Math.round(goals/(goals+misses)*100)}%)` : ''}`, value: goals, color: 'text-green-400' },
          { label: `Paradas${conceded > 0 ? ` (${Math.round(saves/(saves+conceded)*100)}%)` : ''}`, value: saves, color: 'text-blue-400' },
          { label: 'Exclus.', value: exclusions, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="py-3">
            <div className={`text-xl font-bold ${color}`}>{value}</div>
            <div className="text-gray-500 text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Action buttons — 3x2 grid */}
      <div className="flex-1 grid grid-cols-3 gap-2 p-3 content-start mt-1">
        {ACTION_BUTTONS.map(({ type, label, emoji, color }) => (
          <button
            key={type}
            onClick={() => setModal(type)}
            className={`${color} rounded-2xl py-6 text-center transition-transform active:scale-95`}
          >
            <div className="text-2xl mb-1">{emoji}</div>
            <div className="text-white font-bold text-xs tracking-wide">{label}</div>
          </button>
        ))}
      </div>

      {/* Recent events */}
      {match.events.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs uppercase tracking-wide">Últimas acciones</span>
            <button onClick={undoLast} className="text-red-400 text-xs">Deshacer última</button>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {[...match.events].reverse().slice(0, 8).map(ev => (
              <EventRow key={ev.id} event={ev} players={match.players} />
            ))}
          </div>
        </div>
      )}

      {modal && (
        <ActionModal
          type={modal}
          players={match.players}
          minute={minute}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

const TYPE_LABELS = { goal: '⚽ Gol', save: '🧤 Parada', exclusion: '🟥 Exclusión', turnover: '❌ Pérdida' }

function EventRow({ event, players }) {
  const player = players.find(p => p.id === event.playerId)
  return (
    <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
      <span className="text-gray-300 text-sm">{TYPE_LABELS[event.type]}</span>
      <div className="flex items-center gap-2">
        {player && <span className="text-gray-400 text-xs">#{player.number} {player.name}</span>}
        <span className="text-gray-600 text-xs">{event.minute}'</span>
      </div>
    </div>
  )
}
