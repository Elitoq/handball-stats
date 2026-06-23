# Handball Stats

A mobile-first PWA for tracking handball match statistics in real time — built by a player, for players and coaches.

**Live demo →** [handball-stats-sand.vercel.app](https://handball-stats-sand.vercel.app/)

<!-- TODO: replace with a GIF of the live-tracking screen in action.
     A short screen recording (10–15 s) of registering a few actions
     during a match is the single highest-impact thing you can add here. -->

---

## Why this exists

Tracking handball stats during a live match is harder than it sounds. Existing tools are either generic sports apps that don't understand the flow of handball, or spreadsheets that are impossible to fill in fast enough while a game is happening.

I play handball, so I built the tool I actually wanted on the bench: something you can tap through in real time without missing the next play, that turns raw events into per-player and per-season insight afterwards — and exports a clean PDF report when you're done.

---

## Features

- **Live match tracking** — six one-tap actions (goal, miss, save, conceded, exclusion, turnover) with optional detail on shot zone and type, fast enough to keep up with the game.
- **Squad management** — players and goalkeepers with number and role; the roster auto-loads into every match.
- **Per-match statistics** — team summary with first/second-half filter, goal zone maps, player of the match, and individual player breakdowns.
- **Season dashboard** — aggregated stats across all matches, scorer and goalkeeper rankings, and goal charts.
- **Performance rating** — a transparent rating model that scores each player's game (see [below](#performance-rating)).
- **PDF reports** — four report types: match, player-in-match, season, and player-in-season.
- **Works offline** — installable PWA, all data stored locally on the device.

---

## Tech stack

- React 19 + Vite
- Tailwind CSS v4
- `localStorage` for persistence (no backend)
- Deployed on Vercel

---

## Design decisions

The parts of this project I'm most proud of aren't features — they're the things I deliberately didn't build, and why:

- **No minutes/rotation tracking.** Handball substitutions are constant and unstructured; tracking them live would make the app unusable in the one moment it has to work. Cut on purpose.
- **No opponent stats.** Useful for a handful of analytical matches, noise for everyone else. The tool stays focused on your own team.
- **Rating split by role.** Field players and goalkeepers are scored on completely different models, because a flat formula would punish keepers for a stat that isn't theirs to control.
- **Speed over completeness in the live view.** Every interaction during a match is one tap to log, with details optional. Decisions that slow down logging were rejected even when they'd add data.

These come from actually playing the sport — the kind of judgment call you only make when you've been the person trying to log a save while the next attack is already happening.

---

## Performance rating

Each player gets a 1–10 rating per match from a transparent, role-aware model based on EHF Champions League and Bundesliga benchmarks.

**Field players** (base 6.0): goal contribution weighted by shot difficulty (a wing goal is worth more than a fast break, because the expected efficiency is lower); efficiency bonus/penalty compared to league average per shot type once at least 2 shots of that type are taken; −0.45 per turnover; −0.6 per exclusion; −0.4 per missed penalty.

**Goalkeepers** (base 5.0): saves above or below what was statistically expected given the shot type distribution faced (not a flat save percentage); +0.9 per penalty saved; +0.4 per fast break stopped; volume bonus for facing heavy workloads; −0.8 per exclusion. A minimum of 3 shots faced is required before a rating is assigned.

Ratings map to readable labels — *Excepcional* (≥9.0), *Sobresaliente* (≥8.0), *Muy buena* (≥7.0), *Buena actuación* (≥6.0), *Correcta* (≥5.0), *Por debajo* (≥4.0), *Mala actuación* (<4.0) — so a coach gets a verdict, not just a number.

---

## Run locally

```bash
git clone https://github.com/Elitoq/handball-stats.git
cd handball-stats
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Project structure

```
src/
├── App.jsx                    # Top-level router (home / setup / live / stats / squad / season)
├── data/store.js              # Data layer: localStorage I/O, stat calculations, rating model
├── components/ActionModal.jsx
├── pages/
│   ├── Home.jsx               # Match list and entry points
│   ├── Squad.jsx              # Roster management
│   ├── MatchSetup.jsx         # New-match configuration
│   ├── MatchLive.jsx          # Live tracking: scoreboard, timer, action buttons, timeline
│   ├── MatchStats.jsx         # Per-match statistics and player detail
│   └── SeasonDashboard.jsx    # Season aggregates, rankings, charts
└── reports/generateReport.js  # PDF report generation
```

---

## Roadmap

- [ ] Edit a logged event in place (currently delete-and-re-add)
- [ ] Multi-season support
- [ ] Optional cloud sync across devices

---

## About

Built as a portfolio project by Eliot, an Applied Data Science student — and handball player. The goal was a tool I'd genuinely use on match day, taken to a level I'd be happy to put my name on.
