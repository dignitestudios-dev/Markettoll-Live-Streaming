"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import { toast } from "react-toastify";
import VideoPreviewCard from "./video-preview-card";
import StreamStatusCard from "./stream-status-card";
import { liveSocketService } from "@/features/live-stream/services/live-socket.service";

export default function PreStreamSetupView() {
  const router = useRouter();

  const [draftData, setDraftData] = useState<{
    title: string;
    description: string;
    category: string;
    products: string[];
    thumbnail: string;
  }>({
    title: "",
    description: "",
    category: "",
    products: [],
    thumbnail: "",
  });

  // Pre-connect live socket and load draft stream info on page load
  useEffect(() => {
    liveSocketService.connect();

    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("draft_live_stream");
        if (stored) {
          const parsed = JSON.parse(stored);
          setDraftData((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.warn("Could not read draft_live_stream from sessionStorage:", err);
      }
    }
  }, []);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const handleToggleMic = () => {
    const nextState = !isMicOn;
    setIsMicOn(nextState);
    toast.info(nextState ? "Microphone Unmuted" : "Microphone Muted", {
      autoClose: 1500,
      toastId: "mic-status-toast",
    });
  };

  const handleToggleCamera = () => {
    const nextState = !isCameraOn;
    setIsCameraOn(nextState);
    toast.info(nextState ? "Camera Enabled" : "Camera Disabled", {
      autoClose: 1500,
      toastId: "camera-status-toast",
    });
  };

  const handleGoLive = async () => {
    try {
      setIsStarting(true);

      const title = draftData.title || "Live Stream Broadcast";
      const description = draftData.description || "Live shopping broadcast session";
      const category = draftData.category || "General";
      const products = draftData.products || [];
      const thumbnail =
        draftData.thumbnail ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

      const res = await liveSocketService.createLive({
        title,
        description,
        category,
        products,
        thumbnail,
      });

      if (!res.success) {
        toast.error(res.message || res.error || "Failed to start live stream.");
        return;
      }

      const liveId =
        res.data?.live?._id ||
        res.data?.liveId ||
        res.data?._id ||
        res.data?.roomId;

      const hostToken =
        res.data?.token || (res as any)?.token || res.data?.data?.token || "";

      if (typeof window !== "undefined") {
        if (hostToken) {
          sessionStorage.setItem(`hms_token_${liveId}`, hostToken);
        }
        sessionStorage.setItem("current_host_live_id", liveId);
        sessionStorage.setItem(`host_mic_${liveId}`, isMicOn ? "true" : "false");
        sessionStorage.setItem(`host_camera_${liveId}`, isCameraOn ? "true" : "false");
      }

      router.push(`/live-stream/${liveId}`);
    } catch (error: any) {
      console.error("Failed to start live stream:", error);
      toast.error(error?.message || "Failed to start live stream.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-4 bg-[#0D121B] flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <header className="w-full sm:px-10 py-2 flex items-center gap-3 border-b border-white/5 bg-[#0D121B]">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go Back"
          className="w-9 h-9 rounded-full bg-[#1A2232] hover:bg-[#253046] border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <IoChevronBack className="text-lg" />
        </button>

        <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight">
          Pre-Stream Setup
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Video Preview Section */}
          <VideoPreviewCard
            isMicOn={isMicOn}
            isCameraOn={isCameraOn}
            onToggleMic={handleToggleMic}
            onToggleCamera={handleToggleCamera}
            posterImage={draftData.thumbnail}
          />

          {/* Stream Status & Control Box */}
          <StreamStatusCard
            isMicOn={isMicOn}
            isCameraOn={isCameraOn}
            isStarting={isStarting}
            onGoLive={handleGoLive}
          />
        </div>
      </main>

    </div>
  );
}
