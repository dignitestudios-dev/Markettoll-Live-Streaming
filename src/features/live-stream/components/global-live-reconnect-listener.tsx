"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { liveSocketService } from "../services/live-socket.service";
import { useAuth } from "@/hooks/use-auth";

export default function GlobalLiveReconnectListener() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, accessToken, user } = useAuth();
  const isHandlingRef = useRef(false);

  useEffect(() => {
    // Ensure live socket is connected for authenticated user
    const socket = liveSocketService.connect();

    const handleHostReconnected = (rawRes: any) => {
      const res = Array.isArray(rawRes) ? rawRes[0] : rawRes;
      const resData = res?.data || res;
      if (!resData) return;

      const liveId =
        resData?.live?._id ||
        resData?.data?.live?._id ||
        resData?.liveId ||
        resData?.data?.liveId ||
        resData?.roomId ||
        resData?.data?.roomId;

      const token = resData?.token || resData?.data?.token || "";
      const hostId =
        resData?.live?.host?._id ||
        resData?.data?.live?.host?._id ||
        resData?.live?.host ||
        resData?.data?.live?.host;

      if (liveId) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("current_host_live_id", liveId);
          localStorage.setItem("current_host_live_id", liveId);
          if (token) {
            sessionStorage.setItem(`hms_token_${liveId}`, token);
            localStorage.setItem(`hms_token_${liveId}`, token);
          }
          if (hostId) {
            const strHostId = typeof hostId === "string" ? hostId : hostId._id || hostId.id;
            sessionStorage.setItem(`live_host_id_${liveId}`, strHostId);
          }
        }

        // Navigate to live stream page if not already on it
        const targetPath = `/live-stream/${liveId}`;
        if (!pathname?.includes(liveId)) {
          if (!isHandlingRef.current) {
            isHandlingRef.current = true;
            toast.success("Reconnected to your active live stream!");
            router.push(targetPath);
            setTimeout(() => {
              isHandlingRef.current = false;
            }, 3000);
          }
        }
      }
    };

    socket.on("live:host-reconnected", handleHostReconnected);

    return () => {
      socket.off("live:host-reconnected", handleHostReconnected);
    };
  }, [isAuthenticated, accessToken, user, pathname, router]);

  return null;
}
