import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "@/lib/api";
import type { User } from "@/types/general";



type AuthContextValue = {
  user: User | null;
  authLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  /** Laravel: POST /forgot-password { email } */
  forgotPassword: (email: string) => Promise<void>;
  /** Laravel: POST /reset-password { email, token, password, password_confirmation } */
  resetPassword: (email: string, token: string, password: string, password_confirmation: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const { data: user } = await api.get<User>("/user");
      setUser(user);
    } catch (err) {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) return;
    checkAuth();
  }, [checkAuth]);

  const getCsrfCookie = useCallback(async () => {
    await api.get("/sanctum/csrf-cookie", { baseURL: `${import.meta.env.VITE_API_URL}` });
  }, []);


  const login = async (email: string, password: string) => {
    await getCsrfCookie();
    const { data: user } = await api.post("/login", { email, password });
    setUser(user);
  }



  const register = useCallback(async (name: string, email: string, password: string) => {
    await getCsrfCookie();
    const { data: user } = await api.post<User>("/register", { name, email, password });
    setUser(user);
  }, [getCsrfCookie]);

  const logout = useCallback(async () => {
    await api("/logout", { method: "POST" });
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await getCsrfCookie();
    await api.post("/forgot-password", { email });
  }, [getCsrfCookie]);

  const resetPassword = useCallback(
    async (email: string, token: string, password: string, password_confirmation: string) => {
      await getCsrfCookie();
      await api.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation,
      });
    },
    [getCsrfCookie]
  );

  const value: AuthContextValue = {
    user,
    authLoading,
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
