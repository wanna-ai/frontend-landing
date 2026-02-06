// app/api/auth/set-cookie/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { name, value } = await req.json()

  if (!name || !value) {
    return NextResponse.json({ error: 'Missing name or value' }, { status: 400 })
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: name,
    value: value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return response
}