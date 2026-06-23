import { useState } from 'react'
import { auth } from '../firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default function Login({ onGuest }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (e) {
      setError('No se pudo iniciar sesión. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#030712', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16, color: '#7eb3ff', fontWeight: 900, letterSpacing: -2 }}>HS</div>
        <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, margin: 0 }}>Handball Stats</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 8 }}>Registra partidos, analiza temporadas, exporta informes</p>
      </div>

      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{ width: '100%', background: 'white', color: '#111827', border: 'none', borderRadius: 14, padding: '14px 20px', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: loading ? 0.7 : 1 }}
        >
          <GoogleIcon />
          {loading ? 'Iniciando sesión...' : 'Continuar con Google'}
        </button>

        <button
          onClick={onGuest}
          disabled={loading}
          style={{ width: '100%', background: 'transparent', color: '#9ca3af', border: '1px solid #1f2937', borderRadius: 14, padding: '14px 20px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}
        >
          Entrar como invitado
        </button>
      </div>

      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 16, textAlign: 'center' }}>{error}</p>}

      <div style={{ marginTop: 32, maxWidth: 300, textAlign: 'center' }}>
        <p style={{ color: '#374151', fontSize: 12, margin: 0 }}>
          Con Google, tus datos se guardan en la nube y están disponibles en cualquier dispositivo.
        </p>
        <p style={{ color: '#374151', fontSize: 12, marginTop: 8 }}>
          Como invitado, los datos se guardan solo en este dispositivo.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
