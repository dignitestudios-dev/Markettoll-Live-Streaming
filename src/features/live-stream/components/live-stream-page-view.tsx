"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, Share2, UserPlus, LogOut, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { HiSignal } from "react-icons/hi2";
import { useHMSActions, useHMSStore, selectIsConnectedToRoom, selectLocalPeer, selectVideoTrackByPeerID, selectAudioTrackByPeerID, selectPeers, selectAvailableRoleNames } from "@100mslive/react-sdk";
import LiveVideoGrid from "./live-video-grid";
import LiveProductsCarousel, { LiveProductItem } from "./live-products-carousel";
import LiveChatPanel from "./live-chat-panel";
import CohostModal, { CohostParticipant } from "./cohost-modal";
import CohostInviteModal from "./cohost-invite-modal";
import EndStreamModal from "./end-stream-modal";
import ShareModal from "./share-modal";
import { liveSocketService } from "../services/live-socket.service";
import { getHMSRoomToken } from "../services/hms.service";
import { useLivesQuery } from "@/features/home/api/lives.queries";
import { extractProductImageUrl } from "@/features/home/api/lives.service";
import axiosInstance from "@/lib/axios";

export default function LiveStreamPageView() {
  const router = useRouter();
  const params = useParams();
  const liveId = (params?.id as string) || "live-session-101";

  // Fetch lives API data
  const { data: rawLives } = useLivesQuery();

  // Determine if current user is Host vs Viewer
  const [isHost, setIsHost] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const currentHostLiveId = sessionStorage.getItem("current_host_live_id");
      return currentHostLiveId === liveId;
    }
    return false;
  });

  const [isLiveEnded, setIsLiveEnded] = useState<boolean>(false);
  const [hostUserId, setHostUserId] = useState<string | undefined>(undefined);

  // Co-host state: viewer becomes cohost after accepting invitation
  const [isCohost, setIsCohost] = useState<boolean>(false);

  const [socketProducts, setSocketProducts] = useState<any[]>([]);

  // Extract products dynamically from API or Socket ACK for active live session
  const activeLiveProducts: LiveProductItem[] = useMemo(() => {
    let rawProducts: any[] = [];
    if (socketProducts.length > 0) {
      rawProducts = socketProducts;
    } else if (Array.isArray(rawLives)) {
      const currentLive = rawLives.find(
        (item: any) => item._id === liveId || item.id === liveId
      );
      if (currentLive) {
        if (currentLive.host?._id) {
          setHostUserId(currentLive.host._id);
        }
        if (Array.isArray(currentLive.products)) {
          rawProducts = currentLive.products;
        }
      }
    }

    if (rawProducts.length > 0) {
      return rawProducts.map((p: any, idx: number) => {
        const imageUrl = extractProductImageUrl(p);
        const title = p.name || p.title || `Product ${idx + 1}`;
        const price =
          typeof p.price === "number"
            ? p.price
            : parseFloat(p.price) || 10.99;
        const originalPrice = p.originalPrice
          ? typeof p.originalPrice === "number"
            ? p.originalPrice
            : parseFloat(p.originalPrice)
          : undefined;
        const discount =
          p.discount ||
          (originalPrice
            ? `-${Math.round(((originalPrice - price) / originalPrice) * 100)}%`
            : undefined);
        const soldCount =
          p.quantitySold !== undefined ? `${p.quantitySold}` : p.soldCount || "0";

        return {
          id: p._id || p.id || `p-${idx}`,
          title,
          price,
          originalPrice,
          discount,
          image: imageUrl,
          soldCount,
        };
      });
    }

    return [];
  }, [rawLives, socketProducts, liveId]);

  // 100ms SDK
  const hmsActions = useHMSActions();
  const isHMSConnected = useHMSStore(selectIsConnectedToRoom);
  const localPeer = useHMSStore(selectLocalPeer);
  const localPeerVideoTrack = useHMSStore(selectVideoTrackByPeerID(localPeer?.id));
  const localPeerAudioTrack = useHMSStore(selectAudioTrackByPeerID(localPeer?.id));
  const hmsPeers = useHMSStore(selectPeers) || [];
  const [pendingPromotions, setPendingPromotions] = useState<string[]>([]);
  const hmsPeersRef = useRef(hmsPeers);
  useEffect(() => {
    hmsPeersRef.current = hmsPeers;
  }, [hmsPeers]);

  const amIHost = isHost || localPeer?.roleName?.toLowerCase() === "host" || localPeer?.roleName?.toLowerCase() === "broadcaster";

  const availableRoles = useHMSStore(selectAvailableRoleNames) || [];
  const cohostRoleName = useMemo(() => {
    return availableRoles.find((role) => {
      const name = role.toLowerCase();
      return name === "co-host" || name === "cohost" || name === "co_host";
    }) || "co-host";
  }, [availableRoles]);

  // Stream controls state persisted from pre-stream setup
  const [isMicOn, setIsMicOn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedMic = sessionStorage.getItem(`host_mic_${liveId}`);
      if (savedMic !== null) return savedMic === "true";
    }
    return true;
  });

  const [isCameraOn, setIsCameraOn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedCam = sessionStorage.getItem(`host_camera_${liveId}`);
      if (savedCam !== null) return savedCam === "true";
    }
    return true;
  });
  const [isMirrored, setIsMirrored] = useState(false);

  // Live session statistics
  const [viewerCount, setViewerCount] = useState(0);

  // Cohosts list & Modal
  const [cohosts, setCohosts] = useState<CohostParticipant[]>([]);
  const [isCohostModalOpen, setIsCohostModalOpen] = useState(false);

  // End Stream Confirmation Modal state
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isEndingStream, setIsEndingStream] = useState(false);

  // Share Stream Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Cohost invite state (for viewer who receives invitation)
  const [cohostInvite, setCohostInvite] = useState<{
    hostUsername: string;
    liveId: string;
    invitationId?: string;
  } | null>(null);

  const hasJoinedRef = useRef(false);

  // 100ms Live Session Connection & Role Management
  useEffect(() => {
    let isMounted = true;

    async function initStreamSession() {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;

      if (isHost) {
        // HOST FLOW: Host created stream (live:create). Host uses create token or fallback socket ACK token.
        let token = "";
        if (typeof window !== "undefined") {
          token = sessionStorage.getItem(`hms_token_${liveId}`) || "";
        }

        if (!token) {
          try {
            const rawRes = await liveSocketService.joinLive(liveId);
            const res = Array.isArray(rawRes) ? rawRes[0] : rawRes;
            token = res?.data?.token || res?.token || "";
          } catch (e) {
            console.warn("Host fallback socket token error:", e);
          }
        }

        console.log("HMS Host Init: Token =", Boolean(token));

        if (token && isMounted && !isHMSConnected) {
          try {
            await hmsActions.join({
              userName: "Host",
              authToken: token,
            });
            hmsActions.setLocalVideoEnabled(isCameraOn);
            hmsActions.setLocalAudioEnabled(isMicOn);
          } catch (err) {
            console.warn("HMS Host Join error:", err);
          }
        }
      } else {
        // VIEWER FLOW: Use pre-saved token from home-view join (to avoid double join),
        // or call joinLive as fallback if navigated directly.
        let token = "";

        // Check if home-view already called joinLive and stored the token
        const cachedToken =
          typeof window !== "undefined"
            ? sessionStorage.getItem(`viewer_join_token_${liveId}`)
            : "";

        if (cachedToken) {
          token = cachedToken;
          // Clear so it's only used once
          sessionStorage.removeItem(`viewer_join_token_${liveId}`);

          // Restore host id if persisted
          const cachedHostId =
            typeof window !== "undefined"
              ? sessionStorage.getItem(`live_host_id_${liveId}`)
              : "";
          if (cachedHostId) {
            setHostUserId(cachedHostId);
            sessionStorage.removeItem(`live_host_id_${liveId}`);
          }
        } else {
          // Fallback: viewer navigated directly (e.g. deep link), call joinLive now
          try {
            const rawRes = await liveSocketService.joinLive(liveId);
            const res = Array.isArray(rawRes) ? rawRes[0] : rawRes;
            console.log("Viewer Join Live Socket Response:", res);

            if (res && res.success === false) {
              const errorMsg = String(res.error || res.message || "").toLowerCase();
              const isAlreadyJoined = errorMsg.includes("already");

              if (res.error === "LIVE_ALREADY_ENDED" || res.error === "LIVE_NOT_FOUND") {
                setIsLiveEnded(true);
                toast.warn(res.message || "This stream is no longer active.");
                return;
              }

              if (!isAlreadyJoined) {
                toast.error(res.message || "Failed to join live stream.");
                return;
              }
            }

            const hostId = res?.data?.live?.host?._id || res?.data?.live?.host;
            if (hostId) {
              setHostUserId(typeof hostId === "string" ? hostId : hostId._id);
            }

            if (res?.data?.live?.products && Array.isArray(res.data.live.products)) {
              setSocketProducts(res.data.live.products);
            }

            token = res?.data?.token || "";
          } catch (err) {
            console.warn("Viewer socket join error:", err);
          }
        }

        console.log("HMS Viewer Init: Token =", Boolean(token));

        if (token && isMounted && !isHMSConnected) {
          try {
            await hmsActions.join({
              userName: "Viewer",
              authToken: token,
            });
            // CRITICAL VIEWER RULE: Never publish local media for viewer (cohost handled separately)
            hmsActions.setLocalVideoEnabled(false);
            hmsActions.setLocalAudioEnabled(false);
          } catch (err) {
            console.warn("HMS Viewer Join error:", err);
          }
        }
      }
    }

    initStreamSession();

    // Socket Event Listeners
    const socket = liveSocketService.connect();

    const handleViewerCountUpdated = (rawRes: any) => {
      const res = Array.isArray(rawRes) ? rawRes[0] : rawRes;
      console.log("Viewer Count Updated Response:", res);
      const count = res?.data?.count ?? res?.count;
      if (typeof count === "number") {
        setViewerCount(count);
      }
    };

    const handleLiveEnded = () => {
      setIsLiveEnded(true);
      toast.info("The live stream has ended.");
      hmsActions.leave().catch(() => {});
    };

    const handleHostReconnected = async (data: any) => {
      console.log("Host reconnected event:", data);
      const freshToken = data?.data?.token || data?.token;
      if (freshToken) {
        try {
          await hmsActions.leave();
          await hmsActions.join({ authToken: freshToken, userName: isHost ? "Host" : "Viewer" });
          if (!isHost && !isCohost) {
            hmsActions.setLocalVideoEnabled(false);
            hmsActions.setLocalAudioEnabled(false);
          }
        } catch (e) {
          console.warn("HMS Reconnect rejoin error:", e);
        }
      }
    };

    const handleReconnected = async (data: any) => {
      console.log("Reconnected event:", data);
      const freshToken = data?.data?.token || data?.token;
      if (freshToken) {
        try {
          await hmsActions.leave();
          await hmsActions.join({ authToken: freshToken, userName: isHost ? "Host" : "Viewer" });
          if (!isHost && !isCohost) {
            hmsActions.setLocalVideoEnabled(false);
            hmsActions.setLocalAudioEnabled(false);
          }
        } catch (e) {
          console.warn("HMS Reconnect error:", e);
        }
      }
    };

    // Co-host event listeners
    const handleCohostInvited = (data: any) => {
      console.log("live:cohost-invited", data);
      // Open accept/reject modal for the invited viewer
      setCohostInvite({
        hostUsername: data?.data?.hostUsername || "Host",
        liveId: data?.data?.liveId || liveId,
        invitationId: data?.data?.invitationId,
      });
    };

    const handleCohostAdded = (data: any) => {
      console.log("live:cohost-added", data);
      const resData = data?.data || data;
      const username = resData?.username || resData?.user?.name || resData?.name || "Co-Host";
      toast.success(`${username} joined as co-host.`);
      const userId = resData?.userId || resData?.user?._id || resData?._id;
      if (userId) {
        setCohosts((prev) => {
          if (prev.some((c) => c.userId === userId)) return prev;
          return [...prev, { userId, username, role: "cohost", isMuted: false }];
        });

        if (amIHost) {
          const peer = hmsPeersRef.current.find((p) => p.customerUserId === userId);
          console.log(peer, "peer peer")
          if (peer) {
            console.log(`[HMS ROLE] Host promoting accepted co-host peer immediately:`, peer.id);
            hmsActions
              .changeRoleOfPeer(peer.id, cohostRoleName, true)
              .then(() => {
                console.log(`[HMS ROLE] Role change successful: changed peer ${peer.name} to co-host`);
              })
              .catch((err) => {
                console.error(`[HMS ROLE] Role change failed:`, err);
              });
          } else {
            console.log(`[HMS ROLE] Host queueing user ${userId} for co-host promotion (peer not in room yet).`);
            setPendingPromotions((prev) => {
              if (prev.includes(userId)) return prev;
              return [...prev, userId];
            });
          }
        }
      }
    };

    const handleCohostRejected = (data: any) => {
      console.log("live:cohost-rejected", data);
      toast.info("Co-host invitation was declined.");
      const userId = data?.data?.userId;
      if (userId) {
        setCohosts((prev) => prev.filter((c) => c.userId !== userId));
      }
    };

    const handleCohostRemoved = (data: any) => {
      console.log("live:cohost-removed", data);
      const userId = data?.data?.userId;
      if (userId) {
        setCohosts((prev) => prev.filter((c) => c.userId !== userId));
        toast.info("A co-host was removed from the stream.");

        if (amIHost) {
          const peer = hmsPeersRef.current.find((p) => p.customerUserId === userId);
          if (peer) {
            console.log(`[HMS ROLE] Host removing co-host, changing role: demoting peer ${peer.name} (${peer.id}) to viewer...`);
            hmsActions
              .changeRoleOfPeer(peer.id, "viewer", true)
              .then(() => {
                console.log(`[HMS ROLE] Role change successful: changed peer ${peer.name} back to viewer`);
              })
              .catch((err) => {
                console.error(`[HMS ROLE] Role change failed for peer ${peer.name}:`, err);
              });
          } else {
            console.log(`[HMS ROLE] Target peer to demote (userId: ${userId}) not found in HMS room.`);
          }
        }
      }
    };

    const handleCohostMuted = (data: any) => {
      console.log("live:cohost-muted", data);
      const userId = data?.data?.userId;
      if (userId) {
        setCohosts((prev) =>
          prev.map((c) => (c.userId === userId ? { ...c, isMuted: true } : c))
        );
      }
    };

    const handleCohostUnmuted = (data: any) => {
      console.log("live:cohost-unmuted", data);
      const userId = data?.data?.userId;
      if (userId) {
        setCohosts((prev) =>
          prev.map((c) => (c.userId === userId ? { ...c, isMuted: false } : c))
        );
      }
    };

    socket.on("live:viewer-count-updated", handleViewerCountUpdated);
    socket.on("live:ended", handleLiveEnded);
    socket.on("live:host-reconnected", handleHostReconnected);
    socket.on("live:reconnected", handleReconnected);
    socket.on("live:cohost-invited", handleCohostInvited);
    socket.on("live:cohost-added", handleCohostAdded);
    socket.on("live:cohost-rejected", handleCohostRejected);
    socket.on("live:cohost-removed", handleCohostRemoved);
    socket.on("live:cohost-muted", handleCohostMuted);
    socket.on("live:cohost-unmuted", handleCohostUnmuted);

    return () => {
      isMounted = false;
      socket.off("live:viewer-count-updated", handleViewerCountUpdated);
      socket.off("live:ended", handleLiveEnded);
      socket.off("live:host-reconnected", handleHostReconnected);
      socket.off("live:reconnected", handleReconnected);
      socket.off("live:cohost-invited", handleCohostInvited);
      socket.off("live:cohost-added", handleCohostAdded);
      socket.off("live:cohost-rejected", handleCohostRejected);
      socket.off("live:cohost-removed", handleCohostRemoved);
      socket.off("live:cohost-muted", handleCohostMuted);
      socket.off("live:cohost-unmuted", handleCohostUnmuted);
    };
  }, [liveId, isHost, amIHost, isHMSConnected, hmsActions]);

  // Host-only observer to change roles of peers that accepted co-host invitations
  useEffect(() => {
    if (!amIHost || !isHMSConnected || pendingPromotions.length === 0) return;

    const promotedUserIds: string[] = [];

    pendingPromotions.forEach((userId) => {
      // Find the peer in the room where customerUserId matches the user's ID
      const peer = hmsPeers.find((p) => p.customerUserId === userId);
      if (peer) {
        console.log(`[HMS ROLE] Target peer found in room:`, {
          id: peer.id,
          name: peer.name,
          roleName: peer.roleName,
          customerUserId: peer.customerUserId,
        });

        const normalizedRole = peer.roleName?.toLowerCase() || "";
        if (normalizedRole === "co-host" || normalizedRole === "cohost" || normalizedRole === "co_host") {
          console.log(`[HMS ROLE] Peer ${peer.name} is already co-host.`);
          promotedUserIds.push(userId);
          return;
        }

        console.log(`[HMS ROLE] Changing role: promoting peer ${peer.name} (${peer.id}) to co-host...`);

        hmsActions
          .changeRoleOfPeer(peer.id, cohostRoleName, true)
          .then(() => {
            console.log(`[HMS ROLE] Role change successful: changed peer ${peer.name} to co-host`);
          })
          .catch((err) => {
            console.error(`[HMS ROLE] Role change failed for peer ${peer.name}:`, err);
          });

        promotedUserIds.push(userId);
      } else {
        console.log(`[HMS ROLE] Pending promotion user ${userId} not yet found in HMS room.`);
      }
    });

    if (promotedUserIds.length > 0) {
      setPendingPromotions((prev) => prev.filter((id) => !promotedUserIds.includes(id)));
    }
  }, [hmsPeers, pendingPromotions, amIHost, isHMSConnected, hmsActions]);

  // Observer for local peer role change inside the 100ms room
  useEffect(() => {
    if (!localPeer?.roleName) return;

    const currentRole = localPeer.roleName.toLowerCase();
    const isCohostRole = currentRole === "co-host" || currentRole === "cohost" || currentRole === "co_host";
    console.log("[HMS ROLE] Current local role:", localPeer.roleName);

    if (isCohostRole) {
      console.log("[100ms Role Observer] Detected transition to co-host. Enabling local media publishing...");
      
      const enableMedia = async () => {
        try {
          setIsCohost(true);
          
          await hmsActions.setLocalVideoEnabled(true);
          await hmsActions.setLocalAudioEnabled(true);
          
          setIsCameraOn(true);
          setIsMicOn(true);
        } catch (error) {
          console.error("[100ms Role Observer] Failed to enable local media publishing:", error);
        }
      };

      enableMedia();
    } else if (currentRole === "viewer") {
      console.log("[100ms Role Observer] Detected transition to viewer. Disabling local media publishing...");
      
      const disableMedia = async () => {
        try {
          setIsCohost(false);
          
          await hmsActions.setLocalVideoEnabled(false);
          await hmsActions.setLocalAudioEnabled(false);
          
          setIsCameraOn(false);
          setIsMicOn(false);
        } catch (error) {
          console.error("[100ms Role Observer] Failed to disable local media publishing:", error);
        }
      };

      disableMedia();
    }
  }, [localPeer?.roleName, hmsActions]);

  const handleConfirmEndLive = async () => {
    try {
      setIsEndingStream(true);
      try {
        await hmsActions.leave();
      } catch (e) {
        console.warn("HMS leave error:", e);
      }
      await liveSocketService.endLive(liveId);
      toast.success("Live stream ended successfully.");
      setIsEndModalOpen(false);
      setIsLiveEnded(true);
      router.push("/");
    } catch (error: any) {
      console.error("Failed to end live stream:", error);
      toast.error(error?.message || "Failed to end live stream.");
    } finally {
      setIsEndingStream(false);
    }
  };

  const handleAddToCart = async (product: LiveProductItem) => {
    const productId = product.id;
    if (!productId) return;

    try {
      // API call: BaseUrl/users/cart-products/:id (POST)
      const res = await axiosInstance.post(`/users/cart-products/${productId}`);
      const successMessage = res.data?.message || `Added "${product.title}" to cart!`;
      toast.success(successMessage);
    } catch (error: any) {
      console.error("Add to cart error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add product to cart.";
      toast.error(errorMsg);
    }
  };

  const handleLeaveStream = async () => {
    try {
      try {
        await hmsActions.leave();
      } catch (e) {
        console.warn("HMS leave error:", e);
      }
      await liveSocketService.leaveLive(liveId);
      toast.info("You left the live stream.");
      router.push("/");
    } catch (error: any) {
      console.error("Error leaving live stream:", error);
      router.push("/");
    }
  };

  const handleShareStream = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#0E131E] flex flex-col justify-between select-none">
      {/* Outer Page Title */}
      <header className="w-full py-3 px-6 sm:px-10 bg-[#0E131E] border-b border-white/5">
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {isHost ? "Live Broadcast Studio" : "Live Stream Room"}
        </h1>
      </header>

      {/* Main Broadcast Container Card (Matching Screenshot 1:1) */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-2 sm:px-6 py-4 sm:py-6">
        <div className="w-full bg-[#111622] border border-white/10 rounded-[24px] overflow-hidden shadow-2xl flex flex-col">
          {/* Header Row Inside Dark Card */}
          <div className="w-full py-3.5 px-4 sm:px-6 bg-[#111622] border-b border-white/10 flex items-center justify-between">
            {/* Stream Title */}
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {isHost ? "My Live Broadcast" : "Watching Broadcast"}
            </h2>

            {/* Badges & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* LIVE Tag */}
              <span
                className={`${
                  isLiveEnded ? "bg-gray-600" : "bg-[#FF3B30] animate-pulse"
                } text-white text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase tracking-wider`}
              >
                <HiSignal className="text-xs" /> {isLiveEnded ? "ENDED" : "LIVE"}
              </span>

              {/* Viewer Count Pill */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
                <Eye className="w-3.5 h-3.5 text-white" />
                <span>
                  {viewerCount >= 1000
                    ? `${(viewerCount / 1000).toFixed(1)}k`
                    : `${viewerCount}`}
                </span>
              </div>

              {/* Co-Host / Host Media Control Buttons (Mic & Camera) */}
              {(isHost || isCohost) && !isLiveEnded && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10">
                  {/* Mic Toggle Button */}
                  <button
                    type="button"
                    onClick={async () => {
                      const nextState = !isMicOn;
                      try {
                        await hmsActions.setLocalAudioEnabled(nextState);
                        liveSocketService.selfMute(liveId, !nextState);
                        setIsMicOn(nextState);
                      } catch (err) {
                        console.warn("Failed to toggle local audio:", err);
                      }
                    }}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      isMicOn
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white shadow-md"
                    }`}
                    title={isMicOn ? "Mute Mic" : "Unmute Mic"}
                  >
                    {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Camera Toggle Button */}
                  <button
                    type="button"
                    onClick={async () => {
                      const nextState = !isCameraOn;
                      try {
                        await hmsActions.setLocalVideoEnabled(nextState);
                        setIsCameraOn(nextState);
                      } catch (err) {
                        console.warn("Failed to toggle local video:", err);
                      }
                    }}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      isCameraOn
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white shadow-md"
                    }`}
                    title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
                  >
                    {isCameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Invite Co-Host Button (Host Only) */}
              {isHost && !isLiveEnded && (
                <button
                  type="button"
                  onClick={() => setIsCohostModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Invite Co-Host"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              )}

              {/* Share Stream Button */}
              <button
                type="button"
                onClick={handleShareStream}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Share Stream"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* End Livestream Button (Host Only) */}
              {isHost && !isLiveEnded && (
                <button
                  type="button"
                  onClick={() => setIsEndModalOpen(true)}
                  className="bg-[#FF3B30] hover:bg-red-600 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all cursor-pointer"
                >
                  End Livestream
                </button>
              )}

              {/* Leave Stream Button (Viewer Only) */}
              {!isHost && (
                <button
                  type="button"
                  onClick={handleLeaveStream}
                  className="bg-gray-700 hover:bg-gray-600 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Leave Room
                </button>
              )}
            </div>
          </div>

          {/* Body Content Row: Video Grid + Products on Left, Chat on Right */}
          <div className="w-full flex flex-col lg:flex-row h-auto overflow-hidden">
            {/* Left Column: Video & Products */}
            <div className="flex-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
              {/* Main Video Stream */}
              <LiveVideoGrid
                liveId={liveId}
                isHost={isHost}
                isCohost={isCohost}
                hostUserId={hostUserId}
                isMicOn={isMicOn}
                isCameraOn={isCameraOn}
                isMirrored={isMirrored}
                cohosts={cohosts}
                isLiveEnded={isLiveEnded}
                onToggleMic={async () => {
                  if (isHost || isCohost) {
                    const nextState = !isMicOn;
                    try {
                      await hmsActions.setLocalAudioEnabled(nextState);
                      liveSocketService.selfMute(liveId, !nextState);
                      setIsMicOn(nextState);
                    } catch (err) {
                      console.warn("Failed to toggle local audio:", err);
                    }
                  }
                }}
                onToggleCamera={async () => {
                  if (isHost || isCohost) {
                    const nextState = !isCameraOn;
                    try {
                      await hmsActions.setLocalVideoEnabled(nextState);
                      setIsCameraOn(nextState);
                    } catch (err) {
                      console.warn("Failed to toggle local video:", err);
                    }
                  }
                }}
              />

              {/* Products Showcase Carousel (Viewer Only) */}
              {!isHost && (
                <LiveProductsCarousel
                  products={activeLiveProducts}
                  onAddToCart={handleAddToCart}
                />
              )}
            </div>

            {/* Right Column: Real-time Audience Chat */}
            <LiveChatPanel
              liveId={liveId}
              currentUsername={isHost ? "Host" : "Viewer"}
              isLiveEnded={isLiveEnded}
            />
          </div>
        </div>
      </main>

      {/* Cohost Management Modal */}
      {isHost && (
        <CohostModal
          isOpen={isCohostModalOpen}
          onClose={() => setIsCohostModalOpen(false)}
          liveId={liveId}
          cohosts={cohosts}
          onUpdateCohosts={setCohosts}
        />
      )}

      {/* End Stream Confirmation Modal */}
      {isHost && (
        <EndStreamModal
          isOpen={isEndModalOpen}
          onClose={() => setIsEndModalOpen(false)}
          onConfirm={handleConfirmEndLive}
          isEnding={isEndingStream}
        />
      )}

      {/* Share Stream Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        liveId={liveId}
      />

      {/* Cohost Invite Accept/Reject Modal (Viewer only) */}
      {cohostInvite && (
        <CohostInviteModal
          isOpen={!!cohostInvite}
          hostUsername={cohostInvite.hostUsername}
          liveId={cohostInvite.liveId}
          invitationId={cohostInvite.invitationId}
          onAccept={async () => {
            try {
              const res = await liveSocketService.acceptCohost(cohostInvite.liveId, localPeer?.id);
              console.log("acceptCohost socket response:", res);
              toast.info("Accepted co-host invitation. Connecting to stream...");
            } catch (err) {
              toast.error("Failed to accept co-host invitation.");
            } finally {
              setCohostInvite(null);
            }
          }}
          onReject={async () => {
            try {
              await liveSocketService.rejectCohost(cohostInvite.liveId);
              toast.info("You declined the co-host invitation.");
            } catch (err) {
              console.warn("Reject cohost error:", err);
            } finally {
              setCohostInvite(null);
            }
          }}
        />
      )}
    </div>
  );
}
