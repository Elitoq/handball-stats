import { useState } from 'react'
import { User, Shield, Users, ChevronLeft, ChevronRight, Target, ArrowRightLeft, UserMinus } from 'lucide-react'
import { loadData, saveData, createPlayer } from '../data/store'
import { t } from '../i18n'
import PlayerSeasonView from './PlayerSeasonView'

const s = { bg: '#030712', card: '#0d1117', border: '#1f2937', muted: '#6b7280', text: 'white', accent: '#7eb3ff' }

export default function Squad({ onBack, lang = 'es' }) {
  const [data, setData]       = useState(loadData)
  const [viewPlayer, setViewPlayer] = useState(null) // player object for season view
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newRole, setNewRole] = useState('player')
  const [editId, setEditId]   = useState(null)
  const [editName, setEditName]     = useState('')
  const [editNumber, setEditNumber] = useState('')
  const [editRole, setEditRole]     = useState('player')

  const squad = [...(data.squad ?? [])].sort((a, b) => Number(a.number) - Number(b.number))
  const ROLE_OPTIONS = [
    { value: 'player',     label: t('squad.role_player', lang), Icon: User   },
    { value: 'goalkeeper', label: t('squad.role_gk', lang),     Icon: Shield },
  ]

  if (viewPlayer) {
    // Build playerMap from match history (same as SeasonDashboard) so IDs match events
    const allMatches = loadData().matches ?? []
    const playerMap = {}
    allMatches.forEach(m => {
      (m.players ?? []).forEach(p => {
        if (!playerMap[p.id]) playerMap[p.id] = { ...p }
      })
    })
    // Find the match-history player that matches by name+number
    const matchPlayer = Object.values(playerMap).find(
      p => p.name === viewPlayer.name && p.number === viewPlayer.number
    ) ?? viewPlayer
    return <PlayerSeasonView player={matchPlayer} allMatches={allMatches} lang={lang} onBack={() => setViewPlayer(null)} />
  }

  function addPlayer() {
    if (!newName.trim() || !newNumber.trim()) return
    const updated = { ...data, squad: [...(data.squad ?? []), createPlayer(newName.trim(), newNumber.trim(), newRole)] }
    setData(updated); saveData(updated)
    setNewName(''); setNewNumber(''); setNewRole('player')
  }

  function removePlayer(id) {
    const updated = { ...data, squad: data.squad.filter(p => p.id !== id) }
    setData(updated); saveData(updated)
  }

  function startEdit(p) {
    setEditId(p.id); setEditName(p.name); setEditNumber(p.number); setEditRole(p.role ?? 'player')
  }

  function saveEdit() {
    const updated = { ...data, squad: data.squad.map(p => p.id === editId ? { ...p, name: editName.trim(), number: editNumber.trim(), role: editRole } : p) }
    setData(updated); saveData(updated); setEditId(null)
  }

  return (
    <div style={{ minHeight: '100dvh', background: s.bg, color: s.text, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '48px 16px 16px' }}>
        <button onClick={onBack} style={{ color: s.muted, background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', marginBottom: 16, display: 'block' }}>← {t('back', lang)}</button>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{t('squad.title', lang)}</h1>
        <p style={{ margin: '4px 0 0', color: s.muted, fontSize: 14 }}>{t('squad.desc', lang)}</p>
      </div>

      <form onSubmit={e => { e.preventDefault(); addPlayer() }} style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {ROLE_OPTIONS.map(r => (
            <button key={r.value} type="button" onClick={() => setNewRole(r.value)}
              style={{ flex: 1, background: newRole === r.value ? '#0d2456' : '#111827', color: newRole === r.value ? '#7eb3ff' : s.muted,
                border: `1px solid ${newRole === r.value ? '#1e3a7a' : s.border}`, borderRadius: 10, padding: '10px 8px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <r.Icon size={14}/>{r.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input style={{ width: 64, background: '#111827', border: `1px solid ${s.border}`, color: s.text, borderRadius: 12, padding: '12px 8px', textAlign: 'center', fontSize: 18, fontWeight: 700, outline: 'none' }}
            placeholder="#" inputMode="numeric" value={newNumber} onChange={e => setNewNumber(e.target.value)} />
          <input style={{ flex: 1, background: '#111827', border: `1px solid ${s.border}`, color: s.text, borderRadius: 12, padding: '12px 16px', fontSize: 16, outline: 'none' }}
            placeholder={t('squad.name_ph', lang)} value={newName} onChange={e => setNewName(e.target.value)} />
        </div>
        <button type="submit"
          style={{ width: '100%', background: '#1a56db', color: 'white', border: 'none', borderRadius: 12, padding: 16, fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
          {newRole === 'goalkeeper' ? t('squad.add_gk', lang) : t('squad.add_player', lang)}
        </button>
      </form>

      <div style={{ padding: '0 16px 8px' }}>
        {squad.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Users size={40} color="#374151" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#4b5563', fontSize: 14 }}>{t('squad.empty', lang)}</p>
          </div>
        ) : (
          <>
            <p style={{ color: s.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{squad.length} {t('squad.members', lang)}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {squad.map(p => (
                <div key={p.id}>
                  {editId === p.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#111827', borderRadius: 12, padding: 12, border: `1px solid ${s.border}` }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {ROLE_OPTIONS.map(r => (
                          <button key={r.value} type="button" onClick={() => setEditRole(r.value)}
                            style={{ flex: 1, background: editRole === r.value ? '#0d2456' : '#1f2937', color: editRole === r.value ? '#7eb3ff' : s.muted,
                              border: `1px solid ${editRole === r.value ? '#1e3a7a' : 'transparent'}`, borderRadius: 8, padding: '8px', fontSize: 13, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                            <r.Icon size={13}/>{r.label}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input style={{ width: 56, background: '#1f2937', color: 'white', border: 'none', borderRadius: 8, padding: '8px 4px', textAlign: 'center', fontWeight: 700, outline: 'none', fontSize: 16 }}
                          value={editNumber} onChange={e => setEditNumber(e.target.value)} />
                        <input style={{ flex: 1, background: '#1f2937', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', outline: 'none', fontSize: 16 }}
                          value={editName} onChange={e => setEditName(e.target.value)} />
                        <button onClick={saveEdit} style={{ color: '#4ade80', background: 'none', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '0 8px' }}>OK</button>
                        <button onClick={() => setEditId(null)} style={{ color: s.muted, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: '#0d1117', border: `1px solid ${s.border}`, borderRadius: 14, overflow: 'hidden' }}>
                      <button onClick={() => setViewPlayer(p)}
                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                        <span style={{ color: s.accent, fontWeight: 700, fontSize: 16, width: 36, flexShrink: 0 }}>#{p.number}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, color: 'white', fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: s.muted, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            {p.role === 'goalkeeper'
                              ? <><Shield size={11}/> {t('squad.role_gk', lang)}</>
                              : <><User size={11}/> {t('squad.role_player', lang)}</>}
                          </div>
                        </div>
                        <ChevronRight size={16} color="#374151" />
                      </button>
                      <div style={{ display: 'flex', borderTop: `1px solid ${s.border}` }}>
                        <button onClick={() => startEdit(p)}
                          style={{ flex: 1, background: 'none', border: 'none', color: s.muted, padding: '9px 0', fontSize: 13, cursor: 'pointer', borderRight: `1px solid ${s.border}` }}>
                          {t('edit', lang)}
                        </button>
                        <button onClick={() => removePlayer(p.id)}
                          style={{ flex: 1, background: 'none', border: 'none', color: '#ef4444', padding: '9px 0', fontSize: 13, cursor: 'pointer' }}>
                          {t('delete', lang) || (lang === 'en' ? 'Delete' : 'Eliminar')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ textAlign: 'center', padding: '20px 0 24px', color: '#374151', fontSize: 12 }}>
        Crafted by <span style={{ color: '#4b5563', fontWeight: 600 }}>Eliot</span>
      </div>
    </div>
  )
}

