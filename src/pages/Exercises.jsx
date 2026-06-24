import { useState } from 'react'
import { Activity, Dumbbell, Users, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { EXERCISES } from '../data/exercises'
import ExerciseAnimation from '../components/ExerciseAnimation'
import { t } from '../i18n'

export default function Exercises({ lang = 'es' }) {
  const [filter, setFilter]     = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const visible  = filter === 'all' ? EXERCISES : EXERCISES.filter(e => e.type === filter)
  const court    = EXERCISES.filter(e => e.type === 'court').length
  const physical = EXERCISES.filter(e => e.type === 'physical').length

  return (
    <div style={{ minHeight: '100dvh', background: '#030712', color: 'white', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 }}>
      <div style={{ padding: '52px 16px 0' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>{t('ex.title', lang)}</h1>
        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
          {court} {t('ex.court', lang).toLowerCase()} · {physical} {t('ex.physical', lang).toLowerCase()}
        </p>
      </div>

      <div style={{ padding: '16px 16px 0', display: 'flex', gap: 8 }}>
        {[
          { key: 'all',      label: t('ex.all', lang),      Icon: null      },
          { key: 'court',    label: t('ex.court', lang),    Icon: Activity  },
          { key: 'physical', label: t('ex.physical', lang), Icon: Dumbbell  },
        ].map(({ key, label, Icon }) => {
          const active = filter === key
          return (
            <button key={key} onClick={() => setFilter(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                background: active ? '#1a56db' : '#1f2937', color: active ? 'white' : '#6b7280' }}>
              {Icon && <Icon size={14} strokeWidth={2} />}{label}
            </button>
          )
        })}
      </div>

      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
          <ExerciseAnimation id={exercise.id} />
          <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.65, marginBottom: 14 }}>{desc}</p>
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
  return <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#374151', flexShrink: 0 }} />
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
