import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  isAuthenticated: boolean;
  token: string;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: '',
      setIsAuthenticated: (isAuthenticated) => {
        set(() => ({ isAuthenticated: isAuthenticated }));
      },
      setToken: (token) => {
        set(() => ({ token: token }));
      },
    }),
    {
      name: 'authStore',
    },
  ),
);
