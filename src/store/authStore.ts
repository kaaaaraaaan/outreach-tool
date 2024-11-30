import { create } from 'zustand';
import { User } from '../types';

// In a real application, these would be stored securely in a database
const DEFAULT_USERS = [
  {
    id: '1',
    name: 'Admin User',
    username: 'admin',
    password: 'admin123', // In production, this would be hashed
    role: 'admin' as const,
  },
  {
    id: '2',
    name: 'Agency User',
    username: 'agency',
    password: 'agency123',
    role: 'agency' as const,
  },
  {
    id: '3',
    name: 'Outreach Manager',
    username: 'outreach',
    password: 'outreach123',
    role: 'outreach_manager' as const,
  },
];

interface AuthState {
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (credentials) => {
    const user = DEFAULT_USERS.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user;
    set({ user: userWithoutPassword });
  },
  logout: () => set({ user: null }),
}));