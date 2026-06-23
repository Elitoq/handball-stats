import { loadData } from '../data/store'

export default function Home({ onNewMatch, onOpenMatch, onOpenStats, onSquad, onSeason }) {
  const data = loadData()
  const matches = [...data.matches].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="px-4 pt-12 pb-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">🤾 Handball Stats</h1>
          <p className="text-gray-500 text-sm mt-1">Estadísticas en tiempo real</p>
        </div>
        <div className="flex flex-col gap-2 mt-1">
          <button onClick={onSquad} className="bg-gray-800 active:bg-gray-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium">
            👥 Mi Equipo
          </button>
          <button onClick={onSeason} className="bg-gray-800 active:bg-gray-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium">
            📈 Temporada
          </button>
        </div>
      </div>

      <div className="px-4">
        <button
          onClick={onNewMatch}
          className="w-full bg-indigo-600 active:bg-indigo-700 text-white font-bold py-5 rounded-2xl text-lg"
        >
          + Nuevo partido
        </button>
      </div>

      <div className="flex-1 px-4 mt-6 pb-6">
        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏐</div>
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
    </div>
  )
}

function MatchCard({ match, onOpen, onStats }) {
  const goals = match.events.filter(e => e.type === 'goal').length
  const saves = match.events.filter(e => e.type === 'save').length
  const exclusions = match.events.filter(e => e.type === 'exclusion').length
  const turnovers = match.events.filter(e => e.type === 'turnover').length

  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-white">{match.teamName} vs {match.rival}</div>
          <div className="text-gray-500 text-xs mt-0.5">{match.date}</div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${match.finished ? 'bg-gray-700 text-gray-400' : 'bg-green-900 text-green-400'}`}>
          {match.finished ? 'Finalizado' : 'En curso'}
        </span>
      </div>

      <div className="grid grid-cols-4 text-center mb-3">
        {[
          { label: 'Goles', value: goals, color: 'text-green-400' },
          { label: 'Paradas', value: saves, color: 'text-blue-400' },
          { label: 'Exclus.', value: exclusions, color: 'text-red-400' },
          { label: 'Pérdidas', value: turnovers, color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className={`text-lg font-bold ${color}`}>{value}</div>
            <div className="text-gray-600 text-xs">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onOpen}
          className="flex-1 bg-gray-700 active:bg-gray-600 text-white rounded-xl py-2.5 text-sm font-medium"
        >
          {match.finished ? 'Ver partido' : '▶ Continuar'}
        </button>
        <button
          onClick={onStats}
          className="flex-1 bg-indigo-900 active:bg-indigo-800 text-indigo-300 rounded-xl py-2.5 text-sm font-medium"
        >
          📊 Estadísticas
        </button>
      </div>
    </div>
  )
}
