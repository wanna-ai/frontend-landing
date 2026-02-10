'use client'
import styles from "./Chat.module.scss";
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from "@/context/AppContext";
import { useSearchParams } from 'next/navigation'
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Loader from "@/components/Loader/Loader";
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api'
import LoaderGenerate from "@/components/LoaderGenerate/LoaderGenerate";
import { useAuth } from '@/app/hook/useAuth'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const communityId = searchParams.get('c') ?? undefined

  const { promptData, setExperienceData, setPostId } = useContext(AppContext);
  const router = useRouter();
  const { checkAuthStatus } = useAuth();

  // refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<string>("");
  const hasNavigated = useRef<boolean>(false);
  const hasInitialized = useRef<boolean>(false);

  // states
  const [isEditableEmpty, setIsEditableEmpty] = useState(true);
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  const saveAndNavigate = async () => {
    await Promise.all([
      localStorage.setItem('conversation', conversationRef.current),
      localStorage.setItem('editorPrompt', promptData?.editorPrompt || '')
    ]);

    const authStatus = await checkAuthStatus();
    console.log('authStatus', authStatus)

    router.push(authStatus?.isGuest ? '/register': '/result');
  };

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    onFinish: async ({ message }) => {
      const textParts = message.parts
        .filter(part => part.type === "text")
        .map(part => part.text);
  
      const fullText = textParts.join('');
      
      if (fullText) {
        conversationRef.current += `${message.role}: ${fullText}\n\n`;
      }
  
      if (fullText.includes("[WANNA_REVIEW_READY]")) {
        console.log("WANNA_REVIEW_READY")
        // await processExperience();
        
        // router.push('/result');
        await saveAndNavigate();
      }
    },
  });

  // ✅ Unificado: scroll cuando cambian los mensajes
  useEffect(() => {
    if (messages && !isGenerating) {
      requestAnimationFrame(scrollToBottom);
    }
  }, [messages, isGenerating]);

  // ✅ Prevenir scroll al hacer focus
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

  // ✅ Inicialización del chat
  useEffect(() => {
    if (hasInitialized.current || !promptData) return;

    console.log('promptData', promptData)
    
    hasInitialized.current = true;
    
    // Limpiar en una sola línea
    ['title', 'content', 'communityId', 'pills', 'reflection', 'story_valuable', 'rawInterviewText']
      .forEach(key => localStorage.removeItem(key));

    setExperienceData(null);
    setMessages([]);
    hasNavigated.current = false;

    sendMessage(
      {
        role: "user",
        parts: [{ type: "text", text: "Hola Wanna!" }]
      },
      {
        body: {
          data: {
            interviewerPrompt: promptData?.interviewerPromp,
          }
        }
      }
    );
  }, [promptData, setExperienceData, setMessages, sendMessage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editableRef.current || status === "streaming") return;

    const content = editableRef.current.innerText.trim();
    if (content === "") return;

    conversationRef.current += `user: ${content}\n\n`;

    sendMessage(
      {
        role: "user",
        parts: [{ type: "text", text: content }]
      },
      {
        body: {
          data: {
            interviewerPrompt: promptData?.interviewerPromp,
          }
        }
      }
    );

    editableRef.current.innerText = "";
    setIsEditableEmpty(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!editableRef.current || status === "streaming") return;
  
      const content = editableRef.current.innerText.trim();
      if (content === "") return;

      conversationRef.current += `user: ${content}\n\n`;
  
      sendMessage(
        {
          role: "user",
          parts: [{ type: "text", text: content }]
        },
        {
          body: {
            data: {
              interviewerPrompt: promptData?.interviewerPromp,
            }
          }
        }
      );
  
      editableRef.current.innerText = "";
      setIsEditableEmpty(true);
    }
  };

  const handleInput = () => {
    if (!editableRef.current) return;
    const text = editableRef.current.innerText.replace(/\n/g, "").trim();
    setIsEditableEmpty(text.length === 0);
  };

  return (
    <div className={styles.chat}>
      <div className={styles.chat__messages} ref={messagesContainerRef}>
        
        {messages.map((message) => {
          const textParts = message.parts.filter(part => part.type === "text");
          if (textParts.length === 0) return null;

          return (
            <div className={styles.chat__messages__message} key={message.id}>
              {textParts.map((part, index) => {
                // ✅ Ocultar el trigger
                if (part.text.includes("[WANNA_REVIEW_READY]")) return null;

                return (
                  <div
                    key={`${message.id}-${index}`}
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
                      {part.text}
                    </ReactMarkdown>
                  </div>
                );
              })}
            </div>
          );
        })}
        
        {isGenerating && (
          <div className={styles.chat__messages__message__reviewExperience}>
            <LoaderGenerate />
          </div>
        )}
        
        {status === "submitted" && !isGenerating && (
          <div className={styles.chat__messages__message__loading}>
            <Loader />
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
            {status === "submitted" || status === "streaming" ? (
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