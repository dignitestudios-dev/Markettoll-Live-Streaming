"use client";

import React, { useEffect, useRef, useState } from "react";
import { IoPaperPlane } from "react-icons/io5";
import { useAuth } from "@/hooks/use-auth";
import { liveSocketService } from "../services/live-socket.service";

export interface ChatMessage {
  id: string;
  sender: string;
  username: string;
  avatar?: string;
  role: "host" | "cohost" | "viewer";
  message: string;
  createdAt: string;
}

interface LiveChatPanelProps {
  liveId: string;
  isHost?: boolean;
  currentUsername?: string;
  isLiveEnded?: boolean;
}

export default function LiveChatPanel({
  liveId,
  isHost = true,
  currentUsername,
  isLiveEnded = false,
}: LiveChatPanelProps) {
  const { user } = useAuth();
  const currentUserId = (user as any)?._id || (user as any)?.id ? String((user as any)?._id || (user as any)?.id) : "";
  const userAvatar = (user as any)?.avatar || (user as any)?.image || (user as any)?.profileImage || "";
  const displayName = currentUsername || user?.name || (isHost ? "Host" : "Viewer");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Socket listener for new messages
  useEffect(() => {
    const socket = liveSocketService.connect();

    const handleNewMessage = (res: any) => {
      const msgData = res?.data || res;
      if (!msgData || (!msgData.message && !msgData.text)) return;

      const incomingText = (msgData.message || msgData.text || "").trim();
      const incomingId = msgData._id || msgData.id || `msg-${Date.now()}-${Math.random()}`;
      const senderId = String(msgData.sender || msgData.userId || msgData.user?._id || "");
      const isCurrentUserMsg = Boolean(currentUserId && senderId === currentUserId);
      const isHostMsg = msgData.role === "host" || (isHost && isCurrentUserMsg);

      const username =
        msgData.username ||
        msgData.senderName ||
        msgData.user?.name ||
        msgData.user?.username ||
        (isHostMsg ? displayName : isCurrentUserMsg ? displayName : "Viewer");

      const role: "host" | "cohost" | "viewer" = isHostMsg
        ? "host"
        : msgData.role || "viewer";

      const formattedMsg: ChatMessage = {
        id: incomingId,
        sender: senderId || (isCurrentUserMsg ? "current-user" : "user-id"),
        username,
        avatar:
          msgData.avatar ||
          msgData.user?.avatar ||
          userAvatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        role,
        message: incomingText,
        createdAt: msgData.createdAt || new Date().toISOString(),
      };

      setMessages((prev) => {
        // 1. Check if exact message id already exists
        if (prev.some((m) => m.id === incomingId)) {
          return prev;
        }

        // 2. Check if an optimistic client message exists with same text to replace
        const clientIndex = prev.findIndex(
          (m) => m.id.startsWith("client-") && m.message === incomingText
        );

        if (clientIndex !== -1) {
          const updated = [...prev];
          updated[clientIndex] = formattedMsg;
          return updated;
        }

        // 3. Otherwise append new message
        return [...prev, formattedMsg];
      });
    };

    socket.on("live:new-message", handleNewMessage);

    return () => {
      socket.off("live:new-message", handleNewMessage);
    };
  }, [liveId, isHost, displayName, currentUserId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLiveEnded || !inputMessage.trim()) return;

    const text = inputMessage.trim();
    setInputMessage("");

    const clientMsgId = `client-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: clientMsgId,
      sender: currentUserId || "current-user",
      username: displayName,
      avatar: userAvatar || "/upload-profile-image-icon.png",
      role: isHost ? "host" : "viewer",
      message: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    const res = await liveSocketService.sendMessage(liveId, text);
    if (!res.success) {
      console.warn("Send message notice:", res.message || res.error);
    }
  };

  const handleSendReaction = async (emoji: string) => {
    if (isLiveEnded) return;
    const clientMsgId = `client-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: clientMsgId,
      sender: currentUserId || "current-user",
      username: displayName,
      avatar: userAvatar || "/upload-profile-image-icon.png",
      role: isHost ? "host" : "viewer",
      message: emoji,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    await liveSocketService.sendMessage(liveId, emoji);
  };

  return (
    <div className="w-full lg:w-[320px] xl:w-[360px] h-[520px] lg:h-full max-h-[600px] bg-[#0E1420] border-l border-white/10 flex flex-col justify-between p-4 shadow-2xl select-none overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto py-2 flex flex-col gap-3 pr-1.5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-2.5 text-xs text-white">
            <img
              src={
                msg.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              }
              alt={msg.username}
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/20 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-[#0098EA] text-[12px] block truncate">
                {msg.username}
              </span>
              <p className="text-gray-200 text-xs leading-relaxed break-words mt-0.5">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Reactions Toolbar & Message Input */}
      <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
        {/* Emoji Quick Reactions Bar */}
        <div className="flex items-center justify-between px-2 text-base">
          {["❤️", "🎁", "👏", "🎉", "🤩", "🔥"].map((emoji) => (
            <button
              key={emoji}
              type="button"
              disabled={isLiveEnded}
              onClick={() => handleSendReaction(emoji)}
              className="hover:scale-125 active:scale-95 transition-transform cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            placeholder={isLiveEnded ? "Stream ended" : "Say something..."}
            disabled={isLiveEnded}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-[#1B2433] border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#0098EA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLiveEnded}
            className="w-9 h-9 bg-[#0098EA] hover:bg-[#0082c9] active:scale-95 text-white rounded-full transition-all shadow-md flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoPaperPlane className="text-sm" />
          </button>
        </form>
      </div>
    </div>
  );
}
