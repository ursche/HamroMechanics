import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // Replace with localStorage if web
import React, { createContext, ReactNode, useEffect, useState } from 'react';

// -------------------------
// User type matching your Django model
// -------------------------
export interface User {
  id: number;
  full_name: string;
  phone: string;
  role: 'customer' | 'mechanic';
  is_active: boolean;
  is_staff: boolean;
  email?: string | null;
}

// -------------------------
// Input types for signup and login
// -------------------------
export interface SignupData {
  phone: string;
  full_name: string;
  role: 'customer' | 'mechanic';
  password: string;
  email?: string;
}

export interface LoginData {
  phone: string;
  password: string;
}

// -------------------------
// AuthContext shape
// -------------------------
interface AuthContextType {
  user: User | null;
  signup: (data: SignupData) => Promise<void>;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

// -------------------------
// Create the context
// -------------------------
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user + token on app start
  useEffect(() => {
    const loadUser = async () => {
      const access = await SecureStore.getItemAsync('access');
      const userData = await SecureStore.getItemAsync('user');
      if (access && userData) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        setUser(JSON.parse(userData));
      }
    };
    loadUser();
  }, []);

  // Signup + auto-login
  const signup = async (data: SignupData) => {
    try {
      const res = await axios.post('http://<your-api>/users/register/', data);

      const { user, access, refresh } = res.data;

      await SecureStore.setItemAsync('access', access);
      await SecureStore.setItemAsync('refresh', refresh);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setUser(user);
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      throw error;
    }
  };

  // Login existing user
  const login = async (credentials: LoginData) => {
    try {
      const res = await axios.post('http://<your-api>/api/token/', credentials);
      const { access, refresh } = res.data;

      const userRes = await axios.get('http://<your-api>/users/me/', {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const user = userRes.data;

      await SecureStore.setItemAsync('access', access);
      await SecureStore.setItemAsync('refresh', refresh);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setUser(user);
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  // Logout user & clear storage
  const logout = async () => {
    await SecureStore.deleteItemAsync('access');
    await SecureStore.deleteItemAsync('refresh');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
