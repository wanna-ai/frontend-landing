'use client'
import styles from './Succeed.module.scss'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/context/AppContext'
import Link from 'next/link'
import { apiService } from '@/services/api'
import { useAuth } from '@/app/hook/useAuth'

interface ExperienceData {
  title: string
  experience: string
  pildoras: string[]
  reflection: string
  story_valuable: string
  rawInterviewText: string
  visibility: string
}

const SucceedPage = () => {
  const router = useRouter()
  const { checkAuthStatus } = useAuth();

  const searchParams = useSearchParams()
  const postId = searchParams.get('postId') ?? undefined

  const { experienceData, setExperienceData, userInfo, setUserInfo } = useContext(AppContext)

  const [token, setToken] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        /*
         * 1️⃣ Get token from cookie
         */
        const authStatus = await checkAuthStatus();
        console.log("authStatus", authStatus)

        setToken(authStatus?.token || "")

        /*
         * 3️⃣ Get post
         */
        const response = await apiService.get(`/api/v1/landing/posts/${postId}`, { token: authStatus?.token || "" })
        console.log('response', response)

        setExperienceData({
          title: response.title,
          experience: response.experience,
          pildoras: response.pildoras,
          reflection: response.reflection,
          story_valuable: response.story_valuable,
          rawInterviewText: response.rawInterviewText,
          visibility: response.visibility,
        })

      } catch (err) {
        console.error('Error fetching post:', err)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }
  
    if (postId) {
      fetchPost()
    } else {
      router.push('/')
    }
  }, [postId])

  const handleShareWhatsApp = (experienceData: ExperienceData) => {
    console.log('experienceData', experienceData)
    const postId = localStorage.getItem('postId')
    const message = encodeURIComponent(
      `¡Mira lo que acabo de escribir con Wanna!
      \n _${experienceData?.title}_
      \nhttps://frontend.playground.wannna.ai/story/${postId}`
    )
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className={styles.succeed}>
      </div>
    )
  }

  return (
    <div className={styles.succeed}>
      <div className={styles.succeed__content}>
        <div className={styles.succeed__content__header}>
          <div className={styles.succeed__content__header__text}>
            <div className={styles.succeed__content__header__text__info}>
              <div className={ `${styles.succeed__content__header__text__info__item} ${styles.succeed__content__header__text__info__item__highlight}`}>
                <p><span className="highlight">Gracias</span> por probar Wanna</p>
              </div>
              <div className={styles.succeed__content__header__text__info__item}>
                <p>Te hemos enviado <strong>tu historia</strong> por mail. Cuando lancemos Wanna al 100%, te avisaremos.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.succeed__content__separator} />

        <div className={styles.succeed__content__story}>
          <div className={styles.succeed__content__story__header}>
            <h1 className={styles.succeed__content__story__header__title}>
              {experienceData?.visibility === 'PRIVATE' ? 'Déjate conocer más por las personas que te aprecian ' : 'Comparte tu historia '} &#10084;&#65039;
            </h1>
          </div>
          
          <div className={styles.succeed__content__story__story} onClick={() => handleShareWhatsApp(experienceData ?? { title: '', experience: '', pildoras: [], reflection: '', story_valuable: '', rawInterviewText: '', visibility: 'PRIVATE' })}>
            <div className={styles.succeed__content__story__story__content}>
              <div className={styles.succeed__content__story__story__header}>
                <svg className={styles.succeed__content__story__story__header__svg} width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.74999 1.75571V16.9415M9.74999 1.75571L10.7401 1.38414C12.9932 0.538619 15.5067 0.538619 17.7599 1.38414C18.3579 1.60855 18.75 2.15192 18.75 2.75616V15.2217C18.75 16.0515 17.8568 16.6188 17.0356 16.3107C15.2474 15.6396 13.2526 15.6396 11.4644 16.3107L9.76234 16.9494C9.75642 16.9516 9.74999 16.9475 9.74999 16.9415M9.74999 1.75571L8.75987 1.38414C6.50674 0.538619 3.99326 0.538619 1.74012 1.38414C1.14212 1.60855 0.75 2.15192 0.75 2.75616V15.2217C0.75 16.0515 1.64322 16.6188 2.46436 16.3107C4.25258 15.6396 6.24742 15.6396 8.03563 16.3107L9.73765 16.9494C9.74356 16.9516 9.74999 16.9475 9.74999 16.9415" stroke="var(--color-white)" strokeWidth="1.5"/>
                </svg>
                <p>Tu historia</p>
              </div>
              
              <p className={styles.succeed__content__story__story__title}>{experienceData?.title}</p>
              <p className={styles.succeed__content__story__story__by}>by {userInfo?.fullName}</p>
            </div>

            <button className={`${styles.succeed__content__story__button} ${styles.succeed__content__story__button__whatsapp}`}> 
              <div className={styles.succeed__content__story__button__whatsapp}>
                <p>Compartir</p>
                <div className={styles.succeed__content__story__button__whatsapp__svg}>
                  <svg className={styles.succeed__content__story__button__whatsapp__svg__icon} fill="transparent" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path fill='var(--color-white)' stroke='var(--color-white)' d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
                  </svg>
                </div>
              </div>
            </button>

          </div>

          <p className={styles.succeed__content__story__subtitle}>En este <Link className={styles.succeed__content__story__header__link} href={`/story/${localStorage.getItem('postId')}`} target='_blank'>enlace privado</Link> podrás ver tu historia, quién la ha leido y los comentarios</p>
          
        </div>

        <div className={styles.succeed__content__separator} />
        
        <div className={styles.succeed__content__recommend}>
          <button className={styles.succeed__content__recommend__button}>
            <p className={styles.succeed__content__recommend__button__text}>¡Recomiéndale a un amigo una charla con Wanna!</p>

            <div className={styles.succeed__content__recommend__button__svg}>
              <svg className={styles.succeed__content__recommend__button__svg__icon} fill="transparent" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path fill='var(--color-white)' stroke='var(--color-white)' d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
              </svg>
            </div>
          </button>
        </div>
        
        <div className={styles.succeed__fixed}>
          <button className={styles.succeed__fixed__button} onClick={() => router.push('/chat')}>
            <p>Volver a hablar con Wanna</p>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 8.5H16.5M7.5 12.5H13" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 10.5C2 9.72921 2.01346 8.97679 2.03909 8.2503C2.12282 5.87683 2.16469 4.69009 3.13007 3.71745C4.09545 2.74481 5.3157 2.6926 7.7562 2.58819C9.09517 2.5309 10.5209 2.5 12 2.5C13.4791 2.5 14.9048 2.5309 16.2438 2.58819C18.6843 2.6926 19.9046 2.74481 20.8699 3.71745C21.8353 4.69009 21.8772 5.87683 21.9609 8.2503C21.9865 8.97679 22 9.72921 22 10.5C22 11.2708 21.9865 12.0232 21.9609 12.7497C21.8772 15.1232 21.8353 16.3099 20.8699 17.2826C19.9046 18.2552 18.6843 18.3074 16.2437 18.4118C15.5098 18.4432 14.7498 18.4667 13.9693 18.4815C13.2282 18.4955 12.8576 18.5026 12.532 18.6266C12.2064 18.7506 11.9325 18.9855 11.3845 19.4553L9.20503 21.3242C9.07273 21.4376 8.90419 21.5 8.72991 21.5C8.32679 21.5 8 21.1732 8 20.7701V18.4219C7.91842 18.4186 7.83715 18.4153 7.75619 18.4118C5.31569 18.3074 4.09545 18.2552 3.13007 17.2825C2.16469 16.3099 2.12282 15.1232 2.03909 12.7497C2.01346 12.0232 2 11.2708 2 10.5Z" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SucceedPage