import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
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

async function checkAuth(): Promise<AuthStatus> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('authToken')?.value;

    // No token found
    if (!authToken) {
      return {
        isAuthenticated: false,
        isGuest: true,
        user: null,
        token: null,
      };
    }

    // Fetch user info
    const user: User = await apiService.get('/api/v1/users/me', { 
      token: authToken 
    });

    // Check if user is a guest
    const isGuest = user.username?.startsWith('guest-') || false;
    
    return {
      isAuthenticated: true,
      isGuest,
      user,
      token: authToken
    };

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

// Route handler
export async function GET() {
  try {
    const authStatus = await checkAuth();
    return NextResponse.json(authStatus);
  } catch (error) {
    console.error('Error in GET /api/auth/check-auth:', error);
    
    return NextResponse.json(
      {
        isAuthenticated: false,
        isGuest: false,
        user: null,
        token: null,
      },
      { status: 500 }
    );
  }
}