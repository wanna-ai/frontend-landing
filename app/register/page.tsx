'use client'

import styles from './Register.module.scss'
import { useSearchParams } from 'next/navigation'
import { AppContext } from '@/context/AppContext'
import { useContext } from 'react'
import { apiService } from '@/services/api'
import { useRouter } from 'next/navigation'
import LoginOAuth from '@/components/LoginOAuth/LoginOAuth'
import { useState, useEffect } from 'react'

const RegisterPage = () => {

  const searchParams = useSearchParams()
  const communityId = searchParams.get('c') ?? undefined
  const postId = searchParams.get('postId') ?? undefined

  const router = useRouter();

  const { experienceData, setExperienceData, token } = useContext(AppContext);

  const [showLoginMail, setShowLoginMail] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {

        const tokenResponse = await fetch('/api/auth/get-cookie', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!tokenResponse.ok) {
          throw new Error('Failed to fetch token')
        }
        const tokenData = await tokenResponse.json()
        const token = tokenData.token
        console.log('token', token)
        
        const postResponse = await apiService.get(`/api/v1/landing/posts/${postId}`, { token: token })
        if (postResponse.error) {
          throw new Error('Failed to fetch post')
        }
        console.log('postResponse', postResponse)
        setExperienceData({
          title: postResponse.title,
          experience: postResponse.experience,
          pildoras: postResponse.pildoras,
          reflection: postResponse.reflection,
          story_valuable: postResponse.story_valuable,
          rawInterviewText: postResponse.rawInterviewText,
        })
  
        
      } catch (err) {
        console.error('Error fetching token:', err)
        router.push('/')
      } finally {
      }
    }
  
    fetchPost()
  }, [postId])

  const getTruncatedText = (text: string, maxWords: number = 20) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + "...";
  };

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
      <h1 className={styles.register__title}>Esto es lo que Wanna ha empezado a escribir contigo...</h1>

      <div className={styles.register__content}>

        <div className={styles.register__content__item}>
          <div className={styles.register__content__item__header}>
            <div className={styles.register__content__item__header__icon}>
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.74999 1.75571V16.9415M9.74999 1.75571L10.7401 1.38414C12.9932 0.538619 15.5067 0.538619 17.7599 1.38414C18.3579 1.60855 18.75 2.15192 18.75 2.75616V15.2217C18.75 16.0515 17.8568 16.6188 17.0356 16.3107C15.2474 15.6396 13.2526 15.6396 11.4644 16.3107L9.76234 16.9494C9.75642 16.9516 9.74999 16.9475 9.74999 16.9415M9.74999 1.75571L8.75987 1.38414C6.50674 0.538619 3.99326 0.538619 1.74012 1.38414C1.14212 1.60855 0.75 2.15192 0.75 2.75616V15.2217C0.75 16.0515 1.64322 16.6188 2.46436 16.3107C4.25258 15.6396 6.24742 15.6396 8.03563 16.3107L9.73765 16.9494C9.74356 16.9516 9.74999 16.9475 9.74999 16.9415" stroke="var(--color-white)" strokeWidth="1.5"/>
              </svg>
              <p>Tu historia</p>
            </div>

            <p className={styles.register__content__item__title}>{experienceData?.title}</p>
          </div>
        </div>
      
        <div className={styles.register__content__item}>

          <div className={styles.register__content__item__header}>
            <div className={styles.register__content__item__header__icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.14286 14C4.41735 12.8082 4 11.4118 4 9.91886C4 5.54539 7.58172 2 12 2C16.4183 2 20 5.54539 20 9.91886C20 11.4118 19.5827 12.8082 18.8571 14" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M7.38287 17.0982C7.291 16.8216 7.24507 16.6833 7.25042 16.5713C7.26174 16.3343 7.41114 16.1262 7.63157 16.0405C7.73579 16 7.88105 16 8.17157 16H15.8284C16.119 16 16.2642 16 16.3684 16.0405C16.5889 16.1262 16.7383 16.3343 16.7496 16.5713C16.7549 16.6833 16.709 16.8216 16.6171 17.0982C16.4473 17.6094 16.3624 17.8651 16.2315 18.072C15.9572 18.5056 15.5272 18.8167 15.0306 18.9408C14.7935 19 14.525 19 13.9881 19H10.0119C9.47495 19 9.2065 19 8.96944 18.9408C8.47283 18.8167 8.04281 18.5056 7.7685 18.072C7.63755 17.8651 7.55266 17.6094 7.38287 17.0982Z" stroke="var(--color-white)" strokeWidth="1.5"/>
                <path d="M15 19L14.8707 19.6466C14.7293 20.3537 14.6586 20.7072 14.5001 20.9866C14.2552 21.4185 13.8582 21.7439 13.3866 21.8994C13.0816 22 12.7211 22 12 22C11.2789 22 10.9184 22 10.6134 21.8994C10.1418 21.7439 9.74484 21.4185 9.49987 20.9866C9.34144 20.7072 9.27073 20.3537 9.12932 19.6466L9 19" stroke="var(--color-white)" strokeWidth="1.5"/>
                <path d="M12 16V11" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Reflexión</p>
            </div>

            <p className={styles.register__content__item__text}>{getTruncatedText(experienceData?.reflection ?? '')}</p>
          </div>
        </div>  
      </div>

      <div className={styles.register__register}>
        <h3>Regístrate y lee tu historia completa</h3>
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
            <>
              <LoginOAuth _url={'/preview'} />
              {/* <LoginMail handleEmailSignIn={() => setShowLoginMail(true)} /> */}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterPage