# Handball Stats

A real-time handball match tracking PWA built for coaches and analysts. Record events live during a match, review detailed statistics per player and team, and export professional PDF reports.

## Features

### Live Match Tracking
- Real-time scoreboard with manual control of team and rival score
- Timer with play/pause and manual minute adjustment
- First/second half toggle (switchable in both directions)
- One-tap event logging: Goal, Miss, Save, Conceded, Exclusion, Turnover
- Per-event detail capture: zone, shot type, miss reason, exclusion type, turnover type
- Undo last event to correct mistakes mid-match
- Recent event log with individual delete
- Match notes

### Post-Match Analysis
- Team summary: goals, misses, efficiency %, saves, save %
- Goal and save heatmap visualised on an actual goal frame (6 zones: top/bottom × left/centre/right)
- MVP highlight with automatic player rating (1–10)
- Rating algorithm based on EHF Champions League expected performance baselines
- Full player breakdown: shooting efficiency by zone and shot type for field players; save % by zone and received shot type for goalkeepers
- Period-by-period filter (All / 1st / 2nd half)
- Match timeline and notes

### Season Dashboard
- Aggregated team stats across all recorded matches
- Win/Draw/Loss record
- Goals trend chart per match
- Top scorers ranking (goals + efficiency %)
- Top goalkeeper ranking (save %)
- Full match history table

### Squad Management
- Add, edit and delete players
- Role: field player or goalkeeper
- Player number and name

### PDF Export
- Full match report: summary, heatmaps, player table, MVP, timeline
- Individual player match report: zone efficiency map, shot type breakdown
- Season report: rankings, trend data, full match history
- Individual player season report

### Additional
- Google authentication + Firestore cloud sync
- Guest mode (local storage only)
- ES / EN language support
- Player ratings toggle (useful for youth teams)
- PWA — installable on iOS and Android

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 + inline styles |
| Auth & DB | Firebase Authentication + Firestore |
| Icons | Lucide React |
| Deployment | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

### Firebase Setup

Create a project at [firebase.google.com](https://firebase.google.com), enable Google Auth and Firestore, then add your config to `src/firebase.js`:

```js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const app = initializeApp({
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  // ...
})

export const auth = getAuth(app)
export const db = getFirestore(app)
```

## Project Structure

```
src/
├── components/
│   └── ActionModal.jsx       # Event detail capture modal
├── data/
│   └── store.js              # Data layer, stat calculations, player rating algorithm
├── pages/
│   ├── Home.jsx              # Match list and navigation
│   ├── Login.jsx             # Google auth / guest entry
│   ├── MatchLive.jsx         # Live match tracking
│   ├── MatchSetup.jsx        # Match configuration and roster selection
│   ├── MatchStats.jsx        # Post-match statistics and player detail
│   ├── SeasonDashboard.jsx   # Season-wide aggregated stats
│   └── Squad.jsx             # Player roster management
├── reports/
│   └── generateReport.js     # PDF report generation
├── i18n.js                   # ES / EN translations
├── firebase.js               # Firebase configuration
└── App.jsx                   # Routing and auth state
```

## Player Rating Algorithm

Ratings (1–10) are computed using EHF Champions League expected performance data, split by role:

**Field players** — weighted by shot difficulty (wing and 9m shots harder than fast breaks and 7m penalties), penalised for turnovers and exclusions, rewarded for efficiency above expected averages per shot type.

**Goalkeepers** — compared against expected save % per shot type received, with bonuses for penalty saves and fast-break saves, and a workload volume bonus.

## License

MIT
