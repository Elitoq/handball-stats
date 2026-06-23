import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import { syncOnLogin, loadData } from './data/store'
import Login from './pages/Login'
import Home from './pages/Home'
import MatchSetup from './pages/MatchSetup'
import MatchLive from './pages/MatchLive'
import MatchStats from './pages/MatchStats'
import Squad from './pages/Squad'
import SeasonDashboard from './pages/SeasonDashboard'
import Exercises from './pages/Exercises'
import BottomNav from './components/BottomNav'

export default function App() {
  const [user, setUser]               = useState(undefined)
  const [guest, setGuest]             = useState(false)
  const [syncing, setSyncing]         = useState(false)
  const [screen, setScreen]           = useState('home')
  const [section, setSection]         = useState('stats') // 'stats' | 'exercises'
  const [activeMatchId, setActiveMatchId] = useState(null)
  const [lang, setLang]               = useState(() => loadData().settings?.language ?? 'es')

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        setSyncing(true)
        await syncOnLogin(u.uid)
        setSyncing(false)
        setLang(loadData().settings?.language ?? 'es')
      }
      setUser(u ?? null)
    })
  }, [])

  async function handleLogout() {
    if (user) await signOut(auth)
    setGuest(false)
    setScreen('home')
    setSection('stats')
  }

  if (user === undefined || syncing) {
    return (
      <div style={{ background: '#030712', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #1e3a7a', borderTopColor: '#7eb3ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!user && !guest) return <Login onGuest={() => setGuest(true)} />

  // Bottom nav visible on home + exercises; hidden during sub-screens (live match, squad, etc.)
  const showNav = screen === 'home' || section === 'exercises'

  function handleSection(s) {
    setSection(s)
    if (s === 'stats') setScreen('home')
  }

  let content
  if (section === 'exercises') {
    content = <Exercises lang={lang} />
  } else if (screen === 'setup') {
    content = (
      <MatchSetup
        onBack={() => setScreen('home')}
        onStart={id => { setActiveMatchId(id); setScreen('live') }}
      />
    )
  } else if (screen === 'live') {
    content = (
      <MatchLive
        matchId={activeMatchId}
        onBack={() => setScreen('home')}
        onStats={() => setScreen('stats')}
      />
    )
  } else if (screen === 'stats') {
    content = (
      <MatchStats
        matchId={activeMatchId}
        onBack={() => setScreen('home')}
      />
    )
  } else if (screen === 'squad') {
    content = <Squad onBack={() => setScreen('home')} />
  } else if (screen === 'season') {
    content = (
      <SeasonDashboard
        onBack={() => setScreen('home')}
        onOpenMatch={id => { setActiveMatchId(id); setScreen('live') }}
      />
    )
  } else {
    content = (
      <Home
        onNewMatch={() => setScreen('setup')}
        onOpenMatch={id => { setActiveMatchId(id); setScreen('live') }}
        onOpenStats={id => { setActiveMatchId(id); setScreen('stats') }}
        onSquad={() => setScreen('squad')}
        onSeason={() => setScreen('season')}
        onLangChange={setLang}
        onLogout={handleLogout}
        user={user}
        guest={guest}
      />
    )
  }

  return (
    <div style={{ background: '#030712', minHeight: '100dvh' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {content}
      </div>
      {showNav && (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <BottomNav section={section} onSection={handleSection} lang={lang} />
        </div>
      )}
    </div>
  )
}
