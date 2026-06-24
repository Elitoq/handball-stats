export default async function handler(req, res) {
  const { term } = req.query
  if (!term) return res.status(400).json({ error: 'No term' })

  try {
    const searchRes = await fetch(
      `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(term)}&language=english&format=json`
    )
    if (!searchRes.ok) return res.json({ url: null })
    const searchData = await searchRes.json()

    const baseId = searchData.suggestions?.[0]?.data?.base_id
    if (!baseId) return res.json({ url: null })

    const imgRes = await fetch(
      `https://wger.de/api/v2/exerciseimage/?exercise_base=${baseId}&is_main=True&format=json`
    )
    if (!imgRes.ok) return res.json({ url: null })
    const imgData = await imgRes.json()

    const url = imgData.results?.[0]?.image ?? null
    res.setHeader('Cache-Control', 's-maxage=86400')
    res.json({ url })
  } catch {
    res.json({ url: null })
  }
}
