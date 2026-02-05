// app/lib/auth.ts (Server-side only)
import { cookies } from 'next/headers'

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value ?? null
}

// Para Server Actions/Route Handlers
export async function getAuthHeaders() {
  const token = await getAuthToken()
  if (!token) return null
  
  return {
    'Authorization': `Bearer ${token}`
  }
}