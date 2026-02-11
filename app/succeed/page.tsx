'use client'
import styles from './Succeed.module.scss'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '@/context/AppContext'
import Link from 'next/link'
import { apiService } from '@/services/api'
import { useAuth } from '@/app/hook/useAuth'
import CardStory from '@/components/CardStory/CardStory'
import html2canvas from 'html2canvas'

interface ExperienceData {
  title: string
  experience: string
  pildoras: string[]
  reflection: string
  story_valuable: string
  rawInterviewText: string
  visibility: string
}

const SucceedPage = () => {
  const router = useRouter()
  const { checkAuthStatus } = useAuth();

  const searchParams = useSearchParams()
  const postId = searchParams.get('postId') ?? undefined

  
  const { experienceData, setExperienceData, userInfo, setUserInfo, setToast } = useContext(AppContext)
  const storyRef = useRef<HTMLDivElement>(null)

  const [token, setToken] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        /*
         * 1️⃣ Get token from cookie
         */
        const authStatus = await checkAuthStatus();

        setToken(authStatus?.token || "")

        /*
         * 3️⃣ Get post
         */
        const response = await apiService.get(`/api/v1/landing/posts/${postId}`, { token: authStatus?.token || "" })

        setExperienceData({
          title: response.title,
          experience: response.experience,
          pildoras: response.pildoras,
          reflection: response.reflection,
          story_valuable: response.story_valuable,
          rawInterviewText: response.rawInterviewText,
          visibility: response.visibility,
        })

      } catch (err) {
        console.error('Error fetching post:', err)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }
  
    if (postId) {
      fetchPost()
    } else {
      router.push('/')
    }
  }, [postId])

  const handleShareWhatsApp = (experienceData: ExperienceData) => {
    const postId = localStorage.getItem('postId')
    const message = encodeURIComponent(
      `¡Mira lo que acabo de escribir con Wanna!
      \n _${experienceData?.title}_
      \nhttps://frontend.playground.wannna.ai/story/${postId}`
    )
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCopyLink = (postId: string) => {
    const link = `https://frontend.playground.wannna.ai/story/${postId}`
    navigator.clipboard.writeText(link)

    setToast({
      show: true,
      message: 'Enlace copiado al portapapeles',
      type: "success",
    })
  }

  async function loadImage(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
  
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = objectUrl;
    });
  }

  const handleShareInstagram = async () => {

    //const blob = await generateStoryImage(experienceData?.title ?? '', userInfo?.fullName ?? '')
    const blob = await generateStoryImage('Somos como somos: desde un segundo plano', userInfo?.fullName ?? '', '/wanna-logo.svg')
    if (!blob) return

    const file = new File([blob], "story.png", {
      type: "image/png",
    });
  
    const shareData = {
      files: [file],
    };
  
    if (navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error(err);
      }
    } else {
      // Fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "story.png";
      a.click();
    }
      /* const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "story.png";
      a.click(); */

  }

  async function generateStoryImage(
    title: string,
    profileName: string,
    logoUrl: string // e.g. "/images/logo.png"
  ) {
    const width = 1080;
    const height = 1080;
    const padding = 80;
  
    // ---------- Load Fonts ----------
    const semimono = new FontFace("Diatype-Semimono", "url(/fonts/ABCDiatypeSemi-Mono-Medium.woff)", { weight: "400" });
    const bold = new FontFace("Diatype-Bold", "url(/fonts/ABCDiatype-Bold-Trial.woff)", { weight: "700" });
    await Promise.all([semimono.load(), bold.load()]);
    document.fonts.add(semimono);
    document.fonts.add(bold);
  
    // ---------- Load Logo ----------
    const logoImg = await new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = logoUrl;
    });
  
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
  
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    // ---------- Background ----------
    ctx.fillStyle = "#F8F8F8";
    ctx.fillRect(0, 0, width, height);
  
    // ---------- Logo (centered X, top) ----------
    if (logoImg) {
      const logoHeight = 60;
      const logoWidth = (logoImg.width / logoImg.height) * logoHeight; // preserve aspect ratio
      const logoX = (width - logoWidth) / 2;
      const logoY = padding;
      ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
    }
  
    // ---------- Title (vertically centered, left-aligned) ----------
    const fontSize = 88;
    const lineHeight = fontSize * 1.2;
    const maxWidth = width - padding * 2;
  
    ctx.fillStyle = "#181818";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${fontSize}px Diatype-Bold`;
  
    const words = title.split(" ");
    const lines: string[] = [];
    let currentLine = "";
  
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i] + " ";
      if (ctx.measureText(testLine).width > maxWidth && i > 0) {
        lines.push(currentLine.trim());
        currentLine = words[i] + " ";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
  
    const totalTextHeight = lines.length * lineHeight;
    const startY = (height - totalTextHeight) / 2 + lineHeight / 2;
  
    lines.forEach((line, i) => {
      ctx.fillText(line, padding, startY + i * lineHeight);
    });
  
    // ---------- Profile Name (below title, right-aligned) ----------
    const profileFontSize = 40;
    const profileY = startY + totalTextHeight + 32; // 32px gap below last title line
  
    ctx.fillStyle = "#181818";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.font = `400 ${profileFontSize}px Diatype-Semimono`;
    ctx.fillText("by " + profileName, width - padding, profileY);
  
    // ---------- Convert to Blob ----------
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
  
    return blob;
  }
  

  if (isLoading) {
    return (
      <div className={styles.succeed}>
      </div>
    )
  }

  return (
    <div className={styles.succeed}>
      <div className={styles.succeed__content}>
        <div className={styles.succeed__content__story}>
          <div className={styles.succeed__content__story__header}>
            <p className={styles.succeed__content__story__header__title}>
              {experienceData?.visibility === 'PRIVATE' ? 'Déjate conocer más por las personas que te aprecian ' : 'Comparte tu historia '}
              {/* {experienceData?.visibility === 'PRIVATE' ? 'Déjate conocer más por las personas que te aprecian ' : 'Comparte tu historia '} &#10084;&#65039; */}
            </p>
          </div>
          
          <div className={styles.succeed__content__story__story} ref={storyRef}>
            <CardStory user={userInfo ?? { pictureUrl: '', fullName: '' }} title={experienceData?.title ?? ''} />
          </div>

          {/* <p className={styles.succeed__content__story__subtitle}>En este <Link className={styles.succeed__content__story__header__link} href={ postId ? `/story/${postId}` : '/'} target='_blank'>enlace privado</Link> podrás ver tu historia, quién la ha leído y los comentarios</p> */}
          
        </div>

        <div className={styles.succeed__content__share}>

          {/* copy link */}
          <div className={styles.succeed__content__share__item} onClick={() => handleCopyLink(postId ?? '')}>
            <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="29.5" cy="29.5" r="29.5" fill="#EBEBEB"/>
              <path d="M32.1954 30.5228C30.8925 31.8257 28.7801 31.8257 27.4772 30.5228C26.1743 29.2199 26.1743 27.1075 27.4772 25.8045L30.4261 22.8556C31.6697 21.612 33.6508 21.5554 34.9615 22.6858M34.5546 18.7272C35.8575 17.4243 37.9699 17.4243 39.2728 18.7272C40.5757 20.0301 40.5757 22.1425 39.2728 23.4455L36.3239 26.3944C35.0803 27.638 33.0992 27.6946 31.7885 26.5642" stroke="var(--color-black)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M27.1249 17.75C23.0157 17.75 20.9611 17.75 19.5782 18.8849C19.325 19.0927 19.0928 19.3249 18.885 19.5781C17.7501 20.961 17.7501 23.0156 17.75 27.1248L17.75 30.2499C17.75 34.964 17.7499 37.321 19.2144 38.7855C20.6789 40.25 23.0359 40.25 27.75 40.25H30.8749C34.9843 40.25 37.0389 40.25 38.4219 39.1151C38.675 38.9073 38.9072 38.6751 39.115 38.422C40.2499 37.039 40.2499 34.9844 40.2499 30.875" stroke="var(--color-black)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className={styles.succeed__content__share__item__text}>Copiar enlace</p>
          </div>
          
          {/* share whatsapp */}
          <div className={styles.succeed__content__share__item} onClick={() => handleShareWhatsApp(experienceData ?? { title: '', experience: '', pildoras: [], reflection: '', story_valuable: '', rawInterviewText: '', visibility: 'PRIVATE' })}>
            <div className={styles.succeed__content__share__item__whatsapp}>
              <svg width="30" height="30" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path fill='var(--color-white)' stroke='var(--color-white)' d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
              </svg>
            </div>
            <p className={styles.succeed__content__share__item__text}>Whatsapp</p>
          </div>
          
          {/* share instagram */}
          <div className={styles.succeed__content__share__item} onClick={() => handleShareInstagram()}>
            <div className={styles.succeed__content__share__item__instagram}>
              <svg fill="var(--color-white)" width="30" height="30" viewBox="0 0 32 32" id="Camada_1" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                <g>
                  <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z"/>
                  <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8   c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z"/>
                  <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8   c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z"/>
                </g>
              </svg>
            </div>
            <p className={styles.succeed__content__share__item__text}>Instagram</p>
          </div>

        </div>

        <div className={styles.succeed__fixed}>
          <button className={styles.succeed__fixed__button} onClick={() => router.push('/chat')}>
            <p>Volver a hablar con Wanna</p>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 8.5H16.5M7.5 12.5H13" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 10.5C2 9.72921 2.01346 8.97679 2.03909 8.2503C2.12282 5.87683 2.16469 4.69009 3.13007 3.71745C4.09545 2.74481 5.3157 2.6926 7.7562 2.58819C9.09517 2.5309 10.5209 2.5 12 2.5C13.4791 2.5 14.9048 2.5309 16.2438 2.58819C18.6843 2.6926 19.9046 2.74481 20.8699 3.71745C21.8353 4.69009 21.8772 5.87683 21.9609 8.2503C21.9865 8.97679 22 9.72921 22 10.5C22 11.2708 21.9865 12.0232 21.9609 12.7497C21.8772 15.1232 21.8353 16.3099 20.8699 17.2826C19.9046 18.2552 18.6843 18.3074 16.2437 18.4118C15.5098 18.4432 14.7498 18.4667 13.9693 18.4815C13.2282 18.4955 12.8576 18.5026 12.532 18.6266C12.2064 18.7506 11.9325 18.9855 11.3845 19.4553L9.20503 21.3242C9.07273 21.4376 8.90419 21.5 8.72991 21.5C8.32679 21.5 8 21.1732 8 20.7701V18.4219C7.91842 18.4186 7.83715 18.4153 7.75619 18.4118C5.31569 18.3074 4.09545 18.2552 3.13007 17.2825C2.16469 16.3099 2.12282 15.1232 2.03909 12.7497C2.01346 12.0232 2 11.2708 2 10.5Z" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SucceedPage