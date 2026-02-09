import  { cookies } from 'next/headers'
import { apiService } from '@/services/api';

interface User {
  id: string;
  fullName: string;
  pictureUrl: string;
  username: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: User | null;
  token: string | null;
}

export async function checkAuth(): Promise<AuthStatus> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  console.log('authToken', authToken);

  // Check if authToken is present
  if (!authToken) {
    return {
      isAuthenticated: false,
      isGuest: false,
      user: null,
      token: null,
    };
  }

  try {
    const response = await apiService.get('/api/v1/users/me', { token: authToken });
    console.log('response', response);
    const user: User = await response.json();
    console.log('user', user);

    const isGuest = user.fullName.startsWith('guest-');
    
    return {
      isAuthenticated: true,
      isGuest,
      user,
      token: authToken
    }
  } catch (error) {
    console.error('Error checking auth:', error);

    return {
      isAuthenticated: false,
      isGuest: false,
      user: null,
      token: null,
    };

  }
}