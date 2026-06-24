import { useState, useEffect } from 'react'

const WGER_TERMS = {
  p01: 'barbell squat',
  p02: 'barbell bench press',
  p03: 'bent over barbell row',
  p04: 'romanian deadlift',
  p05: 'lunge',
  p06: 'lat pulldown',
  p07: 'box jump',
  p09: 'jump squat',
  p11: 'depth jump',
  p20: 'plank',
  p21: 'russian twist',
  p23: 'dead bug',
  p24: 'hanging knee raise',
  p29: 'external rotation',
  p30: 'single leg squat',
}

const cache = new Map()

async function fetchImage(id) {
  if (cache.has(id)) return cache.get(id)
  const term = WGER_TERMS[id]
  if (!term) { cache.set(id, null); return null }
  try {
    const res = await fetch(`/api/wger-image?term=${encodeURIComponent(term)}`)
    const data = await res.json()
    cache.set(id, data.url ?? null)
    return data.url ?? null
  } catch {
    cache.set(id, null)
    return null
  }
}

export default function PhysicalDiagram({ id }) {
  const [state, setState] = useState('loading')
  const [imgUrl, setImgUrl] = useState(null)

  useEffect(() => {
    if (!WGER_TERMS[id]) { setState('none'); return }
    setState('loading')
    fetchImage(id).then(url => {
      if (url) { setImgUrl(url); setState('ok') }
      else setState('none')
    })
  }, [id])

  if (state === 'none') return null

  if (state === 'loading') return (
    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', fontSize: 13 }}>
      Cargando imagen…
    </div>
  )

  return (
    <img
      src={imgUrl}
      alt={id}
      style={{ width: '100%', borderRadius: 10, display: 'block', margin: '12px 0 6px', maxHeight: 240, objectFit: 'contain', background: '#0d1117' }}
    />
  )
}
