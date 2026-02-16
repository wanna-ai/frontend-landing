'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/app/hook/useAuth'

const LoginSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { checkAuthStatus } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processLogin = async () => {
      try {
        const token = searchParams.get('token')

        if (!token) {
          router.push('/')
          return
        }

        // If running inside a popup (opened by chat page), send token back and close
        // Use BroadcastChannel (reliable) + postMessage fallback (window.opener may be
        // null after cross-origin redirect chain: frontend → backend → Google → backend → frontend)
        if (window.opener || window.name === 'WannaLogin') {
          const channel = new BroadcastChannel('wanna-auth');
          channel.postMessage({ type: 'WANNA_AUTH_SUCCESS', token });
          channel.close();

          // Also try postMessage as fallback
          if (window.opener) {
            window.opener.postMessage({ type: 'WANNA_AUTH_SUCCESS', token }, window.location.origin);
          }

          window.close();
          return;
        }

        // Normal redirect flow: store token in cookie and redirect
        await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'authToken', value: token }),
        })

        const lastpageResponse = await fetch('/api/auth/get-cookie-lastpage', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
        const lastpageData = await lastpageResponse.json()

        await checkAuthStatus();

        if (lastpageData.lastpage === 'register') {
          router.push('/result')
        } else {
          const storedPostId = localStorage.getItem('postId')
          router.push(storedPostId ? `/story/${storedPostId}` : '/')
        }
      } catch (error) {
        console.error('Error durante el login:', error)
        router.push('/')
      } finally {
        setIsProcessing(false)
      }
    }

    processLogin()
  }, [searchParams, router, checkAuthStatus])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <p>{isProcessing ? 'Procesando login...' : 'Redirigiendo...'}</p>
      </div>
    </div>
  )
}

export default LoginSuccessPage
