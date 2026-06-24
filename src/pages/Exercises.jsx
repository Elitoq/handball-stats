import { useState, useMemo } from 'react'
import { Activity, Dumbbell, Users, Clock, ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { EXERCISES } from '../data/exercises'
import { t } from '../i18n'

// ── filter definitions ────────────────────────────────────────

const TYPE_FILTERS = [
  { key: 'all',      labelKey: 'ex.all',      Icon: null     },
  { key: 'court',    labelKey: 'ex.court',    Icon: Activity },
  { key: 'physical', labelKey: 'ex.physical', Icon: Dumbbell },
]

// sub-filters shown when type is selected
const COURT_POSITIONS = [
  { key: 'all',        labelEs: 'Todos',     labelEn: 'All'        },
  { key: 'all',        labelEs: 'Todos',     labelEn: 'All'        }, // placeholder overridden below
  { key: 'goalkeeper', labelEs: 'Portero',   labelEn: 'Goalkeeper' },
  { key: 'wing',       labelEs: 'Extremo',   labelEn: 'Wing'       },
  { key: 'pivot',      labelEs: 'Pivote',    labelEn: 'Pivot'      },
  { key: 'back',       labelEs: 'Central/Lat', labelEn: 'Centre/Back' },
]
const COURT_SUBS = [
  { key: '',           labelEs: 'Todos',     labelEn: 'All'        },
  { key: 'goalkeeper', labelEs: 'Portero',   labelEn: 'Goalkeeper' },
  { key: 'wing',       labelEs: 'Extremo',   labelEn: 'Wing'       },
  { key: 'pivot',      labelEs: 'Pivote',    labelEn: 'Pivot'      },
  { key: 'back',       labelEs: 'Central/Lat', labelEn: 'Centre/Back' },
]
const PHYSICAL_SUBS = [
  { key: '',          labelEs: 'Todos',       labelEn: 'All'       },
  { key: 'strength',  labelEs: 'Fuerza',      labelEn: 'Strength'  },
  { key: 'power',     labelEs: 'Potencia',    labelEn: 'Power'     },
  { key: 'speed',     labelEs: 'Velocidad',   labelEn: 'Speed'     },
  { key: 'endurance', labelEs: 'Resistencia', labelEn: 'Endurance' },
  { key: 'core',      labelEs: 'Core',        labelEn: 'Core'      },
  { key: 'mobility',  labelEs: 'Movilidad',   labelEn: 'Mobility'  },
]
const DIFF_FILTERS = [
  { key: 0, labelEs: 'Todos',    labelEn: 'All'      },
  { key: 1, labelEs: 'Básico',   labelEn: 'Basic'    },
  { key: 2, labelEs: 'Medio',    labelEn: 'Medium'   },
  { key: 3, labelEs: 'Avanzado', labelEn: 'Advanced' },
]

function subLabel(item, lang) {
  return lang === 'en' ? item.labelEn : item.labelEs
}

export default function Exercises({ lang = 'es' }) {
  const [typeFilter, setTypeFilter] = useState('all')
  const [subFilter,  setSubFilter]  = useState('')
  const [diffFilter, setDiffFilter] = useState(0)
  const [query,      setQuery]      = useState('')
  const [expandedId, setExpandedId] = useState(null)

  // which sub-filter row to show
  const subOptions = typeFilter === 'court' ? COURT_SUBS : typeFilter === 'physical' ? PHYSICAL_SUBS : []

  function handleTypeChange(key) {
    setTypeFilter(key)
    setSubFilter('')
    setExpandedId(null)
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return EXERCISES.filter(ex => {
      if (typeFilter !== 'all' && ex.type !== typeFilter) return false
      if (subFilter) {
        if (ex.type === 'court'    && ex.position !== subFilter && subFilter !== '') return false
        if (ex.type === 'physical' && ex.subtype  !== subFilter && subFilter !== '') return false
      }
      if (diffFilter && ex.difficulty !== diffFilter) return false
      if (q) {
        const name = (ex.name[lang] ?? ex.name.es).toLowerCase()
        const desc = (ex.desc[lang] ?? ex.desc.es).toLowerCase()
        const cat  = (ex.category[lang] ?? ex.category.es).toLowerCase()
        if (!name.includes(q) && !desc.includes(q) && !cat.includes(q)) return false
      }
      return true
    })
  }, [typeFilter, subFilter, diffFilter, query, lang])

  const totalCourt    = EXERCISES.filter(e => e.type === 'court').length
  const totalPhysical = EXERCISES.filter(e => e.type === 'physical').length

  return (
    <div style={{ minHeight: '100dvh', background: '#030712', color: 'white', fontFamily: 'system-ui, sans-serif', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: '52px 16px 0' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>{t('ex.title', lang)}</h1>
        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
          {totalCourt} {t('ex.court', lang).toLowerCase()} · {totalPhysical} {t('ex.physical', lang).toLowerCase()}
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: '10px 14px' }}>
          <Search size={16} color="#4b5563" strokeWidth={2} style={{ flexShrink: 0 }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search exercises…' : 'Buscar ejercicios…'}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: 14 }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
              <X size={15} color="#4b5563" />
            </button>
          )}
        </div>
      </div>

      {/* Type filter */}
      <div style={{ padding: '12px 16px 0', display: 'flex', gap: 8 }}>
        {TYPE_FILTERS.map(({ key, labelKey, Icon }) => {
          const active = typeFilter === key
          return (
            <button key={key} onClick={() => handleTypeChange(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                background: active ? '#1a56db' : '#1f2937', color: active ? 'white' : '#6b7280' }}>
              {Icon && <Icon size={14} strokeWidth={2} />}{t(labelKey, lang)}
            </button>
          )
        })}
      </div>

      {/* Sub filter (position or subtype) */}
      {subOptions.length > 0 && (
        <div style={{ padding: '10px 16px 0', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {subOptions.map(item => {
            const active = subFilter === item.key
            return (
              <button key={item.key + item.labelEn} onClick={() => setSubFilter(item.key)}
                style={{ flexShrink: 0, padding: '6px 13px', borderRadius: 999, border: `1px solid ${active ? '#1e3a7a' : '#1f2937'}`, cursor: 'pointer', fontWeight: 600, fontSize: 12,
                  background: active ? '#1e3a7a' : 'transparent', color: active ? '#7eb3ff' : '#6b7280', whiteSpace: 'nowrap' }}>
                {subLabel(item, lang)}
              </button>
            )
          })}
        </div>
      )}

      {/* Difficulty filter */}
      <div style={{ padding: '10px 16px 0', display: 'flex', gap: 6 }}>
        {DIFF_FILTERS.map(item => {
          const active = diffFilter === item.key
          const colors = { 0: '#6b7280', 1: '#22c55e', 2: '#f59e0b', 3: '#ef4444' }
          const c = colors[item.key]
          return (
            <button key={item.key} onClick={() => setDiffFilter(item.key)}
              style={{ padding: '5px 12px', borderRadius: 999, border: `1px solid ${active ? c + '88' : '#1f2937'}`, cursor: 'pointer', fontWeight: 600, fontSize: 12,
                background: active ? c + '22' : 'transparent', color: active ? c : '#6b7280' }}>
              {subLabel(item, lang)}
            </button>
          )
        })}
      </div>

      {/* Results count */}
      <div style={{ padding: '10px 16px 0' }}>
        <span style={{ fontSize: 12, color: '#4b5563' }}>
          {visible.length} {lang === 'en' ? 'exercises' : 'ejercicios'}
        </span>
      </div>

      {/* Exercise list */}
      <div style={{ padding: '8px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.length === 0 && (
          <p style={{ color: '#4b5563', fontSize: 14, textAlign: 'center', paddingTop: 32 }}>{t('ex.empty', lang)}</p>
        )}
        {visible.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} lang={lang}
            expanded={expandedId === ex.id}
            onToggle={() => setExpandedId(expandedId === ex.id ? null : ex.id)} />
        ))}
      </div>
    </div>
  )
}

function ExerciseCard({ exercise, lang, expanded, onToggle }) {
  const name     = exercise.name[lang]     ?? exercise.name.es
  const desc     = exercise.desc[lang]     ?? exercise.desc.es
  const category = exercise.category[lang] ?? exercise.category.es
  const typeColor = exercise.type === 'court' ? '#3b82f6' : '#f97316'
  const TypeIcon  = exercise.type === 'court' ? Activity : Dumbbell

  // position / subtype badge
  const POSITION_LABELS = {
    goalkeeper: { es: 'Portero',    en: 'Goalkeeper' },
    wing:       { es: 'Extremo',    en: 'Wing'       },
    pivot:      { es: 'Pivote',     en: 'Pivot'      },
    back:       { es: 'Central/Lat',en: 'Centre/Back'},
  }
  const SUBTYPE_LABELS = {
    strength:  { es: 'Fuerza',      en: 'Strength'  },
    power:     { es: 'Potencia',    en: 'Power'     },
    speed:     { es: 'Velocidad',   en: 'Speed'     },
    endurance: { es: 'Resistencia', en: 'Endurance' },
    core:      { es: 'Core',        en: 'Core'      },
    mobility:  { es: 'Movilidad',   en: 'Mobility'  },
  }
  const badgeMap = exercise.type === 'court' ? POSITION_LABELS : SUBTYPE_LABELS
  const badgeKey = exercise.type === 'court' ? exercise.position : exercise.subtype
  const badge    = badgeKey && badgeKey !== 'all' && badgeMap[badgeKey] ? (badgeMap[badgeKey][lang] ?? badgeMap[badgeKey].es) : null

  return (
    <div style={{ background: '#111827', borderRadius: 16, border: `1px solid ${expanded ? '#1e3a7a' : '#1f2937'}`, overflow: 'hidden' }}>
      <button onClick={onToggle}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12, textAlign: 'left' }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: `${typeColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TypeIcon size={18} color={typeColor} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 3 }}>{name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#6b7280' }}>{category}</span>
            {badge && (
              <>
                <Dot />
                <span style={{ fontSize: 11, color: typeColor + 'cc', fontWeight: 600 }}>{badge}</span>
              </>
            )}
            <Dot />
            <span style={{ fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={11} /> {exercise.duration} {t('ex.min', lang)}
            </span>
            <Dot />
            <span style={{ fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Users size={11} /> {exercise.players}{exercise.players > 1 ? '+' : ''}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <DifficultyDots n={exercise.difficulty} />
          {expanded ? <ChevronUp size={16} color="#4b5563"/> : <ChevronDown size={16} color="#4b5563"/>}
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #1f2937' }}>
          <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.65, margin: '14px 0' }}>{desc}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Chip icon={Clock}    label={`${exercise.duration} ${t('ex.min', lang)}`}  color="#60a5fa" />
            <Chip icon={Users}    label={`${exercise.players}${exercise.players > 1 ? '+' : ''} ${exercise.players === 1 ? t('ex.player', lang) : t('ex.players', lang)}`} color="#a78bfa" />
            <Chip icon={TypeIcon} label={exercise.type === 'court' ? t('ex.court', lang) : t('ex.physical', lang)} color={typeColor} />
            <DifficultyChip n={exercise.difficulty} lang={lang} />
          </div>
        </div>
      )}
    </div>
  )
}

function Dot() {
  return <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#374151', flexShrink: 0, display: 'inline-block' }} />
}

function DifficultyDots({ n }) {
  const colors = { 1: '#22c55e', 2: '#f59e0b', 3: '#ef4444' }
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i <= n ? colors[n] : '#374151' }}/>)}
    </div>
  )
}

function DifficultyChip({ n, lang }) {
  const labels = { es: ['','Básico','Medio','Avanzado'], en: ['','Basic','Medium','Advanced'] }
  const colors = { 1: '#22c55e', 2: '#f59e0b', 3: '#ef4444' }
  const label  = labels[lang]?.[n] ?? labels.es[n]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${colors[n]}18`, border: `1px solid ${colors[n]}44`, borderRadius: 8, padding: '4px 10px' }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: colors[n] }}/>
      <span style={{ fontSize: 12, fontWeight: 600, color: colors[n] }}>{label}</span>
    </div>
  )
}

function Chip({ icon: Icon, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 8, padding: '4px 10px' }}>
      <Icon size={12} color={color} />
      <span style={{ fontSize: 12, fontWeight: 600, color }}>{label}</span>
    </div>
  )
}
