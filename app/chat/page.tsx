'use client'
import styles from "./Chat.module.scss";
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { AppContext } from "@/context/AppContext";
import { useBackendChat } from "@/app/hook/useBackendChat";
import { API_BASE_URL } from '@/services/config/api';
import { apiService } from '@/services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Loader from "@/components/Loader/Loader";
import { useRouter } from 'next/navigation';
import LoaderGenerate from "@/components/LoaderGenerate/LoaderGenerate";

export default function ChatPage() {
  const { setExperienceData, setSessionId: setContextSessionId } = useContext(AppContext);
  const router = useRouter();

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const [isEditableEmpty, setIsEditableEmpty] = useState(true);

  const {
    messages,
    status,
    sendMessage,
    retryMessage,
    stop,
    statusLine,
    lockData,
    sessionId,
    storyPreview,
    startPolling,
  } = useBackendChat();

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  // Start polling when card appears (locked/processing)
  useEffect(() => {
    if (status === 'locked' || status === 'processing') {
      startPolling();
    }
  }, [status, startPolling]);

  // Store sessionId in context
  useEffect(() => {
    setContextSessionId(sessionId);
  }, [sessionId, setContextSessionId]);

  // Listen for auth success from OAuth popup (BroadcastChannel + postMessage fallback)
  useEffect(() => {
    const handleAuthSuccess = async (token: string) => {
      // Store auth token via Next.js API route
      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'authToken', value: token }),
      });

      // Assign post to authenticated user if postId is already available
      if (storyPreview?.postId) {
        try {
          await apiService.post('/api/v1/landing/interview/assign', { postId: storyPreview.postId }, { token });
        } catch {
          // Will retry in result page
        }
      }

      router.push('/result');
    };

    // BroadcastChannel: reliable same-origin cross-window communication
    const channel = new BroadcastChannel('wanna-auth');
    channel.onmessage = (event) => {
      if (event.data?.type === 'WANNA_AUTH_SUCCESS' && event.data.token) {
        handleAuthSuccess(event.data.token);
      }
    };

    // postMessage fallback (works when window.opener is preserved)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'WANNA_AUTH_SUCCESS' && event.data.token) {
        handleAuthSuccess(event.data.token);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      channel.close();
      window.removeEventListener('message', handleMessage);
    };
  }, [router, storyPreview]);

  // Scroll on new messages
  useEffect(() => {
    if (messages) {
      requestAnimationFrame(scrollToBottom);
    }
  }, [messages, statusLine, storyPreview]);

  // Prevent scroll on focus
  useEffect(() => {
    const preventScrollOnFocus = (e: Event) => {
      e.preventDefault();
      window.scrollTo(0, 0);
    };

    const editable = editableRef.current;
    if (editable) {
      editable.addEventListener('focus', preventScrollOnFocus);
      return () => editable.removeEventListener('focus', preventScrollOnFocus);
    }
  }, []);

  // Initialize chat
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    ['title', 'content', 'communityId', 'pills', 'reflection', 'story_valuable', 'rawInterviewText']
      .forEach(key => localStorage.removeItem(key));

    setExperienceData(null);
    sendMessage('Hola Wanna!');
  }, [setExperienceData, sendMessage]);

  const handleGoogleLogin = useCallback(() => {
    window.open(
      `${API_BASE_URL}/oauth2/authorization/google?wannaSessionId=${sessionId}`,
      'WannaLogin',
      'width=500,height=600,scrollbars=yes',
    );
  }, [sessionId]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editableRef.current || status === 'streaming') return;

    const content = editableRef.current.innerText.trim();
    if (content === '') return;

    sendMessage(content);
    editableRef.current.innerText = '';
    setIsEditableEmpty(true);
  }, [sendMessage, status]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!editableRef.current || status === 'streaming') return;

      const content = editableRef.current.innerText.trim();
      if (content === '') return;

      sendMessage(content);
      editableRef.current.innerText = '';
      setIsEditableEmpty(true);
    }
  }, [sendMessage, status]);

  const handleInput = () => {
    if (!editableRef.current) return;
    const text = editableRef.current.innerText.replace(/\n/g, "").trim();
    setIsEditableEmpty(text.length === 0);
  };

  const isInputVisible = status === 'ready' || status === 'streaming';
  const showRevealCard = status === 'locked' || status === 'processing' || lockData !== null;

  return (
    <div className={styles.chat}>
      <div className={styles.chat__messages} ref={messagesContainerRef}>

        {messages.map((message) => {
          if (!message.content) return null;

          return (
            <div className={styles.chat__messages__message} key={message.id}>
              <div
                className={`${styles.chat__messages__message__content} ${
                  message.role === "user"
                    ? styles.chat__messages__message__content__user
                    : styles.chat__messages__message__content__avatar
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ children }) => <p className={styles.markdown_paragraph}>{children}</p>,
                    strong: ({ children }) => <strong className={styles.markdown_bold}>{children}</strong>,
                    em: ({ children }) => <em className={styles.markdown_italic}>{children}</em>,
                    code: ({ children }) => <code className={styles.markdown_code}>{children}</code>,
                    pre: ({ children }) => <pre className={styles.markdown_pre}>{children}</pre>,
                    ul: ({ children }) => <ul className={styles.markdown_ul}>{children}</ul>,
                    ol: ({ children }) => <ol className={styles.markdown_ol}>{children}</ol>,
                    li: ({ children }) => <li className={styles.markdown_li}>{children}</li>,
                    h1: ({ children }) => <h1 className={styles.markdown_h1}>{children}</h1>,
                    h2: ({ children }) => <h2 className={styles.markdown_h2}>{children}</h2>,
                    h3: ({ children }) => <h3 className={styles.markdown_h3}>{children}</h3>
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}

        {statusLine && (
          <div className={styles.chat__messages__message__reviewExperience}>
            <LoaderGenerate statusLine={statusLine} />
          </div>
        )}

        {status === 'streaming' && messages[messages.length - 1]?.role === 'user' && (
          <div className={styles.chat__messages__message__loading}>
            <Loader />
          </div>
        )}

        {showRevealCard && (
          <div className={styles.chat__revealCard}>
            {(storyPreview || lockData) && (
              <div className={styles.chat__revealCard__details}>
                {(storyPreview?.title || lockData?.title) && (
                  <h2 className={styles.chat__revealCard__title}>{storyPreview?.title || lockData?.title}</h2>
                )}
                {(storyPreview?.pills || (lockData?.pills && lockData.pills.length > 0)) && (
                  <div className={styles.chat__revealCard__pills}>
                    {storyPreview?.pills
                      ? storyPreview.pills
                          .split(/[|]+/)
                          .map((p) => p.trim())
                          .filter((p) => p.length > 0)
                          .map((pill, i) => (
                            <span key={i} className={styles.chat__revealCard__pill}>{pill}</span>
                          ))
                      : lockData?.pills?.map((pill, i) => (
                          <span key={i} className={styles.chat__revealCard__pill}>{pill}</span>
                        ))}
                  </div>
                )}
                {storyPreview?.insight && (
                  <p className={styles.chat__revealCard__insight}>{storyPreview.insight}</p>
                )}
              </div>
            )}
            <button
              type="button"
              className={styles.chat__revealCard__googleBtn}
              onClick={handleGoogleLogin}
            >
              <svg width="16" height="16" viewBox="0 0 24 25">
                <path d="M21.8055 11.0076H21V10.9661H12V14.9661H17.6515C16.827 17.2946 14.6115 18.9661 12 18.9661C8.6865 18.9661 6 16.2796 6 12.9661C6 9.65256 8.6865 6.96606 12 6.96606C13.5295 6.96606 14.921 7.54306 15.9805 8.48556L18.809 5.65706C17.023 3.99256 14.634 2.96606 12 2.96606C6.4775 2.96606 2 7.44356 2 12.9661C2 18.4886 6.4775 22.9661 12 22.9661C17.5225 22.9661 22 18.4886 22 12.9661C22 12.2956 21.931 11.6411 21.8055 11.0076Z" fill="#FFC107"/>
                <path d="M3.15234 8.31156L6.43784 10.7211C7.32684 8.52006 9.47984 6.96606 11.9993 6.96606C13.5288 6.96606 14.9203 7.54306 15.9798 8.48556L18.8083 5.65706C17.0223 3.99256 14.6333 2.96606 11.9993 2.96606C8.15834 2.96606 4.82734 5.13456 3.15234 8.31156Z" fill="#FF3D00"/>
                <path d="M12.0002 22.9664C14.5832 22.9664 16.9302 21.9779 18.7047 20.3704L15.6097 17.7514C14.5719 18.5406 13.3039 18.9674 12.0002 18.9664C9.39916 18.9664 7.19066 17.3079 6.35866 14.9934L3.09766 17.5059C4.75266 20.7444 8.11366 22.9664 12.0002 22.9664Z" fill="#4CAF50"/>
                <path d="M21.8055 11.0076H21V10.9661H12V14.9661H17.6515C17.2571 16.0743 16.5467 17.0427 15.608 17.7516L15.6095 17.7506L18.7045 20.3696C18.4855 20.5686 22 17.9661 22 12.9661C22 12.2956 21.931 11.6411 21.8055 11.0076Z" fill="#1976D2"/>
              </svg>
              Entrar con Google
            </button>
          </div>
        )}
      </div>

      <div className={`${styles.chat__input} ${!isInputVisible ? styles.chat__input__hidden : ""}`}>
        <form className={styles.chat__input__form} onSubmit={handleSubmit}>
          <div
            ref={editableRef}
            className={`${styles.chat__input__editable} ${isEditableEmpty ? styles.empty : ""}`}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-placeholder="Cuéntame lo que quieras..."
          />

          <div className={styles.chat__input__form__buttons}>
            {status === "streaming" ? (
              <button type="button" className={styles.chat__input__form__button} onClick={stop}>
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16.6265" cy="16.6265" r="16.6265" fill="var(--color-black)"/>
                  <rect x="11.6265" y="11.6265" width="10" height="10" rx="1" fill="white"/>
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className={styles.chat__input__form__button}
                disabled={isEditableEmpty || status !== "ready"}
              >
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16.6265" cy="16.6265" r="16.6265" fill="transparent" />
                  <path d="M12.8594 18.5374L16.6246 14.627L20.3906 18.5374" stroke="var(--color-black)" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
