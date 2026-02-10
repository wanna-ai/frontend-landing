'use client'
import { useEffect, useState, useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
import styles from './Story.module.scss'
import { apiService } from '@/services/api'
import LoginProviders from '@/components/LoginProviders/LoginProviders'
import { AppContext } from '@/context/AppContext'
import Image from 'next/image'
import Snippet from '@/components/Snippet/Snippet'
import { useAuth } from '@/app/hook/useAuth'

const MAX_COMMENT_LENGTH = 160

interface Attribution {
  fullName: string
  pictureUrl: string
}

interface Comment {
  content: string
  postId: string
  userId: string
  username: string
  id: string
}

interface Contributions {
  attribution: Attribution
  comments: Comment[]
}

interface Story {
  title: string
  content: string
  username: string
  fullname: string
  isOwner: boolean
  contributions: Contributions[]
}

interface PreviewStory {
  title: string
  previewContent: string
  username: string
  fullname: string
}

interface UserInfo {
  id: string
  fullName: string
  pictureUrl: string
  username: string
}

interface State {
  screen: "login" | "is-owner" | "not-owner"
}

const Modal = ({ story, onClose }: { story: Story, onClose: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (story) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [story]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (story) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [story, onClose]);

  const handleClose = () => {
    setIsClosing(true);

    // Wait for animation to finish
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // same duration as CSS animation
  };

  if (!story) return null;

  return (
    <div className={`${styles.modal} ${isOpen ? styles.open : ''} ${isClosing ? styles.closing : ''}`} onClick={handleClose}>
      <div className={styles.modal__overlay}></div>
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.modal__header}>
          <div className={styles.modal__header__info}>
            <h2 className={styles.modal__header__info__name}>{story.title}</h2>
          </div>
          <button 
            className={styles.modal__header__close} 
            onClick={handleClose}
            aria-label="Close modal"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.modal__story}>
          <p className={styles.modal__story__text}>{story.content}</p>
        </div>
      </div>
    </div>
  );
};

const StoryPage = () => {
  const params = useParams()
  const id = params.id // '2903932'
  const router = useRouter()
  const { checkAuthStatus } = useAuth();

  const { token, userInfo } = useContext(AppContext)

  const [isLoading, setIsLoading] = useState(true)

  const [story, setStory] = useState<Story | null>(null)
  const [previewStory, setPreviewStory] = useState<PreviewStory | null>(null)
  const [state, setState] = useState<State>({ screen: 'login' })
  const [isExpanded, setIsExpanded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comment, setComment] = useState('')


  /*
   * Handle go to chat
   */
  const handleGoToChat = async (_url: string) => {
    router.push(_url)
  }

  useEffect(() => {
    let isMounted = true

    const fetchStory = async () => {

      setIsLoading(true)

      localStorage.setItem('postId', id as string)

      try {
        /*
         * 1️⃣ Get token from cookie
         */

        const authStatus = await checkAuthStatus();

        // only if user is guest or there is no user
        if (authStatus?.isGuest) {
          const previewResponse = await apiService.get(`/api/v1/landing/posts/${id}/preview`)

          setPreviewStory({
            title: previewResponse.title,
            previewContent: previewResponse.previewContent,
            username: previewResponse.userName,
            fullname: previewResponse.fullName,
          })

          return
        }

        /*
         * 2️⃣ Fetch story data
         */
        const response = await apiService.get(`/api/v1/landing/posts/${id}`, { 
          token: authStatus?.token || ""
        })
        
        if (!isMounted) return

        setStory({
          title: response.title,
          content: response.content,
          username: response.userName,
          isOwner: response.isOwner,
          contributions: response.contributions,
          fullname: response.fullName,
        })

        /*
         * 3️⃣ Determine screen based on token and ownership
         */
        if (!authStatus?.token) {
          setState({ screen: 'login' })
        } else if (response.isOwner) {
          setState({ screen: 'is-owner' })
        } else {
          setState({ screen: 'not-owner' })
        }

      } catch (error) {

        const previewResponse = await apiService.get(`/api/v1/landing/posts/${id}/preview`)

        if (!isMounted) return

        setPreviewStory({
          title: previewResponse.title,
          previewContent: previewResponse.previewContent,
          username: previewResponse.userName,
          fullname: previewResponse.fullName,
        })

        setState({ screen: 'login' })
      } finally {
        setIsLoading(false)
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

  /*
  * Handle send comment
  */
  const handleSendComment = async (token: string, userInfo: UserInfo) => {
    const commentText = comment.trim()
  
    if (!commentText) {
      console.log('No hay comentario para enviar')
      return
    }

    console.log(token)
    console.log("userInfo", userInfo)
    console.log("postId",id)
    
    console.log('Enviando comentario:', commentText)

    try {
      await apiService.post(`/api/v1/posts/comments`, {
        content: commentText,
        postId: id,
        userId: userInfo?.id,
      }, { token: token })

      setComment('')
    } catch (error) {
      console.error('Error al enviar comentario:', error)
    }

  }
  
  
  if (isLoading) {
    return (
      <div className={styles.story}>
      </div>
    )
  }

  return (
    <div className={styles.story}>
      {state.screen === 'login' && (
        <div className={styles.story__login}>
          <h1 className={styles.story__login__title}><span className="highlight">{previewStory?.fullname}</span> desea compartir contigo una historia personal</h1>

          {previewStory && (
            <div className={styles.story__login__content}>
                <Snippet icon="story" header="Tu historia" content={previewStory?.title || ''} />
            </div>
          )}


          <div className={styles.story__login__login}>
            <h3>Para poder leer la historia completa, registrate</h3>
            <LoginProviders lastpage="story" />
          </div>
          
        </div>
      )}

      {state.screen === 'is-owner' && (
        <div className={styles.story__isowner}>
          <h1 className={styles.story__isowner__title}>Eres el dueño de esta historia</h1>

          <div className={styles.story__isowner__snippet} onClick={() => setIsModalOpen(true)}>
            <p className={styles.story__isowner__snippet__title}>{story?.title}</p>
            <div className={styles.story__isowner__snippet__buttons}>
              <div className={styles.story__isowner__snippet__buttons__button}>

                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5C8 5 5 8 2.5 12C5 16 8 19 12 19C16 19 19 16 21.5 12C19 8 16 5 12 5Z" stroke="var(--color-black)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="var(--color-black)" strokeWidth="1.4"/>
                </svg>

              </div>
            </div>
          </div>

          {story?.contributions && story.contributions.length > 0 ? (
            <div className={styles.story__isowner__contributions}>
              <h3>Personas que han leído tu historia ({story.contributions.length}):</h3>
              {story.contributions.map((contribution) => (
                <div key={contribution.attribution.fullName} className={styles.story__isowner__contributions__contribution}>
                  <div className={styles.story__isowner__contributions__contribution__header}>
                    {contribution.attribution.pictureUrl && (
                      <Image 
                        src={contribution.attribution.pictureUrl} 
                        alt={contribution.attribution.fullName || 'Usuario'} 
                        className={styles.story__isowner__contributions__contribution__header__avatar}
                        width={32}
                        height={32}
                      />
                    )}
                    <div className={styles.story__isowner__contributions__contribution__header__info}>
                      <span className={styles.story__isowner__contributions__contribution__header__info__name}>
                        {contribution.attribution.fullName || 'Usuario anónimo'}
                      </span>

                    </div>
                  </div>
                  
                  {contribution.comments.length > 0 && (
                    <div className={styles.story__isowner__contributions__contribution__comments}>
                      {contribution.comments.map((comment) => (
                        <div key={comment.id} className={styles.story__isowner__contributions__contribution__comments__comment}>
                          <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.929 3H17.7697C23.8448 3 28.7697 7.92487 28.7697 14L28.7697 14.2563L28.5817 22.9402C28.5451 24.6345 28.7957 26.3227 29.3232 27.9332L29.4224 28.2364C29.6702 28.993 28.9776 29.7216 28.2094 29.5125L26.6055 29.0758C25.2374 28.7033 23.8233 28.5267 22.4056 28.5513L16.7 28.65H11.8C6.38761 28.65 2 24.2624 2 18.85V12.929C2 7.44538 6.44538 3 11.929 3Z" stroke="var(--color-gray)" strokeWidth="1.4"/>
                            <circle cx="1" cy="1" r="1" transform="matrix(-1 0 0 1 21 15)" fill="var(--color-gray)"/>
                            <circle cx="1" cy="1" r="1" transform="matrix(-1 0 0 1 17 15)" fill="var(--color-gray)"/>
                            <circle cx="1" cy="1" r="1" transform="matrix(-1 0 0 1 13 15)" fill="var(--color-gray)"/>
                          </svg>

                          <p className={styles.story__isowner__contributions__contribution__comments__comment__content}>{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.story__isowner__contributions}>
              <p className={styles.story__isowner__contributions__noone}>Todavía no hay personas que hayan leído tu historia</p>
            </div>
          )}

          {isModalOpen && (
            <Modal story={story!} onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      )}

      {state.screen === 'not-owner' && (
        <div className={styles.story__notowner}>
          <div className={styles.story__notowner__header}>
            <h1 className={styles.story__notowner__header__title}><span className="highlight">{story?.fullname}</span> generó esta historia charlando 2 minutos con Wanna</h1>
            <h3 className={styles.story__notowner__header__subtitle}>También le dió una reflexión... pero eso ya es privado :) </h3>
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

            <textarea 
              className={styles.story__notowner__comment__textarea} 
              placeholder='Escribe tu comentario...'
              value={comment}
              onChange={(e) => {
                if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                  setComment(e.target.value)
                }
              }}
              maxLength={MAX_COMMENT_LENGTH}
            />
            
            <button className={styles.story__notowner__comment__svg} onClick={() => handleSendComment(token!, userInfo!)}>
              <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="28" y="28" width="27" height="27" rx="13.5" transform="rotate(180 28 28)" stroke="var(--color-black)" fill="var(--color-black)" strokeWidth="2"/>
                <path d="M14 22L14 9.5" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="14" y1="8.394" x2="10.0607" y2="12.3333" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="0.75" y1="-0.75" x2="6.32107" y2="-0.75" transform="matrix(0.707107 0.707107 0.707107 -0.707107 14 7.33334)" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className={styles.story__notowner__comment__counter}>
            {comment.length}/{MAX_COMMENT_LENGTH}
          </div>

          <button className={styles.story__notowner__button} onClick={() => handleGoToChat(`/chat`)}>
            <p>Hablar con Wanna</p>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 8.5H16.5M7.5 12.5H13" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 10.5C2 9.72921 2.01346 8.97679 2.03909 8.2503C2.12282 5.87683 2.16469 4.69009 3.13007 3.71745C4.09545 2.74481 5.3157 2.6926 7.7562 2.58819C9.09517 2.5309 10.5209 2.5 12 2.5C13.4791 2.5 14.9048 2.5309 16.2438 2.58819C18.6843 2.6926 19.9046 2.74481 20.8699 3.71745C21.8353 4.69009 21.8772 5.87683 21.9609 8.2503C21.9865 8.97679 22 9.72921 22 10.5C22 11.2708 21.9865 12.0232 21.9609 12.7497C21.8772 15.1232 21.8353 16.3099 20.8699 17.2826C19.9046 18.2552 18.6843 18.3074 16.2437 18.4118C15.5098 18.4432 14.7498 18.4667 13.9693 18.4815C13.2282 18.4955 12.8576 18.5026 12.532 18.6266C12.2064 18.7506 11.9325 18.9855 11.3845 19.4553L9.20503 21.3242C9.07273 21.4376 8.90419 21.5 8.72991 21.5C8.32679 21.5 8 21.1732 8 20.7701V18.4219C7.91842 18.4186 7.83715 18.4153 7.75619 18.4118C5.31569 18.3074 4.09545 18.2552 3.13007 17.2825C2.16469 16.3099 2.12282 15.1232 2.03909 12.7497C2.01346 12.0232 2 11.2708 2 10.5Z" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

          </button>
        </div>

      )}
    </div>
  )
}

export default StoryPage