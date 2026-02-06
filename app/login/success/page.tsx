'use client'

import { useEffect, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppContext } from '@/context/AppContext'
import { apiService } from '@/services/api'

const LoginSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { postId: contextPostId, setUserInfo } = useContext(AppContext)

  useEffect(() => {
    const processLogin = async () => {
      try {
        const token = searchParams.get('token')
        if (!token) {
          router.push('/')
          return
        }

        // Store token in HttpOnly cookie
        const cookieRes = await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'authToken', value: token }),
        })

        if (!cookieRes.ok) {
          throw new Error('Failed to set auth cookie')
        }

        // Parallel requests for better performance
        const [userInfo, lastpageData] = await Promise.all([
          apiService.get('/api/v1/users/me', { token }),
          fetch('/api/auth/get-cookie-lastpage', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }).then(res => res.json())
        ])

        if (userInfo) {
          setUserInfo(userInfo)
        }

        const postId = localStorage.getItem('postId') || contextPostId
        const isFromRegister = lastpageData.lastpage === 'register'

        // Assign interview if coming from register flow
        if (isFromRegister && postId) {
          await apiService.postText(
            '/api/v1/landing/interview/assign',
            { postId },
            { token }
          )
          router.push(`/preview?postId=${postId}`)
        } else if (postId) {
          router.push(`/story/${postId}`)
        } else {
          // Fallback if no postId exists
          router.push('/') 
        }

      } catch (error) {
        console.error('Error during login:', error)
        // Consider showing error UI or redirecting to error page
        router.push('/?error=login_failed')
      }
    }

    processLogin()
  }, [searchParams, router, contextPostId, setUserInfo])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
        <p>Procesando login...</p>
      </div>
    </div>
  )
}

export default LoginSuccessPage