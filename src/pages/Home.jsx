import { useState } from 'react'
import { Users, TrendingUp, BarChart2, Activity, Plus, Settings } from 'lucide-react'
import { loadData, saveData } from '../data/store'

export default function Home({ onNewMatch, onOpenMatch, onOpenStats, onSquad, onSeason }) {
  const [data, setData] = useState(loadData)
  const [showSettings, setShowSettings] = useState(false)
  const matches = [...data.matches].sort((a, b) => b.createdAt - a.createdAt)
  const showRatings = data.settings?.showRatings ?? true

  function toggleRatings() {
    const updated = { ...data, settings: { ...data.settings, showRatings: !showRatings } }
    setData(updated)
    saveData(updated)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="px-4 pt-12 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Handball Stats</h1>
          <p className="text-gray-500 text-sm mt-1">Estadísticas en tiempo real</p>
        </div>
        <div className="flex flex-col gap-2 mt-1">
          <button onClick={onSquad} style={{ background: '#111827', border: '1px solid #1e3a7a', color: '#7eb3ff', borderRadius: 12, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={14} /> Mi Equipo
          </button>
          <button onClick={onSeason} style={{ background: '#111827', border: '1px solid #1e3a7a', color: '#7eb3ff', borderRadius: 12, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={14} /> Temporada
          </button>
          <button onClick={() => setShowSettings(true)} style={{ background: '#111827', border: '1px solid #374151', color: '#6b7280', borderRadius: 12, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Settings size={14} /> Ajustes
          </button>
        </div>
      </div>

      <div className="px-4">
        <button
          onClick={onNewMatch}
          style={{ width: '100%', background: '#1a56db', color: 'white', fontWeight: 700, padding: '18px 0', borderRadius: 18, fontSize: 17, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Plus size={20} strokeWidth={2.5} /> Nuevo partido
        </button>
      </div>

      <div className="flex-1 px-4 mt-6 pb-6">
        {matches.length === 0 ? (
          <div className="text-center py-16">
            <Activity size={48} color="#374151" style={{ margin: '0 auto 16px' }} />
            <p className="text-gray-600">Todavía no hay partidos registrados</p>
          </div>
        ) : (
          <div>
            <h2 className="text-gray-500 text-xs uppercase tracking-wide mb-3">Partidos</h2>
            <div className="space-y-3">
              {matches.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onOpen={() => onOpenMatch(match.id)}
                  onStats={() => onOpenStats(match.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showSettings && (
        <div onClick={() => setShowSettings(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: '#111827', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>Ajustes</span>
              <button onClick={() => setShowSettings(false)} style={{ color: '#6b7280', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #1f2937' }}>
              <div>
                <div style={{ color: 'white', fontSize: 15, fontWeight: 500 }}>Mostrar notas de jugadoras</div>
                <div style={{ color: '#6b7280', fontSize: 13, marginTop: 3 }}>Puntuación 1–10 por partido. Desactívalo para categorías base.</div>
              </div>
              <button
                onClick={toggleRatings}
                style={{ flexShrink: 0, marginLeft: 16, width: 48, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer', background: showRatings ? '#1a56db' : '#374151', position: 'relative', transition: 'background 0.2s' }}
              >
                <span style={{ position: 'absolute', top: 3, left: showRatings ? 23 : 3, width: 22, height: 22, background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MatchCard({ match, onOpen, onStats }) {
  const goals      = match.events.filter(e => e.type === 'goal').length
  const saves      = match.events.filter(e => e.type === 'save').length
  const exclusions = match.events.filter(e => e.type === 'exclusion').length
  const turnovers  = match.events.filter(e => e.type === 'turnover').length

  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-white">{match.teamName} vs {match.rival}</div>
          <div className="text-gray-500 text-xs mt-0.5">{match.date}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: match.finished ? '#1f2937' : '#0d2456', color: match.finished ? '#6b7280' : '#7eb3ff', border: `1px solid ${match.finished ? '#374151' : '#1e3a7a'}` }}>
          {match.finished ? 'Finalizado' : 'En curso'}
        </span>
      </div>

      <div className="grid grid-cols-4 text-center mb-3">
        {[
          { label: 'Goles',    value: goals,      color: '#22c55e' },
          { label: 'Paradas',  value: saves,      color: '#3b82f6' },
          { label: 'Exclus.',  value: exclusions, color: '#ef4444' },
          { label: 'Pérdidas', value: turnovers,  color: '#f97316' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div style={{ color, fontSize: 18, fontWeight: 700 }}>{value}</div>
            <div className="text-gray-600 text-xs">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={onOpen} className="flex-1 bg-gray-700 active:bg-gray-600 text-white rounded-xl py-2.5 text-sm font-medium">
          {match.finished ? 'Ver partido' : '▶ Continuar'}
        </button>
        <button
          onClick={onStats}
          style={{ flex: 1, background: '#0d2456', color: '#7eb3ff', border: '1px solid #1e3a7a', borderRadius: 12, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        >
          <BarChart2 size={14} /> Estadísticas
        </button>
      </div>
    </div>
  )
}
