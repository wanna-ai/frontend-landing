import Link from 'next/link';
import styles from './CardStory.module.scss';
import Image from 'next/image';

const CardStory = ({ user, title }: { user: { pictureUrl: string, fullName: string }, title: string }) => {
  return (
    <div className={styles.cardstory}>
      <div className={styles.cardstory__content}>
        <div className={styles.cardstory__content__header}>
          <div className={styles.cardstory__content__header__user}>
            <Image className={styles.cardstory__content__header__user__picture} src={user.pictureUrl} alt={user.fullName} width={24} height={24} />
            <p className={styles.cardstory__content__header__user__name}>{user.fullName}</p>
          </div>
        </div>

        <div className={styles.cardstory__content__body}>
          <p className={styles.cardstory__content__body__title}>{title}</p>
        </div>
      </div>

      <div className={styles.cardstory__footer}>
        <Link href={`/`} target='_blank'>
          <Image src="/wanna-logo.svg" alt="Arrow right" width={24} height={24} />
        </Link>
      </div>
    </div>
  )
}

export default CardStory;