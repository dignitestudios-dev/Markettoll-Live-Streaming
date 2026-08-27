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

    const parseLiveIdAndData = (rawRes: any) => {
      const res = Array.isArray(rawRes) ? rawRes[0] : rawRes;
      const resData = res?.data || res;
      if (!resData) return { liveId: "", token: "", hostId: "", role: "" };

      const liveId =
        resData?.live?._id ||
        resData?.live?.id ||
        (typeof resData?.live === "string" ? resData.live : "") ||
        resData?.data?.live?._id ||
        resData?.data?.live?.id ||
        resData?.liveId ||
        resData?.data?.liveId ||
        resData?.roomId ||
        resData?.data?.roomId ||
        resData?._id ||
        resData?.id ||
        res?.live?._id ||
        res?.live?.id ||
        (typeof res?.live === "string" ? res.live : "") ||
        res?.liveId ||
        res?.roomId ||
        res?._id ||
        res?.id ||
        "";

      const token = resData?.token || resData?.data?.token || res?.token || "";
      const host =
        resData?.live?.host ||
        resData?.data?.live?.host ||
        res?.live?.host;
      const hostId =
        typeof host === "object" ? host?._id || host?.id : typeof host === "string" ? host : "";
      const role = String(resData?.role || resData?.data?.role || res?.role || "").toLowerCase();

      return { liveId: String(liveId), token, hostId, role };
    };

    const handleHostReconnected = (rawRes: any) => {
      const { liveId, token, hostId } = parseLiveIdAndData(rawRes);
      if (!liveId) return;

      if (typeof window !== "undefined") {
        sessionStorage.setItem("current_host_live_id", liveId);
        localStorage.setItem("current_host_live_id", liveId);
        if (token) {
          sessionStorage.setItem(`hms_token_${liveId}`, token);
          localStorage.setItem(`hms_token_${liveId}`, token);
        }
        if (hostId) {
          sessionStorage.setItem(`live_host_id_${liveId}`, hostId);
        }
      }

      // Navigate to live stream page if not already on it
      const targetPath = `/live-stream/${liveId}`;
      if (pathname !== targetPath && !pathname?.endsWith(`/${liveId}`)) {
        if (!isHandlingRef.current) {
          isHandlingRef.current = true;
          toast.success("Reconnected to your active live stream!");
          router.push(targetPath);
          setTimeout(() => {
            isHandlingRef.current = false;
          }, 3000);
        }
      }
    };

    const handleReconnected = (rawRes: any) => {
      const { liveId, token, role } = parseLiveIdAndData(rawRes);
      if (!liveId) return;

      const isHostRole = role === "host" || role === "broadcaster";
      const isCohost = role === "co-host" || role === "cohost" || role === "co_host";

      // Viewer role hone par auto-reconnect ya redirect hit na karein
      if (!isHostRole && !isCohost) {
        return;
      }

      if (typeof window !== "undefined") {
        if (isHostRole) {
          sessionStorage.setItem("current_host_live_id", liveId);
          localStorage.setItem("current_host_live_id", liveId);
        }
        if (token) {
          sessionStorage.setItem(`hms_token_${liveId}`, token);
          localStorage.setItem(`hms_token_${liveId}`, token);
        }
      }

      const targetPath = `/live-stream/${liveId}`;
      if (pathname !== targetPath && !pathname?.endsWith(`/${liveId}`)) {
        if (!isHandlingRef.current) {
          isHandlingRef.current = true;
          toast.success("Reconnected to your active live stream!");
          router.push(targetPath);
          setTimeout(() => {
            isHandlingRef.current = false;
          }, 3000);
        }
      }
    };

    socket.on("live:host-reconnected", handleHostReconnected);
    socket.on("live:reconnected", handleReconnected);

    return () => {
      socket.off("live:host-reconnected", handleHostReconnected);
      socket.off("live:reconnected", handleReconnected);
    };
  }, [isAuthenticated, accessToken, user, pathname, router]);

  return null;
}
