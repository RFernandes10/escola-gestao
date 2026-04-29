'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'DIRECTOR' | 'USER';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

let authToken: string | null = null;

function getApi() {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
  
  instance.interceptors.request.use(config => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  });
  
  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
  
  return instance;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    
    if (storedToken) {
      authToken = storedToken;
      setToken(storedToken);
      setTheme(storedTheme);
      fetchProfile();
    } else {
      setTheme(storedTheme);
      setIsLoading(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const fetchProfile = async () => {
    try {
      const api = getApi();
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      localStorage.removeItem('token');
      authToken = null;
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const api = getApi();
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    authToken = newToken;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    authToken = null;
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export function getApiInstance() {
  return getApi();
}