'use client'

import { useState, useContext } from 'react'
import Image from 'next/image'
import styles from './Edit.module.scss'
import { AppContext } from '@/context/AppContext'
import { useRouter } from 'next/navigation'

type PrivacyOption = 'public' | 'private'

type ExperienceData = {
  title: string
  experience: string
  pildoras: string[]
  reflection: string
  story_valuable: string
  rawInterviewText: string
}

const EditPage = () => {
  const router = useRouter()

  const { experienceData, setExperienceData } = useContext(AppContext)
  const [privacy, setPrivacy] = useState<PrivacyOption>('private')


  const handlePublish = () => {

    /**
     * TODO: Visibilidad del post
     */

    console.log('Visibilidad del post:', privacy)
    router.push('/succeed')
  }

  return (
    <>
      <div className={styles.edit}>
        <h1 className={styles.edit__title}>Decide quién puede ver tu historia</h1>

        <div className={styles.edit__value}>
          <div className={styles.edit__value__header}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.26836 14.4091L5.88799 9.25747M7.26836 14.4091L5.01454 15.013M7.26836 14.4091L8.62335 14.5575M5.88799 9.25747L2.34627 10.2065C1.8128 10.3494 1.49622 10.8978 1.63916 11.4312L2.50189 14.651C2.64483 15.1844 3.19317 15.501 3.72663 15.3581L5.01454 15.013M5.88799 9.25747L12.6295 3.22613C13.5296 2.42084 14.6123 1.84693 15.784 1.55402C15.9048 1.52384 16.0279 1.59415 16.0632 1.7135L19.9222 14.75C19.9652 14.8955 19.8827 15.0484 19.7375 15.0922C18.5912 15.4384 17.3864 15.5476 16.1965 15.4131L8.62335 14.5575M5.01454 15.013L7.3621 20.4041C7.55972 20.8579 8.05963 21.0989 8.53776 20.9708L9.83885 20.6222C10.4173 20.4672 10.7307 19.842 10.5089 19.2858L8.62335 14.5575" stroke="var(--color-black)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.8716 6.65375C17.8716 6.65375 19.882 6.2391 20.3779 8.08975C20.8738 9.94039 18.9254 10.5865 18.9254 10.5865" stroke="var(--color-black)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2>Valor de tu experiencia</h2>
          </div>
          <p>{experienceData?.story_valuable || localStorage.getItem('story_valuable')}</p>
        </div>

        <div className={styles.edit__privacy}>
          <h2 className={styles.edit__privacy__title}>Decide quién puede ver tu historia</h2>
          <div className={styles.edit__privacy__options}>
            <label className={styles.edit__privacy__options__option}>
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={privacy === 'public'}
                onChange={(e) => setPrivacy(e.target.value as PrivacyOption)}
              />
              <div className={styles.edit__privacy__options__option__content}>
                <span className={styles.edit__privacy__options__option__radio}></span>
                <div>
                  <p className={styles.edit__privacy__options__option__title}>Pública</p>
                  <p className={styles.edit__privacy__options__option__description}>
                    Visible para todos cuando se lance Wanna
                  </p>
                </div>
              </div>
            </label>
            <label className={styles.edit__privacy__options__option}>
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={privacy === 'private'}
                onChange={(e) => setPrivacy(e.target.value as PrivacyOption)}
              />
              <div className={styles.edit__privacy__options__option__content}>
                <span className={styles.edit__privacy__options__option__radio}></span>
                <div>
                  <p className={styles.edit__privacy__options__option__title}>Privada</p>
                  <p className={styles.edit__privacy__options__option__description}>
                    Sólo visible para ti y quién tú decidas
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <button className={styles.edit__button} onClick={handlePublish}>
          <p>Finalizar y recibir mi historia</p>
        </button>
      </div>
    </>
  )
}

export default EditPage