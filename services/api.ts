// src/services/api.ts
import { API_BASE_URL } from './config/api'

interface RequestOptions {
  headers?: Record<string, string>
  token?: string // Nuevo: token opcional para client components
}

export const apiService = {
  // POST request
  async post(endpoint: string, data: any, options?: RequestOptions) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers
    }
    
    // Si viene token explícito (desde client), úsalo
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  },
  
  // GET request
  async get(endpoint: string, options?: RequestOptions) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers
    }
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  },

  // PUT request
  async put(endpoint: string, data: any, options?: RequestOptions) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers
    }
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })

    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  },

  // DELETE request
  async delete(endpoint: string, options?: RequestOptions) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers
    }
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`
    }
  
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }
}