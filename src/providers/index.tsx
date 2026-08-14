"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HMSRoomProvider } from "@100mslive/react-sdk";
import Cookies from "js-cookie";
import { store, useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";

function AuthRehydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken && urlToken.trim() !== "") {
        try {
          let parsedUser: any = null;
          try {
            parsedUser = JSON.parse(urlToken);
          } catch {
            parsedUser = JSON.parse(decodeURIComponent(urlToken));
          }

          if (
            parsedUser &&
            (parsedUser._id || parsedUser.id) &&
            parsedUser.role &&
            parsedUser.token
          ) {
            // Save to cookies & localStorage immediately
            Cookies.set("auth-token", parsedUser.token);
            localStorage.setItem("auth-token", parsedUser.token);
            Cookies.set("user", JSON.stringify(parsedUser));
            localStorage.setItem("user", JSON.stringify(parsedUser));
            localStorage.setItem("auth-user", JSON.stringify(parsedUser));

            // Dispatch to Redux store
            dispatch(setCredentials({ user: parsedUser, accessToken: parsedUser.token }));
          }
        } catch (error) {
          console.error("Failed to parse SSO token in AuthRehydrator:", error);
        }

        // Clean the URL query parameter using the History API
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        window.history.replaceState({}, "", url.pathname + url.search);
      } else {
        // Fallback to normal rehydration
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
