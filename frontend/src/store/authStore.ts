import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../lib/api';
import type { User } from '../types/api';

interface AuthState {
  user: User | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (code: string, state: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, userId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userId: null,
      isAuthenticated: false,

      login: async (code: string, state: string) => {
        const response = await auth.handleCallback(code, state);
        localStorage.setItem('userId', response.userId);
        set({
          user: response.user,
          userId: response.userId,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('userId');
        set({
          user: null,
          userId: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User, userId: string) => {
        localStorage.setItem('userId', userId);
        set({
          user,
          userId,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
