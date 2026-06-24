const CSS = `
  @keyframes ex-lr   { 0%,100%{transform:translateX(0)}  50%{transform:translateX(70px)} }
  @keyframes ex-rl   { 0%,100%{transform:translateX(0)}  50%{transform:translateX(-70px)} }
  @keyframes ex-ball-lr { 0%,100%{transform:translate(0,0)} 50%{transform:translate(70px,-8px)} }
  @keyframes ex-fly  { 0%,20%{transform:translate(0,0);opacity:1} 60%{transform:translate(-28px,-52px);opacity:.6} 80%,100%{transform:translate(0,0);opacity:0} }
  @keyframes ex-fly2 { 0%,20%{transform:translate(0,0);opacity:1} 60%{transform:translate(28px,-52px);opacity:.6} 80%,100%{transform:translate(0,0);opacity:0} }
  @keyframes ex-dive-l { 0%,50%{transform:translate(0,0)} 80%,100%{transform:translate(-28px,16px)} }
  @keyframes ex-dive-r { 0%,50%{transform:translate(0,0)} 80%,100%{transform:translate(28px,16px)} }
  @keyframes ex-cut  { 0%{transform:translate(0,0)} 40%{transform:translate(20px,-10px)} 70%{transform:translate(-5px,-40px)} 100%{transform:translate(-5px,-40px)} }
  @keyframes ex-def  { 0%{transform:translate(0,0)} 40%{transform:translate(15px,-5px)} 70%{transform:translate(0,-30px)} 100%{transform:translate(0,-30px)} }
  @keyframes ex-pass2{ 0%,100%{transform:translate(0,0)} 50%{transform:translate(-45px,-8px)} }
  @keyframes ex-run-d{ 0%{transform:translateY(0)} 100%{transform:translateY(-60px)} }
  @keyframes ex-shift{ 0%,100%{transform:translateX(-16px)} 50%{transform:translateX(16px)} }
  @keyframes ex-3v3a { 0%,100%{transform:translate(0,0)} 50%{transform:translate(0,-20px)} }
  @keyframes ex-3v3d { 0%,100%{transform:translate(0,0)} 50%{transform:translate(0,8px)} }
  @keyframes ex-wing { 0%,20%{transform:translate(0,0)} 50%{transform:translate(60px,10px)} 80%,100%{transform:translate(60px,10px)} }
  @keyframes ex-winb { 0%{transform:translate(0,0);opacity:1} 40%{transform:translate(60px,10px);opacity:1} 70%{transform:translate(50px,-45px);opacity:.6} 90%,100%{transform:translate(0,0);opacity:0} }
  @keyframes ex-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ex-spin2{ from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes ex-squat{ 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(14px) scaleY(.72)} }
  @keyframes ex-jump { 0%,100%{transform:translate(0,0)} 30%{transform:translate(22px,-28px)} 60%{transform:translate(44px,0)} }
  @keyframes ex-sprint{ 0%{transform:translateX(-70px);opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{transform:translateX(80px);opacity:0} }
  @keyframes ex-orbit { 0%{transform:rotate(0deg) translate(36px) rotate(0deg)} 100%{transform:rotate(360deg) translate(36px) rotate(-360deg)} }
  @keyframes ex-zig  { 0%{transform:translate(0,0)} 20%{transform:translate(18px,-18px)} 40%{transform:translate(36px,0)} 60%{transform:translate(54px,-18px)} 80%{transform:translate(72px,0)} 100%{transform:translate(0,0)} }
  @keyframes ex-plank{ 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(1.04)} }
  @keyframes ex-mball{ 0%,100%{transform:translate(0,0)} 50%{transform:translate(64px,-6px)} }
  @keyframes ex-str  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(25deg)} }
  @keyframes ex-fly3 { 0%{transform:translate(0,0);opacity:0} 10%{opacity:1} 30%,50%{transform:translate(0,0)} 70%{transform:translate(-22px,-50px);opacity:.5} 85%,100%{transform:translate(0,0);opacity:0} }
  @keyframes ex-fly4 { 0%,40%{transform:translate(0,0);opacity:0} 50%{opacity:1} 70%{transform:translate(22px,-50px);opacity:.5} 85%,100%{transform:translate(0,0);opacity:0} }
`

function Svg({ children, h = 150 }) {
  return (
    <svg viewBox={`0 0 280 ${h}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 10 }}>
      <style>{CSS}</style>
      {children}
    </svg>
  )
}

/* ── Court top-down template ── */
function Court({ children }) {
  return (
    <>
      <rect width="280" height="150" fill="#050c18" rx="10"/>
      <rect x="16" y="14" width="248" height="122" fill="#0d1829" rx="6" stroke="#1e2a3a" strokeWidth="1"/>
      {/* goal */}
      <rect x="100" y="16" width="80" height="13" fill="#0d2456" stroke="#3b82f6" strokeWidth="1.5" rx="2"/>
      {/* 6m arc */}
      <path d="M 88 31 Q 140 68 192 31" fill="none" stroke="#1a3060" strokeWidth="1.5"/>
      {/* 9m dashed */}
      <path d="M 54 62 Q 140 108 226 62" fill="none" stroke="#1f2f45" strokeWidth="1" strokeDasharray="5,4"/>
      {children}
    </>
  )
}

function P({ x, y, color = '#7eb3ff', s }) {
  return <circle cx={x} cy={y} r="6" fill={color} style={s}/>
}
function Ball({ x, y, s }) {
  return <circle cx={x} cy={y} r="4" fill="#22c55e" style={s}/>
}
function GK({ x, y, s }) {
  return <circle cx={x} cy={y} r="6" fill="#f59e0b" style={s}/>
}

/* ── Arrow helper ── */
function Arrow({ x1, y1, x2, y2, color = '#374151' }) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / len, uy = dy / len
  const ax = x2 - ux * 8, ay = y2 - uy * 8
  const nx = -uy, ny = ux
  return (
    <g stroke={color} strokeWidth="1.2" fill="none" opacity=".4">
      <line x1={x1} y1={y1} x2={x2} y2={y2}/>
      <polyline points={`${ax + nx * 4},${ay + ny * 4} ${x2},${y2} ${ax - nx * 4},${ay - ny * 4}`}/>
    </g>
  )
}

/* ══════════════════════════════════════════════════════════════
   COURT EXERCISES
══════════════════════════════════════════════════════════════ */

function AnimC01() { // Pases en movimiento
  return (
    <Svg>
      <Court>
        <Arrow x1={80} y1={90} x2={200} y2={90}/>
        <Arrow x1={200} y1={100} x2={80} y2={100}/>
        <g style={{ animation: 'ex-lr 2.2s ease-in-out infinite' }}>
          <Ball x={80} y={90} s={{ animation: 'ex-ball-lr 2.2s ease-in-out infinite' }}/>
        </g>
        <P x={70} y={90} s={{ animation: 'ex-lr 2.2s ease-in-out infinite' }}/>
        <P x={200} y={100} s={{ animation: 'ex-rl 2.2s ease-in-out infinite' }}/>
      </Court>
    </Svg>
  )
}

function AnimC02() { // Lanzamientos 9m
  return (
    <Svg>
      <Court>
        {/* highlight corners */}
        <rect x="100" y="16" width="20" height="13" fill="#22c55e" opacity=".3" rx="1"/>
        <rect x="160" y="16" width="20" height="13" fill="#22c55e" opacity=".3" rx="1"/>
        <Arrow x1={140} y1={95} x2={108} y2={24}/>
        <Arrow x1={140} y1={95} x2={172} y2={24}/>
        <P x={140} y={95}/>
        <Ball x={140} y={88} s={{ animation: 'ex-fly 2.6s ease-in-out infinite' }}/>
        <Ball x={140} y={88} s={{ animation: 'ex-fly2 2.6s ease-in-out 1.3s infinite' }}/>
      </Court>
    </Svg>
  )
}

function AnimC03() { // 1vs1
  return (
    <Svg>
      <Court>
        <Arrow x1={140} y1={105} x2={140} y2={36} color="#7eb3ff"/>
        <P x={140} y={60} color="#f87171"/>
        <g style={{ animation: 'ex-cut 2.8s ease-in-out infinite' }}>
          <P x={140} y={105}/>
        </g>
        <g style={{ animation: 'ex-def 2.8s ease-in-out .4s infinite' }}>
          <P x={140} y={60} color="#f87171"/>
        </g>
        <Ball x={130} y={102} s={{ animation: 'ex-cut 2.8s ease-in-out .1s infinite' }}/>
      </Court>
    </Svg>
  )
}

function AnimC04() { // 2v1 contraataque
  return (
    <Svg>
      <Court>
        <Arrow x1={100} y1={105} x2={100} y2={50} color="#7eb3ff"/>
        <Arrow x1={180} y1={105} x2={180} y2={50} color="#7eb3ff"/>
        <P x={100} y={105} s={{ animation: 'ex-run-d 2.4s ease-in-out infinite' }}/>
        <P x={180} y={105} s={{ animation: 'ex-run-d 2.4s ease-in-out .2s infinite' }}/>
        <P x={140} y={70} color="#f87171"/>
        <Ball x={100} y={98} s={{ animation: 'ex-pass2 2.4s ease-in-out .8s infinite' }}/>
      </Court>
    </Svg>
  )
}

function AnimC05() { // Goalkeeper
  return (
    <Svg>
      <Court>
        <GK x={140} y={28}/>
        <P x={140} y={95}/>
        <Ball x={140} y={90} s={{ animation: 'ex-fly 3s ease-in-out infinite' }}/>
        <Ball x={140} y={90} s={{ animation: 'ex-fly2 3s ease-in-out 1.5s infinite' }}/>
        <g style={{ animation: 'ex-dive-l 3s ease-in-out infinite' }}>
          <GK x={140} y={28}/>
        </g>
      </Court>
    </Svg>
  )
}

function AnimC06() { // Juego de extremos
  return (
    <Svg>
      <Court>
        <Arrow x1={140} y1={95} x2={90} y2={75} color="#7eb3ff"/>
        <Arrow x1={90} y1={75} x2={50} y2={50} color="#7eb3ff"/>
        <P x={140} y={95}/> {/* center */}
        <P x={90} y={75}/>  {/* pivot */}
        <P x={50} y={50}/>  {/* wing */}
        <Ball x={140} y={90} s={{ animation: 'ex-wing 3s ease-in-out infinite' }}/>
        <Ball x={200} y={90} s={{ animation: 'ex-fly2 3s ease-in-out 1.5s infinite' }}/>
        <P x={220} y={95}/>
        <Arrow x1={220} y1={95} x2={190} y2={50} color="#7eb3ff"/>
      </Court>
    </Svg>
  )
}

function AnimC07() { // 6-0 defensa
  return (
    <Svg>
      <Court>
        <Arrow x1={56} y1={50} x2={224} y2={50} color="#f87171" opacity=".2"/>
        {[56, 90, 112, 168, 190, 224].map((x, i) => (
          <P key={x} x={x} y={50} color="#f87171"
            s={{ animation: `ex-shift 1.8s ease-in-out ${i * 0.08}s infinite` }}/>
        ))}
        {/* attackers */}
        {[80, 120, 160].map(x => (
          <P key={x} x={x} y={95} color="#7eb3ff" opacity=".5"/>
        ))}
        <Ball x={120} y={90}/>
      </Court>
    </Svg>
  )
}

function AnimC08() { // 3v3
  return (
    <Svg>
      <Court>
        {[90, 140, 190].map((x, i) => (
          <P key={x} x={x} y={95} s={{ animation: `ex-3v3a 2s ease-in-out ${i * .2}s infinite` }}/>
        ))}
        {[100, 140, 180].map((x, i) => (
          <P key={x} x={x} y={62} color="#f87171" s={{ animation: `ex-3v3d 2s ease-in-out ${i * .15}s infinite` }}/>
        ))}
        <Ball x={140} y={90}/>
      </Court>
    </Svg>
  )
}

function AnimC09() { // Transición D→A
  return (
    <Svg>
      <Court>
        {/* players rushing upfield */}
        {[90, 140, 190].map((x, i) => (
          <P key={x} x={x} y={115}
            s={{ animation: `ex-run-d 2s ease-in-out ${i * .15}s infinite` }}/>
        ))}
        <Ball x={140} y={110} s={{ animation: 'ex-run-d 2s ease-in-out .1s infinite' }}/>
        {/* arrows */}
        <Arrow x1={90}  y1={120} x2={90}  y2={40} color="#7eb3ff"/>
        <Arrow x1={140} y1={120} x2={140} y2={40} color="#7eb3ff"/>
        <Arrow x1={190} y1={120} x2={190} y2={40} color="#7eb3ff"/>
      </Court>
    </Svg>
  )
}

function AnimC10() { // Penalties
  return (
    <Svg>
      <Court>
        <GK x={140} y={28}/>
        <P x={140} y={75}/>
        {/* alternating corner shots + GK dive */}
        <Ball x={140} y={70} s={{ animation: 'ex-fly3 4s ease-in-out infinite' }}/>
        <Ball x={140} y={70} s={{ animation: 'ex-fly4 4s ease-in-out 2s infinite' }}/>
        <g style={{ animation: 'ex-dive-l 4s ease-in-out infinite' }}>
          <GK x={140} y={28}/>
        </g>
        <g style={{ animation: 'ex-dive-r 4s ease-in-out 2s infinite' }}>
          <GK x={140} y={28}/>
        </g>
      </Court>
    </Svg>
  )
}

/* ══════════════════════════════════════════════════════════════
   PHYSICAL EXERCISES
══════════════════════════════════════════════════════════════ */

function PhysBg({ children }) {
  return (
    <>
      <rect width="280" height="150" fill="#050c18" rx="10"/>
      {children}
    </>
  )
}

function AnimP01() { // Movilidad articular
  const joints = [
    { cx: 140, cy: 38 },  // shoulder
    { cx: 140, cy: 70 },  // hip
    { cx: 115, cy: 100 }, // knee L
    { cx: 165, cy: 100 }, // knee R
  ]
  return (
    <Svg>
      <PhysBg>
        {joints.map(({ cx, cy }, i) => (
          <g key={i} style={{ transformOrigin: `${cx}px ${cy}px`, animation: `ex-spin ${1.8 + i * .3}s linear infinite` }}>
            <circle cx={cx} cy={cy} r={12 - i} fill="none" stroke="#7eb3ff" strokeWidth="1.5" strokeDasharray={`${6-i},${4}`}/>
          </g>
        ))}
        {/* body */}
        <circle cx={140} cy={30} r="8" fill="none" stroke="#7eb3ff" strokeWidth="1.5"/>
        <line x1={140} y1={38} x2={140} y2={75} stroke="#7eb3ff" strokeWidth="2"/>
        <line x1={140} y1={55} x2={115} y2={68} stroke="#7eb3ff" strokeWidth="2"/>
        <line x1={140} y1={55} x2={165} y2={68} stroke="#7eb3ff" strokeWidth="2"/>
        <line x1={140} y1={75} x2={115} y2={105} stroke="#7eb3ff" strokeWidth="2"/>
        <line x1={140} y1={75} x2={165} y2={105} stroke="#7eb3ff" strokeWidth="2"/>
        <line x1={115} y1={105} x2={110} y2={125} stroke="#7eb3ff" strokeWidth="2"/>
        <line x1={165} y1={105} x2={170} y2={125} stroke="#7eb3ff" strokeWidth="2"/>
      </PhysBg>
    </Svg>
  )
}

function AnimP02() { // Sprints
  return (
    <Svg>
      <PhysBg>
        {/* track lines */}
        <line x1="30" y1="100" x2="250" y2="100" stroke="#1e3a7a" strokeWidth="2"/>
        <line x1="30" y1="104" x2="250" y2="104" stroke="#1e3a7a" strokeWidth="1" strokeDasharray="4,4"/>
        {/* markers */}
        {[60, 130, 200].map((x, i) => (
          <g key={x}>
            <line x1={x} y1="96" x2={x} y2="108" stroke="#374151" strokeWidth="1"/>
            <text x={x} y="115" fill="#374151" fontSize="9" textAnchor="middle">{(i + 1) * 10}m</text>
          </g>
        ))}
        {/* sprinting dot + trail */}
        <g style={{ animation: 'ex-sprint 1.8s ease-in 0s infinite' }}>
          <circle cx={140} cy={96} r="7" fill="#7eb3ff"/>
          <ellipse cx={120} cy={96} rx="14" ry="3" fill="#7eb3ff" opacity=".25"/>
          <ellipse cx={100} cy={96} rx="8"  ry="2" fill="#7eb3ff" opacity=".12"/>
        </g>
      </PhysBg>
    </Svg>
  )
}

function AnimP03() { // Escalera
  return (
    <Svg>
      <PhysBg>
        {/* ladder */}
        {[40,60,80,100,120,140,160,180,200,220].map((x) => (
          <g key={x}>
            <rect x={x} y="65" width="18" height="26" fill="none" stroke="#374151" strokeWidth="1.5" rx="1"/>
          </g>
        ))}
        {/* stepping dot */}
        <g style={{ animation: 'ex-zig 3s linear infinite' }}>
          <circle cx={45} cy={72} r="7" fill="#7eb3ff"/>
        </g>
      </PhysBg>
    </Svg>
  )
}

function AnimP04() { // Sentadillas explosivas
  return (
    <Svg>
      <PhysBg>
        {/* floor */}
        <line x1="80" y1="125" x2="200" y2="125" stroke="#374151" strokeWidth="2"/>
        {/* figure */}
        <g style={{ transformOrigin: '140px 80px', animation: 'ex-squat 1.6s ease-in-out infinite' }}>
          <circle cx={140} cy={42} r="10" fill="none" stroke="#7eb3ff" strokeWidth="2"/>
          <line x1={140} y1={52} x2={140} y2={85} stroke="#7eb3ff" strokeWidth="2.5"/>
          <line x1={140} y1={62} x2={118} y2={74} stroke="#7eb3ff" strokeWidth="2"/>
          <line x1={140} y1={62} x2={162} y2={74} stroke="#7eb3ff" strokeWidth="2"/>
          <line x1={140} y1={85} x2={120} y2={115} stroke="#7eb3ff" strokeWidth="2.5"/>
          <line x1={140} y1={85} x2={160} y2={115} stroke="#7eb3ff" strokeWidth="2.5"/>
        </g>
        {/* jump arrow */}
        <line x1={140} y1={32} x2={140} y2={18} stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <text x={148} y={26} fill="#22c55e" fontSize="9">↑</text>
      </PhysBg>
    </Svg>
  )
}

function AnimP05() { // Core - plank
  return (
    <Svg>
      <PhysBg>
        {/* floor */}
        <line x1="60" y1="115" x2="220" y2="115" stroke="#374151" strokeWidth="2"/>
        {/* plank figure */}
        <g style={{ animation: 'ex-plank 2.2s ease-in-out infinite', transformOrigin: '140px 95px' }}>
          {/* body */}
          <line x1={85} y1={105} x2={185} y2={90} stroke="#7eb3ff" strokeWidth="4" strokeLinecap="round"/>
          {/* arms */}
          <line x1={90} y1={105} x2={80} y2={115} stroke="#7eb3ff" strokeWidth="2"/>
          {/* legs */}
          <line x1={185} y1={90} x2={195} y2={105} stroke="#7eb3ff" strokeWidth="2"/>
          <line x1={183} y1={91} x2={195} y2={110} stroke="#7eb3ff" strokeWidth="2"/>
          {/* head */}
          <circle cx={198} cy={84} r="8" fill="none" stroke="#7eb3ff" strokeWidth="2"/>
        </g>
        {/* seconds */}
        <text x={140} y={140} fill="#374151" fontSize="10" textAnchor="middle">45 s</text>
      </PhysBg>
    </Svg>
  )
}

function AnimP06() { // Balón medicinal
  return (
    <Svg>
      <PhysBg>
        {/* two figures */}
        {/* left */}
        <circle cx={75} cy={55} r="9" fill="none" stroke="#7eb3ff" strokeWidth="1.8"/>
        <line x1={75} y1={64} x2={75} y2={100} stroke="#7eb3ff" strokeWidth="2"/>
        <line x1={75} y1={75} x2={55} y2={88} stroke="#7eb3ff" strokeWidth="1.8"/>
        <line x1={75} y1={75} x2={95} y2={85} stroke="#7eb3ff" strokeWidth="1.8"/>
        <line x1={75} y1={100} x2={60} y2={120} stroke="#7eb3ff" strokeWidth="2"/>
        <line x1={75} y1={100} x2={90} y2={120} stroke="#7eb3ff" strokeWidth="2"/>
        {/* right */}
        <circle cx={205} cy={55} r="9" fill="none" stroke="#7eb3ff" strokeWidth="1.8"/>
        <line x1={205} y1={64} x2={205} y2={100} stroke="#7eb3ff" strokeWidth="2"/>
        <line x1={205} y1={75} x2={185} y2={85} stroke="#7eb3ff" strokeWidth="1.8"/>
        <line x1={205} y1={75} x2={225} y2={88} stroke="#7eb3ff" strokeWidth="1.8"/>
        <line x1={205} y1={100} x2={190} y2={120} stroke="#7eb3ff" strokeWidth="2"/>
        <line x1={205} y1={100} x2={220} y2={120} stroke="#7eb3ff" strokeWidth="2"/>
        {/* ball */}
        <circle cx={95} cy={80} r="10" fill="#f97316" opacity=".8"
          style={{ animation: 'ex-mball 2s ease-in-out infinite' }}/>
      </PhysBg>
    </Svg>
  )
}

function AnimP07() { // Pliometría de salto
  return (
    <Svg>
      <PhysBg>
        {/* floor */}
        <line x1="40" y1="118" x2="240" y2="118" stroke="#374151" strokeWidth="2"/>
        {/* boxes */}
        {[90, 150].map(x => (
          <rect key={x} x={x} y="98" width="30" height="20" fill="#1e3a7a" stroke="#3b82f6" strokeWidth="1.5" rx="2"/>
        ))}
        {/* jumping dot */}
        <g style={{ animation: 'ex-jump 1.8s ease-in-out infinite' }}>
          <circle cx={55} cy={112} r="8" fill="#7eb3ff"/>
          <line x1={55} y1={104} x2={55} y2={96} stroke="#22c55e" strokeWidth="1.5"/>
        </g>
      </PhysBg>
    </Svg>
  )
}

function AnimP08() { // Carrera continua
  return (
    <Svg>
      <PhysBg>
        {/* oval track */}
        <ellipse cx={140} cy={80} rx={95} ry={52} fill="none" stroke="#1e3a7a" strokeWidth="6" opacity=".5"/>
        <ellipse cx={140} cy={80} rx={95} ry={52} fill="none" stroke="#7eb3ff" strokeWidth="1.5" opacity=".3" strokeDasharray="8,6"/>
        {/* running dot on track */}
        <g style={{ transformOrigin: '140px 80px', animation: 'ex-spin 3s linear infinite' }}>
          <circle cx={235} cy={80} r="8" fill="#7eb3ff"/>
          <ellipse cx={218} cy={80} rx="13" ry="3" fill="#7eb3ff" opacity=".3"/>
        </g>
        <text x={140} y={85} fill="#374151" fontSize="11" textAnchor="middle" fontWeight="600">30 min</text>
      </PhysBg>
    </Svg>
  )
}

function AnimP09() { // Conos
  return (
    <Svg>
      <PhysBg>
        {/* cones */}
        {[50, 90, 130, 170, 210].map((x, i) => {
          const y = i % 2 === 0 ? 95 : 70
          return (
            <g key={x}>
              <polygon points={`${x},${y - 14} ${x - 8},${y} ${x + 8},${y}`} fill="#f59e0b" opacity=".8"/>
              <line x1={x - 10} y1={y} x2={x + 10} y2={y} stroke="#ca8a04" strokeWidth="1.5"/>
            </g>
          )
        })}
        {/* floor */}
        <line x1="30" y1="100" x2="250" y2="100" stroke="#1f2937" strokeWidth="1" strokeDasharray="4,4"/>
        {/* moving dot */}
        <g style={{ animation: 'ex-zig 2.8s linear infinite' }}>
          <circle cx={40} cy={98} r="7" fill="#7eb3ff"/>
        </g>
      </PhysBg>
    </Svg>
  )
}

function AnimP10() { // Estiramientos
  return (
    <Svg>
      <PhysBg>
        {/* floor */}
        <line x1="60" y1="120" x2="220" y2="120" stroke="#374151" strokeWidth="2"/>
        {/* figure sitting stretch */}
        <g style={{ transformOrigin: '140px 90px' }}>
          {/* torso */}
          <g style={{ animation: 'ex-str 3s ease-in-out infinite', transformOrigin: '140px 108px' }}>
            <circle cx={140} cy={65} r="10" fill="none" stroke="#7eb3ff" strokeWidth="1.8"/>
            <line x1={140} y1={75} x2={140} y2={108} stroke="#7eb3ff" strokeWidth="2.5"/>
            <line x1={140} y1={85} x2={115} y2={97} stroke="#7eb3ff" strokeWidth="2"/>
            <line x1={140} y1={85} x2={165} y2={97} stroke="#7eb3ff" strokeWidth="2"/>
          </g>
          {/* legs */}
          <line x1={140} y1={108} x2={100} y2={120} stroke="#7eb3ff" strokeWidth="2.5"/>
          <line x1={140} y1={108} x2={180} y2={120} stroke="#7eb3ff" strokeWidth="2.5"/>
        </g>
        <text x={140} y={140} fill="#374151" fontSize="10" textAnchor="middle">30 s / grupo</text>
      </PhysBg>
    </Svg>
  )
}

/* ── Map ── */
const ANIM_MAP = {
  c01: AnimC01, c02: AnimC02, c03: AnimC03, c04: AnimC04, c05: AnimC05,
  c06: AnimC06, c07: AnimC07, c08: AnimC08, c09: AnimC09, c10: AnimC10,
  p01: AnimP01, p02: AnimP02, p03: AnimP03, p04: AnimP04, p05: AnimP05,
  p06: AnimP06, p07: AnimP07, p08: AnimP08, p09: AnimP09, p10: AnimP10,
}

export default function ExerciseAnimation({ id }) {
  const Comp = ANIM_MAP[id]
  if (!Comp) return null
  return (
    <div style={{ margin: '14px 0 10px', borderRadius: 10, overflow: 'hidden', border: '1px solid #1f2937' }}>
      <Comp />
    </div>
  )
}
