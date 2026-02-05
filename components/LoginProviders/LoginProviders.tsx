import styles from './LoginProviders.module.scss'
import LoginOAuth from '../LoginOAuth/LoginOAuth'

const LoginProviders = () => {
  return (
    <div className={styles.loginProviders}>
      <LoginOAuth _url={'/preview'} />
    </div>
  )
}

export default LoginProviders