import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/services/config/api';

const COOKIE_NAME = 'WANNA_SESSION_ID';
const COOKIE_MAX_AGE = 1800; // 30 minutes

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const existingSessionId = cookieStore.get(COOKIE_NAME)?.value;

    if (existingSessionId) {
      return NextResponse.json({ sessionId: existingSessionId });
    }

    // Generate new session ID
    const sessionId = crypto.randomUUID();

    // Read client context from request body
    let clientContext = {};
    try {
      clientContext = await request.json();
    } catch {
      // No body or invalid JSON — proceed without context
    }

    // Call backend to init session
    await fetch(`${API_BASE_URL}/api/v1/session/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Wanna-Session-Id': sessionId,
      },
      body: JSON.stringify(clientContext),
    });

    // Set cookie and return
    const response = NextResponse.json({ sessionId });
    response.cookies.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('Error in POST /api/session/init:', error);
    return NextResponse.json(
      { error: 'Failed to initialize session' },
      { status: 500 }
    );
  }
}
