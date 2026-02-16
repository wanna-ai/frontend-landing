import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { apiService } from '@/services/api'

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
      text: async () => 'text response',
    })
  })

  describe('post()', () => {
    it('sends JSON body with Content-Type', async () => {
      await apiService.post('/api/v1/test', { foo: 'bar' })

      const [url, options] = mockFetch.mock.calls[0]
      expect(options.method).toBe('POST')
      expect(options.headers['Content-Type']).toBe('application/json')
      expect(JSON.parse(options.body)).toEqual({ foo: 'bar' })
    })

    it('adds Authorization header with token', async () => {
      await apiService.post('/api/v1/test', { foo: 'bar' }, { token: 'my-token' })

      const [, options] = mockFetch.mock.calls[0]
      expect(options.headers['Authorization']).toBe('Bearer my-token')
    })

    it('throws error on non-ok response', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 })

      await expect(apiService.post('/api/v1/test', {})).rejects.toThrow('HTTP error! status: 500')
    })
  })

  describe('get()', () => {
    it('sends GET with correct URL', async () => {
      await apiService.get('/api/v1/items')

      const [url, options] = mockFetch.mock.calls[0]
      expect(url).toContain('/api/v1/items')
      expect(options.method).toBe('GET')
    })
  })

  describe('put()', () => {
    it('sends PUT with JSON body', async () => {
      await apiService.put('/api/v1/test', { visibility: 'public' })

      const [, options] = mockFetch.mock.calls[0]
      expect(options.method).toBe('PUT')
      expect(JSON.parse(options.body)).toEqual({ visibility: 'public' })
    })
  })

  describe('delete()', () => {
    it('sends DELETE request', async () => {
      await apiService.delete('/api/v1/test/123')

      const [, options] = mockFetch.mock.calls[0]
      expect(options.method).toBe('DELETE')
    })
  })

  describe('postText()', () => {
    it('returns text instead of JSON', async () => {
      const result = await apiService.postText('/api/v1/text', { data: 'test' })
      expect(result).toBe('text response')
    })
  })

  it('all methods prepend API_BASE_URL', async () => {
    await apiService.post('/api/v1/a', {})
    await apiService.get('/api/v1/b')
    await apiService.put('/api/v1/c', {})
    await apiService.delete('/api/v1/d')
    await apiService.postText('/api/v1/e', {})

    for (const call of mockFetch.mock.calls) {
      expect(call[0]).toMatch(/^https?:\/\//)
      expect(call[0]).toContain('/api/v1/')
    }
  })
})
