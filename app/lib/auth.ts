import { apiService } from '@/services/api';

interface UserInfo {
  id: string;
  fullName: string;
  pictureUrl: string;
  username: string;
}

interface AuthTokenResult {
  token: string | null;
  userInfo: UserInfo | null;
}

export const getCookieAuthToken = async (): Promise<AuthTokenResult> => {
  try {
    // First, check the "register" cookie via API
    const registerResponse = await fetch('/api/auth/get-cookie-register', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const registerData = await registerResponse.json();
    console.log('register cookie:', registerData.register);

    // If register is "anonymous" or doesn't exist, remove authToken cookie and exit
    if (registerData.register === 'anonymous' || !registerData.register) {
      // Call API to remove authToken cookie
      await fetch('/api/auth/remove-cookie-token', {
        method: 'POST',
        credentials: 'include',
      });
      return { token: null, userInfo: null };
    }

    // If register is "user", proceed with getting the token
    if (registerData.register === 'user') {
      const tokenResponse = await fetch('/api/auth/get-cookie', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const tokenData = await tokenResponse.json();
      console.log('tokenData', tokenData);

      if (tokenData.token) {
        // Get user info
        const userInfoResponse = await apiService.get('/api/v1/users/me', { 
          token: tokenData.token 
        });
        console.log('userInfoResponse', userInfoResponse);

        return { 
          token: tokenData.token, 
          userInfo: userInfoResponse || null 
        };
      }
    }

    return { token: null, userInfo: null };
  } catch (error) {
    console.error('Error getting auth token:', error);
    return { token: null, userInfo: null };
  }
};