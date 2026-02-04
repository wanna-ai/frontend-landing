'use client'

import { useEffect, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppContext } from '@/context/AppContext'
import { API_BASE_URL } from '@/services/config/api'

const LoginSuccessPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { postId: contextPostId } = useContext(AppContext)
  
  useEffect(() => {
    const processLogin = async () => {
      try {
        const token = searchParams.get('token')
        
        if (!token) {
          router.push('/register')
          return
        }

        // Guardar el token
        localStorage.setItem('authToken', token)

        // Obtener postId del localStorage o del contexto
        const storedPostId = localStorage.getItem('postId')
        const postId = storedPostId || contextPostId

        console.log('PostId:', postId)
        console.log('Token:', token)
        console.log('API_BASE_URL:', API_BASE_URL)

        // Vincular el post con el usuario si existe postId
        if (postId) {
          const response = await fetch(
            `${API_BASE_URL}/api/v1/landing/interview/assign`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ postId })
            }
          )

          if (!response.ok) {
            const errorText = await response.text()
            console.error('Error response:', errorText)
            throw new Error(`Error al vincular el post: ${response.status}`)
          }

          // Obtener la respuesta como texto primero
          const responseText = await response.text()
          console.log('Response text:', responseText)

          // Intentar parsearlo como JSON si no está vacío
          let data = null
          if (responseText) {
            try {
              data = JSON.parse(responseText)
              console.log('Parsed JSON:', data)
            } catch (e) {
              // Si no es JSON, usar el texto tal cual
              console.log('Response is plain text:', responseText)
              data = responseText
            }
          }

          // Limpiar el postId del localStorage después de asignarlo
          // localStorage.removeItem('postId')
          
          // Redirigir solo si todo fue exitoso
          router.push('/preview?postId=' + postId)
        } else {
          // Si no hay postId, redirigir igualmente
          router.push('/preview?postId=' + postId)
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