import { useState } from 'react'
import { Users, TrendingUp, BarChart2, Activity, Plus, Settings, Globe, Star, LogOut, User } from 'lucide-react'
import { loadData, saveData } from '../data/store'
import { t } from '../i18n'

export default function Home({ onNewMatch, onOpenMatch, onOpenStats, onSquad, onSeason, onLangChange, onLogout, user, guest }) {
  const [data, setData]           = useState(loadData)
  const [showSettings, setShowSettings] = useState(false)

  const matches   = [...data.matches].sort((a, b) => b.createdAt - a.createdAt)
  const showRatings = data.settings?.showRatings ?? true
  const lang        = data.settings?.language    ?? 'es'

  function updateSettings(patch) {
    const updated = { ...data, settings: { ...data.settings, ...patch } }
    setData(updated)
    saveData(updated)
    if (patch.language) onLangChange?.(patch.language)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col" style={{ paddingBottom: 72 }}>
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

      {/* ── Settings bottom sheet ── */}
      {showSettings && (
        <div
          onClick={() => setShowSettings(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#0d1117', borderRadius: '22px 22px 0 0', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: '#374151' }} />
            </div>

            {/* Title row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 20px' }}>
              <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>{t('settings.title', lang)}</span>
              <button onClick={() => setShowSettings(false)} style={{ color: '#6b7280', background: '#1f2937', border: 'none', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {/* ── Language ── */}
            <SettingSection icon={Globe} label={t('settings.language', lang)} desc={t('settings.language.desc', lang)}>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {[['es', 'Español 🇪🇸'], ['en', 'English 🇬🇧']].map(([code, display]) => (
                  <button
                    key={code}
                    onClick={() => updateSettings({ language: code })}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                      background: lang === code ? '#1a56db' : '#1f2937',
                      color:      lang === code ? 'white'   : '#6b7280',
                      outline:    lang === code ? '2px solid #3b82f6' : 'none',
                      outlineOffset: 2,
                    }}
                  >{display}</button>
                ))}
              </div>
            </SettingSection>

            <Divider />

            {/* ── Ratings ── */}
            <SettingSection icon={Star} label={t('settings.ratings', lang)} desc={t('settings.ratings.desc', lang)}>
              <Toggle value={showRatings} onChange={v => updateSettings({ showRatings: v })} />
            </SettingSection>

            <Divider />

            {/* ── Account ── */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <User size={15} color="#6b7280" />
                <span style={{ color: '#6b7280', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t('settings.account', lang)}</span>
              </div>
              <div style={{ background: '#1f2937', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>{user ? user.email : t('settings.guest', lang)}</div>
                  {user && <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Google</div>}
                </div>
                <button
                  onClick={() => { setShowSettings(false); onLogout?.() }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1a1f2e', border: '1px solid #374151', color: '#f87171', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  <LogOut size={14} /> {t('settings.logout', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Settings sub-components ──────────────────────────────────────

function SettingSection({ icon: Icon, label, desc, children }) {
  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Icon size={15} color="#6b7280" />
        <span style={{ color: '#6b7280', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
      </div>
      <p style={{ color: '#4b5563', fontSize: 13, marginTop: 0 }}>{desc}</p>
      {children}
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginTop: 6 }}
    >
      <div style={{ width: 48, height: 28, borderRadius: 999, background: value ? '#1a56db' : '#374151', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 22, height: 22, background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
      </div>
      <span style={{ color: value ? '#7eb3ff' : '#6b7280', fontSize: 14, fontWeight: 600 }}>
        {value ? 'Activado' : 'Desactivado'}
      </span>
    </button>
  )
}

function Divider() {
  return <div style={{ height: 1, background: '#1f2937', margin: '0 20px' }} />
}

// ── Match card ──────────────────────────────────────────────────

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
