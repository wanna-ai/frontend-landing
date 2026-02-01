import styles from './LoginMail.module.scss'
const LoginMail = () => {

  const handleEmailSignIn = async () => {
    console.log('Email sign in')
  }

  return (
    <form className={styles.login} action={handleEmailSignIn}>
      <button
        data-type="primary"
        className={styles.login__button}
        type="submit"
        name="action"
        value="google"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="20" height="16" rx="5" stroke="black" stroke-width="1.4"/>
          <path d="M16 10C16 10 12.5 13 12 13C11.5 13 8 10 8 10" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>Continuar con email</p>
      </button>
    </form>
  )
}

export default LoginMail