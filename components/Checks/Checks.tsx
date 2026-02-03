import styles from './Checks.module.scss'

const checks = [
  {
    text: "Guárdalas sólo para ti",
    color: "#FF00BB"
  },
  {
    text: "Compártelas en privado",
    color: "#00A6FF"
  },
  {
    text: "Hazla pública para que ayude a otros ",
    color: "#FF8000"
  }
]

const Checks = () => {
  return (
    <div className={styles.checks}>
      <h2 className={styles.checks__title}>Tus historias son tuyas. <span className={styles.checks__title__span}>Tú decides</span></h2>
      <div className={styles.checks__items}>
        {checks.map((check, index) => (
          <div key={index} className={styles.checks__items__item}>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.25 0.75H10.25C5.77166 0.75 3.53249 0.75 2.14124 2.14124C0.75 3.53249 0.75 5.77166 0.75 10.25C0.75 14.7283 0.75 16.9675 2.14124 18.3588C3.53249 19.75 5.77166 19.75 10.25 19.75C14.7283 19.75 16.9675 19.75 18.3588 18.3588C19.75 16.9675 19.75 14.7283 19.75 10.25V8.25" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M6.75 8.25L10.25 11.75L19.2502 1.75" stroke={check.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
      
            <p>{check.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Checks