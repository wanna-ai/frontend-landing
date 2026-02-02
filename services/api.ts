// src/services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface RequestOptions {
  headers?: Record<string, string>;
}

export const apiService = {
  async post(endpoint: string, data: any, options?: RequestOptions) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error en la petición:', error)
      throw error
    }
  },
  
  async get(endpoint: string, options?: RequestOptions) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error en la petición:', error)
      throw error
    }
  },
  
  async put(endpoint: string, data: any, options?: RequestOptions) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error en la petición:', error)
      throw error
    }
  },
  
  async delete(endpoint: string, options?: RequestOptions) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error en la petición:', error)
      throw error
    }
  },
  
  withAuth(token: string) {
    return {
      post: (endpoint: string, data: any, options?: RequestOptions) =>
        this.post(endpoint, data, {
          headers: { Authorization: `Bearer ${token}`, ...options?.headers }
        }),
      get: (endpoint: string, options?: RequestOptions) =>
        this.get(endpoint, {
          headers: { Authorization: `Bearer ${token}`, ...options?.headers }
        }),
      put: (endpoint: string, data: any, options?: RequestOptions) =>
        this.put(endpoint, data, {
          headers: { Authorization: `Bearer ${token}`, ...options?.headers }
        }),
      delete: (endpoint: string, options?: RequestOptions) =>
        this.delete(endpoint, {
          headers: { Authorization: `Bearer ${token}`, ...options?.headers }
        })
    }
  }
}