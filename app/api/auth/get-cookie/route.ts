import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const { name } = await req.json()
  const cookieStore = await cookies()
  return NextResponse.json({ token: cookieStore.get(name)?.value ?? null })
}