import { useState } from 'react'
import { GOAL_ZONES, SHOT_TYPES, MISS_REASONS, EXCLUSION_TYPES, TURNOVER_TYPES } from '../data/store'
import { t, tv } from '../i18n'

const TYPE_KEYS = {
  goal: 'action.goal_lbl', miss: 'action.miss_lbl', save: 'action.save_lbl',
  conceded: 'action.conceded_lbl', exclusion: 'action.exclusion_lbl', turnover: 'action.turnover_lbl',
}
const COLORS = { goal: '#16a34a', miss: '#ca8a04', save: '#2563eb', conceded: '#f43f5e', exclusion: '#dc2626', turnover: '#f97316' }

export default function ActionModal({ type, players, minute, onConfirm, onClose, lang = 'es' }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [showDetails, setShowDetails] = useState(true)
  const [zone, setZone]         = useState(null)
  const [shotType, setShotType] = useState(null)
  const [missReason, setMissReason] = useState(null)

  const sorted = [...players].sort((a, b) => Number(a.number) - Number(b.number))
  const color  = COLORS[type]

  function confirm(extra = {}) {
    onConfirm({ playerId: selectedPlayer, zone, shotType, missReason, ...extra })
  }

  if (type === 'goal' || type === 'save' || type === 'miss' || type === 'conceded') {
    const isGoal      = type === 'goal'
    const isMiss      = type === 'miss'
    const isSave      = type === 'save'
    const isConceded  = type === 'conceded'
    const isGoalkeeper = isSave || isConceded
    const relevantPlayers = isGoalkeeper ? sorted.filter(p => p.role === 'goalkeeper') : sorted.filter(p => p.role !== 'goalkeeper')
    const allPlayers = relevantPlayers.length > 0 ? relevantPlayers : sorted

    const playerQuestion = isGoalkeeper ? t('modal.who_gk', lang) : t('modal.who_shot', lang)
    const confirmLabel   = isGoal ? t('modal.confirm_goal', lang) : isMiss ? t('modal.confirm_miss', lang) : isSave ? t('modal.confirm_save', lang) : t('modal.confirm_conc', lang)
    const zoneLabel      = isGoalkeeper ? t('modal.zone_gk', lang) : isMiss ? t('modal.zone_miss', lang) : t('modal.zone_goal', lang)

    const shotTypeLabels = SHOT_TYPES.map(s => tv('shot', s, lang))
    const missReasonLabels = MISS_REASONS.map(r => tv('miss', r, lang))

    return (
      <Modal onClose={onClose}>
        <ModalHeader type={type} minute={minute} color={color} onClose={onClose} lang={lang} />
        {!selectedPlayer ? (
          <div style={{ padding: '0 16px 16px' }}>
            <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 12 }}>{playerQuestion}</p>
            {allPlayers.length === 0
              ? <button onClick={() => confirm()} style={btnStyle('#374151', 'white')}>{t('modal.no_player', lang)}</button>
              : <PlayerGrid players={allPlayers} onSelect={setSelectedPlayer} color={color} />}
          </div>
        ) : (
          <div style={{ padding: '0 16px 16px' }}>
            <SelectedBadge player={players.find(p => p.id === selectedPlayer)} onClear={() => setSelectedPlayer(null)} color={color} lang={lang} />
            <button onClick={() => confirm()} style={{ ...btnStyle(color, 'white'), marginBottom: 8 }}>✓ {confirmLabel}</button>
            <button onClick={() => setShowDetails(d => !d)}
              style={{ width: '100%', background: 'none', border: 'none', color: '#9ca3af', fontSize: 14, padding: '8px 0', cursor: 'pointer' }}>
              {showDetails ? '▲' : '▼'} {t('modal.details', lang)}
            </button>
            {showDetails && (
              <div style={{ marginTop: 12 }}>
                <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 8 }}>{zoneLabel}</p>
                <GoalGrid zones={GOAL_ZONES} selected={zone} onSelect={z => setZone(z === zone ? null : z)} color={color} lang={lang} />
                <p style={{ color: '#9ca3af', fontSize: 13, margin: '12px 0 8px' }}>{t('modal.shot_type', lang)}</p>
                <OptionGrid options={SHOT_TYPES} labels={shotTypeLabels} selected={shotType} onSelect={s => setShotType(s === shotType ? null : s)} color={color} />
                {isMiss && (
                  <>
                    <p style={{ color: '#9ca3af', fontSize: 13, margin: '12px 0 8px' }}>{t('modal.miss_reason', lang)}</p>
                    <OptionGrid options={MISS_REASONS} labels={missReasonLabels} selected={missReason} onSelect={r => setMissReason(r === missReason ? null : r)} color={color} />
                  </>
                )}
                <button onClick={() => confirm()} style={{ ...btnStyle(color, 'white'), marginTop: 12 }}>{t('modal.confirm_detail', lang)}</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    )
  }

  if (type === 'exclusion') {
    const exclTypeLabels = EXCLUSION_TYPES.map(e => tv('excl', e, lang))
    return (
      <Modal onClose={onClose}>
        <ModalHeader type={type} minute={minute} color={color} onClose={onClose} lang={lang} />
        <div style={{ padding: '0 16px 16px' }}>
          {!selectedPlayer ? (
            <>
              <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 12 }}>{t('modal.who_excl', lang)}</p>
              <PlayerGrid players={sorted} onSelect={setSelectedPlayer} color={color} />
            </>
          ) : (
            <>
              <SelectedBadge player={players.find(p => p.id === selectedPlayer)} onClear={() => setSelectedPlayer(null)} color={color} lang={lang} />
              <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 8 }}>{t('modal.excl_type', lang)}</p>
              <OptionGrid options={EXCLUSION_TYPES} labels={exclTypeLabels} selected={shotType} onSelect={s => setShotType(s === shotType ? null : s)} color={color} />
              <button onClick={() => onConfirm({ playerId: selectedPlayer, excType: shotType })} style={{ ...btnStyle(color, 'white'), marginTop: 12 }}>✓ {t('modal.confirm_excl', lang)}</button>
            </>
          )}
        </div>
      </Modal>
    )
  }

  // turnover
  const turnTypeLabels = TURNOVER_TYPES.map(t2 => tv('turn', t2, lang))
  return (
    <Modal onClose={onClose}>
      <ModalHeader type={type} minute={minute} color={color} onClose={onClose} lang={lang} />
      <div style={{ padding: '0 16px 16px' }}>
        {!selectedPlayer ? (
          <>
            <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 12 }}>{t('modal.who_turn', lang)}</p>
            <PlayerGrid players={sorted} onSelect={setSelectedPlayer} color={color} />
          </>
        ) : (
          <>
            <SelectedBadge player={players.find(p => p.id === selectedPlayer)} onClear={() => setSelectedPlayer(null)} color={color} lang={lang} />
            <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 8 }}>{t('modal.turn_type', lang)}</p>
            <OptionGrid options={TURNOVER_TYPES} labels={turnTypeLabels} selected={shotType} onSelect={s => setShotType(s === shotType ? null : s)} color={color} />
            <button onClick={() => onConfirm({ playerId: selectedPlayer, turnType: shotType })} style={{ ...btnStyle(color, 'white'), marginTop: 12 }}>✓ {t('modal.confirm_turn', lang)}</button>
          </>
        )}
      </div>
    </Modal>
  )
}

function Modal({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: '#111827', borderRadius: '20px 20px 0 0', maxHeight: '90vh', overflowY: 'auto', paddingBottom: 32 }}>
        {children}
      </div>
    </div>
  )
}

function ModalHeader({ type, minute, color, onClose, lang }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 12px', position: 'sticky', top: 0, background: '#111827', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ background: color, color: 'white', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 999 }}>
          {t(TYPE_KEYS[type], lang)}
        </span>
        <span style={{ color: '#9ca3af', fontSize: 13 }}>{t('min', lang)} {minute}</span>
      </div>
      <button onClick={onClose} style={{ color: '#6b7280', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', padding: '0 4px' }}>✕</button>
    </div>
  )
}

function PlayerGrid({ players, onSelect, color }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
      {players.map(p => (
        <button key={p.id} onClick={() => onSelect(p.id)}
          style={{ background: color, border: 'none', borderRadius: 12, padding: '12px 4px', textAlign: 'center', cursor: 'pointer' }}>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>#{p.number}</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name.split(' ')[0]}</div>
        </button>
      ))}
    </div>
  )
}

function SelectedBadge({ player, onClear, color, lang }) {
  if (!player) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${color}22`, border: `1px solid ${color}66`, borderRadius: 12, padding: '10px 14px', marginBottom: 14 }}>
      <span style={{ color: 'white', fontWeight: 600 }}>#{player.number} {player.name}</span>
      <button onClick={onClear} style={{ color: '#9ca3af', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer' }}>{t('change', lang)}</button>
    </div>
  )
}

function GoalGrid({ zones, selected, onSelect, color, lang }) {
  const lbl = z => z.replace(' alto','↑').replace(' bajo','↓').replace('Izq.','I').replace('Der.','D').replace('Centro','C')
  const cellStyle = z => ({ background: selected === z ? color : '#374151', color: 'white', border: 'none', borderRadius: 8, padding: '10px 4px', fontSize: 12, fontWeight: 500, cursor: 'pointer', flex: 1 })
  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: 12, border: '1px solid #374151' }}>
      <div style={{ color: '#6b7280', fontSize: 11, textAlign: 'center', marginBottom: 8 }}>{t('modal.net', lang)}</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
        {zones.slice(0,3).map(z => <button key={z} onClick={() => onSelect(z)} style={cellStyle(z)}>{lbl(z)}</button>)}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {zones.slice(3,6).map(z => <button key={z} onClick={() => onSelect(z)} style={cellStyle(z)}>{lbl(z)}</button>)}
      </div>
    </div>
  )
}

function OptionGrid({ options, labels, selected, onSelect, color }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {options.map((o, i) => (
        <button key={o} onClick={() => onSelect(o)}
          style={{ background: selected === o ? color : '#374151', color: 'white', border: 'none', borderRadius: 10, padding: '12px 8px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          {labels[i] ?? o}
        </button>
      ))}
    </div>
  )
}

function btnStyle(bg, color) {
  return { width: '100%', background: bg, color, border: 'none', borderRadius: 12, padding: 16, fontSize: 17, fontWeight: 700, cursor: 'pointer', display: 'block' }
}
