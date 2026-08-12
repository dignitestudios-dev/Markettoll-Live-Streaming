"use client";

import React, { useEffect, useState } from "react";
import { IoEye, IoHeart, IoClose, IoPaperPlane } from "react-icons/io5";
import { HiSignal } from "react-icons/hi2";

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMicOn: boolean;
  isCameraOn: boolean;
}

export default function GoLiveModal({
  isOpen,
  onClose,
  isMicOn,
  isCameraOn,
}: GoLiveModalProps) {
  const [streamDuration, setStreamDuration] = useState(0);
  const [viewerCount, setViewerCount] = useState(142);
  const [messages, setMessages] = useState([
    { id: 1, user: "Sarah K.", text: "Hello! Super excited for this stream! 🔥" },
    { id: 2, user: "Alex M.", text: "Can you show the featured item?" },
    { id: 3, user: "Elena R.", text: "Just placed an order! ❤️" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Live timer & viewer simulation
  useEffect(() => {
    if (!isOpen) {
      setStreamDuration(0);
      return;
    }

    const timer = setInterval(() => {
      setStreamDuration((prev) => prev + 1);
    }, 1000);

    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(viewerInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You (Host)", text: inputMessage.trim() },
    ]);
    setInputMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[960px] bg-[#0E131F] border border-white/15 rounded-[28px] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[90vh] max-h-[640px]">
        {/* Main Broadcast Screen (Left) */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          <img
            src="/images/pre-stream-presenter.png"
            alt="Live Stream Presenter"
            className="w-full h-full object-cover"
          />

          {/* Top Bar: LIVE badge, Duration, Viewers */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg tracking-wider animate-pulse">
                <HiSignal className="text-sm" /> LIVE
              </span>
              <span className="bg-black/60 backdrop-blur-md text-white font-mono text-xs px-3 py-1 rounded-full border border-white/10">
                {formatTime(streamDuration)}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white text-xs font-semibold">
              <IoEye className="text-emerald-400 text-sm" />
              <span>{viewerCount} Viewers</span>
            </div>
          </div>

          {/* Floating Reaction Animation */}
          <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setViewerCount((prev) => prev + 1)}
              className="w-11 h-11 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <IoHeart className="text-xl" />
            </button>
          </div>
        </div>

        {/* Live Chat & Controls (Right) */}
        <div className="w-full lg:w-[340px] bg-[#121824] border-l border-white/10 p-4 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-white font-bold text-sm">Live Audience Chat</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2.5 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-[#1A2232] border border-white/5 rounded-xl p-2.5 text-xs text-white"
              >
                <span className="font-bold text-[#0098EA] block mb-0.5">{msg.user}</span>
                <span className="text-gray-200">{msg.text}</span>
              </div>
            ))}
          </div>

          {/* Chat Input & End Stream Button */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Send a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#1A2232] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#0098EA]"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#0098EA] text-white rounded-xl hover:bg-[#0080ca] transition-colors cursor-pointer"
              >
                <IoPaperPlane className="text-xs" />
              </button>
            </form>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              End Stream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
