import api from './api';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  /**
   * Login a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    this.setToken(data.token);
    return data.user;
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<User> {
    const { data: responseData } = await api.post<AuthResponse>('/auth/register', data);
    this.setToken(responseData.token);
    return responseData.user;
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
    }
  }

  /**
   * Get the current user profile
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.getToken()) {
        return null;
      }
      const { data } = await api.get<User>('/auth/me');
      return data;
    } catch (error) {
      this.removeToken();
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Store authentication token
   */
  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Remove authentication token
   */
  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }
}

export const authService = new AuthService();
export default authService; 