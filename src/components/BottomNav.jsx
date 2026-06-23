import { BarChart2, Dumbbell } from 'lucide-react'
import { t } from '../i18n'

export default function BottomNav({ section, onSection, lang = 'es' }) {
  const tabs = [
    { key: 'stats',     label: t('nav.stats', lang),     Icon: BarChart2 },
    { key: 'exercises', label: t('nav.exercises', lang),  Icon: Dumbbell  },
  ]

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#070d1a',
      borderTop: '1px solid #1e3a7a',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(({ key, label, Icon }) => {
        const active = section === key
        return (
          <button
            key={key}
            onClick={() => onSection(key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
              padding: '10px 0 10px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: active ? '#7eb3ff' : '#4b5563',
              transition: 'color 0.15s',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
