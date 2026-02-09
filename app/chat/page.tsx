'use client'
import styles from "./Chat.module.scss";
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
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
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

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

      const tokenResponse = await fetch('/api/auth/get-cookie', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!tokenResponse.ok) {
        throw new Error('Failed to fetch token')
      }
      const tokenData = await tokenResponse.json()
      const token = tokenData.token

      console.log(token)

      const response = await apiService.post('/api/v1/landing/posts/interview', {
        title: data.title,
        content: data.experience,
        pills: data.pildoras.join(' - '),
        reflection: data.reflection,
        story_valuable: data.story_valuable,
        rawInterviewText: data.rawInterviewText
      }, { token: token });

      
      // ✅ Fix: Handle response structure properly
      const responseData = response.data || response;
      setPostId(responseData.id);

      console.log("responseData", responseData)

      // set cookie authToken
      await Promise.all([
        await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'authToken', value: responseData.token }),
        })
        , await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'register', value: 'anonymous' }),
        })
      ])



      localStorage.setItem('postId', responseData.id);
      localStorage.setItem('title', responseData.title);
      localStorage.setItem('content', responseData.content);
      localStorage.setItem('communityId', responseData.communityId || communityId || '');
      localStorage.setItem('pills', responseData.pills);
      localStorage.setItem('reflection', responseData.reflection);
      localStorage.setItem('story_valuable', responseData.story_valuable);
      localStorage.setItem('rawInterviewText', responseData.rawInterviewText);

      // Navigate
      router.push(token ? '/preview?postId=' + responseData.id : '/register?postId=' + responseData.id);

    } catch (error) {
      console.error('Error al enviar la conversación al backend:', error);
      hasNavigated.current = false; // Reset on error
      alert('Error al guardar la experiencia. Por favor, intenta de nuevo.');
    }
  };

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    onFinish: ({ message }) => {
      setIsGenerating(false);

      // ✅ Process in parallel, not sequentially
      const textParts: string[] = [];
      let toolResult = null;
  
      message.parts.forEach((part) => {
        if (part.type === "text") {
          textParts.push(part.text);
        } else if (part.type === "tool-reviewExperience") {
          toolResult = (part as unknown as ToolResultPart).output;
        }
      });
  
      // ✅ Build conversation string only once
      if (textParts.length > 0) {
        conversationRef.current += `${message.role}: ${textParts.join('')}\n\n`;
      }
  
      // ✅ Handle tool result immediately without blocking
      if (toolResult) {
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
          rawInterviewText: conversationRef.current,
          visibility: 'PRIVATE'
        };
  
        // ✅ Update UI immediately (non-blocking)
        setExperienceData(experienceDataToSave);
        
        // ✅ Hide input immediately
        setIsInputVisible(false);
        
        // ✅ Save in background (don't await)
        saveAndNavigate(experienceDataToSave);
      }
    },

    onToolCall: async ({ toolCall }) => {
      console.log('toolCall', toolCall);
      if (toolCall.toolName === 'reviewExperience') {
        setIsGenerating(true);
        setIsInputVisible(false);
      }
    },
  });

  useEffect(() => {
    if (messages.length > 0) {
      const toolParts = messages.filter(message => message.parts.some(part => part.type === "tool-reviewExperience"));
      if (toolParts.length > 0) {
        setIsGenerating(true);
        setIsInputVisible(false);

        requestAnimationFrame(() => {
          scrollToBottom();
        });
        
        return;
      }
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [messages]);

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
    // ✅ Prevenir doble ejecución
    if (hasInitialized.current) {
      console.log('Already initialized, skipping');
      return;
    }

    // ✅ Prevenir doble ejecución
    if (!promptData) {
      console.log('No prompt data, skipping');
      return;
    }
    
    console.log('Initializing chat for the first time');
    hasInitialized.current = true;
    
    // Clear localStorage and state on mount
    ['title', 'content', 'communityId', 'pills', 'reflection', 'story_valuable', 'rawInterviewText']
      .forEach(key => localStorage.removeItem(key));

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

  // ✅ Solo mantén el scroll en un useEffect separado y más ligero
  useEffect(() => {
    if (messages.length === 0) return;
    
    const container = messagesContainerRef.current;
    if (container) {
      // ✅ Solo hacer scroll si no estamos generando
      if (!isGenerating) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages.length, isGenerating]); // ✅ Dependencia solo del length, no del array completo


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editableRef.current) return;

    const content = editableRef.current.innerText.trim();
    if (content === "") return;

    conversationRef.current += "user: " + content + "\n\n";

    if (status === "streaming") return;

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
  
      if (status === "streaming") return;

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
        
        {messages.map((message) => {
          // ✅ Filtrar solo las partes de texto una vez
          const textParts = message.parts.filter(part => part.type === "text");
          // ✅ Si no hay texto, no renderizar nada
          if (textParts.length === 0) return null;

          return (
            <div className={styles.chat__messages__message} key={message.id}>
              {textParts.map((part, index) => (
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
              ))}
            </div>
          );

        })}
        
        {isGenerating && (
          <div className={styles.chat__messages__message__reviewExperience}>
            <LoaderGenerate />
          </div>
        )}
        
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
      </div>
    </div>
  )
}