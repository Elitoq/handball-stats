const T = {
  es: {
    'nav.stats':       'Stats',
    'nav.exercises':   'Ejercicios',

    'settings.title':        'Ajustes',
    'settings.language':     'Idioma',
    'settings.language.desc':'Cambia el idioma de la app',
    'settings.ratings':      'Notas de jugadores',
    'settings.ratings.desc': 'Puntuación 1–10 por partido. Desactívalo en categorías base.',
    'settings.account':      'Cuenta',
    'settings.guest':        'Modo invitado',
    'settings.logout':       'Cerrar sesión',

    'ex.title':      'Ejercicios',
    'ex.all':        'Todos',
    'ex.court':      'Pista',
    'ex.physical':   'Físico',
    'ex.min':        'min',
    'ex.player':     'persona',
    'ex.players':    'personas',
    'ex.difficulty': 'Dificultad',
    'ex.empty':      'Sin ejercicios en esta categoría',
    'ex.desc.hide':  'Ocultar descripción',
    'ex.desc.show':  'Ver descripción',
  },
  en: {
    'nav.stats':       'Stats',
    'nav.exercises':   'Exercises',

    'settings.title':        'Settings',
    'settings.language':     'Language',
    'settings.language.desc':'Change the app language',
    'settings.ratings':      'Player ratings',
    'settings.ratings.desc': 'Score 1–10 per match. Disable for youth teams.',
    'settings.account':      'Account',
    'settings.guest':        'Guest mode',
    'settings.logout':       'Sign out',

    'ex.title':      'Exercises',
    'ex.all':        'All',
    'ex.court':      'Court',
    'ex.physical':   'Physical',
    'ex.min':        'min',
    'ex.player':     'person',
    'ex.players':    'people',
    'ex.difficulty': 'Difficulty',
    'ex.empty':      'No exercises in this category',
    'ex.desc.hide':  'Hide description',
    'ex.desc.show':  'Show description',
  },
}

export function t(key, lang = 'es') {
  return T[lang]?.[key] ?? T.es[key] ?? key
}
