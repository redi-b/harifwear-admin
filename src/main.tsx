import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slide, ToastContainer } from "react-toastify";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Slide}
        theme="dark"
        limit={5}
        draggablePercent={15}
        hideProgressBar
        closeOnClick
        toastStyle={{
          background: "#25262B",
          border: "1px solid rgba(107, 114, 128, 0.6)",
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.25)",
          borderRadius: "7px",
          color: "#e5e7eb",
          padding: "8px 10px",
        }}
        toastClassName={
          "h-min text-sm max-w-[90vw] sm:max-w-[75vw] md:max-w-[50vw] lg:max-w-[30vw]"
        }
        closeButton={false}
        draggable
        stacked
      />
    </StrictMode>
  </QueryClientProvider>
);
