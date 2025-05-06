import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser, signInUser, signOutUser } from "@/api/auth";
import { addTokenRefreshFailCallback } from "@/api/interceptors/authInterceptor";

import Cookies from "js-cookie";

export interface User {
  id: string;
  email: string;
  role: "admin";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  authenticated: boolean;
  verifying: boolean;
  signIn: (
    email: string,
    password: string,
    from?: string
  ) => Promise<{ user?: User; error?: string }>;
  signOut: () => Promise<{ error?: string }>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AUTH_FLAG = "hw_admin_pulse";
const AUTH_USER = "hw_admin";

const setAuthCookie = (userData: User) => {
  Cookies.set(AUTH_USER, btoa(JSON.stringify(userData)), {
    secure: true,
    sameSite: "Strict",
    expires: 1 / 24, // 1 hour
  });
  Cookies.set(AUTH_FLAG, "1", {
    secure: true,
    sameSite: "Strict",
  });
};

const clearAuthCookie = () => {
  Cookies.remove(AUTH_FLAG);
  Cookies.remove(AUTH_USER);
};

const decodeUser = (userStr: string) => JSON.parse(atob(userStr)) as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cachedUser = (() => {
    try {
      const raw = Cookies.get(AUTH_USER);
      return raw ? decodeUser(raw) : null;
    } catch {
      return null;
    }
  })();

  const [shouldFetchUser, setShouldFetchUser] = useState(
    Cookies.get(AUTH_FLAG) == "1"
  );
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!cachedUser && shouldFetchUser);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: userData,
    isPending: userPending,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getCurrentUser,
    enabled: shouldFetchUser,
    retry: false,
  });

  useEffect(() => {
    if (!userPending) {
      if (userData) {
        setUser(decodeUser(userData));
        setAuthCookie(decodeUser(userData));
        setError(null);
      } else {
        setUser(null);
        setError(isUserError ? userError : null);
        Cookies.remove(AUTH_USER);
      }
      setVerifying(false);
      setLoading(false);
    }
  }, [userPending, userData, isUserError, userError]);

  const signIn = async (email: string, password: string, from?: string) => {
    const { user, error } = await signInUser(email, password);
    let parsedUser: User | undefined;
    if (user) {
      parsedUser = JSON.parse(atob(user));
      setUser(parsedUser ?? null);
      if (parsedUser) setAuthCookie(parsedUser);
      navigate(from ?? "/", { replace: true });
    }
    return { user: parsedUser, error };
  };

  const signOut = async () => {
    const { error } = await signOutUser();
    if (!error) {
      setUser(null);
      setShouldFetchUser(false);
      clearAuthCookie();
    }
    return { error };
  };

  const refreshUser = async () => {
    queryClient.invalidateQueries({
      queryKey: ["auth", "user"],
      refetchType: "active",
    });
  };

  const contextValue: AuthContextType = {
    user,
    loading: loading && userPending,
    error,
    authenticated: !!user,
    verifying,
    signIn,
    signOut,
    refreshUser,
  };

  useEffect(() => {
    addTokenRefreshFailCallback(async () => {
      const errorMessage = encodeURI("Invalid or expired session!");

      try {
        setUser(null);
        clearAuthCookie();
      } catch (error) {
        console.error("Error signing out!");
      }
      navigate(`/sign-in#error=${errorMessage}`, {
        state: { from: location.pathname },
      });
    });
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
