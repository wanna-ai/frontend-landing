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
                  <p>Aquí va una reflexión sobre tu historia...</p>
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