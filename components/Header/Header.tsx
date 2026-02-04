'use client'
import Image from "next/image";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Header = () => {

  const searchParams = useSearchParams()
  const communityId = searchParams.get('c') ?? undefined

  return (
    <header className={styles.header}>
      <Link href={communityId ? `/?c=${communityId}` : "/"} className={styles.header__link}>
        <Image src="/wanna-logo.svg" alt="Logo" width={28} height={12} loading="eager"/>{/* <span>V.1</span> */}

      </Link>

      <div className={styles.header__user}>
        <div className={styles.header__user__avatar} />
        <p className={styles.header__user__name}>Tú</p>
      </div>
    </header>
  )
}

export default Header