import { useState, useEffect } from 'react'

// Map our exercise IDs to wger search terms (English)
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

async function fetchWgerImage(term) {
  if (cache.has(term)) return cache.get(term)

  try {
    const searchRes = await fetch(
      `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(term)}&language=english&format=json`
    )
    if (!searchRes.ok) { cache.set(term, null); return null }
    const searchData = await searchRes.json()

    const baseId = searchData.suggestions?.[0]?.data?.base_id
    if (!baseId) { cache.set(term, null); return null }

    const imgRes = await fetch(
      `https://wger.de/api/v2/exerciseimage/?exercise_base=${baseId}&is_main=True&format=json`
    )
    if (!imgRes.ok) { cache.set(term, null); return null }
    const imgData = await imgRes.json()

    const url = imgData.results?.[0]?.image ?? null
    cache.set(term, url)
    return url
  } catch {
    cache.set(term, null)
    return null
  }
}

export default function PhysicalDiagram({ id }) {
  const [state, setState] = useState('loading') // 'loading' | 'ok' | 'none'
  const [imgUrl, setImgUrl] = useState(null)

  const term = WGER_TERMS[id]

  useEffect(() => {
    if (!term) { setState('none'); return }
    setState('loading')
    fetchWgerImage(term).then(url => {
      if (url) { setImgUrl(url); setState('ok') }
      else setState('none')
    })
  }, [id, term])

  if (state === 'none') return null

  if (state === 'loading') return (
    <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', fontSize: 13 }}>
      Cargando imagen…
    </div>
  )

  return (
    <img
      src={imgUrl}
      alt={id}
      style={{
        width: '100%',
        borderRadius: 10,
        display: 'block',
        margin: '12px 0 6px',
        maxHeight: 240,
        objectFit: 'contain',
        background: '#0d1117',
      }}
    />
  )
}
