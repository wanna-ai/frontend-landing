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
import Snippet from '@/components/Snippet/Snippet'
import { useAuth } from '@/app/hook/useAuth'

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import 'swiper/css/pagination';
// import required modules
import { Pagination } from 'swiper/modules';


const RegisterPage = () => {

  const searchParams = useSearchParams()
  const postId = searchParams.get('postId') ?? undefined

  const router = useRouter();
  const { checkAuthStatus } = useAuth();

  const { experienceData, setExperienceData, token } = useContext(AppContext);

  const [showLoginMail, setShowLoginMail] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const authStatus = await checkAuthStatus();
        console.log("authStatus", authStatus)

        const postResponse = await apiService.get(`/api/v1/landing/posts/${postId}`, { token: authStatus?.token || "" })
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
          visibility: postResponse.visibility,
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
        <Swiper pagination={true} modules={[Pagination]} spaceBetween={50} slidesPerView={1}>
          <SwiperSlide>
            <Snippet icon="reflection" header="Reflexión" content={getTruncatedText(experienceData?.reflection ?? '')} />
          </SwiperSlide>
          <SwiperSlide>
            <Snippet icon="story" header="Tu historia" content={experienceData?.title ?? ''} />
          </SwiperSlide>
        </Swiper>
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
              <LoginProviders lastpage="register" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterPage