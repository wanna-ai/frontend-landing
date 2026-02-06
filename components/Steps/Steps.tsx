import styles from "./Steps.module.scss"

const MessageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.071 3H14.2303C8.15516 3 3.2303 7.92487 3.23029 14L3.23029 14.2563L3.41827 22.9402C3.45495 24.6345 3.20426 26.3227 2.67685 27.9332L2.57755 28.2364C2.32979 28.993 3.02244 29.7216 3.79059 29.5125L5.39447 29.0758C6.76263 28.7033 8.17669 28.5267 9.59443 28.5513L15.3 28.65H20.2C25.6124 28.65 30 24.2624 30 18.85V12.929C30 7.44538 25.5546 3 20.071 3Z" stroke="var(--color-black)" strokeWidth="2"/>
    <circle cx="12" cy="16" r="1" fill="var(--color-black)"/>
    <circle cx="16" cy="16" r="1" fill="var(--color-black)"/>
    <circle cx="20" cy="16" r="1" fill="var(--color-black)"/>
    </svg>

)

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 33 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 3.23826V29.4854M16.5 3.23826L18.1502 2.59605C21.9054 1.13465 26.0946 1.13465 29.8498 2.59605C30.8465 2.98392 31.5 3.92308 31.5 4.96745V26.5129C31.5 27.947 30.0113 28.9276 28.6427 28.395C25.6624 27.2351 22.3376 27.2351 19.3573 28.395L16.5206 29.4989C16.5107 29.5028 16.5 29.4957 16.5 29.4854M16.5 3.23826L14.8498 2.59605C11.0946 1.13465 6.90543 1.13465 3.15021 2.59605C2.15354 2.98392 1.5 3.92308 1.5 4.96745V26.5129C1.5 27.947 2.98871 28.9276 4.35727 28.395C7.33763 27.2351 10.6624 27.2351 13.6427 28.395L16.4794 29.4989C16.4893 29.5028 16.5 29.4957 16.5 29.4854" stroke="var(--color-black)" strokeWidth="3"/>
  </svg>
)

const BulbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M2.39147 11.5983C1.00006 7.5 3.5 4.13839 6.28413 3.28632C9.00001 2.45515 11 3.30167 12 4.5C13 3.30167 15 2.45842 17.7053 3.28632C20.6709 4.1939 23 7.5 21.6074 11.5983C19.8495 16.9083 13.0001 20.9983 12 20.9983C10.9999 20.9984 4.20833 16.9703 2.39147 11.5983Z" stroke="var(--color-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>


)

const steps = [
  {
    icon: MessageIcon,
    description: "Cuéntale a Wanna algo que te haya pasado. <strong>(2 minutos)</strong>"
  },
  {
    icon: BookIcon,
    description: "Creará tu propia <strong>historia</strong> y una <strong>reflexión</strong> sobre ti."
  },
  {
    icon: BulbIcon,
    description: "<strong>Compártela</strong>, si así lo sientes."
  }
]

const Steps = () => {
  return (
    <div className={styles.steps}>
      {steps.map((step, index) => {
        const Icon = step.icon
        return (
          <div key={index} className={styles.steps__step}>
            <Icon />
            <p dangerouslySetInnerHTML={{ __html: step.description }} />
          </div>
        )
      })}
    </div>
  )
}

export default Steps