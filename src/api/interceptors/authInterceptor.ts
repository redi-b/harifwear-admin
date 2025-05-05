import { api } from "@/api";
import { refreshToken } from "@/api/auth";

const AUTH_EXCLUDED_PATHS = [
  "/api/admin/auth/sign-in",
  "/api/admin/auth/sign-up",
  "/api/admin/auth/refresh",
];

const shouldSkipAuthRefresh = (url?: string) => {
  if (!url) return true;
  return AUTH_EXCLUDED_PATHS.some((path) => url.includes(path));
};

let onTokenRefreshFailed: (() => Promise<void> | void)[] = [];

let refreshPromise: Promise<{ error?: any }> | null = null;

export const setAuthRefreshInterceptor = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !shouldSkipAuthRefresh(originalRequest.url)
      ) {
        originalRequest._retry = true;

        if (!refreshPromise) {
          refreshPromise = refreshToken().finally(() => {
            refreshPromise = null;
          });
        }

        const { error: refreshError } = await refreshPromise;

        if (!refreshError) {
          // Retry original request after successful refresh
          return api(originalRequest);
        } else {
          // Refresh failed, notify all and reject this request
          await runTokenRefreshFailCallbacks();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

export function addTokenRefreshFailCallback(
  callback: () => void | Promise<void>
) {
  onTokenRefreshFailed.push(callback);
}

export async function runTokenRefreshFailCallbacks() {
  for (const callback of onTokenRefreshFailed) {
    try {
      await callback();
    } catch (err) {
      console.error("Error in onRefreshFailed callback", err);
    }
  }
}
