'use client'

import { useEffect, useRef, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Result.module.scss';
import { apiService } from '@/services/api';
import { useAuth } from '@/app/hook/useAuth';
import { AppContext } from '@/context/AppContext';
import Loader from '@/components/Loader/Loader';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { StoryStatus } from '@/lib/sse-client';

interface InterviewPost {
  id: string;
  title: string;
  content: string;
  pills?: string;
  reflection?: string;
  story_valuable?: string;
}

const POLL_INTERVAL_MS = 1500;

const progressMessages = [
  'Analizando tu conversación...',
  'Identificando los momentos clave...',
  'Dando forma a tu historia...',
  'Preparando tu reflexión...',
];

const ResultPage = () => {
  const router = useRouter();
  const { checkAuthStatus } = useAuth();
  const { setPostId, postId, userInfo } = useContext(AppContext);

  const hasStartedPolling = useRef(false);
  const [storyData, setStoryData] = useState<StoryStatus | null>(null);
  const [fullPost, setFullPost] = useState<InterviewPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressIndex, setProgressIndex] = useState(0);

  // Cycle through progress messages while loading
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setProgressIndex((prev) => (prev + 1) % progressMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Fetch full post once we have postId and auth
  useEffect(() => {
    if (!storyData?.postId) return;

    let cancelled = false;

    checkAuthStatus().then(async (authStatus) => {
      if (cancelled || !authStatus?.token) return;
      try {
        const post = await apiService.get(
          `/api/v1/landing/posts/${storyData.postId}`,
          { token: authStatus.token },
        );
        if (!cancelled) setFullPost(post);
      } catch (err) {
        console.error('Error fetching full post:', err);
      }
    });

    return () => { cancelled = true; };
  }, [storyData?.postId, checkAuthStatus]);

  // Redirect guests to register
  useEffect(() => {
    let cancelled = false;
    checkAuthStatus().then((authStatus) => {
      if (!cancelled && authStatus?.isGuest) {
        router.push('/register');
      }
    });
    return () => { cancelled = true; };
  }, [checkAuthStatus, router]);

  // Poll for story status
  useEffect(() => {
    if (hasStartedPolling.current) return;

    const sessionId = localStorage.getItem('wanna_sessionId');
    if (!sessionId) {
      router.push('/');
      return;
    }

    hasStartedPolling.current = true;

    let cancelled = false;

    const poll = async (stop: () => void) => {
      try {
        const authStatus = await checkAuthStatus();
        const data = await apiService.get(
          `/api/v1/chat/${sessionId}/status`,
          { token: authStatus?.token || '' },
        );

        if (cancelled) return;

        if (data.status === 'COMPLETED') {
          stop();
          setStoryData(data);
          setIsLoading(false);
          if (data.postId) {
            setPostId(data.postId);
            // Assign post to authenticated user
            if (authStatus?.token) {
              apiService.post('/api/v1/landing/interview/assign', { postId: data.postId }, { token: authStatus.token }).catch(() => {});
            }
          }
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Error polling story status:', err);
        stop();
        setError('Error al cargar tu historia. Inténtalo de nuevo.');
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(() => poll(() => clearInterval(intervalId)), POLL_INTERVAL_MS);

    // Initial poll
    poll(() => clearInterval(intervalId));

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [router, checkAuthStatus, setPostId]);

  if (error) {
    return (
      <div className={styles.result}>
        <div className={styles.result__container}>
          <h1>Error al generar experiencia</h1>
          <p>{error}</p>
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
            <div className={styles.result__story__header}>
              <p>Esta es tu historia:</p>
            </div>
            {isLoading && (
              <div className={styles.result__story__loading}>
                <p>{progressMessages[progressIndex]}</p>
              </div>
            )}
            {storyData && (
              <>
                {userInfo?.fullName && (
                  <div className={styles.result__story__user}>
                    <Image className={styles.result__story__user__avatar} src={userInfo.pictureUrl} alt={userInfo.fullName} width={24} height={24} />
                    <p className={styles.result__story__user__name}>
                      {userInfo.fullName}
                      <span>· {new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                    </p>
                  </div>
                )}

                {storyData.title && (
                  <div className={styles.result__story__title}>
                    <h1>{storyData.title}</h1>
                  </div>
                )}

                {(fullPost?.content || storyData.blurPreview) && (
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
                      {fullPost?.content || storyData.blurPreview || ''}
                    </ReactMarkdown>
                  </div>
                )}
              </>
            )}
          </div>

          {(fullPost?.reflection || storyData?.insight) && (
            <div className={styles.result__reflection}>
              <div className={styles.result__reflection__title}>
                <p>Aquí va una reflexión sobre tu historia...</p>
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <p className={styles.result__reflection__content}>{children}</p>,
                }}
              >
                {fullPost?.reflection || storyData?.insight || ''}
              </ReactMarkdown>
            </div>
          )}

          <div className={styles.result__complete}>
            <button
              className={styles.result__complete__button}
              onClick={() => router.push(`/visibility?postId=${postId}`)}
              disabled={isLoading || !postId}
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
