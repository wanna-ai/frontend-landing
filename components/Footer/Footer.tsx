'use client'
import styles from './Footer.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'


const brand = {
  name: "WANNA",
  location: "BASED IN BARCELONA",
};

const nav = [
  { label: "HOME", href: "/" },
  { label: "RESEARCH", href: "/research" },
  { label: "TEAM", href: "/team" },
];

const contact = {
  title: "ANY QUESTIONS?",
  link: { label: "hola@wannna.ai", href: "mailto:hola@wannna.ai" },
};

const socials = {
  title: "FOLLOW US",
  links: [{ label: "LinkedIn", href: "https://www.linkedin.com/company/wanna-ai/" }],
};

const careers = {
  title: "WE ARE HIRING",
  links: [
    { label: "BACKEND DEV.", href: "/jobs/backend-developer-en" },
  ],
};

const legal = {
  links: [
    { label: "Privacy Statement", href: "/privacy" },
    { label: "Terms and Conditions", href: "/terms" },
  ],
  copyright: "All rights reserved © 2026",
};

const Footer = () => {

  const pathname = usePathname()
  
  if (pathname === '/chat' || pathname === '/login/success' || pathname === '/preview' || pathname === '/register' || pathname === '/visibility') {
    return null
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <div className={styles.footer__container__content}>

          <Image className={styles.footer__container__content__ascii} src="/ascii.png" alt="Wanna ASCII" width={1001} height={655} />
          
          <div className={styles.footer__container__content__wrapper}>
            {/* Brand / Location */}
            <div className={styles.footer__container__content__wrapper__brand}>
              <p className={`text-md`}>{brand.name}</p>
              <p className={`text-md`}>{brand.location}</p>
            </div>

            {/* Navigation */}
            {/* <div className={styles.footer__container__content__wrapper__nav}>
              {nav.map((item) => (
                <div key={item.label}>
                  <Link href={item.href} className={`text-md`}>
                    {item.label}
                  </Link>
                </div>
              ))}
            </div> */}

            {/* Contact */}
            <div className={styles.footer__container__content__wrapper__contact}>
              <p className={`text-md`}>{contact.title}</p>
              <Link href={contact.link.href} className={`text-md`}>{contact.link.label}</Link>
            </div>

            {/* Socials */}
            <div className={styles.footer__container__content__wrapper__socials}>
              <p className={`text-md`}>{socials.title}</p>
              {socials.links.map((item) => (
                <div key={item.label}>
                  <Link href={item.href} className={`text-md`} target="_blank">
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Careers */}
            {/* <div className={styles.footer__container__content__wrapper__careers}>
              <p className={`text-md`}>{careers.title}</p>
              {careers.links.map((item) => (
                <div key={item.label}>
                  <Link href={item.href} className={`text-md`}>
                    {item.label}
                  </Link>
                </div>
              ))}
            </div> */}

            {/* Legal */}
            <div className={styles.footer__container__content__wrapper__legal}>
              {legal.links.map((item) => (
                <div key={item.label}>
                  <Link href={item.href} className={`text-md`}>
                    {item.label}
                  </Link>
                </div>
              ))}
              <p className={`text-md`}>{legal.copyright}</p>
            </div>
          </div>


        </div>
      </div>
    </footer>
  )
}

export default Footer