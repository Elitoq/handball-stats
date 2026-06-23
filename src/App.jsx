import { useState } from 'react'
import Home from './pages/Home'
import MatchSetup from './pages/MatchSetup'
import MatchLive from './pages/MatchLive'
import MatchStats from './pages/MatchStats'
import Squad from './pages/Squad'
import SeasonDashboard from './pages/SeasonDashboard'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [activeMatchId, setActiveMatchId] = useState(null)

  let content
  if (screen === 'setup') {
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
      />
    )
  }

  return (
    <div style={{ background: '#030712', minHeight: '100dvh' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {content}
      </div>
    </div>
  )
}
