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
import CohostProductSelectModal from "./cohost-product-select-modal";
import EndStreamModal from "./end-stream-modal";
import LeaveRoomModal from "./leave-room-modal";
import ShareModal from "./share-modal";
import ChooseDeliveryModal from "./choose-delivery-modal";
import { useAuth } from "@/hooks/use-auth";
import { liveSocketService } from "../services/live-socket.service";
import { useLivesQuery } from "@/features/home/api/lives.queries";
import { extractProductImageUrl } from "@/features/home/api/lives.service";
import axiosInstance from "@/lib/axios";
import queryClient from "@/lib/query-client";

export function resolveProductId(p: any): string {
  if (!p) return "";
  if (typeof p === "string") return p;
  return (
    p?.product?._id ||
    p?.product?.id ||
    (typeof p?.product === "string" ? p.product : "") ||
    p?._id ||
    p?.id ||
    ""
  );
}

export default function LiveStreamPageView() {
  const router = useRouter();
  const params = useParams();
  const liveId = (params?.id as string) || "live-session-101";

  const { user } = useAuth();
  const [showDeliveryModal, setShowDeliveryModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<LiveProductItem | null>(null);

  // Fetch lives API data
  const { data: rawLives,refetch } = useLivesQuery();

  // Determine if current user is Host vs Viewer
  const [isHost, setIsHost] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const currentHostLiveId =
        sessionStorage.getItem("current_host_live_id") ||
        localStorage.getItem("current_host_live_id");
      return currentHostLiveId === liveId;
    }
    return false;
  });

  const [actualLiveId, setActualLiveId] = useState<string>(liveId);
  const [isLiveEnded, setIsLiveEnded] = useState<boolean>(false);
  const [hostUserId, setHostUserId] = useState<string | undefined>(undefined);
  const [streamThumbnail, setStreamThumbnail] = useState<string>("");
  const [streamTitle, setStreamTitle] = useState<string>("");

  // Co-host state: viewer becomes cohost after accepting invitation
  const [isCohost, setIsCohost] = useState<boolean>(false);

  const [socketProducts, setSocketProducts] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(`live_products_${liveId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn("Could not read initial live products from sessionStorage", e);
      }
    }
    return [];
  });

  // 1. Read draft live stream info from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("draft_live_stream");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.thumbnail) setStreamThumbnail(parsed.thumbnail);
          if (parsed.title) setStreamTitle(parsed.title);
          if (Array.isArray(parsed.products) && parsed.products.length > 0) {
            setSocketProducts((prev) => (prev.length === 0 ? parsed.products : prev));
          }
        }
      } catch (err) {
        console.warn("Could not read draft_live_stream from sessionStorage:", err);
      }
    }
  }, []);

  // Auto-redirect to active stream if on base /live-stream without id
  useEffect(() => {
    if (!params?.id) {
      if (typeof window !== "undefined") {
        const storedHostLiveId =
          sessionStorage.getItem("current_host_live_id") ||
          localStorage.getItem("current_host_live_id");
        if (storedHostLiveId && storedHostLiveId !== "live-session-101") {
          router.replace(`/live-stream/${storedHostLiveId}`);
        }
      }
    }
  }, [params?.id, router]);

  // Sync actual live ID & host user ID & thumbnail/title from rawLives (/lives API)
  useEffect(() => {
    if (Array.isArray(rawLives) && rawLives.length > 0) {
      const currentLive = rawLives.find(
        (item: any) =>
          item._id === liveId ||
          item.id === liveId ||
          item._id === actualLiveId ||
          item.id === actualLiveId ||
          item.hmsRoomId === liveId ||
          item.roomId === liveId ||
          item.hmsRoomId === actualLiveId ||
          item.host?._id === liveId ||
          item.host?.id === liveId ||
          item.host === liveId ||
          (hostUserId && (item.host?._id === hostUserId || item.host?.id === hostUserId || item.host === hostUserId))
      );
      if (currentLive) {
        if (currentLive._id) {
          setActualLiveId(currentLive._id);
          if (!params?.id || params.id === "live-session-101") {
            router.replace(`/live-stream/${currentLive._id}`);
          }
        }
        if (currentLive.thumbnail) {
          setStreamThumbnail(currentLive.thumbnail);
        }
        if (currentLive.title) {
          setStreamTitle(currentLive.title);
        }
        const hostObj = typeof currentLive.host === "object" ? currentLive.host : null;
        const hostId =
          hostObj?._id ||
          hostObj?.id ||
          (typeof currentLive.host === "string" ? currentLive.host : undefined);
        if (hostId) {
          setHostUserId(hostId);
          const currentUserId = (user as any)?._id || (user as any)?.id;
          if (currentUserId && String(hostId) === String(currentUserId)) {
            setIsHost(true);
            if (typeof window !== "undefined") {
              sessionStorage.setItem("current_host_live_id", currentLive._id || liveId);
              localStorage.setItem("current_host_live_id", currentLive._id || liveId);
            }
          }
        }
      }
    }
  }, [rawLives, liveId, actualLiveId, hostUserId, user, params?.id, router]);

  // Extract products purely from Socket state for active live session
  const activeLiveProducts: LiveProductItem[] = useMemo(() => {
    if (!socketProducts || socketProducts.length === 0) return [];

    // Deduplicate products by unique product ID
    const dedupedMap = new Map<string, any>();
    socketProducts.forEach((rawP: any) => {
      const pId = resolveProductId(rawP);
      if (pId) {
        dedupedMap.set(pId, rawP);
      } else {
        dedupedMap.set(Math.random().toString(), rawP);
      }
    });

    const uniqueRawProducts = Array.from(dedupedMap.values());
    return uniqueRawProducts.map((rawP: any, idx: number) => {
      const p = rawP?.product && typeof rawP.product === "object" ? rawP.product : rawP;
      const productId = resolveProductId(rawP) || `p-${idx}`;
      const imageUrl = extractProductImageUrl(rawP);
      const title = p.name || p.title || `Product ${idx + 1}`;
      // Extract pricing object if available
      const pricing = rawP?.pricing || p?.pricing || rawP?.product?.pricing;
      const discountObj = pricing?.discount || rawP?.discount || p?.discount;

      // Selling / effective price
      let price: number = 10.99;
      if (pricing?.discountedPrice !== undefined && pricing?.discountedPrice !== null) {
        price = typeof pricing.discountedPrice === "number" ? pricing.discountedPrice : parseFloat(pricing.discountedPrice) || 0;
      } else if (p?.discountedPrice !== undefined && p?.discountedPrice !== null) {
        price = typeof p.discountedPrice === "number" ? p.discountedPrice : parseFloat(p.discountedPrice) || 0;
      } else if (p?.price !== undefined && p?.price !== null) {
        price = typeof p.price === "number" ? p.price : parseFloat(p.price) || 0;
      } else if (rawP?.price !== undefined && rawP?.price !== null) {
        price = typeof rawP.price === "number" ? rawP.price : parseFloat(rawP.price) || 0;
      }

      // Original / pre-discount price
      let originalPrice: number | undefined = undefined;
      if (pricing?.originalPrice !== undefined && pricing?.originalPrice !== null) {
        originalPrice = typeof pricing.originalPrice === "number" ? pricing.originalPrice : parseFloat(pricing.originalPrice) || undefined;
      } else if (p?.originalPrice !== undefined && p?.originalPrice !== null) {
        originalPrice = typeof p.originalPrice === "number" ? p.originalPrice : parseFloat(p.originalPrice) || undefined;
      } else if (rawP?.originalPrice !== undefined && rawP?.originalPrice !== null) {
        originalPrice = typeof rawP.originalPrice === "number" ? rawP.originalPrice : parseFloat(rawP.originalPrice) || undefined;
      }

      // Format discount badge
      let discount: string | undefined = undefined;
      if (discountObj && discountObj.status !== "INACTIVE") {
        if (discountObj.type === "PERCENTAGE" && discountObj.value !== undefined) {
          discount = `${discountObj.value}% Discount`;
        } else if (discountObj.type === "FIXED_AMOUNT" && discountObj.value !== undefined) {
          discount = `$${discountObj.value} Discount`;
        }
      }

      if (!discount && pricing?.discountAmount !== undefined && pricing.discountAmount > 0) {
        discount = `$${pricing.discountAmount} Discount`;
      }

      if (!discount && typeof p?.discount === "string" && p.discount.trim()) {
        discount = p.discount;
      } else if (!discount && originalPrice && originalPrice > price) {
        const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
        if (pct > 0) {
          discount = `${pct}% Discount`;
        }
      }
      // Quantity (Stock) and Quantity Sold
      const rawQuantity =
        typeof p?.quantity === "number"
          ? p.quantity
          : typeof rawP?.quantity === "number"
          ? rawP.quantity
          : typeof p?.stock === "number"
          ? p.stock
          : typeof rawP?.stock === "number"
          ? rawP.stock
          : p?.quantity !== undefined && !isNaN(Number(p.quantity))
          ? Number(p.quantity)
          : rawP?.quantity !== undefined && !isNaN(Number(rawP.quantity))
          ? Number(rawP.quantity)
          : undefined;

      const rawQuantitySold =
        typeof p?.quantitySold === "number"
          ? p.quantitySold
          : typeof rawP?.quantitySold === "number"
          ? rawP.quantitySold
          : p?.quantitySold !== undefined && !isNaN(Number(p.quantitySold))
          ? Number(p.quantitySold)
          : rawP?.quantitySold !== undefined && !isNaN(Number(rawP.quantitySold))
          ? Number(rawP.quantitySold)
          : typeof p?.soldCount === "number"
          ? p.soldCount
          : typeof rawP?.soldCount === "number"
          ? rawP.soldCount
          : p?.soldCount !== undefined && !isNaN(Number(p.soldCount))
          ? Number(p.soldCount)
          : undefined;

      const soldCount =
        rawQuantitySold !== undefined ? `${rawQuantitySold}` : p?.soldCount || rawP?.soldCount || "0";

      const uploaderRole =
        rawP?.uploaderRole ||
        p?.uploaderRole ||
        rawP?.role ||
        p?.role ||
        rawP?.uploadedByRole ||
        p?.uploadedByRole ||
        (rawP?.isCohost ? "co-host" : undefined) ||
        (rawP?.isHost ? "host" : undefined) ||
        undefined;

      const uploaderName =
        rawP?.uploadedBy?.name ||
        p?.uploadedBy?.name ||
        (typeof rawP?.uploadedBy === "string" ? rawP.uploadedBy : undefined) ||
        (typeof p?.uploadedBy === "string" ? p.uploadedBy : undefined) ||
        rawP?.uploader?.name ||
        p?.uploader?.name ||
        rawP?.uploaderName ||
        p?.uploaderName ||
        undefined;

      return {
        id: productId,
        title,
        price,
        originalPrice,
        discount,
        image: imageUrl,
        quantity: rawQuantity,
        quantitySold: rawQuantitySold,
        soldCount,
        uploaderRole,
        uploaderName,
      };
    });
  }, [socketProducts]);

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

  const viewerRoleName = useMemo(() => {
    return availableRoles.find((role) => {
      const name = role.toLowerCase();
      return name === "viewer" || name === "audience" || name === "listener";
    }) || "viewer";
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

  // Sync local mic state with HMS track status (e.g. if muted remotely by host)
  useEffect(() => {
    if (localPeerAudioTrack) {
      setIsMicOn(localPeerAudioTrack.enabled);
    }
  }, [localPeerAudioTrack?.enabled]);

  // Sync local camera state with HMS track status (e.g. if turned off remotely by host)
  useEffect(() => {
    if (localPeerVideoTrack) {
      setIsCameraOn(localPeerVideoTrack.enabled);
    }
  }, [localPeerVideoTrack?.enabled]);
  const [isMirrored, setIsMirrored] = useState(false);

  // Live session statistics
  const [viewerCount, setViewerCount] = useState(0);

  // Cohosts list & Modal
  const [cohosts, setCohosts] = useState<CohostParticipant[]>([]);
  const [isCohostModalOpen, setIsCohostModalOpen] = useState(false);

  // End Stream Confirmation Modal state
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isEndingStream, setIsEndingStream] = useState(false);

  // Leave Room Confirmation Modal state (Viewer only)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLeavingStream, setIsLeavingStream] = useState(false);

  // Share Stream Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Cohost invite state (for viewer who receives invitation)
  const [cohostInvite, setCohostInvite] = useState<{
    hostUsername: string;
    liveId: string;
    invitationId?: string;
  } | null>(null);

  // Co-host product selection modal state (after accepting invitation)
  const [isCohostProductModalOpen, setIsCohostProductModalOpen] = useState(false);

  const hasJoinedRef = useRef(false);

  // 100ms Live Session Connection & Role Management
  useEffect(() => {
    let isMounted = true;

    async function initStreamSession() {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;

      if (isHost) {
        // HOST FLOW: Host created stream or reconnected. Host uses create/reconnect token or fallback socket ACK token.
        let token = "";
        if (typeof window !== "undefined") {
          token =
            sessionStorage.getItem(`hms_token_${liveId}`) ||
            localStorage.getItem(`hms_token_${liveId}`) ||
            "";
        }

        if (!token) {
          try {
            const rawRes = await liveSocketService.joinLive(liveId);
            const res = Array.isArray(rawRes) ? rawRes[0] : rawRes;
            token = res?.data?.token || res?.token || "";
            const liveObj = res?.data?.live || res?.live;
            if (liveObj?.products && Array.isArray(liveObj.products)) {
              setSocketProducts(liveObj.products);
              if (typeof window !== "undefined") {
                sessionStorage.setItem(`live_products_${liveObj._id || liveId}`, JSON.stringify(liveObj.products));
              }
            }
          } catch (e) {
            console.warn("Host fallback socket token error:", e);
          }
        }

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

            const liveObj = res?.data?.live || res?.live;
            if (liveObj?._id) {
              setActualLiveId(liveObj._id);
            }
            if (liveObj?.thumbnail) {
              setStreamThumbnail(liveObj.thumbnail);
            }
            if (liveObj?.title) {
              setStreamTitle(liveObj.title);
            }

            const hostId = liveObj?.host?._id || liveObj?.host;
            if (hostId) {
              setHostUserId(typeof hostId === "string" ? hostId : hostId._id);
            }

            const joinedProducts = liveObj?.products || res?.data?.products;
            if (joinedProducts && Array.isArray(joinedProducts)) {
              setSocketProducts(joinedProducts);
              if (typeof window !== "undefined") {
                sessionStorage.setItem(`live_products_${liveObj?._id || liveId}`, JSON.stringify(joinedProducts));
              }
            }

            token = res?.data?.token || "";
          } catch (err) {
            console.warn("Viewer socket join error:", err);
          }
        }
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
      const count = res?.data?.count ?? res?.count;
      if (typeof count === "number") {
        setViewerCount(count);
      }
    };

    const handleLiveEnded = () => {
      setIsLiveEnded(true);
      toast.info("The live stream has ended.");
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("current_host_live_id");
        sessionStorage.removeItem(`hms_token_${liveId}`);
        sessionStorage.removeItem(`host_mic_${liveId}`);
        sessionStorage.removeItem(`host_camera_${liveId}`);
      }
      queryClient.invalidateQueries({ queryKey: ["lives"] });
      queryClient.refetchQueries({ queryKey: ["lives"] });
      hmsActions.leave().catch(() => {});
    };

    const handleHostReconnected = async (rawRes: any) => {
      console.log("Socket event: live:host-reconnected received", rawRes);
      const res = Array.isArray(rawRes) ? (typeof rawRes[0] === "string" ? rawRes[1] : rawRes[0]) : rawRes;
      const resData = res?.data || res;
      const liveData = resData?.live || res?.live;
      const freshToken = resData?.token || res?.token;
      const streamLiveId =
        liveData?._id ||
        liveData?.id ||
        (typeof liveData === "string" ? liveData : "") ||
        resData?.liveId ||
        resData?.roomId ||
        resData?._id ||
        res?._id ||
        liveId;

      setIsHost(true);
      if (streamLiveId) {
        setActualLiveId(streamLiveId);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("current_host_live_id", streamLiveId);
          localStorage.setItem("current_host_live_id", streamLiveId);
        }
        if (!params?.id || params.id !== streamLiveId) {
          router.replace(`/live-stream/${streamLiveId}`);
        }
      }
      if (liveData?.host) {
        const hId = typeof liveData.host === "string" ? liveData.host : liveData.host?._id || liveData.host?.id;
        if (hId) setHostUserId(hId);
      }
      if (liveData?.products && Array.isArray(liveData.products)) {
        setSocketProducts(liveData.products);
        if (typeof window !== "undefined" && streamLiveId) {
          sessionStorage.setItem(`live_products_${streamLiveId}`, JSON.stringify(liveData.products));
        }
      }

      if (typeof window !== "undefined") {
        if (freshToken && streamLiveId) {
          sessionStorage.setItem(`hms_token_${streamLiveId}`, freshToken);
          localStorage.setItem(`hms_token_${streamLiveId}`, freshToken);
        }
      }

      if (freshToken) {
        try {
          await hmsActions.leave().catch(() => {});
          await hmsActions.join({
            authToken: freshToken,
            userName: user?.name || user?.username || "Host",
          });
          hmsActions.setLocalVideoEnabled(isCameraOn);
          hmsActions.setLocalAudioEnabled(isMicOn);
        } catch (e) {
          console.warn("HMS Reconnect rejoin error:", e);
        }
      }
    };

    const handleReconnected = async (rawRes: any) => {
      console.log("Socket event: live:reconnected received", rawRes);
      const res = Array.isArray(rawRes) ? (typeof rawRes[0] === "string" ? rawRes[1] : rawRes[0]) : rawRes;
      const resData = res?.data || res;
      const liveData = resData?.live || res?.live;
      const freshToken = resData?.token || res?.token;
      const role = String(resData?.role || "").toLowerCase();
      const isCohostRole = role === "co-host" || role === "cohost" || role === "co_host";
      const isHostRole = role === "host" || role === "broadcaster";
      const streamLiveId =
        liveData?._id ||
        liveData?.id ||
        (typeof liveData === "string" ? liveData : "") ||
        resData?.liveId ||
        resData?.roomId ||
        resData?._id ||
        res?._id ||
        liveId;

      if (streamLiveId) {
        setActualLiveId(streamLiveId);
        if (isHostRole && typeof window !== "undefined") {
          sessionStorage.setItem("current_host_live_id", streamLiveId);
          localStorage.setItem("current_host_live_id", streamLiveId);
        }
        if (!params?.id || params.id !== streamLiveId) {
          router.replace(`/live-stream/${streamLiveId}`);
        }
      }

      if (liveData?.products && Array.isArray(liveData.products)) {
        setSocketProducts(liveData.products);
        if (typeof window !== "undefined" && streamLiveId) {
          sessionStorage.setItem(`live_products_${streamLiveId}`, JSON.stringify(liveData.products));
        }
      }

      if (freshToken && typeof window !== "undefined" && streamLiveId) {
        sessionStorage.setItem(`hms_token_${streamLiveId}`, freshToken);
        localStorage.setItem(`hms_token_${streamLiveId}`, freshToken);
      }

      if (isCohostRole) {
        setIsCohost(true);
        const currentUserId = (user as any)?._id || (user as any)?.id;
        const currentUserName = (user as any)?.name || (user as any)?.username || "Co-Host";
        if (currentUserId) {
          setCohosts((prev) => {
            if (prev.some((c) => c.userId === currentUserId)) return prev;
            return [...prev, { userId: currentUserId, username: currentUserName, role: "cohost", isMuted: false }];
          });
        }
      } else if (isHostRole) {
        setIsHost(true);
      }

      if (freshToken) {
        try {
          await hmsActions.leave().catch(() => {});
          await hmsActions.join({
            authToken: freshToken,
            userName:
              (user as any)?.name ||
              (user as any)?.username ||
              (isHostRole ? "Host" : isCohostRole ? "Co-Host" : "Viewer"),
          });
          if (isHostRole || isCohostRole) {
            await hmsActions.setLocalVideoEnabled(true);
            await hmsActions.setLocalAudioEnabled(true);
            setIsCameraOn(true);
            setIsMicOn(true);
          } else {
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
      const resData = data?.data || data;
      const resolvedLiveId =
        resData?.liveId ||
        resData?.live?._id ||
        resData?.live?.id ||
        resData?._id ||
        data?.liveId;

      if (resolvedLiveId) {
        setActualLiveId(resolvedLiveId);
      }

      setCohostInvite({
        hostUsername: resData?.hostUsername || resData?.host?.name || resData?.host?.username || "Host",
        liveId: resolvedLiveId || actualLiveId || liveId,
        invitationId: resData?.invitationId,
      });
    };

    const handleCohostAdded = (data: any) => {
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
          if (peer) {
            hmsActions
              .changeRoleOfPeer(peer.id, cohostRoleName, true)
              .then(() => {})
              .catch((err) => {
                console.error(`[HMS ROLE] Role change failed:`, err);
              });
          } else {
            setPendingPromotions((prev) => {
              if (prev.includes(userId)) return prev;
              return [...prev, userId];
            });
          }
        }
      }
    };

    const handleCohostRejected = (data: any) => {
      toast.info("Co-host invitation was declined.");
      const userId = data?.data?.userId;
      if (userId) {
        setCohosts((prev) => prev.filter((c) => c.userId !== userId));
      }
    };

    const handleCohostRemoved = (data: any) => {
      const resData = data?.data || data;
      const userId = typeof resData === "string" ? resData : resData?.userId || resData?.user?._id || resData?._id;
      if (userId) {
        setCohosts((prev) => prev.filter((c) => c.userId !== userId));
        toast.info("A co-host was removed from the stream.");

        if (amIHost) {
          const peer = hmsPeersRef.current.find((p) => p.customerUserId === userId);
          if (peer) {
            hmsActions
              .changeRoleOfPeer(peer.id, viewerRoleName, true)
              .then(() => {})
              .catch((err) => {
                console.error(`[HMS ROLE] Role change failed for peer ${peer.name}:`, err);
              });
          }
        }
      }
    };

    const handleCohostMuted = (data: any) => {
      const userId = data?.data?.userId;
      if (userId) {
        setCohosts((prev) =>
          prev.map((c) => (c.userId === userId ? { ...c, isMuted: true } : c))
        );
      }
    };

    const handleCohostUnmuted = (data: any) => {
      const userId = data?.data?.userId;
      if (userId) {
        setCohosts((prev) =>
          prev.map((c) => (c.userId === userId ? { ...c, isMuted: false } : c))
        );
      }
    };

    const getProductId = (p: any): string => {
      return resolveProductId(p);
    };

    const handleProductAdded = (data: any) => {
      console.log("Socket event: product added received", data);
      const payload = Array.isArray(data) ? (typeof data[0] === "string" ? data[1] : data[0]) : data;
      const resData = payload?.data || payload;

      const incomingList =
        resData?.products ||
        resData?.live?.products ||
        payload?.live?.products ||
        payload?.products ||
        resData?.addedProducts ||
        payload?.addedProducts ||
        resData?.items ||
        payload?.items ||
        resData?.productIds ||
        payload?.productIds ||
        (Array.isArray(resData) ? resData : undefined) ||
        (Array.isArray(payload) ? payload : undefined);

      const singleItem =
        resData?.product ||
        payload?.product ||
        resData?.addedProduct ||
        payload?.addedProduct;

      const prodsToMerge: any[] = Array.isArray(incomingList)
        ? incomingList
        : singleItem
        ? [singleItem]
        : [];

      if (prodsToMerge.length > 0) {
        toast.info("New products added to the live stream!");
        setSocketProducts((prev) => {
          const mergedMap = new Map<string, any>();
          prev.forEach((item) => {
            const id = resolveProductId(item);
            if (id) mergedMap.set(id, item);
          });

          prodsToMerge.forEach((item) => {
            const id = resolveProductId(item);
            if (id) {
              const existing = mergedMap.get(id);
              if (existing && typeof existing === "object" && typeof item === "string") {
                // Keep the richer existing object
              } else if (existing && typeof existing === "object" && typeof item === "object") {
                mergedMap.set(id, { ...existing, ...item });
              } else {
                mergedMap.set(id, item);
              }
            } else {
              mergedMap.set(Math.random().toString(), item);
            }
          });

          const updated = Array.from(mergedMap.values());
          if (typeof window !== "undefined" && actualLiveId) {
            sessionStorage.setItem(`live_products_${actualLiveId}`, JSON.stringify(updated));
          }
          return updated;
        });
      }
    };

    const handleProductRemoved = (data: any) => {
      console.log("Socket event: product removed received", data);
      const payload = Array.isArray(data) ? (typeof data[0] === "string" ? data[1] : data[0]) : data;
      const resData = payload?.data || payload;
      const prods = resData?.products || payload?.products;
      const removedId =
        resData?.productId ||
        payload?.productId ||
        resData?.id ||
        payload?.id;
      const removedIds: string[] =
        resData?.productIds ||
        payload?.productIds ||
        (Array.isArray(prods) ? prods.map(resolveProductId).filter(Boolean) : []) ||
        (removedId ? [removedId] : []);

      if (removedIds.length > 0) {
        setSocketProducts((prev) => {
          const updated = prev.filter((p: any) => {
            const pId = resolveProductId(p);
            return !removedIds.includes(pId);
          });
          if (typeof window !== "undefined" && actualLiveId) {
            sessionStorage.setItem(`live_products_${actualLiveId}`, JSON.stringify(updated));
          }
          return updated;
        });
      }
    };

    socket.on("live:viewer-count-updated", handleViewerCountUpdated);
    socket.on("live:ended", handleLiveEnded);
    socket.on("live:host-reconnected", handleHostReconnected);
    socket.on("live:reconnected", handleReconnected);
    socket.on("live:viewer-reconnected", handleReconnected);
    socket.on("live:cohost-invited", handleCohostInvited);
    socket.on("live:cohost-added", handleCohostAdded);
    socket.on("live:cohost-rejected", handleCohostRejected);
    socket.on("live:cohost-removed", handleCohostRemoved);
    socket.on("live:cohost-left", handleCohostRemoved);
    socket.on("live:user-left", handleCohostRemoved);
    socket.on("live:participant-left", handleCohostRemoved);
    socket.on("live:cohost-muted", handleCohostMuted);
    socket.on("live:cohost-unmuted", handleCohostUnmuted);
    socket.on("live:products-added", handleProductAdded);
    socket.on("live:products-updated", handleProductAdded);
    socket.on("live:product-added", handleProductAdded);
    socket.on("live:product-updated", handleProductAdded);
    socket.on("live:cohost-products-added", handleProductAdded);
    socket.on("live:cohost-product-added", handleProductAdded);
    socket.on("live:products", handleProductAdded);
    socket.on("live:add-products", handleProductAdded);
    socket.on("live:products-removed", handleProductRemoved);
    socket.on("live:product-removed", handleProductRemoved);

    return () => {
      isMounted = false;
      socket.off("live:viewer-count-updated", handleViewerCountUpdated);
      socket.off("live:ended", handleLiveEnded);
      socket.off("live:host-reconnected", handleHostReconnected);
      socket.off("live:reconnected", handleReconnected);
      socket.off("live:viewer-reconnected", handleReconnected);
      socket.off("live:cohost-invited", handleCohostInvited);
      socket.off("live:cohost-added", handleCohostAdded);
      socket.off("live:cohost-rejected", handleCohostRejected);
      socket.off("live:cohost-removed", handleCohostRemoved);
      socket.off("live:cohost-left", handleCohostRemoved);
      socket.off("live:user-left", handleCohostRemoved);
      socket.off("live:participant-left", handleCohostRemoved);
      socket.off("live:cohost-muted", handleCohostMuted);
      socket.off("live:cohost-unmuted", handleCohostUnmuted);
      socket.off("live:products-added", handleProductAdded);
      socket.off("live:products-updated", handleProductAdded);
      socket.off("live:product-added", handleProductAdded);
      socket.off("live:product-updated", handleProductAdded);
      socket.off("live:cohost-products-added", handleProductAdded);
      socket.off("live:cohost-product-added", handleProductAdded);
      socket.off("live:products", handleProductAdded);
      socket.off("live:add-products", handleProductAdded);
      socket.off("live:products-removed", handleProductRemoved);
      socket.off("live:product-removed", handleProductRemoved);
    };
  }, [liveId, isHost, amIHost, isHMSConnected, hmsActions]);

  // Host-only observer to change roles of peers that accepted co-host invitations
  useEffect(() => {
    if (!amIHost || !isHMSConnected || pendingPromotions.length === 0) return;

    const promotedUserIds: string[] = [];

    pendingPromotions.forEach((userId) => {
      // Find the peer in the room where customerUserId matches the user's ID
      const peer = hmsPeers.find((p) => p.customerUserId === userId || p.id === userId);
      if (peer) {
        const normalizedRole = peer.roleName?.toLowerCase() || "";
        if (normalizedRole === "co-host" || normalizedRole === "cohost" || normalizedRole === "co_host") {
          promotedUserIds.push(userId);
          return;
        }

        hmsActions
          .changeRoleOfPeer(peer.id, cohostRoleName, true)
          .then(() => {})
          .catch((err) => {
            console.error(`[HMS ROLE] Role change failed for peer ${peer.name}:`, err);
          });

        promotedUserIds.push(userId);
      }
    });

    if (promotedUserIds.length > 0) {
      setPendingPromotions((prev) => prev.filter((id) => !promotedUserIds.includes(id)));
    }
  }, [hmsPeers, pendingPromotions, amIHost, isHMSConnected, hmsActions]);

  // Keep track of cohost connection statuses in the 100ms room
  const cohostStatusRef = useRef<{
    [userId: string]: {
      addedAt: number;
      hasJoined100ms: boolean;
      lastSeenIn100ms: number;
    };
  }>({});

  // Sync cohosts list with local status tracking ref
  useEffect(() => {
    const now = Date.now();
    const currentStatus = cohostStatusRef.current;

    cohosts.forEach((c) => {
      if (!currentStatus[c.userId]) {
        currentStatus[c.userId] = {
          addedAt: now,
          hasJoined100ms: false,
          lastSeenIn100ms: now,
        };
      }
    });

    Object.keys(currentStatus).forEach((userId) => {
      if (!cohosts.some((c) => c.userId === userId)) {
        delete currentStatus[userId];
      }
    });
  }, [cohosts]);

  // Host-only effect to cleanup stale or disconnected cohosts
  useEffect(() => {
    if (!amIHost) return;

    const timer = setInterval(() => {
      const currentStatus = cohostStatusRef.current;
      const now = Date.now();

      cohosts.forEach((cohost) => {
        const status = currentStatus[cohost.userId];
        if (!status) return;

        const isPresentIn100ms = hmsPeers.some(
          (p) =>
            p.customerUserId === cohost.userId ||
            p.id === cohost.userId ||
            (cohost.username && p.name && cohost.username.toLowerCase() === p.name.toLowerCase())
        );

        if (isPresentIn100ms) {
          status.hasJoined100ms = true;
          status.lastSeenIn100ms = now;
        } else {
          // If they joined previously and left 100ms, immediately remove them from cohosts
          if (status.hasJoined100ms) {
            setCohosts((prev) => prev.filter((c) => c.userId !== cohost.userId));
            liveSocketService.kickCohost(liveId, cohost.userId).catch(() => {});
          } else {
            // Never joined 100ms within 10 seconds -> cleanup
            if (now - status.addedAt > 10000) {
              setCohosts((prev) => prev.filter((c) => c.userId !== cohost.userId));
              liveSocketService.kickCohost(liveId, cohost.userId).catch(() => {});
            }
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hmsPeers, cohosts, amIHost, liveId]);

  // Observer for local peer role change inside the 100ms room
  useEffect(() => {
    if (!localPeer?.roleName) return;

    const currentRole = localPeer.roleName.toLowerCase();
    const isCohostRole = currentRole === "co-host" || currentRole === "cohost" || currentRole === "co_host";

    if (isCohostRole) {
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
    } else if (currentRole === viewerRoleName.toLowerCase()) {
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
  }, [localPeer?.roleName, hmsActions, viewerRoleName]);

  const handleConfirmEndLive = async () => {
    try {
      setIsEndingStream(true);
      try {
        await hmsActions.leave();
      } catch (e) {
        console.warn("HMS leave error:", e);
      }
      await liveSocketService.endLive(liveId);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("current_host_live_id");
        sessionStorage.removeItem(`hms_token_${liveId}`);
        sessionStorage.removeItem(`host_mic_${liveId}`);
        sessionStorage.removeItem(`host_camera_${liveId}`);
      }
      queryClient.invalidateQueries({ queryKey: ["lives"] });
      queryClient.refetchQueries({ queryKey: ["lives"] });
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

  const handleAddToCart = (product: LiveProductItem) => {
    if (!user) {
      toast.error("You must be logged in to add products to your cart.");
      return;
    }
    setSelectedProduct(product);
    setShowDeliveryModal(true);
  };

  const handleSelectFulfillment = async (method: { selfPickup: boolean; delivery: boolean }) => {
    if (!selectedProduct) return;
    const productId = selectedProduct.id;
    if (!productId) return;

    try {
      // API call: BaseUrl/users/cart-products/:id (POST)
      const res = await axiosInstance.post(`/users/cart-product/${productId}`, {
        fulfillmentMethod: method,
      });
      const successMessage = res.data?.message || `Added "${selectedProduct.title}" to cart!`;
      toast.success(successMessage);
    } catch (error: any) {
      console.error("Add to cart error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add product to cart.";
      toast.error(errorMsg);
    } finally {
      setShowDeliveryModal(false);
      setSelectedProduct(null);
    }
  };

  const isLeaveConfirmedRef = useRef(false);

  // Intercept browser back button for viewers to prompt Leave Room confirmation modal
  useEffect(() => {
    if (isHost || isLiveEnded) return;

    if (typeof window !== "undefined") {
      window.history.pushState({ liveRoom: true }, "", window.location.href);

      const handlePopState = () => {
        if (!isLeaveConfirmedRef.current) {
          window.history.pushState({ liveRoom: true }, "", window.location.href);
          setIsLeaveModalOpen(true);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isHost, isLiveEnded]);

  // Automatically leave room when the tab/window is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (liveId && !isHost) {
        liveSocketService.leaveLive(liveId);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [liveId, isHost]);

  const handleConfirmLeaveLive = async () => {
    try {
      setIsLeavingStream(true);
      isLeaveConfirmedRef.current = true;
      const currentUserId =
        user?._id ||
        (user?.id ? String(user.id) : undefined) ||
        localPeer?.customerUserId;
      if (isCohost && currentUserId) {
        try {
          await liveSocketService.kickCohost(liveId, currentUserId);
        } catch (err) {
          console.warn("Failed to remove co-host state on leave:", err);
        }
      }
      try {
        await hmsActions.leave();
      } catch (e) {
        console.warn("HMS leave error:", e);
      }
      await liveSocketService.leaveLive(liveId);
      queryClient.invalidateQueries({ queryKey: ["lives"] });
      queryClient.refetchQueries({ queryKey: ["lives"] });
      toast.info("You left the live stream.");
      setIsLeaveModalOpen(false);
      router.push("/");
    } catch (error: any) {
      console.error("Error leaving live stream:", error);
      setIsLeaveModalOpen(false);
      router.push("/");
    } finally {
      setIsLeavingStream(false);
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
          <div className="w-full py-2.5 sm:py-3.5 px-3 sm:px-6 bg-[#111622] border-b border-white/10 flex items-center justify-between gap-2">
            {/* Stream Title */}
            <h2 className="text-xs sm:text-base font-bold text-white tracking-tight truncate min-w-0">
              {isHost ? "My Live Broadcast" : "Watching Broadcast"}
            </h2>

            {/* Badges & Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* LIVE Tag */}
              <span
                className={`${
                  isLiveEnded ? "bg-gray-600" : "bg-[#FF3B30] animate-pulse"
                } text-white text-[10px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase tracking-wider whitespace-nowrap shrink-0`}
              >
                <HiSignal className="text-xs" /> {isLiveEnded ? "ENDED" : "LIVE"}
              </span>

              {/* Viewer Count Pill */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full text-white text-[11px] sm:text-xs font-semibold whitespace-nowrap shrink-0">
                <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
                <span>
                  {viewerCount >= 1000
                    ? `${(viewerCount / 1000).toFixed(1)}k`
                    : `${viewerCount}`}
                </span>
              </div>

              {/* Invite Co-Host Button (Host Only) */}
              {isHost && !isLiveEnded && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCohostModalOpen(true);
                    queryClient.invalidateQueries({ queryKey: ['live-participants'] });
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Invite Co-Host"
                >
                  <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}

              {/* Share Stream Button */}
              <button
                type="button"
                onClick={handleShareStream}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Share Stream"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* End Livestream Button (Host Only) */}
              {isHost && !isLiveEnded && (
                <button
                  type="button"
                  onClick={() => setIsEndModalOpen(true)}
                  className="bg-[#FF3B30] hover:bg-red-600 active:scale-95 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  End Livestream
                </button>
              )}

              {/* Leave Stream Button (Viewer Only) */}
              {!isHost && (
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="bg-gray-700 hover:bg-gray-600 active:scale-95 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span>Leave Room</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Broadcast & Chat Section (Video & Chat Aligned Side-by-Side) */}
          <div className="w-full flex flex-col lg:flex-row items-stretch  border-b border-white/10 overflow-hidden">
            {/* Main Video Stream */}
            <div className="flex-1 overflow-hidden">
              <LiveVideoGrid
                liveId={liveId}
                isHost={isHost}
                isCohost={isCohost}
                hostUserId={hostUserId}
                isMicOn={isMicOn}
                isCameraOn={isCameraOn}
                isMirrored={true}
                cohosts={cohosts}
                isLiveEnded={isLiveEnded}
                thumbnailUrl={streamThumbnail}
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
            </div>

            {/* Right Column: Real-time Audience Chat */}
            <LiveChatPanel
              liveId={liveId}
              isHost={isHost}
              currentUsername={user?.name || user?.username || ""}
              isLiveEnded={isLiveEnded}
            />
          </div>

          {/* Products Showcase Carousel (Visible to Host, Co-host & Viewers) */}
          <LiveProductsCarousel
            products={activeLiveProducts}
            onAddToCart={handleAddToCart}
            onRefresh={async () => {
              setSocketProducts([]);
              await refetch();
            }}
            showAddToCart={!isHost && !isCohost}
          />
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

      {/* End Stream Confirmation Modal (Host only) */}
      {isHost && (
        <EndStreamModal
          isOpen={isEndModalOpen}
          onClose={() => setIsEndModalOpen(false)}
          onConfirm={handleConfirmEndLive}
          isEnding={isEndingStream}
        />
      )}

      {/* Leave Stream Confirmation Modal (Viewer only) */}
      {!isHost && (
        <LeaveRoomModal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          onConfirm={handleConfirmLeaveLive}
          isLeaving={isLeavingStream}
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
              const rawRes = await liveSocketService.acceptCohost(cohostInvite.liveId, localPeer?.id);
              const res = Array.isArray(rawRes) ? rawRes[0] : rawRes;
              console.log("[Accept Co-Host Response]:", res);

              const resolvedLiveId =
                res?.data?.live?._id ||
                res?.data?.live?.id ||
                res?.data?.liveId ||
                res?.data?._id ||
                res?.liveId ||
                cohostInvite.liveId ||
                actualLiveId;

              if (resolvedLiveId) {
                setActualLiveId(resolvedLiveId);
              }

              toast.info("Accepted co-host invitation. Connecting to stream...");
              setIsCohostProductModalOpen(true);
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

      {/* Co-Host Product Selection Modal */}
      <CohostProductSelectModal
        isOpen={isCohostProductModalOpen}
        liveId={actualLiveId || cohostInvite?.liveId || liveId}
        onClose={() => setIsCohostProductModalOpen(false)}
        onSuccess={(addedProductIds, returnedProducts) => {
          console.log("[Co-Host] Products added to live:", addedProductIds, returnedProducts);
          if (Array.isArray(returnedProducts) && returnedProducts.length > 0) {
            setSocketProducts((prev) => {
              const map = new Map<string, any>();
              prev.forEach((item) => {
                const id = resolveProductId(item);
                if (id) map.set(id, item);
              });
              returnedProducts.forEach((item) => {
                const id = resolveProductId(item);
                if (id) map.set(id, item);
              });
              return Array.from(map.values());
            });
          }
          refetch();
        }}
      />

      <ChooseDeliveryModal
        showPopup={showDeliveryModal}
        handleShowPopup={() => setShowDeliveryModal(false)}
        handleSelectFulfillmentMethod={handleSelectFulfillment}
      />
    </div>
  );
}
