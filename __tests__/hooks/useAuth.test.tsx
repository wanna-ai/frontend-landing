import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useAuth } from '@/app/hook/useAuth';
import { AppContext } from '@/context/AppContext';

const mockSetToken = vi.fn();
const mockSetUserInfo = vi.fn();

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) => (
    <AppContext.Provider
      value={{
        experienceData: null,
        setExperienceData: vi.fn(),
        promptData: null,
        setPromptData: vi.fn(),
        token: null,
        setToken: mockSetToken,
        postId: null,
        setPostId: vi.fn(),
        isLoadingPrompts: false,
        fetchPromptData: vi.fn(),
        userInfo: null,
        setUserInfo: mockSetUserInfo,
        toast: { show: false, message: '', type: 'success' },
        setToast: vi.fn(),
        colorInverse: false,
        setColorInverse: vi.fn(),
        sessionId: null,
        setSessionId: vi.fn(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function mockFetch(body: unknown, ok = true, status = 200) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
  mockSetToken.mockClear();
  mockSetUserInfo.mockClear();
});

describe('useAuth — checkAuthStatus', () => {
  it('updates context when auth is successful', async () => {
    const authData = {
      isAuthenticated: true,
      isGuest: false,
      user: { id: '1', fullName: 'Test', pictureUrl: '', username: 'test' },
      token: 'abc123',
    };
    mockFetch(authData);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    let status: unknown;
    await act(async () => {
      status = await result.current.checkAuthStatus();
    });

    expect(mockSetToken).toHaveBeenCalledWith('abc123');
    expect(mockSetUserInfo).toHaveBeenCalledWith(authData.user);
    expect(status).toEqual(authData);
  });

  it('clears context when auth fails (not authenticated)', async () => {
    const authData = {
      isAuthenticated: false,
      isGuest: true,
      user: null,
      token: null,
    };
    mockFetch(authData);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.checkAuthStatus();
    });

    expect(mockSetToken).toHaveBeenCalledWith(null);
    expect(mockSetUserInfo).toHaveBeenCalledWith(null);
  });

  it('returns null and clears context on network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    let status: unknown;
    await act(async () => {
      status = await result.current.checkAuthStatus();
    });

    expect(status).toBeNull();
    expect(mockSetToken).toHaveBeenCalledWith(null);
    expect(mockSetUserInfo).toHaveBeenCalledWith(null);
  });

  it('clears context on non-ok HTTP response', async () => {
    mockFetch(null, false, 500);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    let status: unknown;
    await act(async () => {
      status = await result.current.checkAuthStatus();
    });

    expect(status).toBeNull();
    expect(mockSetToken).toHaveBeenCalledWith(null);
  });
});
