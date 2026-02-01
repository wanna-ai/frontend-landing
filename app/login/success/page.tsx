'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const LoginSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      // Guardar el token
      localStorage.setItem('authToken', token)

      /**
       * TODO: VINCULAR EL POST CON EL USUARIO
       */
      
      // Redirigir a donde quieras
      router.push('/brief') // o la página que prefieras
    } else {
      // Si no hay token, redirigir al login
      router.push('/register')
    }
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Iniciando sesión...</p>
    </div>
  )
}

export default LoginSuccessPage