import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { UserRole } from 'backend-types';
import * as React from 'react';

export interface AuthContext {
  state: 'loading' | 'authenticated' | 'unauthenticated';
  user:
    | {
        id: string;
        email: string;
        role: UserRole;
        name: string;
        surname: string;
      }
    | null
    | undefined;
  logout: () => void;
  login: () => Promise<unknown>;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const currentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => axios.get<AuthContext['user']>('/auth/user'),
    select: (data) => data.data,
    retry: false,
  });
  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      await axios.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ['currentUser'] });
    },
  });
  const user = currentUserQuery.data;
  const isAuthenticated = !!user;

  const logout = () => {
    logoutMutation.mutate();
  };

  const login = () =>
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });

  return (
    <AuthContext.Provider
      value={{
        state: currentUserQuery.isLoading
          ? 'loading'
          : isAuthenticated
          ? 'authenticated'
          : 'unauthenticated',
        user,
        logout,
        login,
      }}
    >
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
