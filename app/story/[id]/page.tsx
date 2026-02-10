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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import CardStory from '@/components/CardStory/CardStory'

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
  userPictureUrl: string
}

interface PreviewStory {
  title: string
  previewContent: string
  username: string
  fullname: string
  userPictureUrl: string
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              p: ({ children }) => <p className={styles.modal__story__text}>{children}</p>,
            }}
          >
            {story.content}
          </ReactMarkdown>
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

  const { token, userInfo, setColorInverse, colorInverse, setToast } = useContext(AppContext)

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
          console.log("previewResponse", previewResponse)
          setPreviewStory({
            title: previewResponse.title,
            previewContent: previewResponse.previewContent,
            username: previewResponse.userName,
            fullname: previewResponse.fullName,
            userPictureUrl: previewResponse.userPictureUrl,
          })

          return
        }

        /*
         * 2️⃣ Fetch story data
         */
        const response = await apiService.get(`/api/v1/landing/posts/${id}`, { 
          token: authStatus?.token || ""
        })

        console.log("response", response)

        if (!isMounted) return

        setStory({
          title: response.title,
          content: response.content,
          username: response.userName,
          isOwner: response.isOwner,
          contributions: response.contributions,
          fullname: response.fullName,
          userPictureUrl: response.userPictureUrl,
        })

        /*
         * 3️⃣ Determine screen based on token and ownership
         */
        if (!authStatus?.token) {
          setState({ screen: 'login' })
          setColorInverse(false)
        } else if (response.isOwner) {
          setState({ screen: 'is-owner' })
          setColorInverse(false)
        } else {
          setState({ screen: 'not-owner' })
          setColorInverse(true)
        }

      } catch (error) {

        const previewResponse = await apiService.get(`/api/v1/landing/posts/${id}/preview`)

        console.log("previewResponse", previewResponse)
        if (!isMounted) return

        setPreviewStory({
          title: previewResponse.title,
          previewContent: previewResponse.previewContent,
          username: previewResponse.userName,
          fullname: previewResponse.fullName,
          userPictureUrl: previewResponse.userPictureUrl,
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

      setToast({
        show: true,
        message: 'Comentario enviado correctamente',
        type: 'success',
      })

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
    <div className={`${styles.story} ${state.screen == 'not-owner' ? `${styles.story__p0}` : ""}`}>
      {state.screen === 'login' && (
        <div className={styles.story__login}>

          <p>{previewStory?.fullname} desea compartir contigo una historia personal</p>

          {previewStory && (
            <div className={styles.story__login__content}>
                <CardStory user={{ pictureUrl: previewStory?.userPictureUrl ?? '', fullName: previewStory?.fullname ?? '' }} title={previewStory?.title || ''} />
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

          <div className={styles.story__isowner__card} onClick={() => setIsModalOpen(true)}>
            <CardStory user={userInfo ?? { pictureUrl: '', fullName: '' }} title={story?.title ?? ''} />
          </div>

          {story?.contributions && story.contributions.length > 0 ? (
            <div className={styles.story__isowner__contributions}>
              
              <p className={styles.story__isowner__contributions__title}>
                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.39922 0.699951C1.39922 0.313352 1.08582 -4.88162e-05 0.699219 -4.88162e-05C0.312619 -4.88162e-05 -0.000781238 0.313352 -0.000781238 0.699951H0.699219H1.39922ZM13.1497 15.0233C13.4231 14.7499 13.4231 14.3067 13.1497 14.0333L8.69497 9.57857C8.4216 9.3052 7.97838 9.3052 7.70502 9.57857C7.43165 9.85194 7.43165 10.2952 7.70502 10.5685L11.6648 14.5283L7.70502 18.4881C7.43165 18.7615 7.43165 19.2047 7.70502 19.4781C7.97838 19.7514 8.4216 19.7514 8.69497 19.4781L13.1497 15.0233ZM0.699219 0.699951H-0.000781238V11.5283H0.699219H1.39922V0.699951H0.699219ZM3.69922 14.5283V15.2283H12.6548V14.5283V13.8283H3.69922V14.5283ZM0.699219 11.5283H-0.000781238C-0.000781238 13.5718 1.65577 15.2283 3.69922 15.2283V14.5283V13.8283C2.42896 13.8283 1.39922 12.7986 1.39922 11.5283H0.699219Z" fill="#90A1B9"/>
                </svg>
                Personas que han leído tu historia:
              </p>

              <div className={styles.story__isowner__contributions__list}>
                {story.contributions.flatMap((contribution) =>
                  contribution.comments.map((comment) => (
                    <div key={comment.id} className={styles.story__isowner__contributions__contribution}>
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

                      <p className={styles.story__isowner__contributions__contribution__comments__comment__content}>
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
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
            <p>{story?.fullname} generó esta historia charlando 2 minutos con wanna</p>
            <p>También le dió una reflexión... pero eso ya es privado :)</p>
          </div>

          <div className={styles.story__notowner__story}>
            <div className={styles.story__notowner__story__header}>
              <div className={styles.story__notowner__story__header__user}>
                <Image className={styles.story__notowner__story__header__user__picture} src={story?.userPictureUrl ?? ''} alt={story?.fullname ?? ''} width={24} height={24} />
                <p className={styles.story__notowner__story__header__user__name}>{story?.fullname ?? ''}</p>
              </div>
            </div>

            <div className={styles.story__notowner__story__body}>
              <h1 className={styles.story__notowner__story__body__title}>{story?.title}</h1>

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <p className={styles.story__notowner__story__body__text}>{children}</p>,
                }}
              >
                {story?.content}
              </ReactMarkdown>
            </div>

            <div className={styles.story__notowner__story__comment}>
              <p className={styles.story__notowner__story__comment__title}>
                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.39922 0.699951C1.39922 0.313352 1.08582 -4.88162e-05 0.699219 -4.88162e-05C0.312619 -4.88162e-05 -0.000781238 0.313352 -0.000781238 0.699951H0.699219H1.39922ZM13.1497 15.0233C13.4231 14.7499 13.4231 14.3067 13.1497 14.0333L8.69497 9.57857C8.4216 9.3052 7.97838 9.3052 7.70502 9.57857C7.43165 9.85194 7.43165 10.2952 7.70502 10.5685L11.6648 14.5283L7.70502 18.4881C7.43165 18.7615 7.43165 19.2047 7.70502 19.4781C7.97838 19.7514 8.4216 19.7514 8.69497 19.4781L13.1497 15.0233ZM0.699219 0.699951H-0.000781238V11.5283H0.699219H1.39922V0.699951H0.699219ZM3.69922 14.5283V15.2283H12.6548V14.5283V13.8283H3.69922V14.5283ZM0.699219 11.5283H-0.000781238C-0.000781238 13.5718 1.65577 15.2283 3.69922 15.2283V14.5283V13.8283C2.42896 13.8283 1.39922 12.7986 1.39922 11.5283H0.699219Z" fill="#90A1B9"/>
                </svg>
                Dejale tu comentario:
              </p>
              <textarea 
                className={styles.story__notowner__story__comment__textarea} 
                placeholder='Escribe tu comentario...'
                value={comment}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_COMMENT_LENGTH) {
                    setComment(e.target.value)
                  }
                }}
                maxLength={MAX_COMMENT_LENGTH}
              />
              
              <div className={styles.story__notowner__story__comment__counter}>
                {comment.length}/{MAX_COMMENT_LENGTH}
              </div>
              
              <button className={styles.story__notowner__story__comment__button} onClick={() => handleSendComment(token!, userInfo!)}>
                <p>Enviar comentario</p>
              </button>
            </div>

            
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryPage;