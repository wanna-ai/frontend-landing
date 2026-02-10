'use client'

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { useEffect, useRef, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import styles from './Result.module.scss';
import { apiService } from '@/services/api';
import { useAuth } from '@/app/hook/useAuth';
import { AppContext } from '@/context/AppContext';
import Loader from '@/components/Loader/Loader';
import Image from 'next/image';


import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ExperienceData {
  title: string;
  experience: string;
  //pildoras: string[];
  reflection: string;
  story_valuable: string;
}

const experienceSchema = z.object({
  title: z.string(),
  experience: z.string(),
  //pildoras: z.array(z.string()),
  reflection: z.string(),
  story_valuable: z.string(),
});

const ResultPage = () => {
  const router = useRouter();
  const { checkAuthStatus } = useAuth();

  const { setPostId, postId, userInfo } = useContext(AppContext);

  const hasSubmitted = useRef(false); // ✅ useRef en lugar de variable local
  const [conversation, setConversation] = useState('');
  const [editorPrompt, setEditorPrompt] = useState('');

  const saveExperience = async (experienceData: ExperienceData) => {
    console.log('experienceData', experienceData);

    const authStatus = await checkAuthStatus();

    const response = await apiService.post('/api/v1/landing/posts/interview', {
      title: experienceData.title,
      content: experienceData.experience,
      pills: "",
      reflection: experienceData.reflection,
      story_valuable: experienceData.story_valuable,
      rawInterviewText: localStorage.getItem('conversation')
    }, { token: authStatus?.token || "" });

    const responseData = response.data || response;
    console.log('responseData', responseData);
    setPostId(responseData.id);
  }

  const { object, submit, isLoading, error } = useObject({
    api: '/api/chat/review',
    schema: experienceSchema,
    onFinish: async ({ object: result }) => {
      console.log('Experiencia generada:', result);
      
      // ✅ Aquí guardarías en backend
      await saveExperience(result as ExperienceData);
    },
  });

  useEffect(() => {
    
    const checkAuth = async () => {
      const authStatus = await checkAuthStatus();
      console.log('authStatus', authStatus);
      if (authStatus?.isGuest) {
        router.push('/');
      }
    }
    checkAuth();

  }, []);

  // ✅ Cargar datos del localStorage solo una vez
  useEffect(() => {
    const conversationLS = localStorage.getItem('conversation');
    const editorPromptLS = localStorage.getItem('editorPrompt');

    if (!conversationLS || !editorPromptLS) {
      console.error('No hay datos en localStorage');
      router.push('/'); // Redirigir si no hay datos
      return;
    }

    if (!hasSubmitted.current) {
      setConversation(conversationLS);
      setEditorPrompt(editorPromptLS);
    }
  }, [router]);

  // ✅ Submit solo cuando tengamos los datos Y no hayamos hecho submit
  useEffect(() => {
    if (conversation && editorPrompt && !hasSubmitted.current) {
      console.log('Haciendo submit...');
      hasSubmitted.current = true;
      
      submit({
        conversation,
        editorPrompt
      });
    }
  }, [conversation, editorPrompt, submit]);

  // ✅ Mostrar errores si los hay
  if (error) {
    return (
      <div className={styles.preview}>
        <div className={styles.preview__container}>
          <h1>Error al generar experiencia</h1>
          <p>{error.message}</p>
          <button onClick={() => router.push('/')}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.result}>
      <div className={styles.result__container}>

        

          <div className={styles.result__content}>
            
            <div className={styles.result__story}>
              {object && (
                <>
                  {isLoading && !object?.title && (
                    <div className={styles.result__story__loading}>
                      <p>Analizando tu conversación...</p>
                    </div>
                  )}

                  <div className={styles.result__story__header}>
                    <p>Esta es tu historia:</p>
                  </div>

                  {/*  User */}
                  {userInfo?.fullName && (
                    <div className={styles.result__story__user}>
                      <Image className={styles.result__story__user__avatar} src={userInfo.pictureUrl} alt={userInfo.fullName} width={24} height={24} />
                      <p className={styles.result__story__user__name}>
                        {userInfo.fullName}
                        <span>· {new Date().toLocaleDateString( 'es-ES', { month: 'short', day: 'numeric' }) }</span>  
                      </p>
                    </div>
                  )}

                  {/* ✅ Título */}
                  {object.title && (
                    <div className={styles.result__story__title}>
                      <h1>{object.title}</h1>
                    </div>
                  )}

                  {/* ✅ Experiencia */}
                  {object.experience && (
                    <div className={styles.result__story__experience}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          p: ({ children }) => <p className={styles.result__experience__content}>{children}</p>,
                          strong: ({ children }) => <strong className={styles.result__experience__content__strong}>{children}</strong>,
                          em: ({ children }) => <em className={styles.result__experience__content__em}>{children}</em>,
                          code: ({ children }) => <code className={styles.result__experience__content__code}>{children}</code>,
                          pre: ({ children }) => <pre className={styles.result__experience__content__pre}>{children}</pre>,
                          ul: ({ children }) => <ul className={styles.result__experience__content__ul}>{children}</ul>,
                        }}
                      >
                        {object.experience}
                      </ReactMarkdown>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ✅ Píldoras */}
            {/* {object.pildoras && object.pildoras.length > 0 && (
              <div className={styles.result__section}>
                <h3>Píldoras breves ({object.pildoras.length}):</h3>
                <ul>
                  {object.pildoras.map((pill, i) => (
                    <li key={i}>{pill}</li>
                  ))}
                </ul>
              </div>
            )} */}
            

            {/* ✅ Reflexión */}
            {object?.reflection && (
              <div className={styles.result__reflection}>
                <div className={styles.result__reflection__title}>
                  <svg className={styles.result__reflection__title__svg} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.14286 14C4.41735 12.8082 4 11.4118 4 9.91886C4 5.54539 7.58172 2 12 2C16.4183 2 20 5.54539 20 9.91886C20 11.4118 19.5827 12.8082 18.8571 14" stroke="var(--color-yellow)" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7.38287 17.0982C7.291 16.8216 7.24507 16.6833 7.25042 16.5713C7.26174 16.3343 7.41114 16.1262 7.63157 16.0405C7.73579 16 7.88105 16 8.17157 16H15.8284C16.119 16 16.2642 16 16.3684 16.0405C16.5889 16.1262 16.7383 16.3343 16.7496 16.5713C16.7549 16.6833 16.709 16.8216 16.6171 17.0982C16.4473 17.6094 16.3624 17.8651 16.2315 18.072C15.9572 18.5056 15.5272 18.8167 15.0306 18.9408C14.7935 19 14.525 19 13.9881 19H10.0119C9.47495 19 9.2065 19 8.96944 18.9408C8.47283 18.8167 8.04281 18.5056 7.7685 18.072C7.63755 17.8651 7.55266 17.6094 7.38287 17.0982Z" stroke="var(--color-yellow)" strokeWidth="1.5"/>
                    <path d="M15 19L14.8707 19.6466C14.7293 20.3537 14.6586 20.7072 14.5001 20.9866C14.2552 21.4185 13.8582 21.7439 13.3866 21.8994C13.0816 22 12.7211 22 12 22C11.2789 22 10.9184 22 10.6134 21.8994C10.1418 21.7439 9.74484 21.4185 9.49987 20.9866C9.34144 20.7072 9.27073 20.3537 9.12932 19.6466L9 19" stroke="var(--color-yellow)" strokeWidth="1.5"/>
                    <path d="M12 16V11" stroke="var(--color-yellow)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Reflexión sólo para ti</span>
                </div>
                {/* <p className={styles.result__reflection__content}>{object.reflection}</p> */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ children }) => <p className={styles.result__reflection__content}>{children}</p>,
                  }}
                >
                  {object.reflection}
                </ReactMarkdown>
              </div>
            )}

            <div className={styles.result__complete}>
              <button
                className={styles.result__complete__button}
                onClick={() => router.push(`/visibility?postId=${postId}`)}
                disabled={isLoading}
              >
                <p>Decide quién ve tu historia</p>
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.3536 4.03553C15.5488 3.84027 15.5488 3.52369 15.3536 3.32843L12.1716 0.146446C11.9763 -0.048816 11.6597 -0.048816 11.4645 0.146446C11.2692 0.341708 11.2692 0.658291 11.4645 0.853553L14.2929 3.68198L11.4645 6.51041C11.2692 6.70567 11.2692 7.02225 11.4645 7.21751C11.6597 7.41278 11.9763 7.41278 12.1716 7.21751L15.3536 4.03553ZM0 3.68198L0 4.18198L15 4.18198V3.68198V3.18198L0 3.18198L0 3.68198Z" fill="var(--color-white)"/>
                </svg>
              </button>
            </div>

            {isLoading && (
              <div className={styles.result__loading}>
              <Loader />
            </div>
            )}
          </div>
        
      </div>
    </div>
  );
}

export default ResultPage;