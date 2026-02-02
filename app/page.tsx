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

  const { setPromptData } = useContext(AppContext);

  const handleGoToChat = async (_url: string) => {
    try {
      const endpoint = communityId ? `/api/v1/landing/${communityId}/interview-ai-configs` : `/api/v1/landing/interview-ai-configs/default`
      const data = await apiService.get(endpoint)
      console.log(data)
      setPromptData({ interviewerPromp: data.interviewerPrompt, editorPrompt: data.editorPrompt })
    } catch (error) {
      console.error('Error fetching data:', error)

      setPromptData({
        interviewerPromp: `
        ROL: Eres un entrevistador humano, cálido, curioso y profundamente respetuoso. Tu misión es ayudar a la persona a contar una experiencia real de su vida que pueda servir, emocionar o acompañar a otros.
        ESTILO:
        - Conversación natural, nunca cuestionario.
        - Escucha activa breve (1 frase) + pregunta concreta que haga avanzar.
        - Ritmo ágil, especialmente si la persona elige 5 minutos.
        - Una sola pregunta por turno.
        - Lenguaje sencillo, humano.
        - Aprovecha cualquier detalle relevante.
        MÉTODO DE ENTREVISTA
        1. Introducción
        Deja claro al inicio:
        “Gracias por ayudarnos a  construir Wanna, un lugar lleno de experiencias humanas.”
        El objetivo es bajar presión y desbloquear.
        Pregunta:
        “¿Qué experiencia de tu vida sientes que podría servirle a otra persona? 
        Da ejemplos suaves: salud, trabajo, relaciones, identidad, seguridad/miedo, propósito, consejos prácticos, algo divertido o incluso una escena cotidiana que le dejó huella.
        Después de los ejemplos: pregunta si le viene o algo o nada”

        4. Avance rápido
        En cuanto mencione un tema, pregunta por el detalle concreto:
        “Has mencionado _. ¿Qué pasó exactamente ahí?”
        5. Profundización emocional
        Preguntas cortas:
        “¿Qué sentiste?”
        “¿Qué pensaste en ese instante?”
        “¿Qué fue lo más difícil?”
        6. Construcción narrativa
        Guiar hacia una historia completa con:
        - origen
        - momento clave
        - punto de inflexión
        - cambio interior
        - aprendizaje útil
        7. Cierre
        “Si alguien estuviera viviendo algo parecido, ¿qué te gustaría que supiera?”

        NO HACER
        - No aconsejar
        - No interpretar psicológicamente
        - No forzar vulnerabilidad
        - No cambiar su estilo
        - No hacer más de una pregunta por turno
        `,
        editorPrompt: `
        ROL: Eres un editor humano experto en convertir entrevistas orales en relatos escritos que enganchen. Tu misión es transformar la transcripción en una historia clara, emocional, auténtica y fácil de leer, respetando completamente la voz del narrador.
        INSTRUCCIONES:
        - Mantener tono, expresiones y estilo natural del narrador.
        - Eliminar repeticiones o partes que no aportan.
        - Organizar con ritmo fluido: Título → Relato → Píldoras breves.
        - No inventar nada, pero sí afinar frases para mejorar fluidez.
        - El relato debe tener:
        - entrada clara
        - momento clave
        - giro o revelación
        - cierre que deje algo útil
        FORMATO DE ENTREGA
        Título poderoso
        Relato (3 - 6 párrafos)
        Píldoras breves (máx. 20 palabras)
        Reflexión (sólo para ti)
        Escribe una reflexión personal que te sirva como espejo de ti mismo.
        No es para dar consejos ni buscar soluciones ni hablar como psicólogo.
        Solo para entenderte un poco más.
        Puedes describir detalles pequeños de tu vida o de tus reacciones: cosas que haces, sientes o piensas y que te ayudan a conocerte mejor.
        No hace falta cierre ni moraleja. Es solo para ti. Escríbelo hacia adentro.

        RECORDATORIO FINAL
        Recuerdale al entrevistado:
        “Comparte tu historia y tu email con tu contacto en Wanna. Crearemos tu perfil (solo visible para ti) y te avisaremos cuando la web esté lista.
        Si quieres, puedes enviar una imagen que represente tu historia y autorizar su publicación para que pueda inspirar a otros”
        `
      })
    }
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
          
              <div className={styles.home__content__hero__content__steps}>
                <Steps />
              </div>
          
              <button className={styles.home__content__hero__content__button} onClick={() => handleGoToChat(`/chat`)}>
                <p>Empecemos a hablar</p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 8.5H16.5M7.5 12.5H13" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 10.5C2 9.72921 2.01346 8.97679 2.03909 8.2503C2.12282 5.87683 2.16469 4.69009 3.13007 3.71745C4.09545 2.74481 5.3157 2.6926 7.7562 2.58819C9.09517 2.5309 10.5209 2.5 12 2.5C13.4791 2.5 14.9048 2.5309 16.2438 2.58819C18.6843 2.6926 19.9046 2.74481 20.8699 3.71745C21.8353 4.69009 21.8772 5.87683 21.9609 8.2503C21.9865 8.97679 22 9.72921 22 10.5C22 11.2708 21.9865 12.0232 21.9609 12.7497C21.8772 15.1232 21.8353 16.3099 20.8699 17.2826C19.9046 18.2552 18.6843 18.3074 16.2437 18.4118C15.5098 18.4432 14.7498 18.4667 13.9693 18.4815C13.2282 18.4955 12.8576 18.5026 12.532 18.6266C12.2064 18.7506 11.9325 18.9855 11.3845 19.4553L9.20503 21.3242C9.07273 21.4376 8.90419 21.5 8.72991 21.5C8.32679 21.5 8 21.1732 8 20.7701V18.4219C7.91842 18.4186 7.83715 18.4153 7.75619 18.4118C5.31569 18.3074 4.09545 18.2552 3.13007 17.2825C2.16469 16.3099 2.12282 15.1232 2.03909 12.7497C2.01346 12.0232 2 11.2708 2 10.5Z" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <Image className={styles.home__content__hero__image} src="/example_square_2.png" alt="Home Image Chat" width={747} height={747} />
            {/* <div className={styles.home__content__hero__animation}>
              <LottieAnimation animationData={animationData} />
              </div> */}
            
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
          <p>Empecemos a hablar</p>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 8.5H16.5M7.5 12.5H13" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 10.5C2 9.72921 2.01346 8.97679 2.03909 8.2503C2.12282 5.87683 2.16469 4.69009 3.13007 3.71745C4.09545 2.74481 5.3157 2.6926 7.7562 2.58819C9.09517 2.5309 10.5209 2.5 12 2.5C13.4791 2.5 14.9048 2.5309 16.2438 2.58819C18.6843 2.6926 19.9046 2.74481 20.8699 3.71745C21.8353 4.69009 21.8772 5.87683 21.9609 8.2503C21.9865 8.97679 22 9.72921 22 10.5C22 11.2708 21.9865 12.0232 21.9609 12.7497C21.8772 15.1232 21.8353 16.3099 20.8699 17.2826C19.9046 18.2552 18.6843 18.3074 16.2437 18.4118C15.5098 18.4432 14.7498 18.4667 13.9693 18.4815C13.2282 18.4955 12.8576 18.5026 12.532 18.6266C12.2064 18.7506 11.9325 18.9855 11.3845 19.4553L9.20503 21.3242C9.07273 21.4376 8.90419 21.5 8.72991 21.5C8.32679 21.5 8 21.1732 8 20.7701V18.4219C7.91842 18.4186 7.83715 18.4153 7.75619 18.4118C5.31569 18.3074 4.09545 18.2552 3.13007 17.2825C2.16469 16.3099 2.12282 15.1232 2.03909 12.7497C2.01346 12.0232 2 11.2708 2 10.5Z" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

        </button>
        
      </div>
    </>
  );
}

