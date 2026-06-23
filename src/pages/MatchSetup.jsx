import { useState } from 'react'
import { loadData, saveData, createMatch, createPlayer } from '../data/store'

export default function MatchSetup({ onStart, onBack }) {
  const savedData = loadData()
  const [teamName, setTeamName] = useState('')
  const [rival, setRival] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  // Pre-load squad, all selected by default
  const [selectedIds, setSelectedIds] = useState(() => new Set(savedData.squad.map(p => p.id)))
  const [step, setStep] = useState('info')

  const squad = [...savedData.squad].sort((a, b) => Number(a.number) - Number(b.number))

  function togglePlayer(id) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function startMatch() {
    const data = loadData()
    const players = squad.filter(p => selectedIds.has(p.id))
    const match = createMatch({
      teamName: teamName || 'Mi equipo',
      rival: rival || 'Rival',
      date,
      players,
    })
    const updated = { ...data, matches: [...data.matches, match] }
    saveData(updated)
    onStart(match.id)
  }

  if (step === 'info') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <div className="px-4 pt-12 pb-6">
          <button onClick={onBack} className="text-gray-400 text-sm mb-6 block">← Volver</button>
          <h1 className="text-2xl font-bold mb-1">Nuevo partido</h1>
          <p className="text-gray-500 text-sm">Configura los datos del partido</p>
        </div>

        <div className="flex-1 px-4 space-y-4">
          <Field label="Nombre de tu equipo">
            <input
              className="input"
              placeholder="Ej: Atletico Sagunto"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
            />
          </Field>
          <Field label="Rival">
            <input
              className="input"
              placeholder="Ej: CB Valencia"
              value={rival}
              onChange={e => setRival(e.target.value)}
            />
          </Field>
          <Field label="Fecha">
            <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
          </Field>
        </div>

        <div className="p-4">
          <button
            onClick={() => setStep('players')}
            className="w-full bg-indigo-600 active:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-lg"
          >
            Siguiente →
          </button>
        </div>

        <style>{`.input{width:100%;background:#1f2937;border:1px solid #374151;color:white;border-radius:12px;padding:12px 16px;font-size:16px;outline:none;}`}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="px-4 pt-12 pb-4">
        <button onClick={() => setStep('info')} className="text-gray-400 text-sm mb-4 block">← Atrás</button>
        <h1 className="text-2xl font-bold mb-1">Jugadoras convocadas</h1>
        <p className="text-gray-500 text-sm">
          {squad.length === 0
            ? 'No tienes jugadoras en tu plantilla. Puedes añadirlas en "Mi Equipo".'
            : 'Desmarca las que no jueguen hoy'}
        </p>
      </div>

      <div className="flex-1 px-4 overflow-y-auto">
        {squad.length === 0 ? (
          <div className="text-center py-8 text-gray-600 text-sm">
            Ve a "Mi Equipo" desde la pantalla principal para añadir tu plantilla.
          </div>
        ) : (
          <div className="space-y-2">
            {squad.map(p => {
              const selected = selectedIds.has(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlayer(p.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${selected ? 'bg-indigo-900 border border-indigo-500' : 'bg-gray-800 border border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-8 ${selected ? 'text-indigo-300' : 'text-gray-500'}`}>#{p.number}</span>
                    <span className={selected ? 'text-white' : 'text-gray-500'}>{p.name}</span>
                  </div>
                  <span className="text-lg">{selected ? '✓' : '○'}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-center text-gray-500 text-sm mb-3">{selectedIds.size} jugadoras seleccionadas</div>
        <button
          onClick={startMatch}
          className="w-full bg-green-600 active:bg-green-700 text-white font-bold py-4 rounded-2xl text-lg"
        >
          ¡Empezar partido! →
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-gray-400 text-sm block mb-1">{label}</label>
      {children}
    </div>
  )
}
