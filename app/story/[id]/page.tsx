'use client'
import { useEffect, useState, useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
import styles from './Story.module.scss'
import { apiService } from '@/services/api'
import LoginProviders from '@/components/LoginProviders/LoginProviders'
import { AppContext } from '@/context/AppContext'

interface Story {
  title: string
  content: string
  username: string
  isOwner: boolean
}

interface State {
  screen: "login" | "is-owner" | "not-owner"
}

const StoryPage = () => {
  const params = useParams()
  const id = params.id // '2903932'
  const router = useRouter()

  const { token, userInfo } = useContext(AppContext)
  console.log('userInfo', userInfo)

  const [story, setStory] = useState<Story | null>(null)
  const [state, setState] = useState<State>({ screen: 'login' })
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchStory = async () => {
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

        // Fetch story data
        const response = await apiService.get(`/api/v1/landing/posts/${id}`, { 
          token: token 
        })
        console.log('response', response)

        if (!isMounted) return

        setStory({
          title: response.title,
          content: response.content,
          username: response.userName,
          isOwner: response.isOwner,
        })

        // Determine screen based on token and ownership
        if (!token) {
          setState({ screen: 'login' })
        } else if (response.isOwner) {
          setState({ screen: 'is-owner' })
        } else {
          setState({ screen: 'not-owner' })
        }

      } catch (error) {
        console.error('Error fetching token:', error)
        if (isMounted) {
          router.push('/')
        }
      }
    }

    fetchStory()

    return () => {
      isMounted = false
    }
  }, [id])

  // Memoize truncated content to avoid recalculating on every render
  const truncatedContent = story?.content 
    ? story.content.split(' ').slice(0, isExpanded ? undefined : 50).join(' ')
    : ''

  const contentWordCount = story?.content?.split(' ').length || 0
  const shouldShowMore = contentWordCount > 100
  

  return (
    <div className={styles.story}>
      {state.screen === 'login' && (
        <div className={styles.story__login}>
          <h1 className={styles.story__login__title}><span className="highlight">{userInfo?.fullName}</span> desea compartir contigo una historia personal</h1>

          {story && (
            <div className={styles.story__login__content}>

              <div className={styles.story__login__content__header}>
                <svg className={styles.story__login__content__header__svg} width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.74999 1.75571V16.9415M9.74999 1.75571L10.7401 1.38414C12.9932 0.538619 15.5067 0.538619 17.7599 1.38414C18.3579 1.60855 18.75 2.15192 18.75 2.75616V15.2217C18.75 16.0515 17.8568 16.6188 17.0356 16.3107C15.2474 15.6396 13.2526 15.6396 11.4644 16.3107L9.76234 16.9494C9.75642 16.9516 9.74999 16.9475 9.74999 16.9415M9.74999 1.75571L8.75987 1.38414C6.50674 0.538619 3.99326 0.538619 1.74012 1.38414C1.14212 1.60855 0.75 2.15192 0.75 2.75616V15.2217C0.75 16.0515 1.64322 16.6188 2.46436 16.3107C4.25258 15.6396 6.24742 15.6396 8.03563 16.3107L9.73765 16.9494C9.74356 16.9516 9.74999 16.9475 9.74999 16.9415" stroke="var(--color-white)" strokeWidth="1.5"/>
                </svg>
                <p>{story.title}</p>
              </div>

              <div className={styles.story__login__content__content}>
                <p>{story.content.split(' ').slice(0, 20).join(' ')}...</p>
              </div>

            </div>
          )}

          <p>Para poder leer la historia completa, registrate</p>

          <div className={styles.story__login__login}>
            <LoginProviders />
          </div>
          
        </div>
      )}

      {state.screen === 'is-owner' && (
        <div className={styles.story__isowner}>
          <h1 className={styles.story__isowner__title}>Eres el dueño de esta historia</h1>
        </div>
      )}

      {state.screen === 'not-owner' && (
        <div className={styles.story__notowner}>
          <div className={styles.story__notowner__header}>
            <h1 className={styles.story__notowner__header__title}><span className="highlight">{userInfo?.fullName}</span> generó esta historia charlando 2 minutos con Wanna</h1>
            <h3 className={styles.story__notowner__header__subtitle}>También le dió una reflexió... pero eso ya es privado :) </h3>
          </div>

          <div className={styles.story__notowner__story}>
            <div className={styles.story__notowner__story__header}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.11757V20.9907M12 4.11757L13.1001 3.70473C15.6036 2.76525 18.3964 2.76525 20.8999 3.70473C21.5643 3.95407 22 4.55781 22 5.22919V19.0799C22 20.0018 21.0075 20.6321 20.0951 20.2898C18.1082 19.5441 15.8918 19.5441 13.9049 20.2898L12.0137 20.9994C12.0071 21.0019 12 20.9974 12 20.9907M12 4.11757L10.8999 3.70473C8.39638 2.76525 5.60362 2.76525 3.10014 3.70473C2.43569 3.95407 2 4.55781 2 5.22919V19.0799C2 20.0018 2.99247 20.6321 3.90485 20.2898C5.89175 19.5441 8.10825 19.5441 10.0951 20.2898L11.9863 20.9994C11.9929 21.0019 12 20.9974 12 20.9907" stroke="var(--color-black)" strokeWidth="1.5"/>
              </svg>
              <h2 className={styles.story__notowner__story__header__title}>{story?.title}</h2>
            </div>

            <p className={styles.story__notowner__story__content}>
              {isExpanded ? (
                <>
                  {story?.content}
                </>
              ) : (
                <>
                  {truncatedContent}
                  {shouldShowMore && (
                    <>
                      ...
                      <span 
                        onClick={() => setIsExpanded(true)}
                        className={styles.story__notowner__story__more}
                      >
                        { " " } más
                      </span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          <div className={styles.story__notowner__comment}>

            <textarea className={styles.story__notowner__comment__textarea} placeholder='Escribe tu comentario...' />
            
            <svg className={styles.story__notowner__comment__svg} width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="28" y="28" width="27" height="27" rx="13.5" transform="rotate(180 28 28)" stroke="var(--color-main)" fill="var(--color-main)" strokeWidth="2"/>
              <path d="M14 22L14 9.5" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="14" y1="8.394" x2="10.0607" y2="12.3333" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0.75" y1="-0.75" x2="6.32107" y2="-0.75" transform="matrix(0.707107 0.707107 0.707107 -0.707107 14 7.33334)" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>

          </div>

          <p>añadir tope de carateres si hay</p>

          <button>Hablar con Wanna</button>
        </div>

      )}
    </div>
  )
}

export default StoryPage