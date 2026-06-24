import { useRef, useEffect } from 'react'

const π = Math.PI

// ── Primitives ───────────────────────────────────────────────

function bg(ctx, W, H) {
  ctx.fillStyle = '#050c18'; ctx.fillRect(0, 0, W, H)
}

function line(ctx, x1, y1, x2, y2, color = '#e2e8f0', w = 3) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore()
}

function circ(ctx, x, y, r, fill = '#e2e8f0', stroke = null, sw = 2) {
  ctx.save(); ctx.fillStyle = fill
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw }
  ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * π)
  ctx.fill(); if (stroke) ctx.stroke(); ctx.restore()
}

function arrow(ctx, x1, y1, x2, y2, color = '#60a5fa', w = 2) {
  const hl = 8, a = Math.atan2(y2 - y1, x2 - x1)
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - (hl-1)*Math.cos(a), y2 - (hl-1)*Math.sin(a)); ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - hl*Math.cos(a-0.4), y2 - hl*Math.sin(a-0.4))
  ctx.lineTo(x2 - hl*Math.cos(a+0.4), y2 - hl*Math.sin(a+0.4))
  ctx.closePath(); ctx.fill(); ctx.restore()
}

function label(ctx, x, y, txt, color = '#6b7280', size = 11) {
  ctx.save(); ctx.fillStyle = color; ctx.font = `${size}px system-ui`; ctx.textAlign = 'center'
  ctx.fillText(txt, x, y); ctx.restore()
}

// ── Stick figure helpers ─────────────────────────────────────
// Standing upright at (cx, cy=floor level)

function figureStand(ctx, cx, fy, col = '#e2e8f0', scale = 1) {
  const s = scale
  const headR = 10*s, neckY = fy-85*s, shY = fy-72*s, hipY = fy-42*s
  circ(ctx, cx, fy-96*s, headR, col)
  line(ctx, cx, fy-86*s, cx, hipY, col, 3*s)          // spine
  line(ctx, cx, shY, cx-22*s, fy-50*s, col, 2.5*s)    // L arm
  line(ctx, cx, shY, cx+22*s, fy-50*s, col, 2.5*s)    // R arm
  line(ctx, cx, hipY, cx-14*s, fy, col, 2.5*s)         // L leg
  line(ctx, cx, hipY, cx+14*s, fy, col, 2.5*s)         // R leg
}

function figureSquat(ctx, cx, fy, col = '#e2e8f0', depth = 0.55) {
  // depth 0=standing 1=full squat
  const headY = fy - 55 - 40*(1-depth)
  const hipY  = fy - 20
  const kneeY = fy - 35*(1-depth)
  circ(ctx, cx, headY - 10, 10, col)
  line(ctx, cx, headY, cx, hipY, col, 3)           // torso (leaned)
  line(ctx, cx, headY-5, cx-22, headY+8, col, 2.5) // arms on bar
  line(ctx, cx, headY-5, cx+22, headY+8, col, 2.5)
  line(ctx, cx, hipY, cx-18, kneeY, col, 2.5)      // L thigh
  line(ctx, cx-18, kneeY, cx-10, fy, col, 2.5)     // L shin
  line(ctx, cx, hipY, cx+18, kneeY, col, 2.5)      // R thigh
  line(ctx, cx+18, kneeY, cx+10, fy, col, 2.5)     // R shin
}

function figureBench(ctx, cx, fy, col = '#e2e8f0') {
  // Lying on bench pressing up
  const bx1 = cx-45, bx2 = cx+45, bY = fy-18
  // bench
  ctx.save(); ctx.fillStyle='#334155'; ctx.strokeStyle='#475569'; ctx.lineWidth=1.5
  ctx.beginPath(); ctx.roundRect(bx1, bY, bx2-bx1, 12, 3); ctx.fill(); ctx.stroke(); ctx.restore()
  // body
  line(ctx, bx1+8, bY-4, bx2-8, bY-4, col, 6)    // torso (fat line)
  circ(ctx, bx1+14, bY-4, 9, col)                  // head
  line(ctx, cx-5, bY-4, cx-5, bY-30, col, 2.5)    // L arm up
  line(ctx, cx+5, bY-4, cx+5, bY-30, col, 2.5)    // R arm up
  // barbell
  line(ctx, cx-35, bY-30, cx+35, bY-30, '#94a3b8', 4)
  circ(ctx, cx-38, bY-30, 7, '#475569', '#64748b', 1.5)
  circ(ctx, cx+38, bY-30, 7, '#475569', '#64748b', 1.5)
}

function figureRow(ctx, cx, fy, col = '#e2e8f0') {
  // Bent over row
  const hipX = cx, hipY = fy-50
  circ(ctx, cx-30, fy-70, 10, col)                   // head
  line(ctx, cx-20, fy-62, hipX, hipY, col, 3)        // torso (horizontal)
  line(ctx, hipX, hipY, cx-10, fy, col, 2.5)         // L leg
  line(ctx, hipX, hipY, cx+10, fy, col, 2.5)         // R leg
  line(ctx, cx-5, hipY-5, cx-5, hipY-30, col, 2.5)   // L arm down
  line(ctx, cx+5, hipY-5, cx+5, hipY-30, col, 2.5)   // R arm
  // barbell
  line(ctx, cx-32, hipY-30, cx+32, hipY-30, '#94a3b8', 4)
  circ(ctx, cx-35, hipY-30, 7, '#475569', '#64748b', 1.5)
  circ(ctx, cx+35, hipY-30, 7, '#475569', '#64748b', 1.5)
  arrow(ctx, cx, hipY-32, cx, hipY-15, '#60a5fa', 2)
}

function figureHinge(ctx, cx, fy, col = '#e2e8f0') {
  // Hip hinge / RDL
  const hipX = cx+10, hipY = fy-50
  circ(ctx, cx-28, fy-58, 10, col)
  line(ctx, cx-18, fy-52, hipX, hipY, col, 3)
  line(ctx, hipX, hipY, cx+5, fy, col, 2.5)
  line(ctx, hipX, hipY, cx+20, fy, col, 2.5)
  // arms hanging with barbell
  line(ctx, cx-8, hipY, cx-8, fy-25, col, 2.5)
  line(ctx, cx+2, hipY, cx+2, fy-25, col, 2.5)
  line(ctx, cx-28, fy-25, cx+22, fy-25, '#94a3b8', 4)
  circ(ctx, cx-30, fy-25, 6, '#475569', '#64748b', 1.5)
  circ(ctx, cx+24, fy-25, 6, '#475569', '#64748b', 1.5)
}

function figureLunge(ctx, cx, fy, col = '#e2e8f0') {
  circ(ctx, cx, fy-100, 10, col)
  line(ctx, cx, fy-90, cx, fy-55, col, 3)           // torso
  line(ctx, cx, fy-78, cx-20, fy-62, col, 2.5)      // L arm
  line(ctx, cx, fy-78, cx+20, fy-62, col, 2.5)      // R arm
  line(ctx, cx, fy-55, cx-28, fy-20, col, 2.5)      // L thigh back
  line(ctx, cx-28, fy-20, cx-22, fy, col, 2.5)      // L shin
  line(ctx, cx, fy-55, cx+30, fy-30, col, 2.5)      // R thigh front
  line(ctx, cx+30, fy-30, cx+32, fy-10, col, 2.5)   // R shin (bent)
}

function figurePlank(ctx, cx, fy, col = '#e2e8f0') {
  line(ctx, cx-55, fy-22, cx+55, fy-22, col, 6)    // body
  circ(ctx, cx+60, fy-22, 10, col)                   // head
  line(ctx, cx-55, fy-22, cx-58, fy, col, 2.5)      // L forearm
  line(ctx, cx-30, fy-22, cx-33, fy, col, 2.5)      // R forearm
  line(ctx, cx+40, fy-22, cx+42, fy, col, 2.5)      // L foot
  line(ctx, cx+55, fy-22, cx+58, fy, col, 2.5)      // R foot
}

function figureRussianTwist(ctx, cx, fy, col = '#e2e8f0') {
  // Seated, torso leaned back, feet raised
  const seatY = fy - 20
  circ(ctx, cx-15, fy-80, 10, col)                   // head
  line(ctx, cx-8, fy-72, cx+10, seatY, col, 3)       // torso lean
  line(ctx, cx+10, seatY, cx+35, fy-40, col, 2.5)    // L leg up
  line(ctx, cx+10, seatY, cx+45, fy-32, col, 2.5)    // R leg up
  // arms holding ball to one side
  line(ctx, cx-5, fy-60, cx+25, fy-48, col, 2.5)
  circ(ctx, cx+32, fy-46, 7, '#f97316', '#fed7aa', 1.5) // ball
  // twist arc
  ctx.save(); ctx.strokeStyle='#60a5fa'; ctx.lineWidth=1.5; ctx.setLineDash([3,3])
  ctx.beginPath(); ctx.arc(cx+5, fy-55, 28, -0.3, -π+0.3, true); ctx.stroke(); ctx.restore()
}

function figurePallof(ctx, cx, fy, col = '#e2e8f0') {
  figureStand(ctx, cx, fy, col)
  // arms extended forward
  line(ctx, cx, fy-72, cx+32, fy-72, col, 2.5)
  circ(ctx, cx+36, fy-72, 5, '#60a5fa')
  // band from side
  ctx.save(); ctx.strokeStyle='#4ade80'; ctx.lineWidth=2; ctx.setLineDash([4,3])
  ctx.beginPath(); ctx.moveTo(cx-70, fy-72); ctx.lineTo(cx+36, fy-72); ctx.stroke(); ctx.restore()
  // anchor at wall
  line(ctx, cx-70, fy-85, cx-70, fy-55, '#475569', 4)
}

function figureDeadbug(ctx, cx, fy, col = '#e2e8f0') {
  // Lying on back, arms and legs up
  line(ctx, cx-40, fy-8, cx+40, fy-8, col, 6)        // body
  circ(ctx, cx-46, fy-8, 10, col)                      // head
  // arms up
  line(ctx, cx-20, fy-8, cx-25, fy-45, col, 2.5)
  line(ctx, cx+10, fy-8, cx+15, fy-45, col, 2.5)
  // legs up bent
  line(ctx, cx+20, fy-8, cx+35, fy-38, col, 2.5)
  line(ctx, cx+35, fy-38, cx+20, fy-55, col, 2.5)
  line(ctx, cx+30, fy-8, cx+50, fy-35, col, 2.5)
  line(ctx, cx+50, fy-35, cx+38, fy-55, col, 2.5)
  // one arm/leg going down
  line(ctx, cx-10, fy-8, cx-5, fy-48, '#60a5fa', 2.5)
  arrow(ctx, cx-5, fy-48, cx-5, fy-20, '#60a5fa', 1.8)
}

function figureBoxJump(ctx, cx, fy, col = '#e2e8f0') {
  // Box
  ctx.save(); ctx.fillStyle='#1e3a5f'; ctx.strokeStyle='#3b82f6'; ctx.lineWidth=2
  ctx.beginPath(); ctx.roundRect(cx+30, fy-50, 55, 50, 3); ctx.fill(); ctx.stroke(); ctx.restore()
  // Figure jumping
  circ(ctx, cx-10, fy-100, 10, col)
  line(ctx, cx-10, fy-90, cx-10, fy-60, col, 3)
  line(ctx, cx-10, fy-80, cx+10, fy-65, col, 2.5)   // arm forward
  line(ctx, cx-10, fy-80, cx-30, fy-62, col, 2.5)   // arm back
  line(ctx, cx-10, fy-60, cx+5, fy-30, col, 2.5)    // leg tuck
  line(ctx, cx-10, fy-60, cx-20, fy-35, col, 2.5)
  arrow(ctx, cx, fy-95, cx+45, fy-60, '#60a5fa', 2)
}

function figureSprintStart(ctx, cx, fy, col = '#e2e8f0') {
  // Runner in sprint position
  circ(ctx, cx-20, fy-75, 10, col)
  line(ctx, cx-12, fy-66, cx+5, fy-38, col, 3)       // leaned torso
  line(ctx, cx, fy-58, cx+20, fy-42, col, 2.5)       // arm forward
  line(ctx, cx, fy-58, cx-22, fy-40, col, 2.5)       // arm back
  line(ctx, cx+5, fy-38, cx+22, fy-12, col, 2.5)     // drive leg
  line(ctx, cx+5, fy-38, cx-10, fy-10, col, 2.5)     // recovery leg
  arrow(ctx, cx+10, fy-55, cx+55, fy-55, '#60a5fa', 2)
  line(ctx, cx+10, fy, cx+130, fy, '#1e3a5f', 2)
  label(ctx, cx+70, fy+12, '30m', '#3b82f6', 10)
}

function figureJumpSqt(ctx, cx, fy, col = '#e2e8f0') {
  // Squat phase
  figureSquat(ctx, cx-50, fy, col, 0.7)
  // Jump phase
  circ(ctx, cx+50, fy-110, 10, col)
  line(ctx, cx+50, fy-100, cx+50, fy-70, col, 3)
  line(ctx, cx+50, fy-88, cx+70, fy-72, col, 2.5)
  line(ctx, cx+50, fy-88, cx+30, fy-72, col, 2.5)
  line(ctx, cx+50, fy-70, cx+40, fy-50, col, 2.5)
  line(ctx, cx+50, fy-70, cx+60, fy-50, col, 2.5)
  arrow(ctx, cx+50, fy-65, cx+50, fy-105, '#60a5fa', 2)
  // Phase labels
  label(ctx, cx-50, fy+14, 'Bajada', '#6b7280', 10)
  label(ctx, cx+50, fy+14, 'Explosión', '#6b7280', 10)
}

function figureLadder(ctx, cx, fy) {
  // Top view of ladder
  const lx = cx-60, rung = 22, rungs = 5, h = 30
  ctx.save(); ctx.strokeStyle='#475569'; ctx.lineWidth=2
  // sides
  ctx.beginPath(); ctx.moveTo(lx,fy); ctx.lineTo(lx, fy - rungs*rung)
  ctx.moveTo(lx+h, fy); ctx.lineTo(lx+h, fy - rungs*rung); ctx.stroke()
  // rungs
  for (let i = 0; i <= rungs; i++) {
    ctx.beginPath(); ctx.moveTo(lx, fy-i*rung); ctx.lineTo(lx+h, fy-i*rung); ctx.stroke()
  }
  ctx.restore()
  // Footsteps
  const feet = [
    [lx+8, fy-10],[lx+22, fy-10],
    [lx+8, fy-32],[lx+22, fy-32],
    [lx+8, fy-54],[lx+22, fy-54],
  ]
  feet.forEach(([fx,fy2]) => circ(ctx, fx, fy2, 5, '#60a5fa'))
  arrow(ctx, lx+h+10, fy, lx+h+10, fy - rungs*rung - 5, '#4ade80', 1.8)
  label(ctx, lx+h/2, fy+14, 'Escalera', '#6b7280', 10)
  // Standing figure to the side
  figureStand(ctx, cx+55, fy, '#e2e8f0', 0.75)
}

function figureTdrill(ctx, cx, fy) {
  // T-shape with cones
  const cone = (x,y) => {
    ctx.save(); ctx.fillStyle='#f97316'
    ctx.beginPath(); ctx.moveTo(x,y-10); ctx.lineTo(x-5,y); ctx.lineTo(x+5,y); ctx.closePath(); ctx.fill(); ctx.restore()
  }
  // T path
  ctx.save(); ctx.strokeStyle='#3b82f6'; ctx.lineWidth=1.5; ctx.setLineDash([5,4])
  ctx.beginPath()
  ctx.moveTo(cx, fy); ctx.lineTo(cx, fy-70)           // stem up
  ctx.moveTo(cx-55, fy-70); ctx.lineTo(cx+55, fy-70)  // top bar
  ctx.stroke(); ctx.restore()
  cone(cx, fy); cone(cx-55, fy-70); cone(cx+55, fy-70); cone(cx, fy-70)
  arrow(ctx, cx+5, fy-5, cx+5, fy-65, '#60a5fa', 2)
  arrow(ctx, cx, fy-68, cx-52, fy-68, '#facc15', 1.5)
  arrow(ctx, cx-50, fy-68, cx+50, fy-68, '#facc15', 1.5)
  label(ctx, cx-55, fy-80, 'Izquierda', '#6b7280', 9)
  label(ctx, cx+55, fy-80, 'Derecha', '#6b7280', 9)
  label(ctx, cx, fy+14, 'Salida', '#6b7280', 10)
}

function figureRun(ctx, cx, fy, col = '#e2e8f0') {
  // Running figure
  circ(ctx, cx, fy-92, 10, col)
  line(ctx, cx, fy-82, cx+5, fy-50, col, 3)
  line(ctx, cx+2, fy-72, cx+22, fy-58, col, 2.5)
  line(ctx, cx+2, fy-72, cx-18, fy-56, col, 2.5)
  line(ctx, cx+5, fy-50, cx+20, fy-18, col, 2.5)
  line(ctx, cx+20, fy-18, cx+12, fy, col, 2.5)
  line(ctx, cx+5, fy-50, cx-10, fy-20, col, 2.5)
  line(ctx, cx-10, fy-20, cx-2, fy, col, 2.5)
}

function figureInterval(ctx, cx, fy) {
  // 30-30 interval: fast + slow
  figureRun(ctx, cx-55, fy, '#ef4444')
  figureRun(ctx, cx+55, fy, '#4ade80')
  label(ctx, cx-55, fy+14, '90% FCmax', '#ef4444', 10)
  label(ctx, cx+55, fy+14, 'Trote suave', '#4ade80', 10)
  // clock
  circ(ctx, cx, fy-65, 22, 'none', '#3b82f6', 2)
  line(ctx, cx, fy-65, cx, fy-50, '#3b82f6', 2)
  line(ctx, cx, fy-65, cx+12, fy-60, '#facc15', 2)
  label(ctx, cx, fy-85, '30s / 30s', '#6b7280', 10)
}

function figureCircuit(ctx, cx, fy) {
  // 5 stations in a circuit
  const stations = [
    [cx-70, fy-55, '🏃'], [cx-30, fy-90, '⚽'], [cx+30, fy-90, '💪'],
    [cx+70, fy-55, '🏋️'], [cx, fy-25, '🎯'],
  ]
  stations.forEach(([x,y,ico], i) => {
    circ(ctx, x, y, 18, '#0f2744', '#2563eb', 1.5)
    ctx.save(); ctx.font='14px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText(ico, x, y); ctx.restore()
    // arrow to next
    if (i < stations.length-1) {
      const [nx,ny] = stations[i+1]
      const a = Math.atan2(ny-y, nx-x)
      const dist = Math.hypot(nx-x, ny-y)
      arrow(ctx, x+20*Math.cos(a), y+20*Math.sin(a), nx-22*Math.cos(a), ny-22*Math.sin(a), '#1e3a5f', 2)
    }
  })
  label(ctx, cx, fy+12, '5 estaciones × 1 min', '#6b7280', 10)
}

function figureFartlek(ctx, cx, fy) {
  // Wave-like speed profile
  const pts = [
    [cx-80,fy-20],[cx-55,fy-20],[cx-45,fy-60],[cx-20,fy-60],
    [cx-10,fy-20],[cx+5,fy-20],[cx+15,fy-80],[cx+45,fy-80],
    [cx+55,fy-20],[cx+80,fy-20],
  ]
  ctx.save(); ctx.strokeStyle='#3b82f6'; ctx.lineWidth=2.5
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1])
  pts.forEach(([x,y]) => ctx.lineTo(x,y)); ctx.stroke()
  // labels
  label(ctx, cx-35, fy-72, 'Rápido', '#ef4444', 10)
  label(ctx, cx+30, fy-92, 'Sprint', '#f97316', 10)
  label(ctx, cx-60, fy-8, 'Moderado', '#4ade80', 10)
  arrow(ctx, cx-80, fy+5, cx+80, fy+5, '#374151', 1.5)
  label(ctx, cx, fy+18, 'Tiempo', '#4b5563', 10)
  ctx.restore()
}

function figureSidePlank(ctx, cx, fy, col = '#e2e8f0') {
  // Front plank
  figurePlank(ctx, cx-10, fy-20, col)
  label(ctx, cx-10, fy+8, 'Plancha frontal', '#6b7280', 10)
  // Side plank sketch (small)
  const sx = cx+90
  line(ctx, sx-30, fy-30, sx+30, fy-30, col, 5)
  circ(ctx, sx+36, fy-30, 7, col)
  line(ctx, sx-30, fy-30, sx-35, fy, col, 2.5)
  line(ctx, sx+22, fy-30, sx+25, fy, col, 2.5)
  label(ctx, sx, fy+8, 'Lateral', '#6b7280', 10)
}

function figureMedBall(ctx, cx, fy, col = '#e2e8f0') {
  // Two figures facing — chest pass
  // Left
  circ(ctx, cx-60, fy-88, 10, col)
  line(ctx, cx-60, fy-78, cx-60, fy-48, col, 3)
  line(ctx, cx-60, fy-70, cx-40, fy-65, col, 2.5)
  line(ctx, cx-60, fy-48, cx-72, fy, col, 2.5)
  line(ctx, cx-60, fy-48, cx-48, fy, col, 2.5)
  // Right (facing)
  circ(ctx, cx+60, fy-88, 10, col)
  line(ctx, cx+60, fy-78, cx+60, fy-48, col, 3)
  line(ctx, cx+60, fy-70, cx+40, fy-65, col, 2.5)
  line(ctx, cx+60, fy-48, cx+72, fy, col, 2.5)
  line(ctx, cx+60, fy-48, cx+48, fy, col, 2.5)
  // Ball trajectory
  circ(ctx, cx, fy-66, 10, '#1e3a5f', '#3b82f6', 1.5)
  arrow(ctx, cx-48, fy-66, cx-14, fy-66, '#60a5fa', 2)
  arrow(ctx, cx+14, fy-66, cx+48, fy-66, '#60a5fa', 2, )
}

function figureHurdleJump(ctx, cx, fy) {
  // Hurdles on the ground
  for (let i = 0; i < 4; i++) {
    const hx = cx - 60 + i*38
    ctx.save(); ctx.strokeStyle='#2563eb'; ctx.lineWidth=2
    ctx.beginPath(); ctx.moveTo(hx-8, fy); ctx.lineTo(hx-8, fy-22); ctx.lineTo(hx+8, fy-22); ctx.lineTo(hx+8, fy); ctx.stroke()
    ctx.restore()
  }
  // Figure jumping over hurdle
  circ(ctx, cx-50, fy-72, 9, '#e2e8f0')
  line(ctx, cx-50, fy-63, cx-42, fy-38, '#e2e8f0', 3)
  line(ctx, cx-48, fy-55, cx-30, fy-48, '#e2e8f0', 2.5)
  line(ctx, cx-42, fy-38, cx-28, fy-18, '#e2e8f0', 2.5)
  line(ctx, cx-42, fy-38, cx-55, fy-18, '#e2e8f0', 2.5)
  arrow(ctx, cx-40, fy-68, cx-8, fy-68, '#60a5fa', 2)
  label(ctx, cx+50, fy-30, '× 4 vallas', '#6b7280', 10)
}

function figureDropJump(ctx, cx, fy) {
  // Box on left
  ctx.save(); ctx.fillStyle='#1e3a5f'; ctx.strokeStyle='#3b82f6'; ctx.lineWidth=2
  ctx.beginPath(); ctx.roundRect(cx-80, fy-45, 40, 45, 3); ctx.fill(); ctx.stroke(); ctx.restore()
  label(ctx, cx-60, fy-50, '30cm', '#3b82f6', 9)
  // Figure stepping off
  circ(ctx, cx-50, fy-95, 9, '#e2e8f0')
  line(ctx, cx-50, fy-86, cx-40, fy-55, '#e2e8f0', 3)
  arrow(ctx, cx-38, fy-58, cx-15, fy-20, '#60a5fa', 2)
  // Figure landing & jumping
  circ(ctx, cx+35, fy-95, 9, '#e2e8f0')
  line(ctx, cx+35, fy-86, cx+35, fy-60, '#e2e8f0', 3)
  line(ctx, cx+35, fy-80, cx+52, fy-65, '#e2e8f0', 2.5)
  line(ctx, cx+35, fy-60, cx+22, fy-30, '#e2e8f0', 2.5)
  line(ctx, cx+35, fy-60, cx+48, fy-30, '#e2e8f0', 2.5)
  arrow(ctx, cx+35, fy-58, cx+35, fy-90, '#4ade80', 2)
  label(ctx, cx+35, fy+12, 'Contacto mínimo', '#6b7280', 9)
}

function figureShoulderMob(ctx, cx, fy) {
  // Figure doing arm circles
  circ(ctx, cx, fy-98, 10, '#e2e8f0')
  line(ctx, cx, fy-88, cx, fy-55, '#e2e8f0', 3)
  line(ctx, cx, fy-55, cx-14, fy, '#e2e8f0', 2.5)
  line(ctx, cx, fy-55, cx+14, fy, '#e2e8f0', 2.5)
  // Arm circle arcs
  ctx.save(); ctx.strokeStyle='#60a5fa'; ctx.lineWidth=2; ctx.setLineDash([4,3])
  ctx.beginPath(); ctx.arc(cx-5, fy-78, 28, -π*0.7, π*0.5); ctx.stroke()
  ctx.beginPath(); ctx.arc(cx+5, fy-78, 28, π*0.5, -π*0.7, true); ctx.stroke()
  ctx.restore()
  // Arm positions at 12 and 6
  line(ctx, cx-5, fy-78, cx-5, fy-108, '#94a3b8', 2.5)
  line(ctx, cx+5, fy-78, cx+5, fy-50, '#94a3b8', 2.5)
  label(ctx, cx, fy+12, 'Círculos de brazos', '#6b7280', 10)
}

function figureHipMob(ctx, cx, fy) {
  // Goblet squat / deep squat
  figureSquat(ctx, cx-40, fy, '#e2e8f0', 0.9)
  // Hip opening indicator
  arrow(ctx, cx-28, fy-22, cx-55, fy-28, '#60a5fa', 1.8)
  arrow(ctx, cx-14, fy-22, cx+8, fy-28, '#60a5fa', 1.8)
  label(ctx, cx-40, fy+12, 'Goblet squat', '#6b7280', 10)
  // Side stretch
  circ(ctx, cx+55, fy-88, 9, '#e2e8f0')
  line(ctx, cx+55, fy-79, cx+55, fy-50, '#e2e8f0', 3)
  line(ctx, cx+55, fy-50, cx+35, fy, '#e2e8f0', 2.5)
  line(ctx, cx+55, fy-50, cx+75, fy-10, '#e2e8f0', 2.5)
  arrow(ctx, cx+75, fy-15, cx+88, fy-30, '#60a5fa', 1.8)
  label(ctx, cx+60, fy+12, 'Aductor', '#6b7280', 10)
}

function figureStretch(ctx, cx, fy) {
  // Quad stretch
  circ(ctx, cx-50, fy-98, 9, '#e2e8f0')
  line(ctx, cx-50, fy-88, cx-50, fy-55, '#e2e8f0', 3)
  line(ctx, cx-50, fy-55, cx-65, fy, '#e2e8f0', 2.5)
  line(ctx, cx-50, fy-55, cx-40, fy-30, '#e2e8f0', 2.5)
  line(ctx, cx-40, fy-30, cx-55, fy-8, '#e2e8f0', 2.5)
  ctx.save(); ctx.strokeStyle='#60a5fa'; ctx.lineWidth=1.5
  ctx.beginPath(); ctx.arc(cx-50, fy-50, 16, π*0.5, -π*0.3, true); ctx.stroke(); ctx.restore()
  label(ctx, cx-50, fy+12, 'Cuádriceps', '#6b7280', 10)
  // Hamstring stretch
  circ(ctx, cx+40, fy-35, 9, '#e2e8f0')
  line(ctx, cx+40, fy-26, cx+58, fy-8, '#e2e8f0', 3)
  line(ctx, cx+40, fy-26, cx+22, fy-5, '#e2e8f0', 2.5)
  line(ctx, cx+22, fy-5, cx+25, fy+5, '#e2e8f0', 2.5)
  line(ctx, cx+58, fy-8, cx+62, fy+5, '#e2e8f0', 2.5)
  arrow(ctx, cx+40, fy-15, cx+40, fy+2, '#4ade80', 1.8)
  label(ctx, cx+50, fy+16, 'Isquios', '#6b7280', 10)
}

function figureFoamRoller(ctx, cx, fy) {
  // Roller (cylinder side view)
  ctx.save(); ctx.fillStyle='#1e3a5f'; ctx.strokeStyle='#3b82f6'; ctx.lineWidth=2
  ctx.beginPath(); ctx.roundRect(cx-55, fy-18, 110, 18, 8); ctx.fill(); ctx.stroke(); ctx.restore()
  // Body on roller
  line(ctx, cx-55, fy-30, cx+55, fy-30, '#e2e8f0', 6)
  circ(ctx, cx-62, fy-30, 9, '#e2e8f0')
  line(ctx, cx-55, fy-30, cx-58, fy, '#e2e8f0', 2.5)
  line(ctx, cx+45, fy-30, cx+48, fy, '#e2e8f0', 2.5)
  // Arrows showing roll
  arrow(ctx, cx-20, fy-45, cx+20, fy-45, '#60a5fa', 2)
  arrow(ctx, cx+20, fy-45, cx-20, fy-45, '#60a5fa', 2)
  label(ctx, cx, fy+14, 'Pausa en puntos de tensión', '#6b7280', 10)
}

function figureRotatorCuff(ctx, cx, fy) {
  // Figure doing external rotation with band
  circ(ctx, cx, fy-98, 10, '#e2e8f0')
  line(ctx, cx, fy-88, cx, fy-55, '#e2e8f0', 3)
  line(ctx, cx, fy-55, cx-14, fy, '#e2e8f0', 2.5)
  line(ctx, cx, fy-55, cx+14, fy, '#e2e8f0', 2.5)
  // Elbow at 90°
  line(ctx, cx, fy-74, cx+20, fy-74, '#e2e8f0', 2.5)  // upper arm out
  line(ctx, cx+20, fy-74, cx+20, fy-54, '#94a3b8', 2.5)  // forearm down (neutral)
  line(ctx, cx+20, fy-74, cx+38, fy-60, '#4ade80', 2.5)  // forearm rotated out
  // Band
  ctx.save(); ctx.strokeStyle='#4ade80'; ctx.lineWidth=1.5; ctx.setLineDash([4,3])
  ctx.beginPath(); ctx.moveTo(cx+20, fy-56); ctx.lineTo(cx+20, fy-35); ctx.stroke(); ctx.restore()
  arrow(ctx, cx+20, fy-65, cx+38, fy-62, '#4ade80', 1.8)
  label(ctx, cx, fy+12, 'Rot. externa hombro', '#6b7280', 10)
}

function figureKneeStrength(ctx, cx, fy) {
  // Single leg squat / balance
  circ(ctx, cx-40, fy-98, 9, '#e2e8f0')
  line(ctx, cx-40, fy-88, cx-40, fy-55, '#e2e8f0', 3)
  line(ctx, cx-40, fy-55, cx-28, fy, '#e2e8f0', 2.5)
  line(ctx, cx-40, fy-55, cx-48, fy-25, '#e2e8f0', 2.5)
  line(ctx, cx-48, fy-25, cx-38, fy-8, '#e2e8f0', 2.5)
  // balance disc indicator
  ctx.save(); ctx.strokeStyle='#f59e0b'; ctx.lineWidth=2; ctx.setLineDash([3,2])
  ctx.beginPath(); ctx.ellipse(cx-30, fy, 18, 5, 0, 0, 2*π); ctx.stroke(); ctx.restore()
  label(ctx, cx-30, fy+16, 'Equilibrio', '#f59e0b', 10)
  // Single leg squat other side
  figureSquat(ctx, cx+45, fy, '#e2e8f0', 0.5)
  label(ctx, cx+45, fy+14, 'Búlgara', '#6b7280', 10)
}

// ── Draw map ────────────────────────────────────────────────

const DRAWS = {
  p01(ctx) { bg(ctx,280,220); figureSquat(ctx,100,190,'#e2e8f0',0.7)
    // Barbell on back
    line(ctx,56,108,142,108,'#94a3b8',4); circ(ctx,52,108,8,'#475569','#64748b',1.5); circ(ctx,145,108,8,'#475569','#64748b',1.5)
    arrow(ctx,100,185,100,155,'#60a5fa',2); arrow(ctx,100,155,100,185,'#4ade80',2)
    label(ctx,100,205,'4×6-8 reps · 75-85% RM','#6b7280',10)
    label(ctx,200,100,'SENTADILLA','#94a3b8',11) },

  p02(ctx) { bg(ctx,280,220); figureBench(ctx,140,175)
    arrow(ctx,140,145,140,115,'#60a5fa',2); arrow(ctx,140,115,140,145,'#4ade80',2)
    label(ctx,140,208,'4×8-10 reps · Press de banca','#6b7280',10) },

  p03(ctx) { bg(ctx,280,220); figureRow(ctx,140,190)
    label(ctx,140,208,'4×8-10 reps · Remo con barra','#6b7280',10) },

  p04(ctx) { bg(ctx,280,220); figureHinge(ctx,140,190)
    arrow(ctx,140,160,140,140,'#60a5fa',2); arrow(ctx,140,140,140,160,'#4ade80',2)
    label(ctx,140,208,'3×10-12 reps · Peso muerto rumano','#6b7280',10) },

  p05(ctx) { bg(ctx,280,220); figureLunge(ctx,140,195)
    arrow(ctx,110,155,110,135,'#60a5fa',2)
    label(ctx,140,210,'3×12 reps por pierna · Zancadas','#6b7280',10) },

  p06(ctx) { bg(ctx,280,220)
    // Seated pulldown
    circ(ctx,140,78,10,'#e2e8f0')
    line(ctx,140,88,140,128,'#e2e8f0',3)
    line(ctx,140,105,118,90,'#e2e8f0',2.5); line(ctx,140,105,162,90,'#e2e8f0',2.5)
    line(ctx,140,128,128,180,'#e2e8f0',2.5); line(ctx,140,128,152,180,'#e2e8f0',2.5)
    // Pulldown bar
    line(ctx,100,65,180,65,'#94a3b8',4); circ(ctx,100,65,6,'#475569','#64748b',1.5); circ(ctx,180,65,6,'#475569','#64748b',1.5)
    arrow(ctx,100,62,118,88,'#60a5fa',2); arrow(ctx,180,62,162,88,'#60a5fa',2)
    // Bench
    ctx.save(); ctx.fillStyle='#334155'; ctx.strokeStyle='#475569'; ctx.lineWidth=1.5
    ctx.beginPath(); ctx.roundRect(122,178,36,12,3); ctx.fill(); ctx.stroke(); ctx.restore()
    label(ctx,140,208,'4×10-12 · Jalón + Remo · Portero','#6b7280',10) },

  p07(ctx) { bg(ctx,280,220); figureBoxJump(ctx,100,192)
    label(ctx,140,210,'4×6-8 reps · Box jumps','#6b7280',10) },

  p08(ctx) { bg(ctx,280,220); figureMedBall(ctx,140,190)
    label(ctx,140,208,'4×10 reps · Balón medicinal','#6b7280',10) },

  p09(ctx) { bg(ctx,280,220); figureJumpSqt(ctx,140,190)
    label(ctx,140,210,'4×8-10 reps · Squat jumps','#6b7280',10) },

  p10(ctx) { bg(ctx,280,220); figureHurdleJump(ctx,140,185)
    label(ctx,140,208,'4 series · Portero · Saltos laterales','#6b7280',10) },

  p11(ctx) { bg(ctx,280,220); figureDropJump(ctx,140,185)
    label(ctx,140,208,'4×5-6 reps · Pliometría: drop jumps','#6b7280',10) },

  p12(ctx) { bg(ctx,280,220); figureSprintStart(ctx,60,170)
    label(ctx,140,208,'6-8×30m · 2 min recuperación','#6b7280',10) },

  p13(ctx) { bg(ctx,280,220); figureLadder(ctx,140,185)
    label(ctx,140,208,'3 series × patrón · Escalera agilidad','#6b7280',10) },

  p14(ctx) { bg(ctx,280,220); figureTdrill(ctx,140,182)
    label(ctx,140,208,'6 series cronometradas · Circuito en T','#6b7280',10) },

  p15(ctx) { bg(ctx,280,220); figureSprintStart(ctx,55,170)
    // distance markers
    ;[[45,'10m'],[80,'20m'],[130,'30m']].forEach(([dx,lbl]) => {
      ctx.save(); ctx.fillStyle='#f97316'; ctx.beginPath(); ctx.arc(60+dx,170,4,0,2*π); ctx.fill(); ctx.restore()
      label(ctx,60+dx,182,lbl,'#f97316',9)
    })
    label(ctx,140,208,'4-5 reps · Sprint 10-20-30m','#6b7280',10) },

  p16(ctx) { bg(ctx,280,220); figureRun(ctx,140,175)
    // heart rate zone
    circ(ctx,220,60,25,'#0f2744','#22c55e',2)
    label(ctx,220,55,'60-','#22c55e',10); label(ctx,220,68,'70%','#22c55e',10)
    label(ctx,218,40,'FC','#6b7280',9)
    arrow(ctx,60,175,230,175,'#1e3a5f',1.5)
    label(ctx,140,208,'25-35 min · Carrera aeróbica','#6b7280',10) },

  p17(ctx) { bg(ctx,280,220); figureInterval(ctx,140,170)
    label(ctx,140,208,'10-15 reps · Interval 30-30','#6b7280',10) },

  p18(ctx) { bg(ctx,280,220); figureCircuit(ctx,140,170)
    label(ctx,140,208,'3 vueltas × 5 estaciones','#6b7280',10) },

  p19(ctx) { bg(ctx,280,220); figureFartlek(ctx,140,160)
    label(ctx,140,208,'20-25 min · Fartlek libre','#6b7280',10) },

  p20(ctx) { bg(ctx,280,220); figureSidePlank(ctx,100,175)
    label(ctx,140,210,'3×45-60s frontal · 3×30-45s lateral','#6b7280',10) },

  p21(ctx) { bg(ctx,280,220); figureRussianTwist(ctx,140,175)
    label(ctx,140,208,'3×20 reps · Russian twist','#6b7280',10) },

  p22(ctx) { bg(ctx,280,220); figurePallof(ctx,140,185)
    label(ctx,140,210,'3×12 reps/lado · Pallof press','#6b7280',10) },

  p23(ctx) { bg(ctx,280,220); figureDeadbug(ctx,140,175)
    label(ctx,140,208,'3×10 reps/lado · Dead bug','#6b7280',10) },

  p24(ctx) { bg(ctx,280,220)
    // TRX suspension
    line(ctx,110,20,110,55,'#94a3b8',3); line(ctx,170,20,170,55,'#94a3b8',3)
    circ(ctx,110,58,6,'#475569','#94a3b8',2); circ(ctx,170,58,6,'#475569','#94a3b8',2)
    // Figure hanging
    circ(ctx,140,78,10,'#e2e8f0')
    line(ctx,140,88,140,120,'#e2e8f0',3)
    line(ctx,140,100,113,62,'#e2e8f0',2.5); line(ctx,140,100,167,62,'#e2e8f0',2.5)
    // Legs tucked
    line(ctx,140,120,125,148,'#e2e8f0',2.5); line(ctx,125,148,130,165,'#e2e8f0',2.5)
    line(ctx,140,120,155,148,'#e2e8f0',2.5); line(ctx,155,148,150,165,'#e2e8f0',2.5)
    arrow(ctx,140,125,140,118,'#60a5fa',2)
    label(ctx,140,208,'3×12-15 reps · Abdominales TRX','#6b7280',10) },

  p25(ctx) { bg(ctx,280,220); figureShoulderMob(ctx,140,185)
    label(ctx,140,210,'2-3×10 reps · Movilidad hombro','#6b7280',10) },

  p26(ctx) { bg(ctx,280,220); figureHipMob(ctx,140,190)
    label(ctx,140,210,'2×10 reps · Movilidad cadera','#6b7280',10) },

  p27(ctx) { bg(ctx,280,220); figureStretch(ctx,140,180)
    label(ctx,140,208,'30-45s cada músculo · Estiramientos','#6b7280',10) },

  p28(ctx) { bg(ctx,280,220); figureFoamRoller(ctx,140,175)
    label(ctx,140,208,'Foam roller · Liberación miofascial','#6b7280',10) },

  p29(ctx) { bg(ctx,280,220); figureRotatorCuff(ctx,140,185)
    label(ctx,140,210,'3×15-20 reps · Manguito rotador','#6b7280',10) },

  p30(ctx) { bg(ctx,280,220); figureKneeStrength(ctx,140,192)
    label(ctx,140,210,'3×12-15 reps · Prevención rodilla','#6b7280',10) },
}

// ── Component ────────────────────────────────────────────────

export default function PhysicalDiagram({ id }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !DRAWS[id]) return
    DRAWS[id](canvas.getContext('2d'))
  }, [id])

  if (!DRAWS[id]) return null

  return (
    <canvas
      ref={ref}
      width={280}
      height={220}
      style={{ width: '100%', height: 'auto', borderRadius: 10, display: 'block', margin: '12px 0 6px' }}
    />
  )
}
