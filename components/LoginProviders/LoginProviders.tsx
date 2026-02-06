import styles from './LoginProviders.module.scss'
import LoginOAuth from '../LoginOAuth/LoginOAuth'
import { API_BASE_URL } from '@/services/config/api'
import { useRouter } from 'next/navigation'

const LoginProviders = ({ lastpage }: { lastpage: string }) => {

  const router = useRouter()

  const handleGoogle = async () => {
    console.log('handleGoogle')
    // set cookie lastpage
    const cookieRes = await fetch('/api/auth/set-cookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'lastpage', value: lastpage }),
    })
    console.log("no hay token / registrarse con google")
    const endpoint = "/oauth2/authorization/google"
    router.push(`${API_BASE_URL}${endpoint}`)
  }
  
  return (
    <div className={styles.loginProviders}>
      <LoginOAuth _url={'/preview'} handleGoogle={handleGoogle} />
    </div>
  )
}

export default LoginProviders