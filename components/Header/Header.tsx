'use client'
import Image from "next/image";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useContext, useSyncExternalStore, useEffect } from "react";
import { AppContext } from "@/context/AppContext"

const Header = () => {
  const { userInfo, setColorInverse, colorInverse } = useContext(AppContext);
  const searchParams = useSearchParams()
  const pathname = usePathname();
  const communityId = searchParams.get('c') ?? undefined

  const isResult = pathname?.includes("/result");

  useEffect(() => {
    if (pathname?.includes("/result")) {
      setColorInverse(true);
    } else {
      setColorInverse(false);
    }
  }, [pathname]);



  // This hook is designed exactly for this use case
  const isClient = useSyncExternalStore(
    () => () => {}, // subscribe (no-op)
    () => true,      // getSnapshot (client)
    () => false      // getServerSnapshot (server)
  );

  return (
    <header className={`${styles.header} ${colorInverse ? styles.header__result : ""}`}>
      <Link href={communityId ? `/?c=${communityId}` : "/"} className={styles.header__link}>
      <svg width="28" height="12" viewBox="0 0 55 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M41.4199 0C48.6885 0 54.581 4.9621 54.5811 11.083C54.5811 17.204 48.6886 22.166 41.4199 22.166C36.8571 22.166 32.8376 20.2101 30.4766 17.2402C30.4348 17.1959 30.3918 17.1503 30.3486 17.1025C26.4113 12.75 21.3452 14.7947 19.8779 16.8457C17.996 20.0364 14.5987 22.1669 10.7197 22.167C4.79949 22.167 5.33648e-05 17.2049 0 11.084C0 4.96301 4.79945 0.000976562 10.7197 0.000976562C14.5913 0.00102217 17.9831 2.12321 19.8672 5.30371C24.2184 11.1447 28.1336 7.80718 30.2549 5.21582C32.5805 2.08429 36.7106 3.25139e-06 41.4199 0Z" fill={colorInverse ? "var(--color-white)" : "var(--color-black)"}/>
      </svg>

      </Link>

      {/* {isClient && userInfo && (
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
      )} */}
    </header>
  )
}

export default Header