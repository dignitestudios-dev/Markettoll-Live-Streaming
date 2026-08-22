"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoMic, IoMicOff, IoVideocam, IoVideocamOff } from "react-icons/io5";

interface VideoPreviewCardProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  posterImage?: string;
}

export default function VideoPreviewCard({
  isMicOn,
  isCameraOn,
  onToggleMic,
  onToggleCamera,
  posterImage,
}: VideoPreviewCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [streamActive, setStreamActive] = useState<boolean>(false);

  // Initialize camera stream when isCameraOn is true
  useEffect(() => {
    let isMounted = true;

    async function setupCamera() {
      if (!isCameraOn) {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        if (isMounted) setStreamActive(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: isMicOn,
        });

        if (isMounted) {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setStreamActive(true);
        }
      } catch (error) {
        console.warn("Camera access fallback to presenter preview:", error);
        if (isMounted) {
          setStreamActive(false);
        }
      }
    }

    setupCamera();

    return () => {
      isMounted = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [isCameraOn]);

  // Ensure stream stays attached to video element on state changes
  useEffect(() => {
    if (videoRef.current && mediaStreamRef.current && isCameraOn) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [streamActive, isCameraOn]);

  // Handle live toggle of audio tracks on the active stream
  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMicOn;
      });
    }
  }, [isMicOn]);

  return (
    <div className="relative w-full max-w-[580px] aspect-[4/3] rounded-[24px] overflow-hidden bg-[#121722] border border-white/10 shadow-2xl flex items-center justify-center group">
      {/* Top Left Badge: ON / OFF */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white text-xs font-semibold select-none shadow-md">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isCameraOn ? "bg-emerald-400 animate-pulse" : "bg-gray-400"
          }`}
        />
        <span>{isCameraOn ? "ON" : "OFF"}</span>
      </div>

      {/* Video Element (Always present in DOM so stream attaches immediately) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover rounded-[24px] -scale-x-100 transition-opacity duration-300 ${
          isCameraOn && streamActive ? "opacity-100 block" : "opacity-0 hidden"
        }`}
      />

      {/* Presenter Poster Fallback (Displayed when webcam stream is not active or camera is off) */}
      {(!isCameraOn || !streamActive) && (
        <div className="relative w-full h-full">
          <img
            src={posterImage || "/images/pre-stream-presenter.png"}
            alt="Stream Presenter Preview"
            className="w-full h-full object-cover rounded-[24px]"
            style={{ imageRendering: "auto" }}
          />
          {!isCameraOn && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-white/90 text-xs font-semibold px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/15 shadow-lg">
                Camera Off
              </span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Floating Control Bar (Mic & Camera Toggles) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-xl select-none">
        {/* Mic Toggle Button */}
        <button
          type="button"
          onClick={onToggleMic}
          aria-label={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isMicOn
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]"
          }`}
        >
          {isMicOn ? <IoMic className="text-lg" /> : <IoMicOff className="text-lg" />}
        </button>

        {/* Camera Toggle Button */}
        <button
          type="button"
          onClick={onToggleCamera}
          aria-label={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isCameraOn
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]"
          }`}
        >
          {isCameraOn ? <IoVideocam className="text-lg" /> : <IoVideocamOff className="text-lg" />}
        </button>
      </div>
    </div>
  );
}
