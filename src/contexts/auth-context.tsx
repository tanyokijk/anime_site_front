"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { BACKEND_BASE_URL, API_BASE_URL } from "@/config";
import { forgotPassword, resetPassword } from '../services/authService';

// Laravel API error response types
interface LaravelValidationErrors {
  [key: string]: string[];
}

interface LaravelErrorResponse {
  message?: string;
  errors?: LaravelValidationErrors;
}
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  avatar: string;
  backdrop: string;
  description: string;
  birthday: string;
  allow_adult: boolean;
  is_auto_next: boolean;
  is_auto_play: boolean;
  is_auto_skip_intro: boolean;
  is_private_favorites: boolean;
  is_banned: boolean;
  new_episodes: boolean;
  episode_date_changes: boolean;
  announcement_to_ongoing: boolean;
  comment_replies: boolean;
  comment_likes: boolean;
  review_replies: boolean;
  planned_reminders: boolean;
  new_selections: boolean;
  status_changes: boolean;
  new_seasons: boolean;
  subscription_expiration: boolean;
  subscription_renewal: boolean;
  payment_issues: boolean;
  tariff_changes: boolean;
  site_updates: boolean;
  maintenance: boolean;
  security_changes: boolean;
  new_features: boolean;
  email_verified_at: string | null;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
  age: number;
  is_online: boolean;
  formatted_last_seen: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setAuthData: (user: User, token: string) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, password: string, token: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  USER: "anime_user",
  TOKEN: "token",
} as const;

// Helper functions for localStorage - safe for SSR
const storage = {
  get: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail if localStorage is unavailable
    }
  },
  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail if localStorage is unavailable
    }
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const isAuthenticated = !!(user && token);

  const clearError = () => setError(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    // Add a small delay to prevent hydration mismatch
    const initializeAuth = () => {
      const storedUser = storage.get(STORAGE_KEYS.USER);
      const storedToken = storage.get(STORAGE_KEYS.TOKEN);
      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch {
          storage.remove(STORAGE_KEYS.USER);
          storage.remove(STORAGE_KEYS.TOKEN);
        }
      }
      setIsInitialized(true);
    };

    // Use setTimeout to ensure this runs after hydration
    const timeoutId = setTimeout(initializeAuth, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  // Save auth data to localStorage
  const saveAuthData = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
    storage.set(STORAGE_KEYS.TOKEN, token);
  };

  // Public method to set auth data (for external auth like OAuth)
  const setAuthData = (userData: User, tokenData: string) => {
    saveAuthData(userData, tokenData);
  };

  // Clear auth data from state and localStorage
  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.TOKEN);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}auth/login`;
      const requestBody = { email, password };

      console.log('Login request:', {
        url,
        method: 'POST',
        body: requestBody,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Login response status:', res.status);
      console.log('Login response headers:', Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        const errorText = await res.text();
        console.log('Login error response:', errorText);

        let errorData: LaravelErrorResponse = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          console.log('Could not parse error response as JSON');
        }

        let message = "Невдала спроба входу. Спробуйте ще раз.";
        if (errorData.message?.toLowerCase().includes("auth.failed")) {
          message = "Неправильний email або пароль.";
        } else if (errorData.message) {
          message = errorData.message;
        }
        throw new Error(message);
      }

      const responseText = await res.text();
      console.log('Login success response:', responseText);

      const data: LoginResponse = JSON.parse(responseText);
      if (!data.user || !data.token) throw new Error("Некоректна відповідь від сервера");

      saveAuthData(data.user, data.token);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Невідома помилка");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}auth/register`;
      const requestBody = {
        name,
        email,
        password,
        password_confirmation: password
      };

      console.log('Register request:', {
        url,
        method: 'POST',
        body: requestBody,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Register response status:', response.status);
      console.log('Register response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Register error response:', errorText);

        let errorData: LaravelErrorResponse = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          console.log('Could not parse error response as JSON');
        }

        let message = "Помилка реєстрації. Спробуйте ще раз.";

        if (errorData.message) {
          message = errorData.message;
        } else if (errorData.errors) {
          const errors = errorData.errors;
          const firstError = Object.values(errors)[0];
          message = Array.isArray(firstError) ? firstError[0] : 'Помилка валідації';
        }

        throw new Error(message);
      }

      const responseText = await response.text();
      console.log('Register success response:', responseText);

      const data: RegisterResponse = JSON.parse(responseText);

      if (!data.user || !data.token) {
        throw new Error("Invalid response: missing user or token");
      }

      saveAuthData(data.user, data.token);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Call backend logout endpoint if token exists
      if (token) {
        await fetch(`${API_BASE_URL}auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch((error) => {
          console.warn("Logout API call failed:", error);
          // Continue with local logout even if API call fails
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local auth data
      clearAuthData();
      setLoading(false);
    }
  };

  // Always render children - let components handle loading states individually
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        setAuthData: saveAuthData,
        forgotPassword,
        resetPassword,
        loading,
        error,
        isAuthenticated,
        isInitialized,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Utility function for making authenticated API requests with Bearer token
export const createAuthenticatedFetch = (token: string) => async (
  url: string,
  options: RequestInit = {}
) => {
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  // Не встановлюємо Content-Type для FormData, щоб браузер зробив це автоматично
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

// Export types for use in other components
export type { User, AuthContextType };
