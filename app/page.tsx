'use client'

import { useEffect, useContext, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.scss'
import { apiService } from '@/services/api'
import { AppContext } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import LottieAnimation from '@/components/LottieAnimation/LottieAnimation'
import animationData from '@/public/animation.json'

// components
import OurStories from '@/components/OurStories/OurStories'
import FAQS from '@/components/FAQS/FAQS'
import Steps from '@/components/Steps/Steps'
import Checks from '@/components/Checks/Checks'

export default function Home() {
  const searchParams = useSearchParams()
  const communityId = searchParams.get('c') ?? undefined

  const router = useRouter()

  const handleGoToChat = async (_url: string) => {
    router.push(_url)
  }
  
  return (
    <>
      <div className={styles.home}>

        <div className={styles.home__content}>
          {/* HERO */}
          <div className={styles.home__content__hero}>

            <div className={styles.home__content__hero__content}>
              
              <h1 className={styles.home__content__hero__content__title}>Conócete mejor con <span className={styles.home__content__hero__content__title__span}>Wanna</span></h1>
              <h2>y comparte lo vivido</h2>
          
              <div className={styles.home__content__hero__content__steps}>
                <Steps />
              </div>
          
              <button className={styles.home__content__hero__content__button} onClick={() => handleGoToChat(`/chat`)}>
                <p>Hablar con Wanna</p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 8.5H16.5M7.5 12.5H13" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 10.5C2 9.72921 2.01346 8.97679 2.03909 8.2503C2.12282 5.87683 2.16469 4.69009 3.13007 3.71745C4.09545 2.74481 5.3157 2.6926 7.7562 2.58819C9.09517 2.5309 10.5209 2.5 12 2.5C13.4791 2.5 14.9048 2.5309 16.2438 2.58819C18.6843 2.6926 19.9046 2.74481 20.8699 3.71745C21.8353 4.69009 21.8772 5.87683 21.9609 8.2503C21.9865 8.97679 22 9.72921 22 10.5C22 11.2708 21.9865 12.0232 21.9609 12.7497C21.8772 15.1232 21.8353 16.3099 20.8699 17.2826C19.9046 18.2552 18.6843 18.3074 16.2437 18.4118C15.5098 18.4432 14.7498 18.4667 13.9693 18.4815C13.2282 18.4955 12.8576 18.5026 12.532 18.6266C12.2064 18.7506 11.9325 18.9855 11.3845 19.4553L9.20503 21.3242C9.07273 21.4376 8.90419 21.5 8.72991 21.5C8.32679 21.5 8 21.1732 8 20.7701V18.4219C7.91842 18.4186 7.83715 18.4153 7.75619 18.4118C5.31569 18.3074 4.09545 18.2552 3.13007 17.2825C2.16469 16.3099 2.12282 15.1232 2.03909 12.7497C2.01346 12.0232 2 11.2708 2 10.5Z" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* <Image className={styles.home__content__hero__image} src="/example_square_3.png" alt="Home Image Chat" width={747} height={747} /> */}
            <div className={styles.home__content__hero__animation}>
              <LottieAnimation animationData={animationData} style={{borderRadius: 'var(--space-4)', overflow: 'hidden', boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'}} />
            </div>
            
          </div>

          {/* STEPS */}
          <div className={styles.home__content__steps}>
            <Steps />
          </div>

          {/* CHECKS */}
          <div className={styles.home__content__checks}>
            <Checks />
          </div>
          
          {/* OUR STORIES */}
          <div className={styles.home__content__our_stories}>
            <OurStories />
          </div>
          
          {/* FAQS */}
          <div className={styles.home__content__faqs}>

            <FAQS />

          </div>
        </div>

        <button className={styles.home__button} onClick={() => handleGoToChat(`/chat`)}>
          <p>Hablar con Wanna</p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 8.5H16.5M7.5 12.5H13" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 10.5C2 9.72921 2.01346 8.97679 2.03909 8.2503C2.12282 5.87683 2.16469 4.69009 3.13007 3.71745C4.09545 2.74481 5.3157 2.6926 7.7562 2.58819C9.09517 2.5309 10.5209 2.5 12 2.5C13.4791 2.5 14.9048 2.5309 16.2438 2.58819C18.6843 2.6926 19.9046 2.74481 20.8699 3.71745C21.8353 4.69009 21.8772 5.87683 21.9609 8.2503C21.9865 8.97679 22 9.72921 22 10.5C22 11.2708 21.9865 12.0232 21.9609 12.7497C21.8772 15.1232 21.8353 16.3099 20.8699 17.2826C19.9046 18.2552 18.6843 18.3074 16.2437 18.4118C15.5098 18.4432 14.7498 18.4667 13.9693 18.4815C13.2282 18.4955 12.8576 18.5026 12.532 18.6266C12.2064 18.7506 11.9325 18.9855 11.3845 19.4553L9.20503 21.3242C9.07273 21.4376 8.90419 21.5 8.72991 21.5C8.32679 21.5 8 21.1732 8 20.7701V18.4219C7.91842 18.4186 7.83715 18.4153 7.75619 18.4118C5.31569 18.3074 4.09545 18.2552 3.13007 17.2825C2.16469 16.3099 2.12282 15.1232 2.03909 12.7497C2.01346 12.0232 2 11.2708 2 10.5Z" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

        </button>
        
      </div>
    </>
  );
}

