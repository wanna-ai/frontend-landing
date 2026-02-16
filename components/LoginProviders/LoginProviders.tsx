import styles from './LoginProviders.module.scss'
import LoginOAuth from '../LoginOAuth/LoginOAuth'
import { API_BASE_URL } from '@/services/config/api'
import { useState } from 'react'

interface LoginProvidersProps {
  lastpage: string
}

const LoginProviders = ({ lastpage }: LoginProvidersProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogle = async () => {
    if (isLoading) return

    setIsLoading(true)

    window.open(
      `${API_BASE_URL}/oauth2/authorization/google`,
      'WannaLogin',
      'width=500,height=600,scrollbars=yes',
    )

    setIsLoading(false)
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
