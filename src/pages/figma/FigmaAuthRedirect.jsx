import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

const SCOPE = 'current_user:read,file_content:read,file_metadata:read,projects:read'
const STORAGE_KEYS = {
  accessToken: 'figma_access_token',
  expiresAt: 'figma_access_token_expires_at',
  refreshToken: 'figma_refresh_token',
  error: 'figma_oauth_error',
  state: 'figma_oauth_state'
}
const isBrowser = typeof window !== 'undefined'

const buildStateValue = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `figma-${crypto.randomUUID()}`
  }
  return `figma-${Math.random().toString(36).slice(2)}`
}

export default function FigmaAuthRedirect() {
  const location = useLocation()
  const [status, setStatus] = useState('Initializing Figma OAuth flow…')
  const [error, setError] = useState('')
  const clientId = import.meta.env.VITE_FIGMA_CLIENT_ID
  const clientSecret = import.meta.env.VITE_FIGMA_CLIENT_SECRET
  const redirectUri = import.meta.env.VITE_FIGMA_REDIRECT_URI || 'http://localhost:9090/playground/figma-auth'

  const encodedBasicCreds = useMemo(() => {
    if (!(clientId && clientSecret) || typeof btoa === 'undefined') return ''
    return btoa(`${clientId}:${clientSecret}`)
  }, [clientId, clientSecret])

  useEffect(() => {
    if (!isBrowser) return

    const params = new URLSearchParams(location.search)
    const code = params.get('code')
    const state = params.get('state')
    const storedState = localStorage.getItem(STORAGE_KEYS.state)

    if (!clientId || !clientSecret) {
      const message = 'Missing Figma OAuth credentials. Check your local env file.'
      localStorage.setItem(STORAGE_KEYS.error, message)
      setError(message)
      return
    }

    if (!code) {
      const launchState = state || storedState || buildStateValue()
      localStorage.setItem(STORAGE_KEYS.state, launchState)

      const authUrl = new URL('https://www.figma.com/oauth')
      authUrl.searchParams.set('client_id', clientId)
      authUrl.searchParams.set('redirect_uri', redirectUri)
      authUrl.searchParams.set('scope', SCOPE)
      authUrl.searchParams.set('state', launchState)
      authUrl.searchParams.set('response_type', 'code')

      window.location.replace(authUrl.toString())
      return
    }

    if (!state || state !== storedState) {
      const message = 'OAuth state mismatch. Please restart the Figma connection.'
      localStorage.setItem(STORAGE_KEYS.error, message)
      localStorage.removeItem(STORAGE_KEYS.state)
      setError(message)
      return
    }

    const exchangeToken = async () => {
      try {
        setStatus('Finalizing OAuth grant…')
        const body = new URLSearchParams({
          redirect_uri: redirectUri,
          code,
          grant_type: 'authorization_code'
        })

        const response = await fetch('https://api.figma.com/v1/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encodedBasicCreds}`
          },
          body
        })

        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          const message = payload?.error_description || payload?.err || payload?.message || 'Failed to exchange code for token.'
          throw new Error(message)
        }

        const token = payload?.access_token
        if (!token) {
          throw new Error('Figma did not return an access token.')
        }

        localStorage.removeItem(STORAGE_KEYS.error)
        localStorage.removeItem(STORAGE_KEYS.state)
        localStorage.setItem(STORAGE_KEYS.accessToken, token)
        if (payload?.refresh_token) {
          localStorage.setItem(STORAGE_KEYS.refreshToken, payload.refresh_token)
        }
        if (payload?.expires_in) {
          const expiresAt = Date.now() + payload.expires_in * 1000
          localStorage.setItem(STORAGE_KEYS.expiresAt, String(expiresAt))
        }

        setStatus('Access granted! You can close this window.')
        
        await new Promise(resolve => setTimeout(resolve, 300))
        
        if (window.opener && !window.opener.closed) {
          window.opener.focus()
        }
        
        setTimeout(() => {
          window.close()
        }, 1500)
      } catch (err) {
        const message = err.message || 'Unexpected error while finishing Figma OAuth.'
        localStorage.setItem(STORAGE_KEYS.error, message)
        localStorage.removeItem(STORAGE_KEYS.state)
        setError(message)
      }
    }

    if (!encodedBasicCreds) {
      const message = 'Unable to encode OAuth credentials in this environment.'
      localStorage.setItem(STORAGE_KEYS.error, message)
      setError(message)
      return
    }

    exchangeToken()
  }, [clientId, clientSecret, encodedBasicCreds, location.search, redirectUri])

  return (
    <div className="figma-auth-redirect">
      {!error ? (
        <>
          <p>{status}</p>
          <p>You can keep this tab open; it will close automatically once we’re done.</p>
        </>
      ) : (
        <>
          <p>We hit a snag: {error}</p>
          <p>You can close this window and try again from the playground.</p>
        </>
      )}
    </div>
  )
}

