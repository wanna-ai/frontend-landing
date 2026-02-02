'use client'

import styles from './Preview.module.scss'
import { useState, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import { apiService } from '@/services/api'
import { AppContext } from "@/context/AppContext";
import { useRouter } from 'next/navigation'


export default function PreviewPage() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('postId') ?? undefined

  const router = useRouter()

  const { experienceData } = useContext(AppContext);

  const localTitle = localStorage.getItem('title')
  const localContent = localStorage.getItem('content')
  const localPills = localStorage.getItem('pills')
  const localReflection = localStorage.getItem('reflection')
  const localValue = localStorage.getItem('story_valuable')
  
  const [data, setData] = useState({
    title: experienceData?.title || localTitle,
    content: experienceData?.experience || localContent,
    pills: localPills?.split(' - '),
    reflection: localReflection,
    story_valuable: localValue,
  })

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
    <div className={styles.preview}>

      <h1 className={styles.preview__title}>Esta es tu historia</h1>

      <div className={styles.preview__experience}>
        <div className={styles.preview__experience__header}>
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.74999 1.75571V16.9415M9.74999 1.75571L10.7401 1.38414C12.9932 0.538619 15.5067 0.538619 17.7599 1.38414C18.3579 1.60855 18.75 2.15192 18.75 2.75616V15.2217C18.75 16.0515 17.8568 16.6188 17.0356 16.3107C15.2474 15.6396 13.2526 15.6396 11.4644 16.3107L9.76234 16.9494C9.75642 16.9516 9.74999 16.9475 9.74999 16.9415M9.74999 1.75571L8.75987 1.38414C6.50674 0.538619 3.99326 0.538619 1.74012 1.38414C1.14212 1.60855 0.75 2.15192 0.75 2.75616V15.2217C0.75 16.0515 1.64322 16.6188 2.46436 16.3107C4.25258 15.6396 6.24742 15.6396 8.03563 16.3107L9.73765 16.9494C9.74356 16.9516 9.74999 16.9475 9.74999 16.9415" stroke="black" strokeWidth="1.5"/>
          </svg>
          <h1 className={styles.preview__experience__hedaer__title}>{data.title}</h1>
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
                  ...{' '}
                  <span 
                    onClick={() => setIsExpanded(true)}
                    className={styles.preview__experience__more}
                  >
                    LEER MÁS
                  </span>
                </>
              )}
            </>
          )}
        </p>

        {(!shouldShowMore || isExpanded) && (
          <div className={styles.preview__experience__pills}>
            <h4>Píldoras breves</h4>
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.14286 14C4.41735 12.8082 4 11.4118 4 9.91886C4 5.54539 7.58172 2 12 2C16.4183 2 20 5.54539 20 9.91886C20 11.4118 19.5827 12.8082 18.8571 14" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7.38287 17.0982C7.291 16.8216 7.24507 16.6833 7.25042 16.5713C7.26174 16.3343 7.41114 16.1262 7.63157 16.0405C7.73579 16 7.88105 16 8.17157 16H15.8284C16.119 16 16.2642 16 16.3684 16.0405C16.5889 16.1262 16.7383 16.3343 16.7496 16.5713C16.7549 16.6833 16.709 16.8216 16.6171 17.0982C16.4473 17.6094 16.3624 17.8651 16.2315 18.072C15.9572 18.5056 15.5272 18.8167 15.0306 18.9408C14.7935 19 14.525 19 13.9881 19H10.0119C9.47495 19 9.2065 19 8.96944 18.9408C8.47283 18.8167 8.04281 18.5056 7.7685 18.072C7.63755 17.8651 7.55266 17.6094 7.38287 17.0982Z" stroke="black" strokeWidth="1.5"/>
            <path d="M15 19L14.8707 19.6466C14.7293 20.3537 14.6586 20.7072 14.5001 20.9866C14.2552 21.4185 13.8582 21.7439 13.3866 21.8994C13.0816 22 12.7211 22 12 22C11.2789 22 10.9184 22 10.6134 21.8994C10.1418 21.7439 9.74484 21.4185 9.49987 20.9866C9.34144 20.7072 9.27073 20.3537 9.12932 19.6466L9 19" stroke="black" strokeWidth="1.5"/>
            <path d="M12 16V11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className={styles.preview__reflection__header__title}>Reflexión (solo para ti)</h2>
        </div>
        <p>{data.reflection}</p>
      </div>

      <button className={styles.preview__button} onClick={() => router.push(`/visibility?postId=${postId}`)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.26836 14.4091L5.88799 9.25747M7.26836 14.4091L5.01454 15.013M7.26836 14.4091L8.62335 14.5575M5.88799 9.25747L2.34627 10.2065C1.8128 10.3494 1.49622 10.8978 1.63916 11.4312L2.50189 14.651C2.64483 15.1844 3.19317 15.501 3.72663 15.3581L5.01454 15.013M5.88799 9.25747L12.6295 3.22613C13.5296 2.42084 14.6123 1.84693 15.784 1.55402C15.9048 1.52384 16.0279 1.59415 16.0632 1.7135L19.9222 14.75C19.9652 14.8955 19.8827 15.0484 19.7375 15.0922C18.5912 15.4384 17.3864 15.5476 16.1965 15.4131L8.62335 14.5575M5.01454 15.013L7.3621 20.4041C7.55972 20.8579 8.05963 21.0989 8.53776 20.9708L9.83885 20.6222C10.4173 20.4672 10.7307 19.842 10.5089 19.2858L8.62335 14.5575" stroke="var(--color-white)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.8716 6.65375C17.8716 6.65375 19.882 6.2391 20.3779 8.08975C20.8738 9.94039 18.9254 10.5865 18.9254 10.5865" stroke="var(--color-white)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p>Descubrir el valor de tu historia</p>

      </button>
      
    </div>
  )
}