"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import {
  IoMicOutline,
  IoMicOffOutline,
  IoVideocamOutline,
  IoVideocamOffOutline,
} from "react-icons/io5";
import {
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
  selectLocalPeer,
  selectPeers,
  selectVideoTrackByPeerID,
  useVideo,
  HMSPeer,
} from "@100mslive/react-sdk";
import { CohostParticipant } from "./cohost-modal";
import { liveSocketService } from "../services/live-socket.service";

interface LiveVideoGridProps {
  liveId?: string;
  isHost?: boolean;
  isCohost?: boolean;
  hostUserId?: string;
  isMicOn: boolean;
  isCameraOn: boolean;
  isMirrored?: boolean;
  cohosts?: CohostParticipant[];
  onToggleMic: () => void;
  onToggleCamera?: () => void;
  isLiveEnded?: boolean;
}

interface Participant {
  userId: string;
  username: string;
  avatar: string;
  videoTrack?: string;
}



/**
 * 100ms Remote / Local Video Track Component
 */
function HMSVideoElement({
  trackId,
  className,
}: {
  trackId?: string;
  className?: string;
}) {
  const { videoRef } = useVideo({ trackId });
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={className}
    />
  );
}

export default function LiveVideoGrid({
  liveId,
  isHost = true,
  isCohost = false,
  hostUserId,
  isMicOn,
  isCameraOn,
  isMirrored = true,
  cohosts = [],
  onToggleMic,
  onToggleCamera,
  isLiveEnded = false,
}: LiveVideoGridProps) {
  const hostVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [streamActive, setStreamActive] = useState(false);

  // 100ms SDK Hooks
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const localPeer = useHMSStore(selectLocalPeer);
  const hmsPeers = useHMSStore(selectPeers) || [];

  // Identify Host Peer for Viewers (Remote peer for viewer)
  const hostPeer = isHost
    ? localPeer
    : hmsPeers.find(
        (peer: HMSPeer) =>
          peer.roleName?.toLowerCase() === "host" ||
          peer.roleName?.toLowerCase() === "broadcaster" ||
          (hostUserId && (peer.customerUserId === hostUserId || peer.id === hostUserId))
      ) ||
      hmsPeers.find((peer: HMSPeer) => !peer.isLocal);

  // Filter cohost peers: peers in the room whose role corresponds to a co-host
  const cohostPeers = hmsPeers.filter(
    (peer: HMSPeer) => {
      const role = peer.roleName?.toLowerCase() || "";
      return role === "cohost" || role === "co-host" || role === "co_host";
    }
  );

  // isPublisher: host OR cohost — these roles can publish media
  const isPublisher = isHost || isCohost;

  // Sync mic state with 100ms room actions for Host AND Co-host
  useEffect(() => {
    if (isConnected) {
      if (isPublisher) {
        hmsActions.setLocalAudioEnabled(isMicOn);
      } else {
        // VIEWER RULE: Never publish audio for normal viewer
        hmsActions.setLocalAudioEnabled(false);
      }
    }
  }, [isConnected, isMicOn, isPublisher, hmsActions]);

  // Sync camera state with 100ms room actions for Host AND Co-host
  useEffect(() => {
    if (isConnected) {
      if (isPublisher) {
        hmsActions.setLocalVideoEnabled(isCameraOn);
      } else {
        // VIEWER RULE: Never publish video for normal viewer
        hmsActions.setLocalVideoEnabled(false);
      }
    }
  }, [isConnected, isCameraOn, isPublisher, hmsActions]);

  // Fallback WebRTC mediaStream setup when 100ms room is disconnected or offline (Publisher only)
  useEffect(() => {
    let isMounted = true;

    async function setupCamera() {
      if (!isPublisher || isConnected) return; // 100ms handles track publishing when connected

      if (!isCameraOn) {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        if (hostVideoRef.current) {
          hostVideoRef.current.srcObject = null;
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
          if (hostVideoRef.current) {
            hostVideoRef.current.srcObject = stream;
          }
          setStreamActive(true);
        }
      } catch (error) {
        console.warn("Camera stream fallback to presenter thumbnail:", error);
        if (isMounted) setStreamActive(false);
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
  }, [isCameraOn, isConnected, isPublisher]);

  useEffect(() => {
    if (isPublisher && !isConnected && hostVideoRef.current && mediaStreamRef.current && isCameraOn) {
      hostVideoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [streamActive, isCameraOn, isConnected, isPublisher]);

  useEffect(() => {
    if (isPublisher && !isConnected && mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMicOn;
      });
    }
  }, [isMicOn, isConnected, isPublisher]);

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  // Combine dynamic cohosts from Socket.IO and active 100ms peers
  const activeParticipants: Participant[] = [];

  // 1. Add all active cohost peers connected via 100ms
  cohostPeers.forEach((p) => {
    const socketCohost = cohosts.find((c) => c.userId === p.customerUserId);
    activeParticipants.push({
      userId: p.id, // Use 100ms peer ID for key rendering stability
      username: socketCohost?.username || (p.name && p.name !== "Viewer" ? p.name : p.isLocal ? "You (Co-Host)" : "Co-Host"),
      avatar: socketCohost?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      videoTrack: p.videoTrack,
    });
  });

  // 2. Add co-hosts from Socket.IO state who are not yet connected via 100ms
  cohosts.forEach((c) => {
    const isAlreadyConnected = cohostPeers.some((p) => p.customerUserId === c.userId);
    if (!isAlreadyConnected) {
      activeParticipants.push({
        userId: c.userId,
        username: c.username && c.username !== "Someone" ? c.username : "Co-Host",
        avatar: c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        videoTrack: undefined,
      });
    }
  });

  // Retrieve local peer's HMS video track (for host/cohost)
  const localPeerVideoTrack = useHMSStore(selectVideoTrackByPeerID(localPeer?.id));
  // Retrieve host's HMS video track (for viewers watching the host)
  const hostVideoTrack = useHMSStore(selectVideoTrackByPeerID(hostPeer?.id));

  // Active main track ID: Host sees local track; Viewer & Co-Host see Host track (or fallback to local if cohost)
  const mainVideoTrackId = isHost
    ? localPeerVideoTrack?.id || (localPeer as any)?.videoTrack
    : hostVideoTrack?.id || (hostPeer as any)?.videoTrack || (isCohost ? localPeerVideoTrack?.id : undefined);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video sm:h-[460px] lg:h-[500px] bg-black overflow-hidden select-none group"
    >
      {/* Top Left Floating Joined Participants / Co-Hosts Cards */}
      {activeParticipants.length > 0 && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
          {activeParticipants.map((participant) => (
            <div
              key={participant.userId}
              className="relative w-14 h-18 sm:w-16 sm:h-20 rounded-2xl overflow-hidden border border-cyan-400/50 shadow-2xl group/card bg-black/60 backdrop-blur-md"
            >
              {participant.videoTrack ? (
                <HMSVideoElement
                  trackId={participant.videoTrack}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={participant.avatar}
                  alt={participant.username}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform"
                />
              )}
              <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs py-0.5 px-1 text-center">
                <span className="text-[10px] font-semibold text-white truncate block">
                  {participant.username}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Right Mini Controls: Camera Toggle, Mic Toggle & Fullscreen Button */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Camera Control Button (Host & Co-Host) */}
        {isPublisher && !isLiveEnded && (
          <button
            type="button"
            onClick={() => {
              if (onToggleCamera) {
                onToggleCamera();
              }
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer text-white shadow-lg ${
              isCameraOn
                ? "bg-black/50 hover:bg-black/70"
                : "bg-red-500/80 hover:bg-red-600"
            }`}
            title={isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
          >
            {isCameraOn ? (
              <IoVideocamOutline className="w-4 h-4" />
            ) : (
              <IoVideocamOffOutline className="w-4 h-4 text-white" />
            )}
          </button>
        )}

        {/* Mic Control Button (Host & Co-Host) */}
        {isPublisher && !isLiveEnded && (
          <button
            type="button"
            onClick={() => {
              if (liveId) {
                liveSocketService.selfMute(liveId, isMicOn);
              }
              onToggleMic();
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer text-white shadow-lg ${
              isMicOn
                ? "bg-black/50 hover:bg-black/70"
                : "bg-red-500/80 hover:bg-red-600"
            }`}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isMicOn ? (
              <IoMicOutline className="w-4 h-4" />
            ) : (
              <IoMicOffOutline className="w-4 h-4 text-white" />
            )}
          </button>
        )}

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={handleFullscreen}
          className="p-2 rounded-xl bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer shadow-lg"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Stream Ended Overlay Banner */}
      {isLiveEnded ? (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-6 gap-3">
          <span className="text-4xl">🔴</span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Stream Has Ended</h3>
          <p className="text-gray-400 text-xs sm:text-sm max-w-md">
            The host has concluded this live broadcast. Thank you for watching!
          </p>
        </div>
      ) : (
        <>
          {/* Main Host Live Video Stream (100ms HMS Video or WebRTC direct video) */}
          {mainVideoTrackId ? (
            <HMSVideoElement
              trackId={mainVideoTrackId}
              className={`w-full h-full object-contain bg-black transition-opacity duration-300 ${
                isPublisher && isMirrored ? "-scale-x-100" : "scale-x-100"
              }`}
            />
          ) : isPublisher && !isConnected && isCameraOn && streamActive ? (
            <video
              ref={hostVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-contain bg-black transition-opacity duration-300 ${
                isMirrored ? "-scale-x-100" : "scale-x-100"
              }`}
            />
          ) : (
            /* Fallback Presenter Poster / Thumbnail Image when Camera is OFF or Stream is connecting */
            <div className="relative w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
                alt="Live Stream Presenter Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-white/90 text-xs font-semibold px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/15 shadow-lg">
                  {isPublisher
                    ? isCameraOn
                      ? "Connecting Camera..."
                      : "Camera Off — Presenter Thumbnail Displayed"
                    : "Connecting to Host Live Video..."}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

