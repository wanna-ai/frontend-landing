'use client'

import { useEffect, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppContext } from '@/context/AppContext'
import { API_BASE_URL } from '@/services/config/api'
import { apiService } from '@/services/api'


const LoginSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { postId: contextPostId, setUserInfo } = useContext(AppContext)

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
         * 1️⃣ Store token securely in HttpOnly cookie and set register to user
         */
        await Promise.all([
          await fetch('/api/auth/set-cookie', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'authToken', value: token }),
          }),
          await fetch('/api/auth/set-cookie', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'register', value: 'user' }),
          })
        ])

        /*
         * Get cookie lastpage
         */
        const lastpageResponse = await fetch('/api/auth/get-cookie-lastpage', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const lastpageData = await lastpageResponse.json()
        const lastpage = lastpageData.lastpage
        console.log('lastpage', lastpage)

        /**
         * 2️⃣ Get user info (still from localStorage or context)
         */

        const userInfo = await apiService.get('/api/v1/users/me', { token: token })
        console.log('userInfo', userInfo)
        if (userInfo) {
          setUserInfo(userInfo)
        }

        /**
         * 3️⃣ Get postId (still from localStorage or context)
         */
        const storedPostId = localStorage.getItem('postId')
        const postId = storedPostId || contextPostId

        console.log('PostId:', postId)
        console.log('API_BASE_URL:', API_BASE_URL)
        console.log('token', token)
        
        /**
         * 5️⃣ Redirect
        */
       if (lastpage === 'register') {
        if (postId) {
          console.log("here")
          const response = await apiService.postText('/api/v1/landing/interview/assign', { postId: postId }, { token: token })
          console.log('response', response)
        }
        router.push(`/preview?postId=${postId}`)
        } else {
          router.push(`/story/${postId}`)
        }

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
