import { AuthProvider } from "@/contexts/AuthContext";
import { notifyError, notifyInfo, notifySuccess } from "@/utils/notification";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastOptions } from "react-toastify";

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.hash.replace("#", "?"));

    if (location.hash) {
      const messages: Record<string, string> = {};

      params.forEach((value, key) => {
        const decodedValue = decodeURIComponent(value.replace(/\+/g, " "));
        messages[key] = decodedValue;
      });

      const commonOpts: ToastOptions<unknown> = {
        autoClose: false,
        closeButton: true,
        closeOnClick: false,
      };

      if (messages.error || messages.error_description) {
        notifyError(
          messages.error_description || messages.error || "Unknown error",
          { ...commonOpts }
        );
      }

      if (messages.success) {
        notifySuccess(messages.success, { ...commonOpts });
      }

      if (messages.warning) {
        notifyInfo(messages.warning, { ...commonOpts });
      }

      if (messages.message) {
        notifyInfo(messages.message, { ...commonOpts });
      }

      navigate(location.pathname ?? "/");
    }
  }, [location.hash, navigate]);

  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default RootLayout;
