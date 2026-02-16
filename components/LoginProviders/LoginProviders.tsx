import styles from './LoginProviders.module.scss'
import LoginOAuth from '../LoginOAuth/LoginOAuth'
import { API_BASE_URL } from '@/services/config/api'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState, useCallback } from 'react'
import { AppContext } from '@/context/AppContext'
import { useAuth } from '@/app/hook/useAuth'

interface LoginProvidersProps {
  lastpage: string
}

const LoginProviders = ({ lastpage }: LoginProvidersProps) => {
  const router = useRouter()
  const { sessionId, postId } = useContext(AppContext)
  const { checkAuthStatus } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const setCookie = async (name: string, value: string) => {
    const response = await fetch('/api/auth/set-cookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, value }),
    })

    if (!response.ok) {
      throw new Error(`Failed to set cookie: ${name}`)
    }

    return response
  }

  const handleAuthSuccess = useCallback(async (token: string) => {
    try {
      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'authToken', value: token }),
      })

      await checkAuthStatus()

      if (lastpage === 'register') {
        router.push('/result')
      } else {
        router.push(postId ? `/story/${postId}` : '/story')
      }
    } catch (error) {
      console.error('Error handling auth success:', error)
    } finally {
      setIsLoading(false)
    }
  }, [checkAuthStatus, lastpage, postId, router])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'WANNA_AUTH_SUCCESS') return

      const { token } = event.data
      if (token) {
        handleAuthSuccess(token)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleAuthSuccess])

  const handleGoogle = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)

      await setCookie('lastpage', lastpage)

      const endpoint = '/oauth2/authorization/google'
      const sessionParam = sessionId ? `?sessionId=${sessionId}` : ''
      const url = `${API_BASE_URL}${endpoint}${sessionParam}`

      const popup = window.open(
        url,
        'google-auth',
        'width=500,height=600,popup=true'
      )

      if (!popup) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error during Google OAuth:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.loginProviders}>
      <LoginOAuth
        _url={'/preview'}
        handleGoogle={handleGoogle}
      />
    </div>
  )
}

export default LoginProviders
