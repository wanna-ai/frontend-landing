import styles from './LoginProviders.module.scss'
import LoginOAuth from '../LoginOAuth/LoginOAuth'

const LoginProviders = () => {

  const handleGoogle = () => {
    console.log('handleGoogle')
  }
  
  return (
    <div className={styles.loginProviders}>
      <LoginOAuth _url={'/preview'} handleGoogle={handleGoogle} />
    </div>
  )
}

export default LoginProviders