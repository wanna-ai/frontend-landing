'use client'
import styles from './Succeed.module.scss'
import { useRouter } from 'next/navigation'

const SucceedPage = () => {
  const router = useRouter()

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      '¡Acabo de probar Wanna! Una plataforma para compartir experiencias auténticas. Únete a la lista de espera: https://wannna.ai'
    )
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className={styles.succeed}>
      <div className={styles.succeed__content}>
        <div className={styles.succeed__content__text}>
          <h1>Gracias por probar Wanna!</h1>
          <p>Te hemos enviado tu historia por mail.<br/>Cuando lancemos Wanna al 100%, te avisaremos.</p>
        </div>

        <div className={styles.succeed__buttons}>
          <button className={`${styles.succeed__buttons__button} ${styles.succeed__buttons__button__whatsapp}`} onClick={handleShareWhatsApp}>
            <svg fill="transparent" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path fill='var(--color-white)' stroke='var(--color-white)' d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
            </svg>
            <p>Compartir Wanna</p>
          </button>

          <button className={styles.succeed__buttons__button} onClick={() => router.push('/chat')}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.0146 11.2817C25.1087 11.2817 27.6171 13.394 27.6172 15.9995C27.6172 18.6051 25.1088 20.7173 22.0146 20.7173C20.0679 20.7172 18.3537 19.8809 17.3496 18.6118C17.3343 18.5955 17.3175 18.5794 17.3018 18.562C15.6254 16.709 13.4679 17.5794 12.8438 18.4526C12.0426 19.8106 10.5974 20.7183 8.94629 20.7183C6.42611 20.7183 4.38281 18.6051 4.38281 15.9995C4.38306 13.3941 6.42626 11.2817 8.94629 11.2817C10.5899 11.2817 12.0297 12.181 12.833 13.5288C14.6938 16.0368 16.3672 14.5977 17.2695 13.4917C18.2609 12.1644 20.0152 11.2818 22.0146 11.2817Z" fill="var(--color-white)"/>
            </svg>

            <p>Volver a hablar con Wanna</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SucceedPage