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

  if (screen === 'setup') {
    return (
      <MatchSetup
        onBack={() => setScreen('home')}
        onStart={id => { setActiveMatchId(id); setScreen('live') }}
      />
    )
  }

  if (screen === 'live') {
    return (
      <MatchLive
        matchId={activeMatchId}
        onBack={() => setScreen('home')}
        onStats={() => setScreen('stats')}
      />
    )
  }

  if (screen === 'stats') {
    return (
      <MatchStats
        matchId={activeMatchId}
        onBack={() => setScreen('home')}
      />
    )
  }

  if (screen === 'squad') {
    return <Squad onBack={() => setScreen('home')} />
  }

  if (screen === 'season') {
    return (
      <SeasonDashboard
        onBack={() => setScreen('home')}
        onOpenMatch={id => { setActiveMatchId(id); setScreen('live') }}
      />
    )
  }

  return (
    <Home
      onNewMatch={() => setScreen('setup')}
      onOpenMatch={id => { setActiveMatchId(id); setScreen('live') }}
      onOpenStats={id => { setActiveMatchId(id); setScreen('stats') }}
      onSquad={() => setScreen('squad')}
      onSeason={() => setScreen('season')}
    />
  )
}
