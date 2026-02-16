import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from '@/services/api';

const MOCK_BASE = 'https://api.playground.wannna.ai';

beforeEach(() => {
  vi.restoreAllMocks();
});

function mockFetch(body: unknown = {}, status = 200) {
  const fn = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });
  global.fetch = fn;
  return fn;
}

describe('apiService', () => {
  describe('GET', () => {
    it('sends correct method and headers', async () => {
      const fetchMock = mockFetch({ data: 1 });

      const result = await apiService.get('/api/v1/items');

      expect(fetchMock).toHaveBeenCalledWith(`${MOCK_BASE}/api/v1/items`, {
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      });
      expect(result).toEqual({ data: 1 });
    });
  });

  describe('POST', () => {
    it('sends JSON body', async () => {
      const fetchMock = mockFetch({ id: 1 });
      const payload = { name: 'test' };

      await apiService.post('/api/v1/items', payload);

      expect(fetchMock).toHaveBeenCalledWith(`${MOCK_BASE}/api/v1/items`, {
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(payload),
      });
    });
  });

  describe('PUT', () => {
    it('sends JSON body', async () => {
      const fetchMock = mockFetch({ id: 1 });
      const payload = { name: 'updated' };

      await apiService.put('/api/v1/items/1', payload);

      expect(fetchMock).toHaveBeenCalledWith(`${MOCK_BASE}/api/v1/items/1`, {
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(payload),
      });
    });
  });

  describe('DELETE', () => {
    it('sends no body', async () => {
      const fetchMock = mockFetch();

      await apiService.delete('/api/v1/items/1');

      expect(fetchMock).toHaveBeenCalledWith(`${MOCK_BASE}/api/v1/items/1`, {
        method: 'DELETE',
        headers: expect.any(Object),
      });
      const callArgs = fetchMock.mock.calls[0][1];
      expect(callArgs.body).toBeUndefined();
    });
  });

  describe('Authorization', () => {
    it('includes Bearer token when provided', async () => {
      const fetchMock = mockFetch();

      await apiService.get('/api/v1/me', { token: 'my-token' });

      const headers = fetchMock.mock.calls[0][1].headers;
      expect(headers['Authorization']).toBe('Bearer my-token');
    });

    it('does not include Authorization header without token', async () => {
      const fetchMock = mockFetch();

      await apiService.get('/api/v1/me');

      const headers = fetchMock.mock.calls[0][1].headers;
      expect(headers['Authorization']).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('throws on HTTP 404', async () => {
      mockFetch(null, 404);
      await expect(apiService.get('/api/v1/missing')).rejects.toThrow(
        'HTTP error! status: 404'
      );
    });

    it('throws on HTTP 500', async () => {
      mockFetch(null, 500);
      await expect(apiService.get('/api/v1/broken')).rejects.toThrow(
        'HTTP error! status: 500'
      );
    });

    it('propagates network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
      await expect(apiService.get('/api/v1/items')).rejects.toThrow(
        'Failed to fetch'
      );
    });
  });
});
