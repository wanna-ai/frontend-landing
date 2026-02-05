import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { name, token } = await req.json()

  if (!name || !token) {
    return NextResponse.json({ error: 'Missing name or token' }, { status: 400 })
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: name,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return response
}
