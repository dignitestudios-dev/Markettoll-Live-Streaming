"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HMSRoomProvider } from "@100mslive/react-sdk";
import { store, useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";

function AuthRehydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const userStr = localStorage.getItem("user") || localStorage.getItem("auth-user");
    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        dispatch(setCredentials({ user, accessToken: token }));
      } catch {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60 * 5, retry: 1 },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HMSRoomProvider>
          <AuthRehydrator>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </AuthRehydrator>
        </HMSRoomProvider>
      </QueryClientProvider>
    </Provider>
  );
}
