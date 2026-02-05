// app/not-found.tsx (si usas App Router)
import { redirect } from 'next/navigation'

export default function NotFound() {
  redirect('/')
}