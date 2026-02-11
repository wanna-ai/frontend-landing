'use client'

import { useEffect, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppContext } from '@/context/AppContext'
import { API_BASE_URL } from '@/services/config/api'
import { apiService } from '@/services/api'
import { useAuth } from '@/app/hook/useAuth'


const LoginSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { checkAuthStatus } = useAuth();
  const { postId: contextPostId, setUserInfo } = useContext(AppContext)

  useEffect(() => {
    const processLogin = async () => {
      try {

        // Check if we need to redirect to localhost
        /* const currentUrl = window.location.href
        const url = new URL(currentUrl)
        const pathname = url.pathname
        const search = url.search

        // If we're not already on localhost, redirect
        if (!window.location.hostname.includes('localhost')) {
          window.location.href = `http://localhost:3000${pathname}${search}`
          return
        } */
        
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

        const authStatus = await checkAuthStatus();
        console.log("authStatus", authStatus)

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
          router.push(`/result`)
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
