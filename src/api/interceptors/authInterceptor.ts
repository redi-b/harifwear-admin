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

        const { error } = await refreshToken();

        if (!error) {
          // If refresh succeeded, retry the original request
          return api(originalRequest);
        } else {
          // If refresh failed, run the callbacks
          await runTokenRefreshFailCallbacks();
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
