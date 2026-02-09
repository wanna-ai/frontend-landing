import styles from './Snippet.module.scss'

const IconStory = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.74999 1.75571V16.9415M9.74999 1.75571L10.7401 1.38414C12.9932 0.538619 15.5067 0.538619 17.7599 1.38414C18.3579 1.60855 18.75 2.15192 18.75 2.75616V15.2217C18.75 16.0515 17.8568 16.6188 17.0356 16.3107C15.2474 15.6396 13.2526 15.6396 11.4644 16.3107L9.76234 16.9494C9.75642 16.9516 9.74999 16.9475 9.74999 16.9415M9.74999 1.75571L8.75987 1.38414C6.50674 0.538619 3.99326 0.538619 1.74012 1.38414C1.14212 1.60855 0.75 2.15192 0.75 2.75616V15.2217C0.75 16.0515 1.64322 16.6188 2.46436 16.3107C4.25258 15.6396 6.24742 15.6396 8.03563 16.3107L9.73765 16.9494C9.74356 16.9516 9.74999 16.9475 9.74999 16.9415" stroke="var(--color-white)" strokeWidth="1.5"/>
  </svg>
)

const IconReflection = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.14286 14C4.41735 12.8082 4 11.4118 4 9.91886C4 5.54539 7.58172 2 12 2C16.4183 2 20 5.54539 20 9.91886C20 11.4118 19.5827 12.8082 18.8571 14" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7.38287 17.0982C7.291 16.8216 7.24507 16.6833 7.25042 16.5713C7.26174 16.3343 7.41114 16.1262 7.63157 16.0405C7.73579 16 7.88105 16 8.17157 16H15.8284C16.119 16 16.2642 16 16.3684 16.0405C16.5889 16.1262 16.7383 16.3343 16.7496 16.5713C16.7549 16.6833 16.709 16.8216 16.6171 17.0982C16.4473 17.6094 16.3624 17.8651 16.2315 18.072C15.9572 18.5056 15.5272 18.8167 15.0306 18.9408C14.7935 19 14.525 19 13.9881 19H10.0119C9.47495 19 9.2065 19 8.96944 18.9408C8.47283 18.8167 8.04281 18.5056 7.7685 18.072C7.63755 17.8651 7.55266 17.6094 7.38287 17.0982Z" stroke="var(--color-white)" strokeWidth="1.5"/>
    <path d="M15 19L14.8707 19.6466C14.7293 20.3537 14.6586 20.7072 14.5001 20.9866C14.2552 21.4185 13.8582 21.7439 13.3866 21.8994C13.0816 22 12.7211 22 12 22C11.2789 22 10.9184 22 10.6134 21.8994C10.1418 21.7439 9.74484 21.4185 9.49987 20.9866C9.34144 20.7072 9.27073 20.3537 9.12932 19.6466L9 19" stroke="var(--color-white)" strokeWidth="1.5"/>
    <path d="M12 16V11" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Snippet = ({ icon, header, content }: { icon: string, header: string, content: string }) => {
  return (
    <div className={styles.snippet}>
      <div className={styles.snippet__item}>
        <div className={styles.snippet__item__header}>
          {icon === 'story' && <IconStory />}
          {icon === 'reflection' && <IconReflection />}
          <p>{header}</p>
        </div>

        <p className={styles.snippet__item__text}>{content}</p>
      </div>
    </div>
  )
}

export default Snippet