'use client'

import { useEffect, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppContext } from '@/context/AppContext'
import { API_BASE_URL } from '@/services/config/api'
import { apiService } from '@/services/api'

const LoginSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { postId: contextPostId } = useContext(AppContext)

  useEffect(() => {
    const processLogin = async () => {
      try {
        //get token from search params
        const token = searchParams.get('token')

        if (!token) {
          router.push('/')
          return
        }

        /**
         * 1️⃣ Store token securely in HttpOnly cookie
         */
        const cookieRes = await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'authToken', token }),
        })

        if (!cookieRes.ok) {
          throw new Error('Failed to set auth cookie')
        }

        /**
         * 2️⃣ Get postId (still from localStorage or context)
         */
        const storedPostId = localStorage.getItem('postId')
        const postId = storedPostId || contextPostId

        console.log('PostId:', postId)
        console.log('API_BASE_URL:', API_BASE_URL)
        console.log('token', token)

        /**
         * 3️⃣ Assign post to user (token still used here once)
         */
        if (postId) {
          console.log("here")
          const response = await apiService.postText('/api/v1/landing/interview/assign', { postId: postId }, { token: token })
          console.log('response', response)
        }

        /**
         * 4️⃣ Redirect
         */
        router.push(`/preview?postId=${postId}`)

      } catch (error) {
        console.error('Error durante el login:', error)
      }
    }

    processLogin()
  }, [searchParams, router, contextPostId])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Procesando login...</p>
      </div>
    </div>
  )
}

export default LoginSuccessPage
