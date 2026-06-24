// type: 'court' | 'physical'
// position (court): 'all' | 'goalkeeper' | 'wing' | 'pivot' | 'back'
// subtype (physical): 'strength' | 'power' | 'speed' | 'endurance' | 'core' | 'mobility'
// difficulty: 1=basic 2=medium 3=advanced

export const EXERCISES = [
  // ─────────────────────────────────────────────────────────────
  // COURT — ALL POSITIONS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'c01', type: 'court', position: 'all',
    category: { es: 'Pase', en: 'Passing' },
    name: { es: 'Pases en movimiento por parejas', en: 'Partner passing on the move' },
    desc: {
      es: 'Dos jugadores se desplazan en paralelo de un lado a otro de la pista pasándose el balón. Variar el tipo de pase: por arriba, por abajo, de béisbol. Mantener la cadencia y el ritmo sin perder velocidad de desplazamiento.',
      en: 'Two players move in parallel across the court passing the ball. Vary pass type: overarm, underarm, baseball. Maintain rhythm without losing movement speed.',
    },
    duration: 10, players: 2, difficulty: 1,
  },
  {
    id: 'c02', type: 'court', position: 'all',
    category: { es: 'Pase', en: 'Passing' },
    name: { es: 'Triángulo de pases a velocidad', en: 'Triangle passing at speed' },
    desc: {
      es: 'Tres jugadores en triángulo pasan el balón en dirección de las agujas del reloj y a la inversa. Aumentar progresivamente la velocidad. Variante: añadir un segundo balón.',
      en: 'Three players in a triangle pass the ball clockwise then counter-clockwise. Progressively increase speed. Variant: add a second ball.',
    },
    duration: 8, players: 3, difficulty: 1,
  },
  {
    id: 'c03', type: 'court', position: 'all',
    category: { es: 'Lanzamiento', en: 'Shooting' },
    name: { es: 'Lanzamientos desde 9 metros', en: '9-metre shooting' },
    desc: {
      es: 'Jugador recibe de espaldas a portería, se gira y lanza desde distintas posiciones del arco de 9 metros. Trabajar el lanzamiento en apoyo y en salto. El portero trabaja la lectura del lanzamiento.',
      en: 'Player receives with back to goal, turns and shoots from different positions on the 9m arc. Work both grounded and jump shots. Goalkeeper works on reading the shot.',
    },
    duration: 12, players: 2, difficulty: 2,
  },
  {
    id: 'c04', type: 'court', position: 'all',
    category: { es: 'Contraataque', en: 'Fast break' },
    name: { es: '2v1 contraataque', en: '2v1 fast break' },
    desc: {
      es: 'Dos atacantes contra un defensor. Los atacantes parten desde campo propio, el defensor sale desde la línea de 9m. Los atacantes deben decidir entre el pase al compañero libre o el lanzamiento. Rotar los roles.',
      en: 'Two attackers vs one defender. Attackers start from own half, defender starts at 9m line. Attackers must decide between passing or shooting. Rotate roles.',
    },
    duration: 12, players: 3, difficulty: 2,
  },
  {
    id: 'c05', type: 'court', position: 'all',
    category: { es: 'Contraataque', en: 'Fast break' },
    name: { es: '3v2 contraataque con transición', en: '3v2 fast break with transition' },
    desc: {
      es: 'Tres atacantes contra dos defensores. Al terminar la acción, los defensores se convierten en atacantes y un atacante regresa a defender. Mantener el juego continuo.',
      en: 'Three attackers vs two defenders. After each action, defenders become attackers and one attacker drops back to defend. Keep play continuous.',
    },
    duration: 15, players: 5, difficulty: 2,
  },
  {
    id: 'c06', type: 'court', position: 'all',
    category: { es: 'Ataque posicional', en: 'Positional attack' },
    name: { es: 'Juego 3v3 en espacio reducido', en: '3v3 in reduced space' },
    desc: {
      es: 'Tres atacantes contra tres defensores en la zona entre la línea de 6m y los 9m. Trabajar la movilidad sin balón, los bloqueos y la comunicación.',
      en: 'Three attackers vs three defenders between the 6m and 9m lines. Work on off-ball movement, screens and communication.',
    },
    duration: 15, players: 6, difficulty: 2,
  },
  {
    id: 'c07', type: 'court', position: 'all',
    category: { es: 'Ataque posicional', en: 'Positional attack' },
    name: { es: 'Juego 6v6 libre', en: '6v6 free play' },
    desc: {
      es: 'Partido de entrenamiento con reglas normales. El entrenador puede parar el juego para corregir posiciones o situaciones tácticas. Cada equipo ataca 5 minutos y luego cambia.',
      en: 'Training match with normal rules. Coach can stop play to correct positions or tactical situations. Each team attacks for 5 minutes then switches.',
    },
    duration: 20, players: 12, difficulty: 2,
  },
  {
    id: 'c08', type: 'court', position: 'all',
    category: { es: 'Defensa', en: 'Defence' },
    name: { es: 'Defensa 6-0 y pressing colectivo', en: '6-0 defence and collective pressing' },
    desc: {
      es: 'Seis defensores en línea de 6m practican desplazamientos laterales, comunicación y cierre de huecos. Posteriormente avanzan a 9m para practicar el pressing alto.',
      en: 'Six defenders on the 6m line practice lateral movements, communication and closing gaps. Then advance to 9m to practice high pressing.',
    },
    duration: 15, players: 6, difficulty: 2,
  },
  {
    id: 'c09', type: 'court', position: 'all',
    category: { es: 'Defensa', en: 'Defence' },
    name: { es: 'Defensa individual y recuperación', en: 'Man-to-man marking and recovery' },
    desc: {
      es: 'Cada defensor marca un atacante específico. Al perder el balón, los atacantes transicionan rápidamente a defensa. Trabajar la comunicación y los cambios de marca.',
      en: 'Each defender marks a specific attacker for the entire possession. When the ball is lost, attackers quickly transition to defence. Work on defensive communication and switching.',
    },
    duration: 12, players: 8, difficulty: 3,
  },
  {
    id: 'c10', type: 'court', position: 'all',
    category: { es: '7 metros', en: '7-metre throw' },
    name: { es: 'Serie de penaltis (7 metros)', en: '7-metre penalty series' },
    desc: {
      es: 'Cada jugador lanza 5 penaltis seguidos. El portero trabaja la anticipación y el lanzador la colocación. Competición: primer jugador en anotar 5 gana.',
      en: 'Each player takes 5 consecutive penalties. Goalkeeper works on anticipation, shooter on placement. Competition: first player to score 5 wins.',
    },
    duration: 10, players: 2, difficulty: 1,
  },
  {
    id: 'c11', type: 'court', position: 'all',
    category: { es: 'Transición', en: 'Transition' },
    name: { es: 'Transición defensa-ataque (circuito)', en: 'Defence-to-attack transition circuit' },
    desc: {
      es: 'Tras una acción defensiva (parada o robo), el equipo sale en contraataque organizado en menos de 3 segundos. El entrenador señala cuándo y hacia qué lado. Trabajar la comunicación y la velocidad de cambio de mentalidad.',
      en: 'After a defensive action (save or steal), the team launches an organised fast break in under 3 seconds. Coach signals when and which side. Work on communication and speed of mindset switch.',
    },
    duration: 15, players: 8, difficulty: 2,
  },

  // ─────────────────────────────────────────────────────────────
  // COURT — WINGS (EXTREMOS)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'c12', type: 'court', position: 'wing',
    category: { es: 'Extremo', en: 'Wing' },
    name: { es: 'Lanzamiento en caída desde el extremo', en: 'Wing falling shot' },
    desc: {
      es: 'El extremo recibe el pase en carrera desde el lateral, salta hacia el área y lanza en caída antes de tocar el suelo dentro. El portero trabaja la salida para reducir el ángulo. Repetir desde ambas bandas.',
      en: 'Wing receives a pass at full sprint from the sideline, jumps towards the area and releases a falling shot before landing inside. Goalkeeper narrows the angle. Repeat from both wings.',
    },
    duration: 12, players: 2, difficulty: 2,
  },
  {
    id: 'c13', type: 'court', position: 'wing',
    category: { es: 'Extremo', en: 'Wing' },
    name: { es: 'Combinación central-extremo con cruce', en: 'Centre-wing combination with crossover' },
    desc: {
      es: 'El central inicia el ataque y realiza un cruce con el extremo que sale en carrera hacia el área. El extremo puede recibir y lanzar o dejar el balón al central que continúa. Trabaja la sincronización y el timing.',
      en: 'Centre starts the attack and performs a crossover with the wing who sprints towards the area. The wing can receive and shoot or leave the ball for the continuing centre. Works on synchronisation and timing.',
    },
    duration: 10, players: 3, difficulty: 2,
  },
  {
    id: 'c14', type: 'court', position: 'wing',
    category: { es: 'Extremo', en: 'Wing' },
    name: { es: 'Extremo: recepción alta y finalización', en: 'Wing: high reception and finishing' },
    desc: {
      es: 'Lanzador desde línea de fondo pasa alto al extremo que viene en carrera. El extremo controla el balón en suspensión y lanza antes de cruzar la línea de área. Énfasis en el control corporal en el aire.',
      en: 'Thrower from the end line passes high to the wing coming at full speed. Wing controls the ball in the air and shoots before crossing the crease line. Emphasis on body control in the air.',
    },
    duration: 12, players: 2, difficulty: 3,
  },
  {
    id: 'c15', type: 'court', position: 'wing',
    category: { es: 'Extremo', en: 'Wing' },
    name: { es: 'Lanzamiento en suspensión desde el ángulo', en: 'Jump shot from the corner angle' },
    desc: {
      es: 'El extremo trabaja el lanzamiento en suspensión desde el ángulo estrecho. Variantes: directo a portería, picado al suelo, colocado al palo largo. El portero trabaja la posición ante el ángulo cerrado.',
      en: 'Wing works on jump shots from a tight angle. Variations: direct, bouncing, placed at far post. Goalkeeper works on positioning for narrow angles.',
    },
    duration: 10, players: 2, difficulty: 2,
  },
  {
    id: 'c16', type: 'court', position: 'wing',
    category: { es: 'Extremo', en: 'Wing' },
    name: { es: 'Extremo: 1v1 contra defensor lateral', en: 'Wing: 1v1 against flank defender' },
    desc: {
      es: 'El extremo parte desde la posición habitual y debe superar al defensor lateral que le cierra el paso hacia el área. Trabajar el cambio de ritmo, el finteo y el lanzamiento con ángulo muy reducido.',
      en: 'Wing starts from their usual position and must beat the flank defender closing the path to the area. Work on pace change, faking and shooting from a very tight angle.',
    },
    duration: 10, players: 2, difficulty: 3,
  },

  // ─────────────────────────────────────────────────────────────
  // COURT — GOALKEEPER (PORTERO)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'c17', type: 'court', position: 'goalkeeper',
    category: { es: 'Portero', en: 'Goalkeeper' },
    name: { es: 'Posicionamiento y salida al ángulo', en: 'Positioning and angle narrowing' },
    desc: {
      es: 'Un compañero mueve el balón por el arco y el portero ajusta su posición continuamente. Cuando se lanza, el portero practica la salida para cerrar el ángulo. Fundamental para la lectura del juego.',
      en: 'A partner moves the ball around the arc and the goalkeeper continuously adjusts position. When the shot comes, the goalkeeper practises stepping out to close the angle.',
    },
    duration: 15, players: 2, difficulty: 1,
  },
  {
    id: 'c18', type: 'court', position: 'goalkeeper',
    category: { es: 'Portero', en: 'Goalkeeper' },
    name: { es: 'Paradas en serie (reacción)', en: 'Series saves (reaction)' },
    desc: {
      es: 'Dos o tres lanzadores disparan al portero en rápida sucesión desde distintas posiciones. El portero trabaja la recuperación de posición entre parada y parada. Series de 5 disparos con 30 segundos de descanso.',
      en: 'Two or three throwers shoot at the goalkeeper in quick succession from different positions. Goalkeeper works on recovering position between saves. Sets of 5 shots with 30 seconds rest.',
    },
    duration: 12, players: 3, difficulty: 2,
  },
  {
    id: 'c19', type: 'court', position: 'goalkeeper',
    category: { es: 'Portero', en: 'Goalkeeper' },
    name: { es: 'Portero: desplazamientos laterales y parada', en: 'Goalkeeper: lateral movements and save' },
    desc: {
      es: 'El portero toca el palo derecho, luego el izquierdo y en cualquier momento recibe un disparo. Trabaja la agilidad lateral y la preparación ante el lanzamiento. Variante: añadir salida a 9m.',
      en: 'Goalkeeper touches the right post, then the left post, and at any moment receives a shot. Works on lateral agility and readiness. Variant: add a step out to 9m after the movement.',
    },
    duration: 10, players: 2, difficulty: 2,
  },
  {
    id: 'c20', type: 'court', position: 'goalkeeper',
    category: { es: 'Portero', en: 'Goalkeeper' },
    name: { es: 'Portero: lectura de 1v1 ante pivote', en: 'Goalkeeper: reading pivot 1v1' },
    desc: {
      es: 'El pivote recibe espaldas a portería y puede girar y lanzar o asistir a un lateral. El portero debe leer las caderas del pivote y anticipar la acción. Trabaja la toma de decisiones rápida.',
      en: 'Pivot receives with back to goal and can turn and shoot or assist a winger. Goalkeeper must read the pivot\'s hips and anticipate the action. Works on fast decision-making.',
    },
    duration: 12, players: 3, difficulty: 3,
  },
  {
    id: 'c21', type: 'court', position: 'goalkeeper',
    category: { es: 'Portero', en: 'Goalkeeper' },
    name: { es: 'Salida del portero en contraataque', en: 'Goalkeeper launch in fast break' },
    desc: {
      es: 'Tras una parada, el portero lanza largo a un compañero que sale en contraataque. Trabajar el lanzamiento preciso con la mano y el control del balón bajo presión. Variante: bote y volea.',
      en: 'After a save, the goalkeeper launches long to a teammate starting a fast break. Work on accurate throwing under pressure. Variant: bounce and volley the ball.',
    },
    duration: 10, players: 2, difficulty: 2,
  },
  {
    id: 'c22', type: 'court', position: 'goalkeeper',
    category: { es: 'Portero', en: 'Goalkeeper' },
    name: { es: 'Portero: paradas al suelo (extremos)', en: 'Goalkeeper: ground saves (wing shots)' },
    desc: {
      es: 'El portero trabaja específicamente las paradas a ras de suelo desde el ángulo. Lanzadores desde la posición de extremo (derecho e izquierdo) a máxima velocidad. Énfasis en la caída controlada y la recuperación.',
      en: 'Goalkeeper specifically works on ground-level saves from the angle. Throwers from both wing positions at maximum speed. Emphasis on controlled fall and recovery.',
    },
    duration: 12, players: 2, difficulty: 2,
  },

  // ─────────────────────────────────────────────────────────────
  // COURT — PIVOT (PIVOTE)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'c23', type: 'court', position: 'pivot',
    category: { es: 'Pivote', en: 'Pivot' },
    name: { es: 'Pivote: giro y lanzamiento', en: 'Pivot: turn and shoot' },
    desc: {
      es: 'El pivote recibe el balón en línea de 6m con la espalda al portero. Trabajar el giro rápido (derecha e izquierda) y el lanzamiento inmediato antes de que el defensor recupere posición. Series de 10 repeticiones.',
      en: 'Pivot receives the ball on the 6m line with back to goal. Work on quick turns (right and left) and immediate shot before the defender recovers. Sets of 10 reps.',
    },
    duration: 10, players: 2, difficulty: 2,
  },
  {
    id: 'c24', type: 'court', position: 'pivot',
    category: { es: 'Pivote', en: 'Pivot' },
    name: { es: 'Pivote: bloqueo y liberación del central', en: 'Pivot: screen and release for centre' },
    desc: {
      es: 'El pivote coloca un bloqueo estático al defensor del central. El central aprovecha el bloqueo para penetrar o lanzar. El pivote, tras el bloqueo, se libera hacia portería para el pase de asistencia.',
      en: 'Pivot sets a static screen on the centre\'s defender. Centre uses the screen to drive or shoot. Pivot releases towards goal for the assist pass.',
    },
    duration: 12, players: 3, difficulty: 2,
  },
  {
    id: 'c25', type: 'court', position: 'pivot',
    category: { es: 'Pivote', en: 'Pivot' },
    name: { es: 'Pivote: recepción difícil bajo presión', en: 'Pivot: difficult reception under pressure' },
    desc: {
      es: 'Un defensor presiona activamente al pivote en la línea. El pasador envía pases en distintas alturas y velocidades. El pivote trabaja el control del cuerpo para proteger el balón y conservar la posición.',
      en: 'A defender actively pressures the pivot on the line. The passer sends balls at different heights and speeds. Pivot works on body control to protect the ball and hold position.',
    },
    duration: 10, players: 3, difficulty: 3,
  },

  // ─────────────────────────────────────────────────────────────
  // COURT — BACKS (CENTRAL Y LATERALES)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'c26', type: 'court', position: 'back',
    category: { es: 'Central / Lateral', en: 'Centre / Back' },
    name: { es: 'Penetración y asistencia al pivote', en: 'Drive and pivot assist' },
    desc: {
      es: 'El lateral penetra entre los defensores y, si no puede lanzar, asiste al pivote liberado. El entrenador indica antes del primer bote si el pase va al pivote o al extremo saliente. Trabaja la lectura y la decisión.',
      en: 'Back drives between defenders and, if cannot shoot, assists the released pivot. Coach signals before the first dribble where to pass. Works on reading and decision-making.',
    },
    duration: 12, players: 3, difficulty: 2,
  },
  {
    id: 'c27', type: 'court', position: 'back',
    category: { es: 'Central / Lateral', en: 'Centre / Back' },
    name: { es: 'Lanzamiento en suspensión desde lateral', en: 'Jump shot from back court' },
    desc: {
      es: 'Lateral recibe pase del central y lanza en suspensión. Variantes: en apoyo, en salto con un paso, en salto con dos pasos. 20 repeticiones por jugador.',
      en: 'Back receives pass from centre and takes a jump shot. Variants: grounded, one-step jump, two-step jump. 20 reps per player.',
    },
    duration: 12, players: 2, difficulty: 2,
  },
  {
    id: 'c28', type: 'court', position: 'back',
    category: { es: 'Central / Lateral', en: 'Centre / Back' },
    name: { es: 'Central: dirección de ataque y circulación', en: 'Centre: attack direction and ball circulation' },
    desc: {
      es: 'El central dirige la circulación del balón entre los seis jugadores de ataque. Practica la comunicación verbal, el cambio de ritmo y la toma de decisiones: cuándo acelerar, cuándo retener, cuándo penetrar.',
      en: 'Centre directs ball circulation among all six attacking players. Practises verbal communication, pace change and decision-making: when to accelerate, hold or drive.',
    },
    duration: 15, players: 6, difficulty: 3,
  },

  // ─────────────────────────────────────────────────────────────
  // PHYSICAL — STRENGTH (FUERZA)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p01', type: 'physical', position: 'all', subtype: 'strength',
    category: { es: 'Fuerza', en: 'Strength' },
    name: { es: 'Sentadilla con peso libre', en: 'Barbell back squat' },
    desc: {
      es: '4 series de 6-8 repeticiones al 75-85% del RM. Mantener la espalda recta, rodillas alineadas con los pies. Fundamental para la potencia de lanzamiento y los saltos.',
      en: '4 sets of 6-8 reps at 75-85% of 1RM. Keep back straight, knees aligned with feet. Fundamental for throwing power and jumping.',
    },
    duration: 20, players: 1, difficulty: 2,
  },
  {
    id: 'p02', type: 'physical', position: 'all', subtype: 'strength',
    category: { es: 'Fuerza', en: 'Strength' },
    name: { es: 'Press de banca con mancuernas', en: 'Dumbbell bench press' },
    desc: {
      es: '4 series de 8-10 repeticiones. Trabaja el pectoral mayor, deltoides anterior y tríceps. Mejora la fuerza de empuje en los lanzamientos. Alternar con press inclinado.',
      en: '4 sets of 8-10 reps. Works pectoralis major, anterior deltoid and triceps. Improves pushing force in throws. Alternate with incline press.',
    },
    duration: 15, players: 1, difficulty: 2,
  },
  {
    id: 'p03', type: 'physical', position: 'all', subtype: 'strength',
    category: { es: 'Fuerza', en: 'Strength' },
    name: { es: 'Remo con barra (tracción horizontal)', en: 'Barbell bent-over row' },
    desc: {
      es: '4 series de 8-10 repeticiones. Trabaja la espalda (dorsal, romboides) y bíceps. Esencial para el equilibrio muscular respecto al press de banca y para armar el brazo en el lanzamiento.',
      en: '4 sets of 8-10 reps. Works back (lats, rhomboids) and biceps. Essential for muscle balance against bench press and for the arm-cocking motion in throwing.',
    },
    duration: 15, players: 1, difficulty: 2,
  },
  {
    id: 'p04', type: 'physical', position: 'all', subtype: 'strength',
    category: { es: 'Fuerza', en: 'Strength' },
    name: { es: 'Peso muerto rumano (isquios y glúteos)', en: 'Romanian deadlift (hamstrings and glutes)' },
    desc: {
      es: '3 series de 10-12 repeticiones con carga moderada. Trabaja isquiotibiales y glúteos, fundamentales para la prevención de lesiones. Bajar controlado y subir con extensión de cadera.',
      en: '3 sets of 10-12 reps at moderate load. Works hamstrings and glutes, fundamental for injury prevention. Lower under control and rise with hip extension.',
    },
    duration: 15, players: 1, difficulty: 2,
  },
  {
    id: 'p05', type: 'physical', position: 'all', subtype: 'strength',
    category: { es: 'Fuerza', en: 'Strength' },
    name: { es: 'Zancadas con mancuernas', en: 'Dumbbell lunges' },
    desc: {
      es: '3 series de 12 repeticiones por pierna. Trabaja el cuádriceps, glúteo y equilibrio. Variantes: zancada lateral (útil para porteros), zancada hacia atrás, zancada caminando.',
      en: '3 sets of 12 reps per leg. Works quadriceps, glutes and balance. Variants: lateral lunge (useful for goalkeepers), reverse lunge, walking lunge.',
    },
    duration: 15, players: 1, difficulty: 1,
  },
  {
    id: 'p06', type: 'physical', position: 'goalkeeper', subtype: 'strength',
    category: { es: 'Fuerza (Portero)', en: 'Strength (GK)' },
    name: { es: 'Jalón al pecho y remo en polea', en: 'Lat pulldown and cable row' },
    desc: {
      es: 'Específico para porteros. 4 series de 10-12 repeticiones. Trabaja la musculatura para las paradas laterales y los manotazos. Alternar jalón frontal con jalón posterior y remo en polea baja.',
      en: 'Goalkeeper-specific. 4 sets of 10-12 reps. Works muscles for lateral saves and blocks. Alternate front lat pulldown, rear pulldown and low cable row.',
    },
    duration: 15, players: 1, difficulty: 2,
  },

  // ─────────────────────────────────────────────────────────────
  // PHYSICAL — POWER / EXPLOSIVENESS (POTENCIA)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p07', type: 'physical', position: 'all', subtype: 'power',
    category: { es: 'Potencia', en: 'Power' },
    name: { es: 'Saltos en caja (box jumps)', en: 'Box jumps' },
    desc: {
      es: '4 series de 6-8 repeticiones. Saltar sobre una caja de 40-60 cm, bajar controlado y repetir. Variante: salto lateral, salto desde sentadilla profunda.',
      en: '4 sets of 6-8 reps. Jump onto a 40-60cm box, step down and repeat. Variants: lateral jump, jump from deep squat.',
    },
    duration: 15, players: 1, difficulty: 2,
  },
  {
    id: 'p08', type: 'physical', position: 'all', subtype: 'power',
    category: { es: 'Potencia', en: 'Power' },
    name: { es: 'Lanzamiento de balón medicinal (pase de pecho)', en: 'Medicine ball chest pass throw' },
    desc: {
      es: 'En parejas o contra la pared. Lanzamiento explosivo de balón medicinal de 3-5 kg desde el pecho. 4 series de 10 repeticiones. Mejora directamente la potencia de lanzamiento. Variante: lanzamiento por encima de la cabeza.',
      en: 'In pairs or against a wall. Explosive chest pass with a 3-5kg medicine ball. 4 sets of 10 reps. Directly improves throwing power. Variant: overhead throw.',
    },
    duration: 12, players: 2, difficulty: 1,
  },
  {
    id: 'p09', type: 'physical', position: 'all', subtype: 'power',
    category: { es: 'Potencia', en: 'Power' },
    name: { es: 'Sentadilla con salto (squat jumps)', en: 'Squat jumps' },
    desc: {
      es: '4 series de 8-10 repeticiones. Bajar hasta la posición de sentadilla y explotar hacia arriba. Amortiguar bien el aterrizaje. Puede añadirse peso con chaleco lastrado o mancuernas ligeras.',
      en: '4 sets of 8-10 reps. Lower to a squat and explode upward. Land softly to protect knees. Can add load with a weighted vest or light dumbbells.',
    },
    duration: 12, players: 1, difficulty: 2,
  },
  {
    id: 'p10', type: 'physical', position: 'goalkeeper', subtype: 'power',
    category: { es: 'Potencia (Portero)', en: 'Power (GK)' },
    name: { es: 'Saltos laterales explosivos sobre vallas', en: 'Explosive lateral hurdle jumps' },
    desc: {
      es: 'El portero salta lateralmente sobre 4-6 vallas bajas (20-30 cm) de forma continuada. 4 series con 30 segundos de recuperación. Simula el movimiento de manotazo y el desplazamiento lateral bajo palos.',
      en: 'Goalkeeper jumps laterally over 4-6 low hurdles (20-30cm) continuously. 4 sets with 30 seconds recovery. Simulates the save movement and lateral displacement in goal.',
    },
    duration: 12, players: 1, difficulty: 2,
  },
  {
    id: 'p11', type: 'physical', position: 'all', subtype: 'power',
    category: { es: 'Potencia', en: 'Power' },
    name: { es: 'Pliometría: saltos en profundidad (drop jumps)', en: 'Plyometrics: depth jumps' },
    desc: {
      es: 'Bajar de una caja (30-40 cm), al tocar el suelo saltar inmediatamente hacia arriba o hacia delante. 4 series de 5-6 repeticiones. Trabaja la fase excéntrica-concéntrica para maximizar la potencia explosiva.',
      en: 'Step off a box (30-40cm) and upon ground contact immediately jump up or forward. 4 sets of 5-6 reps. Works the eccentric-concentric phase to maximise explosive power.',
    },
    duration: 12, players: 1, difficulty: 3,
  },

  // ─────────────────────────────────────────────────────────────
  // PHYSICAL — SPEED (VELOCIDAD)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p12', type: 'physical', position: 'all', subtype: 'speed',
    category: { es: 'Velocidad', en: 'Speed' },
    name: { es: 'Sprint 30 metros con salida explosiva', en: '30-metre sprint with explosive start' },
    desc: {
      es: '6-8 repeticiones de sprint de 30m con 2 minutos de recuperación entre series. Trabajar la posición de salida y los primeros pasos. Variante: salida desde posición de defensa, desde el suelo, desde sentadilla.',
      en: '6-8 reps of 30m sprint with 2 minutes recovery between sets. Work on starting position and first steps. Variants: from defensive stance, from the floor, from squat.',
    },
    duration: 15, players: 1, difficulty: 1,
  },
  {
    id: 'p13', type: 'physical', position: 'all', subtype: 'speed',
    category: { es: 'Velocidad', en: 'Speed' },
    name: { es: 'Escalera de coordinación (agilidad de pies)', en: 'Agility ladder drills' },
    desc: {
      es: 'Distintos patrones en la escalera: dos pasos por cuadro, lateral, cruzado, icky shuffle. 3 series de cada patrón. Fundamental para la rapidez de pies del portero y la agilidad de los extremos.',
      en: 'Different patterns on the ladder: two-feet in each box, lateral, crossover, icky shuffle. 3 sets of each pattern. Fundamental for goalkeeper foot speed and wing agility.',
    },
    duration: 15, players: 1, difficulty: 1,
  },
  {
    id: 'p14', type: 'physical', position: 'all', subtype: 'speed',
    category: { es: 'Velocidad', en: 'Speed' },
    name: { es: 'Circuito en T (cambio de dirección)', en: 'T-drill (change of direction)' },
    desc: {
      es: 'Circuito en forma de T con conos: salida al frente, desplazamiento lateral derecha, lateral izquierda y regreso. 6 repeticiones cronometradas con 90 segundos de recuperación. Mide la agilidad y el cambio de dirección.',
      en: 'T-shaped course with cones: sprint forward, sidestep right, sidestep left and back. 6 timed reps with 90 seconds recovery. Measures agility and change of direction.',
    },
    duration: 12, players: 1, difficulty: 2,
  },
  {
    id: 'p15', type: 'physical', position: 'all', subtype: 'speed',
    category: { es: 'Velocidad', en: 'Speed' },
    name: { es: 'Sprint interválico 10-20-30m', en: '10-20-30m interval sprint' },
    desc: {
      es: 'Desde la misma salida: sprint de 10m, vuelve; sprint de 20m, vuelve; sprint de 30m, vuelve. Eso es 1 repetición. 4-5 repeticiones con 3 minutos de recuperación.',
      en: 'From the same start: 10m sprint back, 20m sprint back, 30m sprint back. That is 1 rep. 4-5 reps with 3 minutes recovery.',
    },
    duration: 15, players: 1, difficulty: 2,
  },

  // ─────────────────────────────────────────────────────────────
  // PHYSICAL — ENDURANCE (RESISTENCIA)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p16', type: 'physical', position: 'all', subtype: 'endurance',
    category: { es: 'Resistencia', en: 'Endurance' },
    name: { es: 'Carrera continua aeróbica', en: 'Continuous aerobic run' },
    desc: {
      es: 'Carrera a ritmo moderado (60-70% FCmax) durante 25-35 minutos. Base aeróbica fundamental. No realizar en días de fuerza o velocidad. Ideal al inicio de la pretemporada.',
      en: 'Running at moderate pace (60-70% HRmax) for 25-35 minutes. Fundamental aerobic base. Do not do on strength or speed days. Ideal at the start of pre-season.',
    },
    duration: 30, players: 1, difficulty: 1,
  },
  {
    id: 'p17', type: 'physical', position: 'all', subtype: 'endurance',
    category: { es: 'Resistencia', en: 'Endurance' },
    name: { es: 'Interval training (30-30)', en: 'Interval training (30-30)' },
    desc: {
      es: '10-15 repeticiones de 30 segundos al 90% FCmax seguidas de 30 segundos de trote suave. Mejora la capacidad de recuperación y la resistencia específica del balonmano.',
      en: '10-15 reps of 30 seconds at 90% HRmax followed by 30 seconds of light jogging. Improves recovery capacity and handball-specific endurance.',
    },
    duration: 20, players: 1, difficulty: 2,
  },
  {
    id: 'p18', type: 'physical', position: 'all', subtype: 'endurance',
    category: { es: 'Resistencia', en: 'Endurance' },
    name: { es: 'Circuito de resistencia con balón', en: 'Ball endurance circuit' },
    desc: {
      es: '5 estaciones de 1 minuto: pases contra la pared, conducciones en slalom, abdominales con balón, sentadillas con balón, lanzamientos al aro. 15 segundos de descanso entre estaciones. 3 vueltas.',
      en: '5 stations of 1 minute each: wall passing, slalom dribbling, sit-ups with ball, squats with ball, shots at basket. 15 seconds rest between stations. 3 circuits.',
    },
    duration: 20, players: 1, difficulty: 2,
  },
  {
    id: 'p19', type: 'physical', position: 'all', subtype: 'endurance',
    category: { es: 'Resistencia', en: 'Endurance' },
    name: { es: 'Fartlek con cambios de velocidad', en: 'Fartlek with speed changes' },
    desc: {
      es: '20-25 minutos de carrera variando la velocidad libremente o a señal del entrenador: 1 minuto rápido, 2 minutos moderado, 30 segundos sprint, etc. Simula los cambios de ritmo del partido.',
      en: '20-25 minutes of running varying speed freely or on coach signal: 1 minute fast, 2 minutes moderate, 30 seconds sprint, etc. Simulates the pace changes of a match.',
    },
    duration: 25, players: 1, difficulty: 2,
  },

  // ─────────────────────────────────────────────────────────────
  // PHYSICAL — CORE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p20', type: 'physical', position: 'all', subtype: 'core',
    category: { es: 'Core', en: 'Core' },
    name: { es: 'Plancha frontal y lateral', en: 'Front and side plank' },
    desc: {
      es: 'Plancha frontal: 3 series de 45-60 segundos. Plancha lateral: 3 series de 30-45 segundos por lado. Mantener cuerpo alineado sin hundir caderas. Fundamental para la estabilidad en los lanzamientos y duelos físicos.',
      en: 'Front plank: 3 sets of 45-60 seconds. Side plank: 3 sets of 30-45 seconds per side. Keep body aligned without dropping hips.',
    },
    duration: 12, players: 1, difficulty: 1,
  },
  {
    id: 'p21', type: 'physical', position: 'all', subtype: 'core',
    category: { es: 'Core', en: 'Core' },
    name: { es: 'Russian twist con balón medicinal', en: 'Russian twist with medicine ball' },
    desc: {
      es: '3 series de 20 repeticiones (10 por lado) con balón de 3-5 kg. Sentado con pies elevados, rotar el tronco llevando el balón de lado a lado. Directamente relacionado con el giro de cadera en el lanzamiento.',
      en: '3 sets of 20 reps (10 per side) with 3-5kg ball. Seated with feet raised, rotate trunk side to side. Directly related to hip rotation in throwing.',
    },
    duration: 10, players: 1, difficulty: 1,
  },
  {
    id: 'p22', type: 'physical', position: 'all', subtype: 'core',
    category: { es: 'Core', en: 'Core' },
    name: { es: 'Pallof press (anti-rotación)', en: 'Pallof press (anti-rotation)' },
    desc: {
      es: 'Con una goma o polea lateral, empujar los brazos al frente y resistir la rotación del tronco. 3 series de 12 repeticiones por lado. Trabaja la estabilidad rotacional, muy específica del gesto del lanzamiento.',
      en: 'With a resistance band or side cable, press arms forward and resist trunk rotation. 3 sets of 12 reps per side. Works rotational stability, very specific to the handball throwing motion.',
    },
    duration: 10, players: 1, difficulty: 2,
  },
  {
    id: 'p23', type: 'physical', position: 'all', subtype: 'core',
    category: { es: 'Core', en: 'Core' },
    name: { es: 'Dead bug (estabilización lumbar)', en: 'Dead bug (lumbar stabilisation)' },
    desc: {
      es: 'Tumbado boca arriba, brazos y piernas en el aire. Bajar simultáneamente brazo derecho y pierna izquierda sin perder la curvatura lumbar. 3 series de 10 repeticiones por lado. Excelente para prevenir lesiones de espalda.',
      en: 'Lying on back with arms and legs in the air. Lower right arm and left leg simultaneously without losing lumbar position. 3 sets of 10 reps per side.',
    },
    duration: 10, players: 1, difficulty: 1,
  },
  {
    id: 'p24', type: 'physical', position: 'all', subtype: 'core',
    category: { es: 'Core', en: 'Core' },
    name: { es: 'Abdominal en suspensión (TRX o anillas)', en: 'Suspended crunch (TRX or rings)' },
    desc: {
      es: 'Con los pies en las asas del TRX, realizar flexiones de cadera llevando las rodillas al pecho. 3 series de 12-15 repeticiones. Trabaja el core con componente inestable que simula el gesto atlético.',
      en: 'With feet in TRX straps, perform hip flexion bringing knees to chest. 3 sets of 12-15 reps. Works core with an unstable component that simulates the athletic movement.',
    },
    duration: 10, players: 1, difficulty: 2,
  },

  // ─────────────────────────────────────────────────────────────
  // PHYSICAL — MOBILITY (MOVILIDAD)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p25', type: 'physical', position: 'all', subtype: 'mobility',
    category: { es: 'Movilidad', en: 'Mobility' },
    name: { es: 'Movilidad dinámica de hombro', en: 'Dynamic shoulder mobility' },
    desc: {
      es: 'Rotaciones del brazo hacia adelante y hacia atrás, círculos, cruces al pecho, aperturas. 2-3 series de 10 repeticiones cada movimiento. Imprescindible antes del entrenamiento de lanzamiento.',
      en: 'Arm circles forward and backward, crossovers on the chest, openings. 2-3 sets of 10 reps each. Essential before throwing training.',
    },
    duration: 8, players: 1, difficulty: 1,
  },
  {
    id: 'p26', type: 'physical', position: 'all', subtype: 'mobility',
    category: { es: 'Movilidad', en: 'Mobility' },
    name: { es: 'Movilidad de cadera y aductores', en: 'Hip and adductor mobility' },
    desc: {
      es: 'Sentadilla profunda con apertura de caderas (goblet squat), apertura lateral (sumo), estiramiento de aductor dinámico. 2 series de 10 repeticiones de cada ejercicio. Fundamental para extremos y pivotes.',
      en: 'Deep squat with hip opening (goblet squat), lateral opening (sumo), dynamic adductor stretch. 2 sets of 10 reps each. Fundamental for wings and pivots.',
    },
    duration: 10, players: 1, difficulty: 1,
  },
  {
    id: 'p27', type: 'physical', position: 'all', subtype: 'mobility',
    category: { es: 'Movilidad', en: 'Mobility' },
    name: { es: 'Estiramientos estáticos post-entreno', en: 'Static stretching post-training' },
    desc: {
      es: 'Al final del entrenamiento: cuádriceps, isquios, glúteos, aductores, pectoral, hombros, cervicales. Mantener cada estiramiento 30-45 segundos. No botar. Fundamental para la recuperación.',
      en: 'After training: quads, hamstrings, glutes, adductors, chest, shoulders, neck. Hold each stretch 30-45 seconds. No bouncing. Fundamental for recovery.',
    },
    duration: 12, players: 1, difficulty: 1,
  },
  {
    id: 'p28', type: 'physical', position: 'all', subtype: 'mobility',
    category: { es: 'Movilidad', en: 'Mobility' },
    name: { es: 'Foam roller y liberación miofascial', en: 'Foam roller and myofascial release' },
    desc: {
      es: 'Pasar el foam roller lentamente por isquios, cuádriceps, glúteos, espalda lumbar y dorsal. Pausar 30 segundos en los puntos de tensión. Ideal como recuperación activa tras competición o entrenamiento intenso.',
      en: 'Roll the foam roller slowly over hamstrings, quads, glutes, lower and mid back. Pause 30 seconds on tension points. Ideal as active recovery after competition or intense training.',
    },
    duration: 15, players: 1, difficulty: 1,
  },

  // ─────────────────────────────────────────────────────────────
  // PHYSICAL — INJURY PREVENTION (PREVENCIÓN)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'p29', type: 'physical', position: 'all', subtype: 'mobility',
    category: { es: 'Prevención lesiones', en: 'Injury prevention' },
    name: { es: 'Ejercicios de manguito rotador (hombro)', en: 'Rotator cuff exercises (shoulder)' },
    desc: {
      es: 'Con goma elástica ligera: rotación interna y externa del hombro, elevaciones laterales, press Arnold ligero. 3 series de 15-20 repeticiones. Imprescindible para prevenir las lesiones de hombro en lanzadores.',
      en: 'With a light resistance band: internal and external shoulder rotation, lateral raises, light Arnold press. 3 sets of 15-20 reps. Essential for preventing shoulder injuries in throwers.',
    },
    duration: 12, players: 1, difficulty: 1,
  },
  {
    id: 'p30', type: 'physical', position: 'all', subtype: 'mobility',
    category: { es: 'Prevención lesiones', en: 'Injury prevention' },
    name: { es: 'Fortalecimiento de rodilla y propiocepción', en: 'Knee strengthening and proprioception' },
    desc: {
      es: 'Extensión de rodilla en camilla (isométrico y con polea), equilibrio monopodal sobre superficie inestable, sentadilla búlgara. 3 series de 12-15 repeticiones. Previene las lesiones de ligamentos y rodilla en balonmano.',
      en: 'Knee extension (isometric and with cable), single-leg balance on unstable surface, Bulgarian split squat. 3 sets of 12-15 reps. Prevents ligament and knee injuries in handball.',
    },
    duration: 15, players: 1, difficulty: 2,
  },
]
