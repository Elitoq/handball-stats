import { useRef, useEffect } from 'react'

// ── Layout constants (10px = 1m) ────────────────────────────
// Court: x=40..240 (200px=20m), half: y=40..240, full: y=40..440
const C = {
  L: 40, R: 240, MX: 140,       // court left/right/center x
  GL: 125, GR: 155,              // goal posts x
  R6: 60, R9: 90, RC: 30,       // radii
  GT: 40,  // goal line top (half & full)
  CT: 240, // center line / half-court bottom
  GB: 440, // goal line bottom (full only)
}
const π = Math.PI

// ── Drawing primitives ───────────────────────────────────────

function arrow(ctx, x1, y1, x2, y2, color = '#60a5fa', w = 2, dashed = false) {
  const hl = 8
  const a = Math.atan2(y2 - y1, x2 - x1)
  ctx.save()
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w
  ctx.setLineDash(dashed ? [6, 4] : [])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2 - (hl - 1) * Math.cos(a), y2 - (hl - 1) * Math.sin(a))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - hl * Math.cos(a - 0.42), y2 - hl * Math.sin(a - 0.42))
  ctx.lineTo(x2 - hl * Math.cos(a + 0.42), y2 - hl * Math.sin(a + 0.42))
  ctx.closePath(); ctx.fill()
  ctx.restore()
}

function player(ctx, x, y, lbl, bg = '#1d4ed8', bd = '#60a5fa') {
  ctx.save()
  ctx.fillStyle = bg; ctx.strokeStyle = bd; ctx.lineWidth = 2
  ctx.beginPath(); ctx.arc(x, y, 11, 0, 2 * π); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${lbl.length > 2 ? '7' : '9'}px system-ui`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(lbl, x, y)
  ctx.restore()
}

const gk  = (ctx, x, y)       => player(ctx, x, y, 'GK', '#1f2937', '#6b7280')
const def = (ctx, x, y, l='D') => player(ctx, x, y, l,   '#7f1d1d', '#f87171')

function ball(ctx, x, y) {
  ctx.save()
  ctx.fillStyle = '#f97316'; ctx.strokeStyle = '#fed7aa'; ctx.lineWidth = 1.2
  ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * π); ctx.fill(); ctx.stroke()
  ctx.restore()
}

// ── Court base ───────────────────────────────────────────────

function court(ctx, W, H, full = false) {
  const { L, R, MX, GL, GR, R6, R9, RC, GT, CT, GB } = C
  const bot = full ? GB : CT
  const BL = '#3b82f6'

  ctx.fillStyle = '#050c18'; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#0b1e35'; ctx.fillRect(L, GT, R - L, bot - GT)

  ctx.save()
  ctx.beginPath(); ctx.rect(L, GT, R - L, bot - GT); ctx.clip()
  ctx.strokeStyle = BL

  // center line
  ctx.lineWidth = 1.5; ctx.setLineDash([])
  ctx.beginPath(); ctx.moveTo(L, CT); ctx.lineTo(R, CT); ctx.stroke()
  if (full) { ctx.beginPath(); ctx.arc(MX, CT, RC, 0, 2*π); ctx.stroke() }

  // TOP 6m solid
  ctx.lineWidth = 2; ctx.setLineDash([])
  ctx.beginPath()
  ctx.arc(GL, GT, R6, π, π/2, true); ctx.lineTo(GR, GT+R6)
  ctx.arc(GR, GT, R6, π/2, 0, true); ctx.stroke()

  // TOP 9m dashed
  ctx.lineWidth = 1.5; ctx.setLineDash([8, 5])
  ctx.beginPath()
  ctx.arc(GL, GT, R9, π, π/2, true); ctx.lineTo(GR, GT+R9)
  ctx.arc(GR, GT, R9, π/2, 0, true); ctx.stroke()

  if (full) {
    // BOTTOM 6m solid
    ctx.lineWidth = 2; ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(GL, GB, R6, π, 3*π/2, false); ctx.lineTo(GR, GB-R6)
    ctx.arc(GR, GB, R6, 3*π/2, 0, false); ctx.stroke()

    // BOTTOM 9m dashed
    ctx.lineWidth = 1.5; ctx.setLineDash([8, 5])
    ctx.beginPath()
    ctx.arc(GL, GB, R9, π, 3*π/2, false); ctx.lineTo(GR, GB-R9)
    ctx.arc(GR, GB, R9, 3*π/2, 0, false); ctx.stroke()
  }

  ctx.restore()
  ctx.setLineDash([])

  // border with goal gap
  ctx.strokeStyle = BL; ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(L, GT); ctx.lineTo(GL, GT)
  ctx.moveTo(GR, GT); ctx.lineTo(R, GT)
  ctx.moveTo(L, GT); ctx.lineTo(L, bot)
  ctx.moveTo(R, GT); ctx.lineTo(R, bot)
  if (full) {
    ctx.moveTo(L, GB); ctx.lineTo(GL, GB)
    ctx.moveTo(GR, GB); ctx.lineTo(R, GB)
  }
  ctx.stroke()

  // goals
  ctx.strokeStyle = '#6b8aaa'; ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(GL, GT); ctx.lineTo(GL, GT-12)
  ctx.lineTo(GR, GT-12); ctx.lineTo(GR, GT); ctx.stroke()
  if (full) {
    ctx.beginPath()
    ctx.moveTo(GL, GB); ctx.lineTo(GL, GB+12)
    ctx.lineTo(GR, GB+12); ctx.lineTo(GR, GB); ctx.stroke()
  }
}

// ── Per-exercise draw functions ──────────────────────────────

const DRAWS = {

  // c01 – Pases en movimiento
  c01(ctx) {
    court(ctx, 280, 270)
    const { MX, CT, GT } = C
    const y1 = GT + 55, y2 = CT - 30
    player(ctx, MX-55, y1, 'A1'); player(ctx, MX+55, y2, 'A2')
    ball(ctx, MX, (y1+y2)/2)
    arrow(ctx, MX-43, y1, MX+43, y2, '#facc15', 2, true)
    arrow(ctx, MX+43, y2-4, MX-43, y1+4, '#60a5fa', 2, true)
  },

  // c02 – Triángulo de pases
  c02(ctx) {
    court(ctx, 280, 270)
    const { MX, GT } = C
    const cy = GT + 110
    const pts = [[MX, cy-60], [MX-55, cy+40], [MX+55, cy+40]]
    pts.forEach(([x,y], i) => player(ctx, x, y, `A${i+1}`))
    ball(ctx, pts[0][0]+12, pts[0][1]+10)
    arrow(ctx, pts[0][0]+5, pts[0][1]+8, pts[1][0]+10, pts[1][1]-8, '#facc15', 2, true)
    arrow(ctx, pts[1][0]+14, pts[1][1], pts[2][0]-14, pts[2][1], '#60a5fa', 2, true)
    arrow(ctx, pts[2][0]-10, pts[2][1]-8, pts[0][0]+8, pts[0][1]+8, '#4ade80', 2, true)
  },

  // c03 – Lanzamientos 9m
  c03(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R9 } = C
    gk(ctx, MX, GT+28)
    const sy = GT + R9
    player(ctx, MX-35, sy, 'A'); ball(ctx, MX-22, sy-12)
    arrow(ctx, MX-35, sy-12, MX-10, GT+22, '#f97316', 2.5)
    player(ctx, MX+50, sy-8, 'A')
    arrow(ctx, MX+50, sy-20, MX+10, GT+22, '#f97316', 1.5)
  },

  // c04 – 2v1 contraataque (full court)
  c04(ctx) {
    court(ctx, 280, 470, true)
    const { MX, GT, GB, CT } = C
    gk(ctx, MX, GT+26); gk(ctx, MX, GB-18)
    def(ctx, MX-10, CT-35)
    player(ctx, MX-55, CT+30, 'A1'); player(ctx, MX+55, CT+30, 'A2')
    ball(ctx, MX-40, CT+16)
    arrow(ctx, MX, GB-30, MX-50, CT+16, '#4ade80', 1.8, true)
    arrow(ctx, MX-55, CT+18, MX-50, GT+115, '#60a5fa', 2)
    arrow(ctx, MX+55, CT+18, MX+35, GT+115, '#60a5fa', 2)
    arrow(ctx, MX-46, GT+111, MX+28, GT+111, '#facc15', 2.5, true)
  },

  // c05 – 3v2 contraataque (full court)
  c05(ctx) {
    court(ctx, 280, 470, true)
    const { MX, GT, GB, CT } = C
    gk(ctx, MX, GT+26); gk(ctx, MX, GB-18)
    def(ctx, MX-35, CT-20, 'D1'); def(ctx, MX+35, CT-20, 'D2')
    player(ctx, MX, CT+40, 'A1')
    player(ctx, MX-65, CT+15, 'A2')
    player(ctx, MX+65, CT+15, 'A3')
    ball(ctx, MX+12, CT+28)
    arrow(ctx, MX, CT+28, MX, GT+115, '#60a5fa', 2)
    arrow(ctx, MX-65, CT+3, MX-50, GT+105, '#60a5fa', 1.5)
    arrow(ctx, MX+65, CT+3, MX+40, GT+105, '#60a5fa', 1.5)
    arrow(ctx, MX-4, GT+111, MX-48, GT+105, '#facc15', 2, true)
  },

  // c06 – 3v3 espacio reducido
  c06(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R6 } = C
    const zy = GT + R6 + 15
    player(ctx, MX-55, zy, 'A1')
    player(ctx, MX, zy-20, 'A2')
    player(ctx, MX+55, zy, 'A3')
    def(ctx, MX-30, zy+50, 'D1')
    def(ctx, MX+15, zy+55, 'D2')
    def(ctx, MX+50, zy+40, 'D3')
    gk(ctx, MX, GT+28)
    ball(ctx, MX+12, zy-12)
    arrow(ctx, MX+12, zy-12, MX+54, zy-4, '#facc15', 2, true)
    arrow(ctx, MX+54, zy-4, MX+26, GT+62, '#f97316', 2)
  },

  // c07 – 6v6 libre (full court)
  c07(ctx) {
    court(ctx, 280, 470, true)
    const { MX, GT, GB, CT } = C
    gk(ctx, MX, GT+26); gk(ctx, MX, GB-18)
    player(ctx, MX-75, CT-45, 'EI'); player(ctx, MX-35, CT-60, 'LI')
    player(ctx, MX, CT-65, 'CE'); player(ctx, MX+35, CT-60, 'LD')
    player(ctx, MX+75, CT-45, 'ED'); player(ctx, MX, CT-25, 'PI')
    def(ctx, MX-45, CT+30, 'D'); def(ctx, MX-15, CT+25, 'D')
    def(ctx, MX+15, CT+25, 'D'); def(ctx, MX+45, CT+30, 'D')
    ball(ctx, MX+5, CT-55)
    arrow(ctx, MX+5, CT-55, MX+35, CT-52, '#facc15', 2, true)
  },

  // c08 – Defensa 6-0
  c08(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R6 } = C
    gk(ctx, MX, GT+28)
    const dy = GT + R6 + 18
    ;[-75,-45,-15,20,50,78].forEach((dx, i) => def(ctx, MX+dx, dy, `${i+1}`))
    player(ctx, MX-70, dy-50, 'A'); player(ctx, MX, dy-55, 'A'); player(ctx, MX+70, dy-50, 'A')
    arrow(ctx, MX-73, dy-2, MX-43, dy-2, '#f87171', 1.5)
    arrow(ctx, MX+22, dy-2, MX+52, dy-2, '#f87171', 1.5)
  },

  // c09 – Defensa individual
  c09(ctx) {
    court(ctx, 280, 270)
    const { MX, GT } = C
    gk(ctx, MX, GT+28)
    ;[-60, 0, 60].forEach((dx, i) => {
      const x = MX+dx, y = GT+80
      player(ctx, x, y-22, `A${i+1}`)
      def(ctx, x+5, y+18, `D${i+1}`)
      arrow(ctx, x+3, y-8, x+5, y+6, '#f87171', 1.5)
    })
  },

  // c10 – 7 metros
  c10(ctx) {
    court(ctx, 280, 270)
    const { MX, GT } = C
    gk(ctx, MX, GT+28)
    const py = GT + 70
    ctx.save(); ctx.strokeStyle='#3b82f6'; ctx.lineWidth=1.5; ctx.setLineDash([4,3])
    ctx.beginPath(); ctx.moveTo(MX-22, py); ctx.lineTo(MX+22, py); ctx.stroke()
    ctx.restore()
    player(ctx, MX, py+6, 'A'); ball(ctx, MX+14, py-2)
    arrow(ctx, MX-3, py-5, MX-15, GT+15, '#f97316', 2)
    arrow(ctx, MX+3, py-5, MX+15, GT+15, '#f97316', 1.5)
  },

  // c11 – Transición defensa-ataque
  c11(ctx) {
    court(ctx, 280, 470, true)
    const { MX, GT, GB, CT } = C
    gk(ctx, MX, GT+26); gk(ctx, MX, GB-18)
    player(ctx, MX-50, GB-55, 'A1'); player(ctx, MX+40, GB-55, 'A2')
    arrow(ctx, MX, GB-30, MX-44, CT-10, '#4ade80', 1.8, true)
    ball(ctx, MX-18, CT)
    arrow(ctx, MX-50, GB-68, MX-55, GT+120, '#60a5fa', 2)
    arrow(ctx, MX+40, GB-68, MX+50, GT+100, '#60a5fa', 2)
  },

  // c12 – Extremo: caída
  c12(ctx) {
    court(ctx, 280, 270)
    const { MX, L, R, GT, R6 } = C
    gk(ctx, MX, GT+28)
    player(ctx, R-15, GT+52, 'EX'); ball(ctx, R-28, GT+40)
    def(ctx, R-32, GT+68)
    ctx.save(); ctx.strokeStyle='#60a5fa'; ctx.lineWidth=2; ctx.setLineDash([])
    ctx.beginPath(); ctx.moveTo(R-15, GT+52)
    ctx.quadraticCurveTo(R-18, GT+85, L+62, GT+78); ctx.stroke(); ctx.restore()
    arrow(ctx, L+62, GT+76, MX-10, GT+22, '#f97316', 2.5)
  },

  // c13 – Central-extremo con cruce
  c13(ctx) {
    court(ctx, 280, 270)
    const { MX, R, GT, R9 } = C
    gk(ctx, MX, GT+28)
    player(ctx, MX-15, GT+R9+5, 'CE'); ball(ctx, MX-3, GT+R9-10)
    player(ctx, R-22, GT+R9-25, 'EX')
    arrow(ctx, MX-3, GT+R9-10, R-32, GT+62, '#facc15', 2, true)
    arrow(ctx, R-22, GT+R9-38, R-32, GT+64, '#60a5fa', 2)
    ctx.save(); ctx.strokeStyle='#a78bfa'; ctx.lineWidth=1.5; ctx.setLineDash([4,3])
    ctx.beginPath(); ctx.moveTo(MX-15, GT+R9-8); ctx.lineTo(R-22, GT+R9-14); ctx.stroke(); ctx.restore()
  },

  // c14 – Extremo: recepción alta
  c14(ctx) {
    court(ctx, 280, 270)
    const { MX, L, R, GT } = C
    gk(ctx, MX, GT+28)
    player(ctx, L+15, GT+18, 'P', '#374151', '#6b7280')
    player(ctx, R-20, GT+68, 'EX')
    arrow(ctx, R-20, GT+55, R-22, GT+32, '#60a5fa', 2)
    arrow(ctx, L+26, GT+16, R-30, GT+30, '#facc15', 2, true)
    ball(ctx, MX+30, GT+18)
    arrow(ctx, R-24, GT+30, MX+14, GT+18, '#f97316', 2)
  },

  // c15 – Extremo: suspensión ángulo
  c15(ctx) {
    court(ctx, 280, 270)
    const { MX, L, R, GT } = C
    gk(ctx, MX, GT+28)
    player(ctx, R-16, GT+55, 'EX'); ball(ctx, R-30, GT+44)
    arrow(ctx, R-25, GT+48, MX+14, GT+18, '#f97316', 2)
    arrow(ctx, R-25, GT+48, L+132, GT+22, '#f97316', 1.5)
    arrow(ctx, R-25, GT+50, MX+5, GT+36, '#f97316', 1.2)
  },

  // c16 – Extremo: 1v1
  c16(ctx) {
    court(ctx, 280, 270)
    const { MX, R, GT } = C
    gk(ctx, MX, GT+28)
    player(ctx, R-18, GT+78, 'EX'); ball(ctx, R-30, GT+66)
    def(ctx, R-36, GT+56)
    arrow(ctx, R-18, GT+65, R-20, GT+32, '#60a5fa', 2)
    ctx.save(); ctx.strokeStyle='#a78bfa'; ctx.lineWidth=1.5; ctx.setLineDash([4,3])
    ctx.beginPath(); ctx.moveTo(R-18, GT+65); ctx.lineTo(R-52, GT+70); ctx.stroke(); ctx.restore()
  },

  // c17 – Portero: posicionamiento
  c17(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R9 } = C
    gk(ctx, MX, GT+30)
    const ay = GT+R9
    player(ctx, MX-55, ay, 'A'); player(ctx, MX, ay+5, 'A'); player(ctx, MX+55, ay, 'A')
    ctx.save(); ctx.strokeStyle='#facc15'; ctx.lineWidth=1; ctx.setLineDash([4,3]); ctx.globalAlpha=0.4
    ;[[MX-55,ay],[MX,ay+5],[MX+55,ay]].forEach(([ax,ay2]) => {
      ctx.beginPath(); ctx.moveTo(ax, ay2); ctx.lineTo(MX, GT+22); ctx.stroke()
    })
    ctx.restore()
    arrow(ctx, MX-12, GT+32, MX-40, GT+37, '#4ade80', 2)
    arrow(ctx, MX+12, GT+32, MX+40, GT+37, '#4ade80', 2)
  },

  // c18 – Portero: paradas en serie
  c18(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R9 } = C
    gk(ctx, MX, GT+30)
    const sy = GT+R9
    ;[[MX-60,sy,'#f97316'],[MX,sy+5,'#ef4444'],[MX+55,sy-5,'#f59e0b']].forEach(([x,y,col]) => {
      player(ctx, x, y, 'A')
      arrow(ctx, x, y-12, MX+(x>MX?8:-8), GT+22, col, 2)
    })
    ball(ctx, MX+12, sy-30)
  },

  // c19 – Portero: desplazamientos
  c19(ctx) {
    court(ctx, 280, 270)
    const { MX, L, R, GT } = C
    gk(ctx, MX, GT+30)
    arrow(ctx, MX-12, GT+30, L+2, GT+30, '#4ade80', 2)
    arrow(ctx, L+5, GT+30, MX-14, GT+30, '#4ade80', 1.5, true)
    arrow(ctx, MX+12, GT+30, R-2, GT+30, '#4ade80', 2)
    player(ctx, MX+5, GT+108, 'A'); ball(ctx, MX+20, GT+96)
    arrow(ctx, MX+5, GT+95, MX-5, GT+44, '#f97316', 2)
  },

  // c20 – Portero: lectura de pivote
  c20(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R6, R9 } = C
    gk(ctx, MX, GT+28)
    player(ctx, MX+10, GT+R6-5, 'PI'); ball(ctx, MX+24, GT+R6-14)
    def(ctx, MX-8, GT+R6+18)
    player(ctx, MX+65, GT+88, 'LD'); player(ctx, MX-60, GT+90, 'LI')
    arrow(ctx, MX+24, GT+R6-14, MX+55, GT+83, '#facc15', 1.8, true)
    ctx.save(); ctx.strokeStyle='#f97316'; ctx.lineWidth=1.5; ctx.setLineDash([4,3])
    ctx.beginPath(); ctx.arc(MX+10, GT+R6-5, 16, -π/2, π/4); ctx.stroke(); ctx.restore()
  },

  // c21 – Portero: salida en contraataque
  c21(ctx) {
    court(ctx, 280, 470, true)
    const { MX, GT, GB, CT } = C
    gk(ctx, MX, GT+24)
    player(ctx, MX-60, CT+20, 'A1'); player(ctx, MX+40, CT-30, 'A2')
    arrow(ctx, MX, GT+36, MX-56, CT+8, '#4ade80', 2, true)
    ball(ctx, MX-25, CT-18)
    gk(ctx, MX, GB-18)
    arrow(ctx, MX-60, CT+8, MX-55, GT+130, '#60a5fa', 2)
  },

  // c22 – Portero: paradas al suelo (extremos)
  c22(ctx) {
    court(ctx, 280, 270)
    const { MX, L, R, GT } = C
    gk(ctx, MX, GT+30)
    player(ctx, L+18, GT+56, 'EI'); arrow(ctx, L+18, GT+43, MX-12, GT+38, '#f97316', 2)
    player(ctx, R-18, GT+50, 'ED'); arrow(ctx, R-18, GT+37, MX+12, GT+36, '#f97316', 1.5)
    ctx.save(); ctx.strokeStyle='#4ade80'; ctx.lineWidth=2
    ctx.beginPath(); ctx.moveTo(MX-5, GT+40); ctx.lineTo(MX-24, GT+50); ctx.stroke(); ctx.restore()
  },

  // c23 – Pivote: giro y lanzamiento
  c23(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R6 } = C
    gk(ctx, MX, GT+28)
    const py = GT+R6-8
    player(ctx, MX, py, 'PI'); def(ctx, MX+5, py+22); ball(ctx, MX+16, py-8)
    ctx.save(); ctx.strokeStyle='#a78bfa'; ctx.lineWidth=2; ctx.setLineDash([])
    ctx.beginPath(); ctx.arc(MX, py, 18, -π, 0); ctx.stroke()
    arrow(ctx, MX+16, py-4, MX+12, py-20, '#a78bfa', 2)
    ctx.restore()
    arrow(ctx, MX-6, py-14, MX-12, GT+22, '#f97316', 2)
  },

  // c24 – Pivote: bloqueo
  c24(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R6, R9 } = C
    gk(ctx, MX, GT+28)
    player(ctx, MX+20, GT+R6+10, 'PI'); def(ctx, MX+15, GT+R6+30, 'Dp')
    player(ctx, MX-15, GT+R9+5, 'CE'); def(ctx, MX-20, GT+R9+28, 'Dc')
    ball(ctx, MX-3, GT+R9-8)
    arrow(ctx, MX-15, GT+R9-8, MX+8, GT+R6+8, '#60a5fa', 2)
    arrow(ctx, MX+10, GT+R6+5, MX+10, GT+22, '#f97316', 2)
    ctx.save(); ctx.strokeStyle='#facc15'; ctx.lineWidth=2
    ctx.beginPath(); ctx.moveTo(MX+20, GT+R6-2); ctx.lineTo(MX+20, GT+R6+22); ctx.stroke(); ctx.restore()
  },

  // c25 – Pivote: recepción difícil
  c25(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R6 } = C
    gk(ctx, MX, GT+28)
    player(ctx, MX+10, GT+R6-5, 'PI'); def(ctx, MX+10, GT+R6+18)
    player(ctx, MX-62, GT+R6-8, 'CE'); ball(ctx, MX-50, GT+R6-20)
    arrow(ctx, MX-50, GT+R6-22, MX+5, GT+R6-14, '#facc15', 2, true)
    arrow(ctx, MX-50, GT+R6-22, MX+1, GT+R6-2, '#60a5fa', 1.5, true)
    arrow(ctx, MX+10, GT+R6+6, MX+10, GT+R6-1, '#f87171', 1.5)
  },

  // c26 – Penetración y asistencia al pivote
  c26(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R6, R9 } = C
    gk(ctx, MX, GT+28)
    player(ctx, MX+35, GT+R9+5, 'LD'); def(ctx, MX+32, GT+R9+28)
    player(ctx, MX-15, GT+R9-5, 'CE'); def(ctx, MX-12, GT+R9+22)
    player(ctx, MX, GT+R6-5, 'PI')
    ball(ctx, MX+47, GT+R9-10)
    arrow(ctx, MX+35, GT+R9-8, MX+12, GT+R6+5, '#60a5fa', 2)
    arrow(ctx, MX+10, GT+R6-2, MX+10, GT+22, '#f97316', 2)
    arrow(ctx, MX+10, GT+R6-6, MX-2, GT+R6-10, '#facc15', 1.5, true)
  },

  // c27 – Lanzamiento suspensión desde lateral
  c27(ctx) {
    court(ctx, 280, 270)
    const { MX, GT, R9 } = C
    gk(ctx, MX, GT+28)
    player(ctx, MX-58, GT+R9-8, 'CE')
    player(ctx, MX+32, GT+R9, 'LD'); ball(ctx, MX+44, GT+R9-14)
    arrow(ctx, MX-46, GT+R9-10, MX+20, GT+R9-10, '#facc15', 2, true)
    ctx.save(); ctx.strokeStyle='#60a5fa'; ctx.lineWidth=1.5; ctx.setLineDash([3,3])
    ctx.beginPath(); ctx.arc(MX+32, GT+R9-18, 14, π, 0, true); ctx.stroke(); ctx.restore()
    arrow(ctx, MX+32, GT+R9-12, MX+8, GT+22, '#f97316', 2.5)
  },

  // c28 – Central: dirección de ataque
  c28(ctx) {
    court(ctx, 280, 270)
    const { MX, L, R, GT, R9, R6 } = C
    gk(ctx, MX, GT+28)
    player(ctx, L+20, GT+78, 'EI'); player(ctx, MX-58, GT+R9, 'LI')
    player(ctx, MX, GT+R9+5, 'CE'); player(ctx, MX+58, GT+R9, 'LD')
    player(ctx, R-20, GT+78, 'ED'); player(ctx, MX, GT+R6+15, 'PI')
    ball(ctx, MX+12, GT+R9-8)
    arrow(ctx, MX+12, GT+R9-8, MX+48, GT+R9-5, '#facc15', 2, true)
    arrow(ctx, MX+56, GT+R9-8, R-28, GT+82, '#facc15', 1.5, true)
    arrow(ctx, MX-58, GT+R9-12, MX-35, GT+R9-12, '#60a5fa', 1.5, true)
  },
}

// ── Component ────────────────────────────────────────────────

export default function CourtDiagram({ id }) {
  const ref = useRef(null)
  const full = ['c04','c05','c07','c11','c21'].includes(id)
  const W = 280, H = full ? 470 : 270

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !DRAWS[id]) return
    DRAWS[id](canvas.getContext('2d'))
  }, [id])

  if (!DRAWS[id]) return null

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      style={{ width: '100%', height: 'auto', borderRadius: 10, display: 'block', margin: '12px 0 6px' }}
    />
  )
}
