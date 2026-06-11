"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { apiFetch } from "@/lib/api";
import { clearTokens, getAccessToken, setTokens } from "@/lib/auth";

type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string | Date;
};

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  email: string;
  password: string;
  displayName?: string;
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type AuthState = {
  user: AuthUser | null;
  status: "idle" | "loading" | "ready";
  error: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthState["status"];
  error: string | null;
  isAuthenticated: boolean;
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  logout(): Promise<void>;
  refreshMe(): Promise<void>;
};

type Action =
  | { type: "loading" }
  | { type: "ready" }
  | { type: "setUser"; user: AuthUser | null }
  | { type: "setError"; error: string | null };

const AuthContext = createContext<AuthContextValue | null>(null);

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "loading":
      return { ...state, status: "loading", error: null };
    case "ready":
      return { ...state, status: "ready" };
    case "setUser":
      return { ...state, user: action.user, error: null, status: "ready" };
    case "setError":
      return { ...state, error: action.error, status: "ready" };
    default:
      return state;
  }
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refreshMe = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      dispatch({ type: "setUser", user: null });
      return;
    }

    dispatch({ type: "loading" });

    try {
      const user = await apiFetch<AuthUser>("/auth/me", { token });
      dispatch({ type: "setUser", user });
    } catch (e) {
      clearTokens();
      dispatch({
        type: "setError",
        error: e instanceof Error ? e.message : "Failed to load user",
      });
      dispatch({ type: "setUser", user: null });
    }
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    dispatch({ type: "loading" });

    try {
      const res = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: input,
      });

      setTokens(res.accessToken, res.refreshToken);
      dispatch({ type: "setUser", user: res.user });
    } catch (e) {
      dispatch({
        type: "setError",
        error: e instanceof Error ? e.message : "Login failed",
      });
      throw e;
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    dispatch({ type: "loading" });

    try {
      const res = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: input,
      });

      setTokens(res.accessToken, res.refreshToken);
      dispatch({ type: "setUser", user: res.user });
    } catch (e) {
      dispatch({
        type: "setError",
        error: e instanceof Error ? e.message : "Register failed",
      });
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    const token = getAccessToken();

    dispatch({ type: "loading" });

    try {
      if (token) {
        await apiFetch<unknown>("/auth/logout", { method: "POST", token });
      }
    } finally {
      clearTokens();
      dispatch({ type: "setUser", user: null });
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  const value: AuthContextValue = useMemo(
    () => ({
      user: state.user,
      status: state.status,
      error: state.error,
      isAuthenticated: !!state.user,
      login,
      register,
      logout,
      refreshMe,
    }),
    [login, logout, refreshMe, register, state.error, state.status, state.user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}