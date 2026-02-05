'use client'
import styles from "./Chat.module.scss";
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from "@/context/AppContext";
import { useSearchParams } from 'next/navigation'
import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Loader from "@/components/Loader/Loader";
import { ToolResultPart } from "ai";
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api'
import LoaderGenerate from "@/components/LoaderGenerate/LoaderGenerate";


export default function ChatPage() {
  const searchParams = useSearchParams()
  const communityId = searchParams.get('c') ?? undefined

  const { promptData } = useContext(AppContext);
  const router = useRouter();
  const { setExperienceData, setPostId, token, userInfo } = useContext(AppContext);

  // refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<string>("");
  const hasNavigated = useRef<boolean>(false); // ✅ Prevent double navigation
  const hasInitialized = useRef<boolean>(false);

  // states
  const [isEditableEmpty, setIsEditableEmpty] = useState(true);
  const [isInputVisible, setIsInputVisible] = useState(true);

  // ✅ Improved: Pass data directly, handle response properly
  const saveAndNavigate = async (data: {
    title: string;
    experience: string;
    pildoras: string[];
    reflection: string;
    story_valuable: string;
    rawInterviewText: string;
  }) => {
    // Prevent double navigation
    if (hasNavigated.current) {
      console.log('Navigation already in progress');
      alert('Navigation already in progress');
      return;
    }
    
    hasNavigated.current = true;

    try {

      const response = await apiService.post('/api/v1/landing/posts/interview', {
        title: data.title,
        content: data.experience,
        pills: data.pildoras.join(' - '),
        reflection: data.reflection,
        story_valuable: data.story_valuable,
        rawInterviewText: data.rawInterviewText
      });

      
      // ✅ Fix: Handle response structure properly
      const responseData = response.data || response;
      setPostId(responseData.id);

      console.log("responseData", responseData)

      // set cookie authToken
      const cookieRes = await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'fakeAuthToken', token: responseData.token }),
      })

      if (!cookieRes.ok) {
        throw new Error('Failed to set auth cookie')
      }
      
      localStorage.setItem('postId', responseData.id);
      localStorage.setItem('title', responseData.title);
      localStorage.setItem('content', responseData.content);
      localStorage.setItem('communityId', responseData.communityId || communityId || '');
      localStorage.setItem('pills', responseData.pills);
      localStorage.setItem('reflection', responseData.reflection);
      localStorage.setItem('story_valuable', responseData.story_valuable);
      localStorage.setItem('rawInterviewText', responseData.rawInterviewText);

      // Navigate
      router.push('/register?postId=' + responseData.id);

    } catch (error) {
      console.error('Error al enviar la conversación al backend:', error);
      hasNavigated.current = false; // Reset on error
      alert('Error al guardar la experiencia. Por favor, intenta de nuevo.');
    }
  };

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    onFinish: ({ message }) => {
      let textParts = "";
      let toolResult = null;
  
      message.parts.forEach((part) => {
        if (part.type === "text") {
          textParts += part.text;
        } else if (part.type === "tool-reviewExperience") {
          toolResult = (part as unknown as ToolResultPart).output;
        }
      });
  
      if (textParts) {
        conversationRef.current += message.role + ": " + textParts + "\n\n";
      }
  
      if (toolResult) {
        console.log(toolResult, conversationRef.current);
        const result = toolResult as { 
          title: string; 
          experience: string; 
          pildoras: string[]; 
          reflection: string; 
          story_valuable: string 
        };
        
        const experienceDataToSave = {
          title: result.title,
          experience: result.experience,
          pildoras: result.pildoras,
          reflection: result.reflection,
          story_valuable: result.story_valuable,
          rawInterviewText: conversationRef.current
        };

        // ✅ Set state for UI display
        setExperienceData(experienceDataToSave);
        saveAndNavigate(experienceDataToSave);

        // Scroll to bottom
        const container = messagesContainerRef.current;
        if (container) {
          requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
          });
        }
      }
    }
  });

  // scroll to top when clicking on input
  useEffect(() => {
    const preventScrollOnFocus = (e: Event) => {
      e.preventDefault();
      window.scrollTo(0, 0);
    };
  
    const editable = editableRef.current;
    if (editable) {
      editable.addEventListener('focus', preventScrollOnFocus);
    }
  
    return () => {
      if (editable) {
        editable.removeEventListener('focus', preventScrollOnFocus);
      }
    };
  }, []);

  // send message when component mounts
  useEffect(() => {
    // ✅ Guard: solo ejecutar si tenemos los prompts necesarios
    /* if (!promptData?.interviewerPromp || !promptData?.editorPrompt) {
      console.log('Waiting for prompt data...');
      return;
    } */

    // ✅ Prevenir doble ejecución
    if (hasInitialized.current) {
      console.log('Already initialized, skipping');
      return;
    }
    
    console.log('Initializing chat for the first time');
    hasInitialized.current = true;
    
    // Clear localStorage and state on mount
    localStorage.removeItem('title');
    localStorage.removeItem('content');
    localStorage.removeItem('communityId');
    localStorage.removeItem('pills');
    localStorage.removeItem('reflection');
    localStorage.removeItem('story_valuable');
    localStorage.removeItem('rawInterviewText');

    setExperienceData(null);
    setMessages([]);
    hasNavigated.current = false;

    // ✅ Enviar mensaje inicial
    sendMessage(
      {
        role: "user",
        parts: [{ type: "text", text: "Hola Wanna!" }]
      },
      {
        body: {
          data: {
            interviewerPrompt: promptData?.interviewerPromp,
            editorPrompt: promptData?.editorPrompt
          }
        }
      }
    );

  }, [promptData]); // ✅ Dependencias correctas

  useEffect(() => {
    if (messages.length > 0) {
      const hasReviewExperience = messages.some(message => 
        message.parts.some(part => part.type === "tool-reviewExperience")
      );

      if (hasReviewExperience) {
        setTimeout(() => {
          setIsInputVisible(false);
        }, 10);
      }
  
      const container = messagesContainerRef.current;
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editableRef.current) return;

    const content = editableRef.current.innerText.trim();
    if (content === "") return;

    conversationRef.current += "user: " + content + "\n\n";

    sendMessage(
      {
        role: "user",
        parts: [{ type: "text", text: content }]
      },
      {
        body: {
          data: {
            interviewerPrompt: promptData?.interviewerPromp,
            editorPrompt: promptData?.editorPrompt
          }
        }
      }
    );

    editableRef.current.innerText = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!editableRef.current) return;
  
      const content = editableRef.current.innerText.trim();
      if (content === "") return;

      conversationRef.current += "user: " + content + "\n\n";
  
      sendMessage(
        {
          role: "user",
          parts: [{ type: "text", text: content }]
        },
        {
          body: {
            data: {
              interviewerPrompt: promptData?.interviewerPromp,
              editorPrompt: promptData?.editorPrompt
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
        {messages.map((message) => (
          <div className={styles.chat__messages__message} key={message.id}>
            {message.parts.map((part, index) =>
                part.type === "text" ? (
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
                ) : part.type === "tool-reviewExperience" ? (
                  <div key={`${message.id}-${index}`} className={styles.chat__messages__message__reviewExperience}>
                    <LoaderGenerate />
                  </div>
                ) : null
            )}
          </div>
        ))}
        
        {status === "submitted" && (
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
        
        {/* <div className={styles.chat__input__disclaimer}>
          <p className={styles.chat__input__disclaimer__text}>
            Wanna puede cometer errores. Considera verificar la información importante.
          </p>
        </div> */}
      </div>
    </div>
  )
}