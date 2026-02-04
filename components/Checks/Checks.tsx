import styles from './Checks.module.scss'

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.54152 15.4983C3.45841 14.5009 3.41685 14.0022 3.4509 13.5892C3.639 11.3076 5.35267 9.44516 7.61079 9.06823C8.01957 9 8.51998 9 9.5208 9H14.4792C15.48 9 15.9804 9 16.3892 9.06823C18.6473 9.44516 20.361 11.3076 20.5491 13.5892C20.5831 14.0022 20.5416 14.5009 20.4585 15.4983C20.3869 16.3571 20.3511 16.7865 20.2655 17.1492C19.7957 19.1387 18.1621 20.6418 16.1404 20.9448C15.7719 21 15.341 21 14.4792 21H9.5208C8.65897 21 8.22806 21 7.85958 20.9448C5.83794 20.6418 4.20435 19.1387 3.73451 17.1492C3.64888 16.7865 3.61309 16.3571 3.54152 15.4983Z" stroke="var(--color-black)" strokeWidth="1.4"/>
    <path d="M7.5 8.5C7.5 8.5 7.51388 4 12 4C16.4861 4 16.4875 8.5 16.4875 8.5" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17L12 15" stroke="black" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>

)
const KeyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="6" stroke="var(--color-black)" strokeWidth="1.4"/>
    <path d="M8.5 9.7002C10.0464 9.7002 11.2998 10.9536 11.2998 12.5C11.2998 14.0464 10.0464 15.2998 8.5 15.2998C6.9536 15.2998 5.7002 14.0464 5.7002 12.5C5.7002 10.9536 6.9536 9.7002 8.5 9.7002Z" stroke="var(--color-black)" strokeWidth="1.4"/>
    <path d="M15 15L15 13.3C15 12.8582 15.3582 12.5 15.8 12.5L16.7 12.5C17.1418 12.5 17.5 12.8579 17.5 13.2998C17.5 13.4981 17.5 13.732 17.5 14" stroke="var(--color-black)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 13.2C18.8866 13.2 19.2 12.8866 19.2 12.5C19.2 12.1134 18.8866 11.8 18.5 11.8V12.5V13.2ZM11.5 12.5V13.2H18.5V12.5V11.8H11.5V12.5Z" fill="var(--color-black)"/>
  </svg>
)

const WorldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="2" width="20" height="20" rx="10" stroke="var(--color-black)" strokeWidth="1.6"/>
    <path d="M12 2C5.33333 7.41554 5.33333 16.5845 12 22" stroke="var(--color-black)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 2C20.6667 7.40604 20.6667 16.594 14 22" stroke="var(--color-black)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13 2V22" stroke="var(--color-black)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M23 12L3 12" stroke="var(--color-black)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 8L4 8" stroke="var(--color-black)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 16H4" stroke="var(--color-black)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>

)


const checks = [
  {
    text: "Guárdalas sólo para ti",
    color: "#FF00BB",
    icon: LockIcon
  },
  {
    text: "Compártelas en privado",
    color: "#00A6FF",
    icon: KeyIcon
  },
  {
    text: "Hazla pública para que ayude a otros ",
    color: "#FF8000",
    icon: WorldIcon
  }
]

const Checks = () => {
  return (
    <div className={styles.checks}>
      <h2 className={styles.checks__title}>Tus historias son tuyas. <span className={styles.checks__title__span}>Tú decides</span></h2>
      <div className={styles.checks__items}>
        {checks.map((check, index) => {
          const Icon = check.icon
          return (
          <div key={index} className={styles.checks__items__item}>
            <Icon />
      
            <p>{check.text}</p>
          </div>
        )})}
      </div>
    </div>
  )
}

export default Checks