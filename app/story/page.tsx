'use client'
import { useRouter } from 'next/navigation'

const StoryPage = () => {
  const router = useRouter()
  router.push(`/`)
  return null;
}

export default StoryPage