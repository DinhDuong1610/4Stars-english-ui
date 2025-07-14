import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser } from 'types/user.type';

interface AuthState {
    isAuthenticated: boolean;
    user: IUser | null;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    setUser: (user: IUser | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
            setUser: (user) => set({ user }),
            logout: () => {
                set({ isAuthenticated: false, user: null, accessToken: null });
                window.history.pushState({}, '', '/login');
                window.location.reload();
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
        }
    )
);