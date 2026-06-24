import { useState } from 'react'
import { Users, TrendingUp, BarChart2, Activity, Plus, Settings, Globe, Star, LogOut, User } from 'lucide-react'
import { loadData, saveData } from '../data/store'
import { t } from '../i18n'

export default function Home({ onNewMatch, onOpenMatch, onOpenStats, onSquad, onSeason, onLangChange, onLogout, user, guest }) {
  const [data, setData]           = useState(loadData)
  const [showSettings, setShowSettings] = useState(false)

  const matches     = [...data.matches].sort((a, b) => b.createdAt - a.createdAt)
  const showRatings = data.settings?.showRatings ?? true
  const lang        = data.settings?.language    ?? 'es'

  function updateSettings(patch) {
    const updated = { ...data, settings: { ...data.settings, ...patch } }
    setData(updated)
    saveData(updated)
    if (patch.language) onLangChange?.(patch.language)
  }

  const displayName = user?.displayName ?? null
  const photoURL    = user?.photoURL    ?? null
  const initials    = displayName ? displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : null

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col" style={{ paddingBottom: 24 }}>

      {/* ── Header centrado ── */}
      <div style={{ padding: '52px 20px 24px', textAlign: 'center', position: 'relative' }}>

        {/* Settings button top-right */}
        <button onClick={() => setShowSettings(true)}
          style={{ position: 'absolute', top: 52, right: 20, background: '#111827', border: '1px solid #1f2937', color: '#6b7280', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={16} />
        </button>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          {photoURL ? (
            <img src={photoURL} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #1e3a7a', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0d2456', border: '2px solid #1e3a7a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {initials
                ? <span style={{ color: '#7eb3ff', fontSize: 22, fontWeight: 800 }}>{initials}</span>
                : <User size={28} color="#7eb3ff" />}
            </div>
          )}
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Handball Stats</h1>
        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>{t('home.subtitle', lang)}</p>

        {/* Nav pills */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
          <button onClick={onSquad} style={navPill}>
            <Users size={14} /> {t('home.squad', lang)}
          </button>
          <button onClick={onSeason} style={navPill}>
            <TrendingUp size={14} /> {t('home.season', lang)}
          </button>
        </div>
      </div>

      {/* ── New match button ── */}
      <div style={{ padding: '0 16px 24px' }}>
        <button onClick={onNewMatch}
          style={{ width: '100%', background: '#1a56db', color: 'white', fontWeight: 700, padding: '18px 0', borderRadius: 18, fontSize: 17, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Plus size={20} strokeWidth={2.5} /> {t('home.new_match', lang)}
        </button>
      </div>

      {/* ── Match list ── */}
      <div className="flex-1 px-4 pb-6">
        {matches.length === 0 ? (
          <div className="text-center py-16">
            <Activity size={48} color="#374151" style={{ margin: '0 auto 16px' }} />
            <p className="text-gray-600">{t('home.no_matches', lang)}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-gray-500 text-xs uppercase tracking-wide mb-3">{t('home.matches_hdr', lang)}</h2>
            <div className="space-y-3">
              {matches.map(match => (
                <MatchCard key={match.id} match={match} lang={lang}
                  onOpen={() => onOpenMatch(match.id)}
                  onStats={() => onOpenStats(match.id)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Settings sheet ── */}
      {showSettings && (
        <div onClick={() => setShowSettings(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#0d1117', borderRadius: '22px 22px 0 0', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: '#374151' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 20px' }}>
              <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>{t('settings.title', lang)}</span>
              <button onClick={() => setShowSettings(false)}
                style={{ color: '#6b7280', background: '#1f2937', border: 'none', width: 30, height: 30, borderRadius: '50%', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <SettingSection icon={Globe} label={t('settings.language', lang)} desc={t('settings.language.desc', lang)}>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {[['es','Español 🇪🇸'],['en','English 🇬🇧']].map(([code, display]) => (
                  <button key={code} onClick={() => updateSettings({ language: code })}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                      background: lang === code ? '#1a56db' : '#1f2937', color: lang === code ? 'white' : '#6b7280',
                      outline: lang === code ? '2px solid #3b82f6' : 'none', outlineOffset: 2 }}>
                    {display}
                  </button>
                ))}
              </div>
            </SettingSection>

            <Divider />

            <SettingSection icon={Star} label={t('settings.ratings', lang)} desc={t('settings.ratings.desc', lang)}>
              <Toggle value={showRatings} onChange={v => updateSettings({ showRatings: v })} lang={lang} />
            </SettingSection>

            <Divider />

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
                <button onClick={() => { setShowSettings(false); onLogout?.() }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1a1f2e', border: '1px solid #374151', color: '#f87171', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
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

function SettingSection({ icon: Icon, label, desc, children }) {
  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Icon size={15} color="#6b7280" />
        <span style={{ color: '#6b7280', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
      </div>
      <p style={{ color: '#4b5563', fontSize: 13, margin: 0 }}>{desc}</p>
      {children}
    </div>
  )
}

function Toggle({ value, onChange, lang }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginTop: 6 }}>
      <div style={{ width: 48, height: 28, borderRadius: 999, background: value ? '#1a56db' : '#374151', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 22, height: 22, background: 'white', borderRadius: '50%', transition: 'left 0.2s' }} />
      </div>
      <span style={{ color: value ? '#7eb3ff' : '#6b7280', fontSize: 14, fontWeight: 600 }}>
        {value ? t('settings.on', lang) : t('settings.off', lang)}
      </span>
    </button>
  )
}

function Divider() { return <div style={{ height: 1, background: '#1f2937', margin: '0 20px' }} /> }

const navPill = { background: '#0d1117', border: '1px solid #1e3a7a', color: '#7eb3ff', borderRadius: 99, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }

function MatchCard({ match, onOpen, onStats, lang }) {
  const goals      = match.events.filter(e => e.type === 'goal').length
  const misses     = match.events.filter(e => e.type === 'miss').length
  const saves      = match.events.filter(e => e.type === 'save').length
  const exclusions = match.events.filter(e => e.type === 'exclusion').length
  const turnovers  = match.events.filter(e => e.type === 'turnover').length
  const rival      = match.rivalGoals ?? 0
  const effPct     = goals + misses > 0 ? Math.round(goals / (goals + misses) * 100) : null

  const resultColor = !match.finished ? '#7eb3ff'
    : goals > rival ? '#4ade80'
    : goals < rival ? '#f87171'
    : '#facc15'
  const resultLabel = !match.finished ? t('home.live', lang)
    : goals > rival ? (lang === 'en' ? 'W' : 'V')
    : goals < rival ? (lang === 'en' ? 'L' : 'D')
    : (lang === 'en' ? 'D' : 'E')

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 20, overflow: 'hidden' }}>
      {/* Score bar */}
      <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {match.teamName} <span style={{ color: '#374151' }}>vs</span> {match.rival}
          </div>
          <div style={{ color: '#4b5563', fontSize: 12, marginTop: 2 }}>{match.date}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#4ade80', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{goals}</div>
            <div style={{ fontSize: 10, color: '#4b5563', marginTop: 1 }}>{lang === 'en' ? 'US' : 'NOS'}</div>
          </div>
          <div style={{ color: '#374151', fontSize: 20, fontWeight: 300 }}>—</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#f87171', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{rival}</div>
            <div style={{ fontSize: 10, color: '#4b5563', marginTop: 1 }}>{lang === 'en' ? 'THEM' : 'RIV'}</div>
          </div>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: resultColor + '22', border: `1.5px solid ${resultColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: resultColor }}>{resultLabel}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid #1a2030', padding: '8px 0' }}>
        {[
          { label: t('stat.saves', lang),      value: saves,      color: '#3b82f6' },
          { label: lang === 'en' ? 'Eff%' : 'Ef%', value: effPct != null ? `${effPct}%` : '—', color: '#7eb3ff' },
          { label: t('stat.excl_short', lang), value: exclusions, color: '#ef4444' },
          { label: t('stat.turnovers', lang),  value: turnovers,  color: '#f97316' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center', padding: '4px 0' }}>
            <div style={{ color, fontSize: 17, fontWeight: 700 }}>{value}</div>
            <div style={{ color: '#4b5563', fontSize: 10, marginTop: 1 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #1a2030' }}>
        <button onClick={onOpen}
          style={{ flex: 1, background: 'none', border: 'none', color: '#9ca3af', padding: '12px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRight: '1px solid #1a2030' }}>
          {match.finished ? t('home.view', lang) : t('home.continue', lang)}
        </button>
        <button onClick={onStats}
          style={{ flex: 1, background: 'none', border: 'none', color: '#7eb3ff', padding: '12px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <BarChart2 size={14} /> {t('stats', lang)}
        </button>
      </div>
    </div>
  )
}
