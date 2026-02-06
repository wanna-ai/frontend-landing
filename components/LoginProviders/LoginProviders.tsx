import styles from './LoginProviders.module.scss'
import LoginOAuth from '../LoginOAuth/LoginOAuth'
import { API_BASE_URL } from '@/services/config/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LoginProvidersProps {
  lastpage: string
}

const LoginProviders = ({ lastpage }: LoginProvidersProps) => {
  const router = useRouter()
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

  const handleGoogle = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      
      await Promise.all([
        setCookie('lastpage', lastpage),
        setCookie('mode', 'testing')
      ])

      const endpoint = '/oauth2/authorization/google'
      router.push(`${API_BASE_URL}${endpoint}`)
    } catch (error) {
      console.error('Error during Google OAuth:', error)
      setIsLoading(false)
      // Optionally show error to user
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