'use client'

import styles from './Register.module.scss'
import { useSearchParams } from 'next/navigation'
import { AppContext } from '@/context/AppContext'
import { useContext } from 'react'
import { apiService } from '@/services/api'
import { useRouter } from 'next/navigation'
import LoginProviders from '@/components/LoginProviders/LoginProviders'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/services/config/api'
import { useAuth } from '@/app/hook/useAuth'

const RegisterPage = () => {

  const searchParams = useSearchParams()
  const postId = searchParams.get('postId') ?? undefined

  const router = useRouter();
  const { checkAuthStatus } = useAuth();

  const { token } = useContext(AppContext);

  const [showLoginMail, setShowLoginMail] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  useEffect(() => {

    const checkAuth = async () => {
        const authStatus = await checkAuthStatus();
        if (!authStatus?.isGuest) {

          if (localStorage.getItem('conversation') && localStorage.getItem('editorPrompt')) {
            router.push('/result')
          } else {
            router.push('/')
          }
        }
    }
    
    checkAuth()
  }, [])


  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string



    console.log('Login')
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>, token: string) => {
    e.preventDefault()

    console.log(token)

    if (!token) {
      console.log("No hay token")
    }

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    //const response = await apiService.post('/api/v1/landing/user', { email, username, password })
    const response = await apiService.post('/api/v1/landing/user', { email, username, password }, { token: token })
    console.log(response)
    if (response.error) {
      console.error('Error al registrar el usuario:', response.error)
      return
    }

    console.log('Usuario registrado correctamente:', response.data)

    console.log('Register')
  }

  return (
    <div className={styles.register}>
      <div className={styles.register__overlay}></div>
      <div className={styles.register__content}>
        <div className={styles.register__content__header}>
          <p>Esta es tu historia:</p>
        </div>
        <h1 className={styles.register__content__title}>Cuando dejas de meditar justo cuando más lo necesitas</h1>

        <div className={styles.register__content__content}>
          <p>
            Había un momento en mi vida en que me sentía centrado, conectado conmigo mismo. Meditaba regularmente y tenía tiempo para mí. Todo cambió cuando tuve que tirar de la compañía y el estrés se instaló en mi día a día.  Es curioso cómo funciona la mente: cuando más cosas tienes en la cabeza, más te cuesta meditar, dejar la mente vacía. Ves urgencia en todo y puedes llegar a pensar que meditar es un engorro. 
            <br/>
            <br/>
            Perdí el foco en mí mismo justo en el momento en que más lo necesitaba.  Me di cuenta de algo paradójico: a veces en la vida toca empujar, y es precisamente entonces cuando abandonas lo que más te ayudaría. 
            <br/>
            <br/>
            Es como si la urgencia te convenciera de que parar es lujo que no te puedes permitir.  Lo que he aprendido es que no hay que fustigarse por no conseguir meditar cuando creemos que deberíamos hacerlo. Vamos mejorando poco a poco, y algún día lo conseguiremos si así lo queremos. 
            <br/>
            <br/>
            Aunque no logres meditar con la misma intensidad o profundidad, el simple hecho de luchar por ello, de hacer una pausa, siempre va a ir bien en momentos de intensidad. Es ahí donde encuentras la claridad.<br/>
          </p>
        </div>
      </div>

      <div className={styles.register__register}>
        <h3 className={styles.register__register__title}>Regístrate y lee<br/>tu historia completa:</h3>
        <div className={styles.register__register__buttons}>
          {showLoginMail ? (
            <div>
              {showLoginPassword ? (
                <div className={styles.register__register__buttons__login}>
                  <form className={styles.register__register__buttons__login__form} onSubmit={(e) => handleRegister(e, token as string)}>
                    <input type="text" placeholder="Username" name="username" />
                    <input type="email" placeholder="Email" name="email" />
                    <input type="password" placeholder="Contraseña" name="password" />
                    <button className={styles.register__register__buttons__login__form__button} type="submit">Regístrate</button>
                  </form>
                </div>
              ) : (
                <div className={styles.register__register__buttons__login}>
                  <form className={styles.register__register__buttons__login__form} onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" name="email" />
                    <input type="password" placeholder="Contraseña" name="password" />
                    <button className={styles.register__register__buttons__login__form__button} type="submit">Iniciar sesión</button>
                  </form>
                  <p className={styles.register__register__buttons__login__form__text}>No tienes una cuenta? <span onClick={() => setShowLoginPassword(true)}>Regístrate</span></p>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.register__register__buttons__login}>
              <LoginProviders lastpage="register" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterPage