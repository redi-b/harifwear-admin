import { AxiosError } from "axios";
import { api } from ".";
import { setAuthRefreshInterceptor } from "@/api/interceptors/authInterceptor";

setAuthRefreshInterceptor();

// --- Helpers ---
const parseError = (error: unknown, fallback: string): string => {
  const err = error as AxiosError<{ message?: string }>;
  return err.response?.data?.message || fallback;
};

// --- Auth Functions ---

export const getCurrentUser = async (): Promise<string | null> => {
  try {
    const { data } = await api.get<{ user: string | null }>(
      "/api/admin/auth/user"
    );
    return data.user;
  } catch {
    return null;
  }
};

export const refreshToken = async (): Promise<{
  message?: string;
  error?: string;
}> => {
  try {
    const { data } = await api.post<{ message?: string }>(
      "/api/admin/auth/refresh"
    );
    return { message: data.message };
  } catch (error) {
    return { error: parseError(error, "Token refresh failed!") };
  }
};

export const signInUser = async (
  email: string,
  password: string
): Promise<{ user?: string; error?: string }> => {
  try {
    const { data } = await api.post<{ user: string }>(
      "/api/admin/auth/sign-in",
      {
        email,
        password,
      }
    );
    return { user: data.user };
  } catch (error) {
    return { error: parseError(error, "Sign in failed! Please try again.") };
  }
};

export const signOutUser = async (): Promise<{
  message?: string;
  error?: string;
}> => {
  try {
    const { data } = await api.post<{ message: string }>(
      "/api/admin/auth/logout"
    );
    return { message: data.message };
  } catch (error) {
    return { error: parseError(error, "Sign out failed! Please try again.") };
  }
};
