// duration in minutes · players = minimum needed · difficulty 1-3

export const EXERCISES = [
  // ── PISTA ──────────────────────────────────────────────────────
  {
    id: 'c01',
    type: 'court',
    category: { es: 'Calentamiento', en: 'Warm-up' },
    name:     { es: 'Pases en movimiento', en: 'Moving passes' },
    desc: {
      es: 'En parejas, pases continuos desplazándose por la pista. Alterna pase de muñeca, pase largo y bote. El receptor debe moverse hacia el balón para crear hábito de desmarcaje.',
      en: 'In pairs, continuous passes while moving across the court. Alternate wrist pass, long pass and bounce pass. Receiver should move toward the ball to build off-ball habits.',
    },
    duration: 10, players: 2, difficulty: 1,
  },
  {
    id: 'c02',
    type: 'court',
    category: { es: 'Lanzamiento', en: 'Shooting' },
    name:     { es: 'Lanzamientos desde 9 metros', en: '9m shooting series' },
    desc: {
      es: 'Series de lanzamientos desde distintas posiciones en la línea de 9 metros. 5 lanzamientos por posición (derecha, centro, izquierda). Trabajar potencia, precisión y variación de zona de portería.',
      en: 'Shooting series from different positions on the 9m line. 5 shots per position (right, center, left). Focus on power, accuracy and varying goal zones.',
    },
    duration: 15, players: 2, difficulty: 2,
  },
  {
    id: 'c03',
    type: 'court',
    category: { es: 'Ataque', en: 'Attack' },
    name:     { es: 'Penetración 1vs1', en: '1v1 penetration' },
    desc: {
      es: 'Atacante vs defensor, salida desde 9 metros. El atacante tiene 5 segundos para llegar al área y lanzar. El defensor trabaja posición y desplazamiento lateral. Rotar roles cada 3 intentos.',
      en: 'Attacker vs defender, starting from 9m. The attacker has 5 seconds to reach the area and shoot. Defender works on positioning and lateral movement. Rotate roles every 3 attempts.',
    },
    duration: 15, players: 2, difficulty: 2,
  },
  {
    id: 'c04',
    type: 'court',
    category: { es: 'Transición', en: 'Transition' },
    name:     { es: '2vs1 contraataque', en: '2v1 fast break' },
    desc: {
      es: 'Dos atacantes contra un defensor en superioridad numérica. El objetivo es tomar la decisión correcta: lanzar si hay ventaja, pasar si el defensor cierra. Trabajar comunicación y velocidad de ejecución.',
      en: 'Two attackers against one defender in numerical superiority. Goal: make the right decision — shoot if open, pass if defender closes. Work on communication and execution speed.',
    },
    duration: 20, players: 3, difficulty: 2,
  },
  {
    id: 'c05',
    type: 'court',
    category: { es: 'Portería', en: 'Goalkeeping' },
    name:     { es: 'Estiradas y reacción de portero/a', en: 'Goalkeeper diving & reaction' },
    desc: {
      es: 'Lanzamientos dirigidos a las esquinas de la portería a ritmo progresivo. El/la portero/a trabaja las estiradas laterales, la técnica de caída y la recuperación rápida entre lanzamientos. Empezar lento y aumentar frecuencia.',
      en: 'Shots aimed at goal corners at progressive pace. Goalkeeper works on lateral dives, falling technique and quick recovery between shots. Start slow, increase frequency.',
    },
    duration: 20, players: 2, difficulty: 2,
  },
  {
    id: 'c06',
    type: 'court',
    category: { es: 'Ataque', en: 'Attack' },
    name:     { es: 'Juego de extremos', en: 'Wing play combination' },
    desc: {
      es: 'Combinación central–pivote–extremo. El extremo recibe en carrera y lanza desde ángulo. Trabajar el timing del pase, el bloqueo del pivote y la entrada en el ángulo. Alternar lado derecho e izquierdo.',
      en: 'Center–pivot–wing combination. Wing receives on the run and shoots from the angle. Work on pass timing, pivot block and angle entry. Alternate right and left side.',
    },
    duration: 20, players: 4, difficulty: 2,
  },
  {
    id: 'c07',
    type: 'court',
    category: { es: 'Defensa', en: 'Defense' },
    name:     { es: 'Defensa 6-0 coordinada', en: 'Coordinated 6-0 defense' },
    desc: {
      es: 'Trabajo de posicionamiento colectivo en bloque 6-0. Énfasis en desplazamientos laterales coordinados, anticipación al pase y comunicación verbal entre defensores. El equipo atacante puede mover el balón libremente.',
      en: 'Collective positioning work in 6-0 block. Emphasis on coordinated lateral movement, pass anticipation and verbal communication between defenders. Attacking team can move the ball freely.',
    },
    duration: 25, players: 8, difficulty: 3,
  },
  {
    id: 'c08',
    type: 'court',
    category: { es: 'Ataque', en: 'Attack' },
    name:     { es: '3vs3 posicional en media pista', en: '3v3 half-court positional' },
    desc: {
      es: 'Situación de juego reducido 3vs3 en media pista. Fomenta la toma de decisiones, los bloqueos y la movilidad sin balón. El equipo que marca 3 goles cede el turno al siguiente grupo.',
      en: 'Reduced game 3v3 in half court. Encourages decision-making, blocking and off-ball movement. The team that scores 3 goals gives way to the next group.',
    },
    duration: 25, players: 6, difficulty: 3,
  },
  {
    id: 'c09',
    type: 'court',
    category: { es: 'Transición', en: 'Transition' },
    name:     { es: 'Transición defensa–ataque', en: 'Defense-to-attack transition' },
    desc: {
      es: 'Recuperación del balón en zona defensiva y salida rápida en contraataque organizado. Dos carriles laterales + central. Énfasis en velocidad de transición, la línea de pase inicial y la finalización.',
      en: 'Ball recovery in defensive zone and quick organized counterattack. Two wide lanes + center. Emphasis on transition speed, initial pass line and finishing.',
    },
    duration: 25, players: 8, difficulty: 3,
  },
  {
    id: 'c10',
    type: 'court',
    category: { es: 'Portería', en: 'Goalkeeping' },
    name:     { es: 'Serie de 7 metros (penaltis)', en: 'Penalty (7m) series' },
    desc: {
      es: 'El/la portero/a recibe una serie de 7 metros desde distintos lanzadores. Trabajo de lectura del lanzador, anticipación y técnica de parada de penalti. Llevar estadísticas de paradas.',
      en: 'Goalkeeper faces a series of 7m penalties from different shooters. Work on reading the shooter, anticipation and penalty-stop technique. Track save statistics.',
    },
    duration: 15, players: 3, difficulty: 2,
  },

  // ── FÍSICO ─────────────────────────────────────────────────────
  {
    id: 'p01',
    type: 'physical',
    category: { es: 'Calentamiento', en: 'Warm-up' },
    name:     { es: 'Movilidad articular', en: 'Joint mobility' },
    desc: {
      es: 'Rotaciones progresivas de tobillos, rodillas, caderas, hombros y muñecas. Círculos de cuello y activación de escápulas. Imprescindible al inicio de cualquier sesión para prevenir lesiones.',
      en: 'Progressive rotations of ankles, knees, hips, shoulders and wrists. Neck circles and scapular activation. Essential at the start of any session to prevent injuries.',
    },
    duration: 10, players: 1, difficulty: 1,
  },
  {
    id: 'p02',
    type: 'physical',
    category: { es: 'Velocidad', en: 'Speed' },
    name:     { es: 'Sprints cortos con recuperación', en: 'Short sprints with recovery' },
    desc: {
      es: 'Series de 10–20–30 m con recuperación completa entre repeticiones (walk back). 6–8 repeticiones totales. Trabajar aceleración inicial y velocidad máxima, que son los patrones dominantes en balonmano.',
      en: '10–20–30m series with full recovery between reps (walk back). 6–8 total reps. Work on initial acceleration and top speed, the dominant patterns in handball.',
    },
    duration: 20, players: 1, difficulty: 2,
  },
  {
    id: 'p03',
    type: 'physical',
    category: { es: 'Agilidad', en: 'Agility' },
    name:     { es: 'Escalera de coordinación', en: 'Agility ladder' },
    desc: {
      es: 'Patrones de movimiento en escalera de agilidad: dos pies, lateral cruzado, entrada–salida. 3 series de 4 repeticiones por patrón. Fundamental para cambios de dirección rápidos y coordinación pierna–ojo.',
      en: 'Movement patterns on agility ladder: two feet, lateral crossover, in-out. 3 sets of 4 reps per pattern. Essential for quick direction changes and leg-eye coordination.',
    },
    duration: 15, players: 1, difficulty: 2,
  },
  {
    id: 'p04',
    type: 'physical',
    category: { es: 'Fuerza', en: 'Strength' },
    name:     { es: 'Sentadillas explosivas', en: 'Explosive squats' },
    desc: {
      es: '4 series de 8 repeticiones. Sentadilla profunda con salto explosivo al subir. Aterriza de forma controlada flexionando rodillas. Trabaja la potencia de piernas necesaria para el salto en el lanzamiento en suspensión.',
      en: '4 sets of 8 reps. Deep squat with explosive jump on the way up. Land in a controlled manner by bending your knees. Builds the leg power needed for jump shots.',
    },
    duration: 20, players: 1, difficulty: 2,
  },
  {
    id: 'p05',
    type: 'physical',
    category: { es: 'Fuerza', en: 'Strength' },
    name:     { es: 'Circuito de core', en: 'Core circuit' },
    desc: {
      es: '3 rondas: plancha frontal 45 s · plancha lateral 30 s cada lado · puente de glúteos 15 reps · rotaciones rusas con balón medicinal 3 kg, 20 reps. Descanso 60 s entre rondas. Base para la estabilidad en el lanzamiento.',
      en: '3 rounds: front plank 45 s · side plank 30 s each side · glute bridge 15 reps · Russian twists with 3 kg medicine ball, 20 reps. 60 s rest between rounds. Foundation for throwing stability.',
    },
    duration: 25, players: 1, difficulty: 2,
  },
  {
    id: 'p06',
    type: 'physical',
    category: { es: 'Fuerza', en: 'Strength' },
    name:     { es: 'Lanzamientos con balón medicinal', en: 'Medicine ball throws' },
    desc: {
      es: 'En parejas con balón medicinal de 3–4 kg. Lanzamientos de pecho x12, sobre cabeza x12, con giro de cadera x10 por lado. 3 series. Trabaja la cadena cinética del lanzamiento y la potencia de brazo.',
      en: 'In pairs with 3–4 kg medicine ball. Chest throws x12, overhead x12, hip-rotation throws x10 per side. 3 sets. Works the throwing kinetic chain and arm power.',
    },
    duration: 20, players: 2, difficulty: 2,
  },
  {
    id: 'p07',
    type: 'physical',
    category: { es: 'Potencia', en: 'Power' },
    name:     { es: 'Pliometría de salto', en: 'Jump plyometrics' },
    desc: {
      es: '4 series: saltos al cajón (40–50 cm) x6 · saltos laterales x10 · multisaltos con dos pies x15 m. Descanso completo entre series. Mejora la potencia de salto para el lanzamiento en suspensión y los bloqueos.',
      en: '4 sets: box jumps (40–50 cm) x6 · lateral jumps x10 · multi-jumps two feet x15 m. Full rest between sets. Improves jump power for jump shots and blocks.',
    },
    duration: 20, players: 1, difficulty: 3,
  },
  {
    id: 'p08',
    type: 'physical',
    category: { es: 'Resistencia', en: 'Endurance' },
    name:     { es: 'Carrera continua aeróbica', en: 'Aerobic continuous run' },
    desc: {
      es: 'Carrera a ritmo moderado (60–70 % FCmáx, puedes mantener conversación). Construye la base aeróbica necesaria para sostener el nivel de intensidad en los últimos minutos del partido.',
      en: 'Running at moderate pace (60–70 % HRmax, you can hold a conversation). Builds the aerobic base needed to sustain intensity in the final minutes of the match.',
    },
    duration: 30, players: 1, difficulty: 1,
  },
  {
    id: 'p09',
    type: 'physical',
    category: { es: 'Agilidad', en: 'Agility' },
    name:     { es: 'Cambios de dirección con conos', en: 'Cone direction changes' },
    desc: {
      es: 'Circuitos en T (5–10–5 m), en zig-zag y en L. 6 repeticiones con walk-back de recuperación. Simula los patrones de movimiento característicos del balonmano: arranques, frenadas y giros.',
      en: 'T-cone (5–10–5 m), zig-zag and L-shaped circuits. 6 reps with walk-back recovery. Simulates handball-specific movement patterns: sprints, stops and turns.',
    },
    duration: 20, players: 1, difficulty: 2,
  },
  {
    id: 'p10',
    type: 'physical',
    category: { es: 'Recuperación', en: 'Recovery' },
    name:     { es: 'Vuelta a la calma y estiramientos', en: 'Cool-down & stretching' },
    desc: {
      es: 'Estiramientos estáticos de isquiotibiales, cuádriceps, gemelos, flexores de cadera, pectorales y hombros. Mínimo 30 segundos por grupo muscular. Esencial tras cada sesión para reducir agujetas y prevenir lesiones.',
      en: 'Static stretching of hamstrings, quadriceps, calves, hip flexors, chest and shoulders. Minimum 30 seconds per muscle group. Essential after each session to reduce soreness and prevent injuries.',
    },
    duration: 15, players: 1, difficulty: 1,
  },
]
