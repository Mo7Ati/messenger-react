import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "@/services/auth-service";
import type { User } from "@/types/general";

type AuthContextValue = {
  user: User | null;
  authLoading: boolean;
  setUser: (user: User | null) => void;

  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, token: string, password: string, password_confirmation: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const user = await authService.checkAuth();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) return;
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setUser(user);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const user = await authService.register(username, email, password);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await authService.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(
    async (email: string, token: string, password: string, password_confirmation: string) => {
      await authService.resetPassword(email, token, password, password_confirmation);
    },
    []
  );

  const value: AuthContextValue = {
    user,
    authLoading,
    setUser,
    login,
    register,
    logout,
    checkAuth,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error("User not found");
  return user;
}
