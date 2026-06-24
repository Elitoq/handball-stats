export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { matchData } = req.body ?? {}
  if (!matchData) return res.status(400).json({ error: 'No match data' })

  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(500).json({ error: 'API key not configured' })

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Eres un analista de balonmano experto. Analiza este partido y escribe un resumen de 3-4 frases en español. Destaca los puntos más positivos del equipo, el área principal de mejora y termina con un mensaje motivador corto. Sé concreto con los números. Datos del partido:\n${JSON.stringify(matchData, null, 2)}`,
            }],
          }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      return res.status(502).json({ error: err })
    }

    const data = await response.json()
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No se pudo generar el análisis.'
    res.json({ summary })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
}
