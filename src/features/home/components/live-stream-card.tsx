"use client";

import React from "react";
import { LiveStream } from "../types/home.types";
import { Eye, Clock } from "lucide-react";

interface LiveStreamCardProps {
  stream: LiveStream;
  onCardClick?: (stream: LiveStream) => void;
}

export default function LiveStreamCard({
  stream,
  onCardClick,
}: LiveStreamCardProps) {
  return (
    <div
      onClick={() => onCardClick?.(stream)}
      className="group bg-white w-full rounded-[16px] border border-black/5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      <div>
        {/* Main Cover Image Section (Height ~183.8px) */}
        <div className="relative h-[183.8px] w-full bg-gray-100 overflow-hidden">
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none z-[1]" />

          {/* Top Row: LIVE Tag & Viewer Count */}
          <div className="absolute top-[10.89px] inset-x-3 z-10 flex items-center justify-between pointer-events-none">
            {/* LIVE Tag */}
            <div className="flex items-center gap-[6px] bg-[#FF3B30] text-white text-[12px] font-bold px-[10px] py-[4px] rounded-full shadow-xs">
              <span className="w-[8px] h-[8px] rounded-full bg-white animate-pulse" />
              <span>LIVE</span>
            </div>

            {/* Viewer Count Tag */}
            <div className="flex items-center gap-[4px] bg-black/50 backdrop-blur-xs text-white text-[12px] font-semibold px-[8px] py-[4px] rounded-full shadow-xs">
              <Eye className="w-[12px] h-[12px] text-white" />
              <span>{stream.viewerCount}</span>
            </div>
          </div>

          {/* Bottom-Left: Duration Tag */}
          <div className="absolute bottom-[12px] left-[12px] z-10 flex items-center gap-[4px] bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium px-[8px] py-[4px] rounded-full">
            <Clock className="w-[10px] h-[10px] text-white" />
            <span>{stream.duration || "1:24:38"}</span>
          </div>
        </div>

        {/* Card Details Section (Padding 16px) */}
        <div className="p-4 flex flex-col justify-between">
          {/* Streamer Profile Row */}
          <div className="flex items-center gap-[12px] mb-2.5">
            {/* Avatar with Live Indicator */}
            <div className="relative w-[40px] h-[40px] flex-shrink-0">
              <img
                src={stream.streamerAvatar}
                alt={stream.streamerName}
                className="w-[40px] h-[40px] object-cover rounded-full border-[1.11px] border-[#00A9E0]/30"
              />
              <span className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-[#FF3B30] border-[1.11px] border-white rounded-full z-10" />
            </div>

            <div className="min-w-0 flex-1 flex flex-col gap-[2px]">
              <h3 className="text-[14px] font-semibold text-[#101828] leading-[20px] truncate group-hover:text-[#0098EA] transition-colors">
                {stream.streamerName}
              </h3>
              <div>
                <span className="inline-block bg-[#F3F4F6] text-[#4A5565] text-[12px] font-normal px-[8px] py-[2px] rounded-full">
                  {stream.category}
                </span>
              </div>
            </div>
          </div>

          {/* Stream Title */}
          <div className="my-[4px] min-h-[38px]">
            <p className="text-[14px] font-medium text-[#1E2939] leading-[19px] line-clamp-2">
              {stream.title}
            </p>
          </div>

          {/* Featured Products Row */}
          <div className="grid grid-cols-4 gap-2 pt-[12px] border-t border-[#F3F4F6] mt-2 min-h-[48px] items-center">
            {stream.products && stream.products.length > 0 ? (
              stream.products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="relative aspect-square w-full rounded-[8px] bg-gray-100 border border-gray-100 group/prod"
                >
                  <img
                    src={product.image}
                    alt={product.title || "product"}
                    className="w-full h-full object-cover rounded-[8px] group-hover/prod:scale-105 transition-transform duration-300"
                  />
                  {product.discount && (
                    <span className="absolute -top-[4px] -right-[4px] bg-[#FF3B30] text-white text-[9px] font-semibold px-[6px] py-[2px] rounded-full shadow-xs z-10">
                      {product.discount}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-xs text-gray-400 font-medium py-1">
                No products listed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
