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
      <Link href={communityId ? `/?c=${communityId}` : "/"}>
        <Image src="/wanna-logo.svg" alt="Logo" width={28} height={12} />
      </Link>
    </header>
  )
}

export default Header