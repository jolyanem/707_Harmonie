import type { UserRole } from 'backend-types';
import * as React from 'react';

export interface AuthContext {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    role: UserRole;
  } | null;
  token: string | null;
  setAuth: (token: string) => void;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthContext['user'] | null>(null);
  const [token, setToken] = React.useState<AuthContext['token'] | null>('test');
  const isAuthenticated = !!user;

  const setAuth = (token?: string) => {
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });
      setToken(token);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
