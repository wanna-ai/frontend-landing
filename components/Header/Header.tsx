'use client'
import Image from "next/image";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext"

const Header = () => {
  const { userInfo } = useContext(AppContext);
  const searchParams = useSearchParams()
  const communityId = searchParams.get('c') ?? undefined

  return (
    <header className={styles.header}>
      <Link href={communityId ? `/?c=${communityId}` : "/"} className={styles.header__link}>
        <Image src="/wanna-logo.svg" alt="Logo" width={28} height={12} loading="eager"/>{/* <span>V.1</span> */}

      </Link>

      {userInfo && (
        <div className={styles.header__user}>
          {userInfo.pictureUrl && (
            <div className={styles.header__user__avatar}>
              <Image className={styles.header__user__avatar__image} loading="eager" src={userInfo.pictureUrl} alt="Avatar" width={24} height={24} />
            </div>
          )}
          {userInfo.fullName && (
            <p className={styles.header__user__name}>{userInfo.fullName.split(' ')[0]}</p>
          )}
        </div>
      )}
    </header>
  )
}

export default Header