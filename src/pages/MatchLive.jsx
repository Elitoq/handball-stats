import { useState, useEffect, useRef } from 'react'
import { Target, XCircle, Shield, ShieldOff, UserMinus, ArrowRightLeft, BarChart2, StickyNote, ChevronLeft } from 'lucide-react'
import { createEvent, loadData, saveData } from '../data/store'
import ActionModal from '../components/ActionModal'

const ACTION_BUTTONS = [
  { type: 'goal',      label: 'GOL',       Icon: Target,         accent: '#22c55e' },
  { type: 'miss',      label: 'FALLO',     Icon: XCircle,        accent: '#f59e0b' },
  { type: 'save',      label: 'PARADA',    Icon: Shield,         accent: '#3b82f6' },
  { type: 'conceded',  label: 'ENCAJADO',  Icon: ShieldOff,      accent: '#f43f5e' },
  { type: 'exclusion', label: 'EXCLUSIÓN', Icon: UserMinus,      accent: '#ef4444' },
  { type: 'turnover',  label: 'PÉRDIDA',   Icon: ArrowRightLeft, accent: '#f97316' },
]

const TYPE_LABELS = {
  goal: 'Gol', miss: 'Fallo', save: 'Parada',
  conceded: 'Encajado', exclusion: 'Exclusión', turnover: 'Pérdida',
}

export default function MatchLive({ matchId, onBack, onStats }) {
  const [data, setData] = useState(loadData)
  const [modal, setModal] = useState(null)
  const [minute, setMinute] = useState(0)
  const [running, setRunning] = useState(false)
  const [period, setPeriod] = useState(1)
  const intervalRef = useRef(null)

  const match = data.matches.find(m => m.id === matchId)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setMinute(m => m + 1), 60000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  if (!match) return null

  const goals    = match.events.filter(e => e.type === 'goal').length
  const misses   = match.events.filter(e => e.type === 'miss').length
  const saves    = match.events.filter(e => e.type === 'save').length
  const conceded = match.events.filter(e => e.type === 'conceded').length
  const exclusions = match.events.filter(e => e.type === 'exclusion').length

  function handleConfirm(details) {
    const event = createEvent({ type: modal, playerId: details.playerId, minute, period, details })
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

  function deleteEvent(id) {
    const ev = match.events.find(e => e.id === id)
    const updated = {
      ...data,
      matches: data.matches.map(m => {
        if (m.id !== matchId) return m
        const base = { ...m, events: m.events.filter(e => e.id !== id) }
        if (ev?.type === 'conceded') base.rivalGoals = Math.max(0, (m.rivalGoals ?? 0) - 1)
        return base
      }),
    }
    setData(updated)
    saveData(updated)
  }

  function saveNotes(notes) {
    const updated = {
      ...data,
      matches: data.matches.map(m => m.id === matchId ? { ...m, notes } : m),
    }
    setData(updated)
    saveData(updated)
  }

  function finishMatch() {
    const updated = {
      ...data,
      matches: data.matches.map(m => m.id === matchId ? { ...m, finished: true } : m),
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
          <button onClick={onBack} className="text-gray-400 flex items-center gap-1 text-sm">
            <ChevronLeft size={16} /> Volver
          </button>
          <div className="flex gap-4 items-center">
            {onStats && (
              <button onClick={onStats} className="text-gray-400 flex items-center gap-1.5 text-sm">
                <BarChart2 size={15} /> Stats
              </button>
            )}
            <button onClick={() => setModal('notes')} className="text-gray-400">
              <StickyNote size={17} />
            </button>
            <button onClick={finishMatch} className="text-red-400 text-sm font-medium">
              Finalizar
            </button>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="mt-2">
          <div className="text-gray-500 text-xs text-center mb-3">{match.teamName} vs {match.rival}</div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-6xl font-bold tabular-nums text-green-400">{goals}</div>
              <div className="text-gray-600 text-xs mt-1">{match.teamName}</div>
            </div>
            <div className="text-3xl text-gray-700 font-light">—</div>
            <div className="text-center">
              <div className="text-6xl font-bold tabular-nums text-red-400">{match.rivalGoals ?? 0}</div>
              <div className="text-gray-600 text-xs mt-1">{match.rival}</div>
            </div>
          </div>
        </div>

        {/* Period */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <div style={{ display: 'flex', borderRadius: 999, overflow: 'hidden', border: '1px solid #1e3a7a' }}>
            <div style={{ padding: '4px 16px', fontSize: 13, fontWeight: 600, background: period === 1 ? '#1a56db' : '#111827', color: period === 1 ? 'white' : '#4b5563' }}>1ª</div>
            <div style={{ padding: '4px 16px', fontSize: 13, fontWeight: 600, background: period === 2 ? '#1a56db' : '#111827', color: period === 2 ? 'white' : '#4b5563' }}>2ª</div>
          </div>
          {period === 1 ? (
            <button
              onClick={() => { setPeriod(2); setRunning(false); setMinute(30) }}
              style={{ color: '#7eb3ff', fontSize: 12, fontWeight: 600, border: '1px solid #1e3a7a', borderRadius: 999, padding: '4px 12px', background: 'none', cursor: 'pointer' }}
            >→ 2ª parte</button>
          ) : (
            <span className="text-gray-600 text-xs">Segunda parte</span>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <button onClick={() => setMinute(m => Math.max(0, m - 1))} className="bg-gray-800 text-white w-8 h-8 rounded-full text-lg leading-none">−</button>
          <button
            onClick={() => setRunning(r => !r)}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold ${running ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'}`}
          >
            {running ? `⏱ ${minute}'` : `▶ ${minute}'`}
          </button>
          <button onClick={() => setMinute(m => m + 1)} className="bg-gray-800 text-white w-8 h-8 rounded-full text-lg leading-none">+</button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 bg-gray-900 border-t border-gray-800 text-center">
        {[
          { label: `Goles${misses > 0 ? ` · ${Math.round(goals/(goals+misses)*100)}%` : ''}`, value: goals, color: '#22c55e' },
          { label: `Paradas${conceded > 0 ? ` · ${Math.round(saves/(saves+conceded)*100)}%` : ''}`, value: saves, color: '#3b82f6' },
          { label: 'Exclus.', value: exclusions, color: '#ef4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="py-3">
            <div style={{ color, fontSize: 20, fontWeight: 700 }}>{value}</div>
            <div className="text-gray-500 text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex-1 grid grid-cols-3 gap-2 p-3 content-start mt-1">
        {ACTION_BUTTONS.map(({ type, label, Icon, accent }) => (
          <button
            key={type}
            onClick={() => setModal(type)}
            style={{
              background: '#111827',
              border: `1.5px solid ${accent}44`,
              borderRadius: 20,
              padding: '20px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              cursor: 'pointer',
            }}
          >
            <Icon size={26} color={accent} strokeWidth={1.8} />
            <span style={{ color: '#e5e7eb', fontWeight: 700, fontSize: 10, letterSpacing: '0.07em' }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Recent events */}
      {match.events.length > 0 && (
        <div className="px-4 pb-4">
          <div className="mb-2">
            <span className="text-gray-500 text-xs uppercase tracking-wide">Últimas acciones</span>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {[...match.events].reverse().slice(0, 8).map(ev => (
              <EventRow key={ev.id} event={ev} players={match.players} onDelete={deleteEvent} />
            ))}
          </div>
        </div>
      )}

      {modal === 'notes' && (
        <NotesModal
          notes={match.notes ?? ''}
          onSave={notes => { saveNotes(notes); setModal(null) }}
          onClose={() => setModal(null)}
        />
      )}

      {modal && modal !== 'notes' && (
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

function EventRow({ event, players, onDelete }) {
  const player = players.find(p => p.id === event.playerId)
  return (
    <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
      <span className="text-gray-300 text-sm">{TYPE_LABELS[event.type]}</span>
      <div className="flex items-center gap-2">
        {player && <span className="text-gray-400 text-xs">#{player.number} {player.name}</span>}
        <span className="text-gray-600 text-xs">{event.minute}'</span>
        <button
          onClick={() => onDelete(event.id)}
          className="text-red-500 text-xs px-1.5 py-0.5 rounded bg-red-950 active:bg-red-900"
        >✕</button>
      </div>
    </div>
  )
}

function NotesModal({ notes, onSave, onClose }) {
  const [text, setText] = useState(notes)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ background: '#1f2937', width: '100%', borderRadius: '20px 20px 0 0', padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 12 }}>Notas del partido</div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Sin Laura #7. Rival muy físico. Segunda parte bajó la intensidad defensiva..."
          style={{ width: '100%', background: '#111827', color: 'white', border: '1px solid #374151', borderRadius: 10, padding: 12, fontSize: 14, minHeight: 120, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={onClose} style={{ flex: 1, background: '#374151', color: '#9ca3af', border: 'none', borderRadius: 12, padding: '12px 0', fontSize: 15, cursor: 'pointer' }}>Cancelar</button>
          <button onClick={() => onSave(text)} style={{ flex: 2, background: '#1a56db', color: 'white', border: 'none', borderRadius: 12, padding: '12px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
