import { useContext, useCallback } from 'react';
import { AppContext } from '@/context/AppContext';
import type { AuthStatus } from '@/app/api/auth/check-auth/route';

export const useAuth = () => {
  const { setToken, setUserInfo } = useContext(AppContext);

  const checkAuthStatus = useCallback(async (): Promise<AuthStatus | null> => {
    try {
      const response = await fetch('/api/auth/check-auth', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check auth status');
      }

      const authStatusData: AuthStatus = await response.json();

      // Actualizar contexto si está autenticado
      if (authStatusData.isAuthenticated && authStatusData.user) {
        setToken(authStatusData.token);
        setUserInfo(authStatusData.user);
      } else {
        setToken(null);
        setUserInfo(null);
      }

      return authStatusData;
    } catch (error) {
      console.error('Error checking auth:', error);
      setToken(null);
      setUserInfo(null);
      return null;
    }
  }, [setToken, setUserInfo]);

  return { checkAuthStatus };
};