'use client'

import styles from './Preview.module.scss'
import { useState, useContext, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { apiService } from '@/services/api'
import { AppContext } from "@/context/AppContext";
import { useRouter } from 'next/navigation'

export default function PreviewPage() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('postId') ?? undefined

  const router = useRouter()

  const [data, setData] = useState({
    title: '',
    content: '',
    pills: [],
    reflection: '',
    story_valuable: '',
  })

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


        const response = await apiService.get(`/api/v1/landing/posts/${postId}`, { token: token })
        console.log('response', response)

        setData({
          title: response.title,
          content: response.content,
          pills: response.pildoras,
          reflection: response.reflection,
          story_valuable: response.story_valuable,
        })

      } catch (err) {
        console.error('Error fetching post:', err)
        router.push('/')
      }
    }
  
    if (postId) {
      fetchPost()
    } else {
      router.push('/')
    }
  }, [postId])

  const [isExpanded, setIsExpanded] = useState(false)

  // Function to truncate text to specified word count
  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return ''
    const words = text.split(' ')
    if (words.length <= wordLimit) return text
    return words.slice(0, wordLimit).join(' ')
  }

  const contentWordCount = data.content ? data.content.split(' ').length : 0
  const shouldShowMore = contentWordCount > 100

  return (
    <div className={styles.preview} >

      <h1 className={styles.preview__title}>Esta es tu <span className={styles.preview__title__span}>historia</span></h1>

      <div className={styles.preview__content} style={{ backgroundImage: `url(/ascii.png)` }}>
        <div className={styles.preview__experience}>
          <div className={styles.preview__experience__header}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.11757V20.9907M12 4.11757L13.1001 3.70473C15.6036 2.76525 18.3964 2.76525 20.8999 3.70473C21.5643 3.95407 22 4.55781 22 5.22919V19.0799C22 20.0018 21.0075 20.6321 20.0951 20.2898C18.1082 19.5441 15.8918 19.5441 13.9049 20.2898L12.0137 20.9994C12.0071 21.0019 12 20.9974 12 20.9907M12 4.11757L10.8999 3.70473C8.39638 2.76525 5.60362 2.76525 3.10014 3.70473C2.43569 3.95407 2 4.55781 2 5.22919V19.0799C2 20.0018 2.99247 20.6321 3.90485 20.2898C5.89175 19.5441 8.10825 19.5441 10.0951 20.2898L11.9863 20.9994C11.9929 21.0019 12 20.9974 12 20.9907" stroke="var(--color-black)" strokeWidth="1.5"/>
          </svg>

            <h2 className={styles.preview__experience__header__title}>{data.title}</h2>
          </div>
          
          <p className={styles.preview__experience__content}>
            {isExpanded ? (
              <>
                {data.content}
              </>
            ) : (
              <>
                {truncateText(data.content || '', 100)}
                {shouldShowMore && (
                  <>
                    ...
                    <span 
                      onClick={() => setIsExpanded(true)}
                      className={styles.preview__experience__more}
                    >
                      { " " } más
                    </span>
                  </>
                )}
              </>
            )}
          </p>

          {(!shouldShowMore || isExpanded) && (
            <div className={styles.preview__experience__pills}>
              <h4 className={styles.preview__experience__pills__title}>Píldoras breves</h4>
              <ul>
                {data.pills?.map((pildora) => (
                  <li key={pildora}>{pildora}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.preview__reflection}>
          <div className={styles.preview__reflection__header}>
            <svg className={styles.preview__reflection__header__svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.14286 14C4.41735 12.8082 4 11.4118 4 9.91886C4 5.54539 7.58172 2 12 2C16.4183 2 20 5.54539 20 9.91886C20 11.4118 19.5827 12.8082 18.8571 14" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7.38287 17.0982C7.291 16.8216 7.24507 16.6833 7.25042 16.5713C7.26174 16.3343 7.41114 16.1262 7.63157 16.0405C7.73579 16 7.88105 16 8.17157 16H15.8284C16.119 16 16.2642 16 16.3684 16.0405C16.5889 16.1262 16.7383 16.3343 16.7496 16.5713C16.7549 16.6833 16.709 16.8216 16.6171 17.0982C16.4473 17.6094 16.3624 17.8651 16.2315 18.072C15.9572 18.5056 15.5272 18.8167 15.0306 18.9408C14.7935 19 14.525 19 13.9881 19H10.0119C9.47495 19 9.2065 19 8.96944 18.9408C8.47283 18.8167 8.04281 18.5056 7.7685 18.072C7.63755 17.8651 7.55266 17.6094 7.38287 17.0982Z" stroke="black" strokeWidth="1.5"/>
              <path d="M15 19L14.8707 19.6466C14.7293 20.3537 14.6586 20.7072 14.5001 20.9866C14.2552 21.4185 13.8582 21.7439 13.3866 21.8994C13.0816 22 12.7211 22 12 22C11.2789 22 10.9184 22 10.6134 21.8994C10.1418 21.7439 9.74484 21.4185 9.49987 20.9866C9.34144 20.7072 9.27073 20.3537 9.12932 19.6466L9 19" stroke="black" strokeWidth="1.5"/>
              <path d="M12 16V11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className={styles.preview__reflection__header__title}>Reflexión (solo para ti)</h2>
          </div>
          <p>{data.reflection}</p>
        </div>
      </div>


      <div className={styles.preview__fixed}>
        <button className={styles.preview__button} onClick={() => router.push(`/visibility?postId=${postId}`)}>
          <p>Elige quién ve tu historia</p>
        </button>
      </div>

      
    </div>
  )
}