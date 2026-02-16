import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '@/context/AppContext';

export const useSession = () => {
  const { setSessionId } = useContext(AppContext);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initSession = async () => {
      try {
        // Gather client context
        const nav = navigator as any;
        const clientContext: Record<string, unknown> = {
          language: navigator.language,
          languages: navigator.languages ? [...navigator.languages] : undefined,
          userAgent: navigator.userAgent,
          screenWidth: screen.width,
          screenHeight: screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        // Network info (if available)
        if (nav.connection) {
          clientContext.connection = {
            effectiveType: nav.connection.effectiveType,
            downlink: nav.connection.downlink,
            rtt: nav.connection.rtt,
          };
        }

        const response = await fetch('/api/session/init', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientContext),
        });

        if (!response.ok) {
          throw new Error('Failed to init session');
        }

        const data = await response.json();
        setSessionId(data.sessionId);
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    };

    initSession();
  }, [setSessionId]);
};
