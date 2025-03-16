import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Mock the localStorage
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the api module
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should successfully login a user', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    const mockResponse = {
      user: mockUser,
      access_token: 'test-token',
      token_type: 'Bearer',
    };

    (api.post as any).mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(api.post).toHaveBeenCalledWith('/login', {
      email: 'test@example.com',
      password: 'password',
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  it('should handle login errors', async () => {
    const errorMessage = 'Invalid login credentials';
    (api.post as any).mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage,
        },
      },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await expect(result.current.login('test@example.com', 'wrong-password')).rejects.toThrow(errorMessage);
    });
  });

  it('should successfully register a user', async () => {
    const mockUser = {
      id: '1',
      name: 'New User',
      email: 'new@example.com',
      role: 'user',
    };

    const mockResponse = {
      user: mockUser,
      access_token: 'test-token',
      token_type: 'Bearer',
    };

    (api.post as any).mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.register('New User', 'new@example.com', 'password');
    });

    expect(api.post).toHaveBeenCalledWith('/register', {
      name: 'New User',
      email: 'new@example.com',
      password: 'password',
      password_confirmation: 'password',
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
  });

  it('should successfully logout a user', async () => {
    (api.post as any).mockResolvedValueOnce({});

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(api.post).toHaveBeenCalledWith('/logout');
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('should check auth status on mount', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    (localStorageMock.getItem as any).mockReturnValue('test-token');
    (api.get as any).mockResolvedValueOnce({ data: { data: mockUser } });

    let hook: any;

    await act(async () => {
      hook = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });
      // Wait for the effect to run
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(api.get).toHaveBeenCalledWith('/user');
    expect(hook.result.current.user).toEqual(mockUser);
    expect(hook.result.current.isAuthenticated).toBe(true);
  });
}); 