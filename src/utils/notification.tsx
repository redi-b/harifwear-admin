import { CheckCircle, Info, Loader, XCircle } from "lucide-react";
import {
  Id,
  toast,
  ToastContent,
  ToastOptions,
  UpdateOptions,
} from "react-toastify";

const successIcon = <CheckCircle size={22} color="#10b981" />; // Green success icon
const errorIcon = <XCircle size={22} color="#ef4444" />; // Red error icon
const infoIcon = <Info size={22} color="#3b82f6" />; // Blue for info

export const notifySuccess = (
  content: ToastContent<unknown>,
  options?: ToastOptions<unknown> | undefined
) => {
  toast.success(content, {
    icon: successIcon,
    ...options,
  });
};

export const notifyError = (
  content: ToastContent<unknown>,
  options?: ToastOptions<unknown> | undefined
) => {
  toast.error(content, {
    icon: errorIcon,
    ...options,
  });
};

export const notifyInfo = (
  content: ToastContent<unknown>,
  options?: ToastOptions<unknown> | undefined
) => {
  toast.info(content, {
    icon: infoIcon,
    ...options,
  });
};

export const notifyLoading = (
  content: ToastContent<unknown>,
  options?: ToastOptions<unknown> | undefined
): Id => {
  return toast.loading(content, {
    icon: <Loader size={22} className="animate-spin" color="#f97316" />,
    ...options,
  });
};

const toastUpdateConfig: UpdateOptions<unknown> = {
  isLoading: false,
  autoClose: 2000,
  closeOnClick: true,
  draggable: true,
};

export const loadingUpdateSuccess: UpdateOptions<unknown> = {
  ...toastUpdateConfig,
  type: "success",
  icon: successIcon,
};

export const loadingUpdateError: UpdateOptions<unknown> = {
  type: "error",
  ...toastUpdateConfig,
  icon: errorIcon,
};

export const loadingUpdateInfo: UpdateOptions<unknown> = {
  type: "info",
  ...toastUpdateConfig,
  icon: infoIcon,
};
