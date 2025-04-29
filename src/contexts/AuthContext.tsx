import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getCurrentUser, signInUser, signOutUser, User } from "@/api/auth";
import { addTokenRefreshFailCallback } from "@/api/interceptors/authInterceptor";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  authenticated: boolean;
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

const AUTH_FLAG = "__admin_auth_pulse"; // Key name to indicate login state

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // REMOVE: For development
  const [user, setUser] = useState<User | null>({
    id: "",
    email: "harifwear@gmail.com",
    role: "admin",
  });
  const [authenticated, setAuthenticated] = useState<boolean>(true);

  // const [user, setUser] = useState<User | null>(null);
  // const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const shouldFetchUser = localStorage.getItem(AUTH_FLAG) === "1";

  const {
    data,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getCurrentUser,
    enabled: shouldFetchUser,
    retry: false,
  });

  useEffect(() => {
    if (isUserError) {
      setUser(null);
      setAuthenticated(false);
      setError(userError as Error);
      localStorage.removeItem(AUTH_FLAG);
    }

    if (isUserSuccess && data) {
      setUser(data);
      setAuthenticated(true);
    }
  }, [isUserError, isUserSuccess, data]);

  const signIn = async (email: string, password: string, from?: string) => {
    const { user, error } = await signInUser(email, password);

    if (user) {
      setUser(user);
      setAuthenticated(true);
      localStorage.setItem(AUTH_FLAG, "1");
      navigate(from ?? "/", { replace: true });
    }
    return { user, error };
  };

  const signOut = async () => {
    const { error } = await signOutUser();
    if (!error) {
      setUser(null);
      setAuthenticated(false);
      localStorage.removeItem(AUTH_FLAG);
    }
    return { error };
  };

  const refreshUser = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch (err: any) {
      console.error("Failed to refresh user:", err);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading: isUserLoading,
    error,
    authenticated,
    signIn,
    signOut,
    refreshUser,
  };

  useEffect(() => {
    addTokenRefreshFailCallback(async () => {
      const errorMessage = encodeURI("Invalid or expired session!");

      try {
        setUser(null);
        setAuthenticated(false);
        localStorage.removeItem(AUTH_FLAG);
      } catch (error) {
        console.error("Error signing out!");
      }
      navigate(`/sign-in#error=${errorMessage}`);
    });
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
