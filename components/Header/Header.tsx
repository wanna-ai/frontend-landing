'use client'
import Image from "next/image";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useSyncExternalStore } from "react";
import { AppContext } from "@/context/AppContext"

const Header = () => {
  const { userInfo } = useContext(AppContext);
  const searchParams = useSearchParams()
  const communityId = searchParams.get('c') ?? undefined

  // This hook is designed exactly for this use case
  const isClient = useSyncExternalStore(
    () => () => {}, // subscribe (no-op)
    () => true,      // getSnapshot (client)
    () => false      // getServerSnapshot (server)
  );

  return (
    <header className={styles.header}>
      <Link href={communityId ? `/?c=${communityId}` : "/"} className={styles.header__link}>
        <Image src="/wanna-logo.svg" alt="Logo" width={28} height={12} loading="eager"/>
      </Link>

      {isClient && userInfo && (
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