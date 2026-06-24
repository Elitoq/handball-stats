// Direct image URLs from wger.de (open license)
const IMAGES = {
  p02: 'https://wger.de/media/exercise-images/192/Bench-press-1.png',
  p03: 'https://wger.de/media/exercise-images/110/Reverse-grip-bent-over-rows-1.png',
  p04: 'https://wger.de/media/exercise-images/161/Dead-lifts-1.png',
  p05: 'https://wger.de/media/exercise-images/113/Walking-lunges-1.png',
}

export default function PhysicalDiagram({ id }) {
  const url = IMAGES[id]
  if (!url) return null

  return (
    <img
      src={url}
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
