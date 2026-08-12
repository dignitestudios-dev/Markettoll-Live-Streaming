"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import HomeHeader from "./home-header";
import CategoryBar from "./category-bar";
import LiveStreamCard from "./live-stream-card";
import { LiveProduct, LiveStream } from "../types/home.types";
import { useLivesQuery } from "../api/lives.queries";
import { extractProductImageUrl } from "../api/lives.service";
import { liveSocketService } from "@/features/live-stream/services/live-socket.service";
import { IoClose } from "react-icons/io5";
import { Eye } from "lucide-react";

export default function HomeView() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeStreamModal, setActiveStreamModal] = useState<LiveStream | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // Fetch lives via React Query useLivesQuery hook
  const { data: rawLives, isLoading } = useLivesQuery();
  console.log(rawLives, "rawLive===>");

  const streams: LiveStream[] = useMemo(() => {
    if (Array.isArray(rawLives)) {
      return rawLives?.map((item) => {
        const products: LiveProduct[] = Array.isArray(item.products)
          ? item.products.map((p: any, idx: number) => {
              const imageUrl = extractProductImageUrl(p);
              const title = p.name || p.title || `Product ${idx + 1}`;
              const priceVal =
                typeof p.price === "number"
                  ? `$${p.price.toFixed(2)}`
                  : p.price
                  ? `$${p.price}`
                  : "$10.99";

              return {
                id: p._id || p.id || `p-${idx}`,
                image: imageUrl,
                discount: p.discount || "DEAL",
                title: title,
                price: priceVal,
                originalPrice: p.originalPrice ? `$${p.originalPrice}` : undefined,
              };
            })
          : [];

        return {
          id: item._id,
          streamerName: item.host?.name || "Lillian Bakerss",
          streamerAvatar:
            item.host?.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          category: item.category || "General",
          title: item.title || "Live Shopping Stream",
          viewerCount: String(item.viewerCount || 0),
          thumbnail: item?.thumbnail || "",
          products: products,
          isLive: item.status === "live" || true,
          duration: "Live Now",
        };
      });
    }
    return [];
  }, [rawLives]);

  const handleJoinStreamRoom = async (liveId: string) => {
    if (joiningId) return; // prevent double-click
    setJoiningId(liveId);
    try {
      const rawRes = await liveSocketService.joinLive(liveId);
      const res = Array.isArray(rawRes) ? rawRes[0] : rawRes;
      if (res && res.success === false) {
        const errorMsg = String(res.error || res.message || "").toLowerCase();
        if (
          res.error === "LIVE_ALREADY_ENDED" ||
          res.error === "LIVE_NOT_FOUND"
        ) {
          toast.error(res.message || "This stream is no longer active.");
          setJoiningId(null);
          return;
        }
        // ignore "already joined" — viewer may still navigate
        if (!errorMsg.includes("already")) {
          toast.error(res.message || "Failed to join live stream.");
          setJoiningId(null);
          return;
        }
      }

      // Persist viewer token so live-stream-page-view skips a second joinLive call
      const token = res?.data?.token || res?.token || "";
      if (token && typeof window !== "undefined") {
        sessionStorage.setItem(`viewer_join_token_${liveId}`, token);
        // Also persist host/live data if available
        const hostId = res?.data?.live?.host?._id || res?.data?.live?.host;
        if (hostId) {
          sessionStorage.setItem(`live_host_id_${liveId}`, typeof hostId === "string" ? hostId : hostId._id);
        }
      }
    } catch (err) {
      console.warn("Socket join error:", err);
    }
    setActiveStreamModal(null);
    router.push(`/live-stream/${liveId}`);
  };
console.log(activeStreamModal,'activeStreamModal?.products')
  return (
    <div className="w-full padding-x py-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Welcome Header */}
        <HomeHeader />

        {/* Category Bar */}
        <CategoryBar
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Section Heading */}
        <div className="pt-4 pb-2">
          <h2 className="text-xl sm:text-[28px] font-bold text-[#003DAC] tracking-tight leading-[35px]">
            Join now and shop exclusive deals
          </h2>
        </div>

        {/* Grid of Live Streams from API */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[320px] bg-gray-100 animate-pulse rounded-2xl border border-gray-200"
              />
            ))}
          </div>
        ) : streams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 pt-2">
            {streams?.map((stream) => (
              <LiveStreamCard
                key={stream.id}
                stream={stream}
                onCardClick={(s) => setActiveStreamModal(s)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16  rounded-2xl my-4">
            <p className="text-gray-500 font-medium text-base">
              No live streams active right now.
            </p>
          </div>
        )}
      </div>

      {/* Stream Quick View Modal */}
      {activeStreamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative border border-gray-100 select-none">
            <button
              type="button"
              onClick={() => setActiveStreamModal(null)}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition cursor-pointer"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <div className="relative aspect-video w-full bg-black">
              <img
                src={activeStreamModal.thumbnail}
                alt={activeStreamModal.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-[#FF3B30] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  🔴 LIVE NOW
                </span>
                <span className="bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {activeStreamModal.viewerCount}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-bold line-clamp-1">
                  {activeStreamModal.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src={activeStreamModal.streamerAvatar}
                    alt={activeStreamModal.streamerName}
                    className="w-6 h-6 rounded-full object-cover border border-white"
                  />
                  <span className="text-xs font-semibold opacity-90">
                    {activeStreamModal.streamerName}
                  </span>
                  <span className="text-xs opacity-70">
                    • {activeStreamModal.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Featured Live Products ({activeStreamModal.products.length})
              </h4>
              {activeStreamModal.products.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {activeStreamModal.products.map((prod) => (
                    <div
                      key={prod.id}
                      className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group"
                    >
                      <img
                        src={prod.image}
                        alt="product"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute top-1 left-1 bg-[#FF3B30] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs">
                        {prod.discount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-400 font-medium">
                  No products listed for this stream.
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleJoinStreamRoom(activeStreamModal.id)}
                  disabled={joiningId === activeStreamModal.id}
                  className="w-full py-2.5 bg-[#0098EA] hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  {joiningId === activeStreamModal.id ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join Stream Room"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
