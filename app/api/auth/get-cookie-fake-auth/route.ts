import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  return NextResponse.json({ token: cookieStore.get("fakeAuthToken")?.value ?? null })
}