import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types/schema';

interface AuthContextType {
  user: User;
  switchDemoRole: (role: UserRole) => void;
  logout: () => void;
}

const DEMO_ACCOUNTS: Record<UserRole, User> = {
  COLLECTOR: {
    id: 'usr-collector-1',
    phone: '9999999999',
    name: 'Ramesh Kumar',
    role: 'COLLECTOR',
    language: 'hi'
  },
  RECYCLER: {
    id: 'usr-recycler-1',
    phone: '8888888888',
    name: 'Rajesh Sharma (GreenCycle)',
    role: 'RECYCLER',
    language: 'en'
  },
  ADMIN: {
    id: 'usr-admin-1',
    phone: '7777777777',
    name: 'Dr. S. K. Verma (JNARDDC / MoM)',
    role: 'ADMIN',
    language: 'en'
  }
};

function safeGetStorage(key: string): string | null {
  try {
    return typeof window !== 'undefined' && window.localStorage ? localStorage.getItem(key) : null;
  } catch (e) {
    console.warn('[Storage] localStorage read failed:', e);
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn('[Storage] localStorage write failed:', e);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = safeGetStorage('kabadiwala_demo_role');
    if (saved && DEMO_ACCOUNTS[saved as UserRole]) {
      return DEMO_ACCOUNTS[saved as UserRole];
    }
    return DEMO_ACCOUNTS.COLLECTOR;
  });

  const switchDemoRole = (role: UserRole) => {
    const targetUser = DEMO_ACCOUNTS[role];
    setUser(targetUser);
    safeSetStorage('kabadiwala_demo_role', role);
  };

  const logout = () => {
    switchDemoRole('COLLECTOR');
  };

  useEffect(() => {
    safeSetStorage('kabadiwala_demo_role', user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, switchDemoRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
