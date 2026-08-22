"use client";

import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiSignal } from "react-icons/hi2";
import ButtonLoader from "@/components/ui/button-loader";
import { liveSocketService } from "@/features/live-stream/services/live-socket.service";

interface StreamStatusCardProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  isStarting: boolean;
  onGoLive: () => void;
}

export default function StreamStatusCard({
  isMicOn,
  isCameraOn,
  isStarting,
  onGoLive,
}: StreamStatusCardProps) {
  const statusItems = [
    {
      name: "Camera",
      isReady: isCameraOn,
      statusText: isCameraOn ? "Ready" : "Off",
    },
    {
      name: "Microphone",
      isReady: isMicOn,
      statusText: isMicOn ? "Ready" : "Muted",
    },
    {
      name: "Connection",
      isReady: true,
      statusText: "Ready",
    },
    {
      name: "Stream Key",
      isReady: true,
      statusText: "Ready",
    },
  ];
 
  return (
    <div className="w-full lg:w-[360px] bg-[#141B26] border border-[#222C3D] rounded-[24px] p-6 sm:p-7 text-white flex flex-col justify-between shadow-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Ready to Go Live?</h2>
        <p className="text-xs text-gray-400 mt-1 font-normal leading-relaxed">
          All checks passed. Your stream is ready to start.
        </p>


        {/* Checklist Rows */}
        <div className="mt-6 flex flex-col gap-3">
          {statusItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between py-1.5 text-sm"
            >
              <span className="text-gray-300 font-medium">{item.name}</span>

              <div
                className={`flex items-center gap-1.5 font-medium text-xs ${
                  item.isReady ? "text-[#10B981]" : "text-amber-400"
                }`}
              >
                {item.isReady ? (
                  <>
                    <FaCheck className="text-[11px]" />
                    <span>{item.statusText}</span>
                  </>
                ) : (
                  <>
                    <FaTimes className="text-[11px]" />
                    <span>{item.statusText}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Go Live Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onGoLive}
          disabled={isStarting}
          className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#FF5252] via-[#FF3B3B] to-[#FF2E2E] hover:from-[#FF3B3B] hover:to-[#E60000] text-white font-bold text-base shadow-[0_4px_20px_rgba(255,46,46,0.45)] hover:shadow-[0_6px_28px_rgba(255,46,46,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isStarting ? (
            <>
              <ButtonLoader size={20} className="text-white" />
              <span>Starting Live Stream...</span>
            </>
          ) : (
            <>
              <HiSignal className="text-xl animate-pulse" />
              <span>Go Live!</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
