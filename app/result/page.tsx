'use client'

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { useEffect, useRef, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import styles from './Result.module.scss';
import { apiService } from '@/services/api';
import { useAuth } from '@/app/hook/useAuth';
import { AppContext } from '@/context/AppContext';

interface ExperienceData {
  title: string;
  experience: string;
  pildoras: string[];
  reflection: string;
  story_valuable: string;
}

const experienceSchema = z.object({
  title: z.string(),
  experience: z.string(),
  pildoras: z.array(z.string()),
  reflection: z.string(),
  story_valuable: z.string(),
});

const ResultPage = () => {
  const router = useRouter();
  const { checkAuthStatus } = useAuth();

  const { setPostId, postId } = useContext(AppContext);

  const hasSubmitted = useRef(false); // ✅ useRef en lugar de variable local
  const [conversation, setConversation] = useState('');
  const [editorPrompt, setEditorPrompt] = useState('');

  const saveExperience = async (experienceData: ExperienceData) => {
    console.log('experienceData', experienceData);

    const authStatus = await checkAuthStatus();
    console.log('authStatus', authStatus);

    const response = await apiService.post('/api/v1/landing/posts/interview', {
      title: experienceData.title,
      content: experienceData.experience,
      pills: experienceData.pildoras.join(' - '),
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

  useEffect(() => {
    if (object) {
      console.log('object', object);
    }
  }, [object]);

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
        <h1>Creando tu experiencia</h1>
        
        {isLoading && !object?.title && (
          <div className={styles.result__loading}>
            <div className={styles.spinner} />
            <p>Analizando tu conversación...</p>
          </div>
        )}

        {object && (
          <div className={styles.result__content}>
            {/* ✅ Título */}
            {object.title && (
              <div className={styles.result__section}>
                <h2>📝 Título</h2>
                <h3>{object.title}</h3>
              </div>
            )}

            {/* ✅ Experiencia */}
            {object.experience && (
              <div className={styles.result__section}>
                <h2>📖 Tu historia</h2>
                <p>{object.experience}</p>
                {isLoading && <span className={styles.typing}>▊</span>}
              </div>
            )}

            {/* ✅ Píldoras */}
            {object.pildoras && object.pildoras.length > 0 && (
              <div className={styles.result__section}>
                <h2>💊 Píldoras ({object.pildoras.length})</h2>
                <ul>
                  {object.pildoras.map((pill, i) => (
                    <li key={i}>{pill}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ✅ Reflexión */}
            {object.reflection && (
              <div className={styles.result__section}>
                <h2>💭 Reflexión</h2>
                <p>{object.reflection}</p>
              </div>
            )}

            {!isLoading && (
              <div className={styles.result__complete}>
                <button className={styles.result__complete__button} onClick={() => router.push(`/visibility?postId=${postId}`)}>
                  <p>Decide quién ve tu historia</p>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultPage;