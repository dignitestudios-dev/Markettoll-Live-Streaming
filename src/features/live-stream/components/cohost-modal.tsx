"use client";

import React, { useState } from "react";
import {
  IoClose,
  IoPersonAdd,
  IoCopyOutline,
  IoCheckmark,
  IoMicOutline,
  IoMicOffOutline,
  IoVideocamOutline,
  IoVideocamOffOutline,
} from "react-icons/io5";
import {
  useHMSActions,
  useHMSStore,
  selectPeers,
  selectAudioTrackByPeerID,
  selectVideoTrackByPeerID,
} from "@100mslive/react-sdk";
import { liveSocketService } from "../services/live-socket.service";
import { toast } from "react-toastify";
import { useLiveParticipantsQuery } from "../api/live-participants.queries";

export interface CohostParticipant {
  userId: string;
  username: string;
  role: "cohost" | "viewer";
  isMuted: boolean;
  avatar?: string;
}

interface CohostModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveId: string;
  cohosts: CohostParticipant[];
  onUpdateCohosts: (updated: CohostParticipant[]) => void;
}

interface ParticipantRowProps {
  uId: string;
  uName: string;
  uAvatar: string;
  isCohost: boolean;
  isInvited: boolean;
  liveId: string;
  onInvite: () => void;
  onRemove: () => void;
}

function ParticipantRow({
  uId,
  uName,
  uAvatar,
  isCohost,
  isInvited,
  liveId,
  onInvite,
  onRemove,
}: ParticipantRowProps) {
  const hmsActions = useHMSActions();
  const hmsPeers = useHMSStore(selectPeers) || [];

  // Find corresponding 100ms peer
  const peer = hmsPeers.find((p) => p.customerUserId === uId);

  // Retrieve track objects using selectors
  const audioTrack = useHMSStore(selectAudioTrackByPeerID(peer?.id));
  const videoTrack = useHMSStore(selectVideoTrackByPeerID(peer?.id));

  // Determine muted/enabled states.
  const isMicEnabled = audioTrack ? audioTrack.enabled : true;
  const isVideoEnabled = videoTrack ? videoTrack.enabled : true;

  console.log("audioTrack", audioTrack);
  console.log("videoTrack", videoTrack);
  const handleToggleMute = async () => {
    console.log(audioTrack,"audioTrack")
    if (audioTrack) {
      if (!audioTrack.enabled) {
        toast.info("Only the co-host can unmute themselves.");
        return; 
      }
      try {
        await hmsActions.setRemoteTrackEnabled(audioTrack.id, false);
        await liveSocketService.muteCohost(liveId, uId, true);
        toast.info(`Muted ${uName}.`);
      } catch (err) {
        console.error("Failed to mute remote audio:", err);
        toast.error("Failed to mute co-host.");
      }
    } else {
      toast.warn("Guest is not actively connected to the audio room yet.");
    }
  };

  const handleToggleCamera = async () => {
    if (videoTrack) {
      if (!videoTrack.enabled) {
        toast.info("Only the co-host can turn their camera back on.");
        return;
      }
      try {
        await hmsActions.setRemoteTrackEnabled(videoTrack.id, false);
        toast.info(`Turned off ${uName}'s camera.`);
      } catch (err) {
        console.error("Failed to change remote video state:", err);
        toast.error("Failed to turn off camera.");
      }
    } else {
      toast.warn("Guest is not actively connected to the video room yet.");
    }
  };

  return (
    <div
      className="
        flex items-center justify-between
        rounded-[12px]
        border border-[#eeeeee]
        bg-white
        px-3 py-[8px]
        shadow-[0_1px_3px_rgba(0,0,0,0.03)]
      "
    >
      {/* User Info */}
      <div className="flex min-w-0 flex-1 items-center gap-[9px]">
        <div className="relative shrink-0">
          <img
            src={uAvatar}
            alt={uName}
            className="
              h-[32px] w-[32px]
              rounded-full
              border border-[#eeeeee]
              object-cover
            "
          />
          {/* Online status dot */}
          <span
            className="
              absolute bottom-[-1px] right-[-1px]
              h-[7px] w-[7px]
              rounded-full
              border-[1.5px] border-white
              bg-[#21c96b]
            "
          />
        </div>

        <div className="flex flex-col min-w-0">
          <span
            className="
              truncate
              text-[10px]
              font-semibold
              text-[#242424]
            "
          >
            {uName}
          </span>
          {isCohost && (
            <span className="text-[8px] text-[#08acd1] font-medium mt-0.5">
              Active Guest
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {isCohost && (
          <div className="flex items-center gap-1.5 mr-1">
            {/* Mute/Unmute Button */}
            <button
              type="button"
              onClick={handleToggleMute}
              disabled={!audioTrack || !isMicEnabled}
              title={isMicEnabled ? "Mute Guest" : "Guest is Muted"}
              className={`
                flex h-[24px] w-[24px] items-center justify-center rounded-full border transition-all
                ${
                  !audioTrack
                    ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                    : isMicEnabled
                    ? "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    : "border-red-100 bg-red-50 text-red-400 cursor-not-allowed"
                }
              `}
            >
              {isMicEnabled ? (
                <IoMicOutline className="text-[14px]" />
              ) : (
                <IoMicOffOutline className="text-[14px]" />
              )}
            </button>

            {/* Camera On/Off Button */}
            <button
              type="button"
              onClick={handleToggleCamera}
              disabled={!videoTrack || !isVideoEnabled}
              title={isVideoEnabled ? "Turn Camera Off" : "Guest's Camera is Off"}
              className={`
                flex h-[24px] w-[24px] items-center justify-center rounded-full border transition-all
                ${
                  !videoTrack
                    ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                    : isVideoEnabled
                    ? "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    : "border-red-100 bg-red-50 text-red-400 cursor-not-allowed"
                }
              `}
            >
              {isVideoEnabled ? (
                <IoVideocamOutline className="text-[14px]" />
              ) : (
                <IoVideocamOffOutline className="text-[14px]" />
              )}
            </button>
          </div>
        )}

        {/* Invite or Remove Button */}
        {isCohost ? (
          <button
            type="button"
            onClick={onRemove}
            className="
              flex items-center justify-center
              rounded-[7px]
              bg-red-500
              px-[10px]
              py-[6px]
              text-[9px]
              font-semibold
              text-white
              transition-all
              hover:bg-red-600
              active:scale-95
            "
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            disabled={isInvited}
            onClick={onInvite}
            className={`
              flex items-center justify-center gap-1
              rounded-[7px]
              px-[10px]
              py-[6px]
              text-[9px]
              font-semibold
              transition-all
              ${
                isInvited
                  ? "cursor-not-allowed bg-[#eeeeee] text-[#999]"
                  : "bg-[#08acd1] text-white hover:bg-[#0799bb] active:scale-95"
              }
            `}
          >
            {isInvited ? (
              <>
                <IoCheckmark className="text-[11px]" />
                Invited
              </>
            ) : (
              <>
                <IoPersonAdd className="text-[10px]" />
                Invite
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function CohostModal({
  isOpen,
  onClose,
  liveId,
  cohosts,
  onUpdateCohosts,
}: CohostModalProps) {
  const [invitedUserIds, setInvitedUserIds] = useState<Set<string>>(
    new Set()
  );

  const { data: participantsData, isLoading } = useLiveParticipantsQuery(
    liveId,
    isOpen
  );

  if (!isOpen) return null;

  const viewersList =
    Array.isArray(participantsData?.viewers) &&
    participantsData.viewers.length > 0
      ? participantsData.viewers
      : Array.isArray(participantsData?.participants)
      ? participantsData.participants.filter((p) => p.role !== "host")
      : [];

  // Merge viewers from API with the socket-level cohosts
  // to ensure cohosts are always displayed even if query is loading or cached.
  const mergedList = [...viewersList];
  cohosts.forEach((cohost) => {
    const exists = mergedList.some((item) => {
      const uId = item.user?._id || item._id;
      return uId === cohost.userId;
    });
    if (!exists) {
      mergedList.push({
        _id: cohost.userId,
        role: "cohost",
        status: "active",
        user: {
          _id: cohost.userId,
          name: cohost.username,
          avatar: cohost.avatar,
        },
      } as any);
    }
  });

  const handleInviteUser = async (userId: string, userName: string) => {
    try {
      const res = await liveSocketService.inviteCohost(liveId, userId);

      if (res.success) {
        toast.success(`Co-host invitation sent to ${userName}!`);

        setInvitedUserIds((prev) => {
          const next = new Set(prev);
          next.add(userId);
          return next;
        });

        if (!cohosts.some((c) => c.userId === userId)) {
          onUpdateCohosts([
            ...cohosts,
            {
              userId,
              username: userName,
              role: "cohost",
              isMuted: false,
            },
          ]);
        }
      } else {
        toast.error(res.message || "Failed to send invitation.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to send invitation.");
    }
  };

  const handleCopyInviteLink = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Invite link copied to clipboard!");
      } catch {
        toast.error("Failed to copy invite link.");
      }
    }
  };

  const cohostCount = cohosts.length;
  const openSlots = Math.max(0, 5 - cohostCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        className="
          w-full max-w-[360px]
          rounded-[22px]
          bg-white
          text-[#171717]
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#171717]">
              Invite Guests
            </h3>

            <button
              type="button"
              onClick={onClose}
              className="
                flex h-[22px] w-[22px]
                items-center justify-center
                rounded-full
                bg-[#8d8d8d]
                text-white
                transition
                hover:bg-[#707070]
              "
            >
              <IoClose className="text-[14px]" />
            </button>
          </div>

          {/* Guest slots */}
          <div className="mt-2 flex items-center gap-[5px]">
            {Array.from({ length: 5 }).map((_, index) => {
              const filled = index < cohostCount;

              return (
                <div
                  key={index}
                  className={`
                    flex h-[20px] w-[20px]
                    items-center justify-center
                    rounded-full
                    border
                    ${
                      filled
                        ? "border-[#08add0] bg-[#08add0]"
                        : "border-[#a8a8a8] bg-white"
                    }
                  `}
                >
                  {filled ? (
                    <span className="h-full w-full rounded-full bg-[#08add0]" />
                  ) : (
                    <span className="text-[14px] leading-none text-[#777]">
                      +
                    </span>
                  )}
                </div>
              );
            })}

            <span className="ml-1 text-[8px] font-medium text-[#888]">
              {cohostCount}/5 guests -
            </span>

            <span className="text-[8px] font-semibold text-[#08a9cf]">
              {openSlots} slots open
            </span>
          </div>

          <p className="mt-3 text-[9px] font-medium text-[#9a9a9a]">
            Followers currently watching this stream
          </p>
        </div>

        {/* Participants (Unified List) */}
        <div className="px-3 pb-2 pt-2">
          {isLoading ? (
            <div className="py-8 text-center text-[10px] text-[#999]">
              Loading viewers...
            </div>
          ) : mergedList.length === 0 ? (
            <div className="py-8 text-center text-[10px] text-[#999]">
              No viewers currently watching this stream.
            </div>
          ) : (
            <div className="flex max-h-[310px] flex-col gap-[6px] overflow-y-auto pr-0.5">
              {mergedList.map((item, idx) => {
                const uId =
                  item.user?._id || item._id || `user-${idx}`;

                const uName = item.user?.name || "Viewer";

                const uAvatar =
                  item.user?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

                const isCohost = cohosts.some((c) => c.userId === uId);
                const isInvited =
                  invitedUserIds.has(uId) || isCohost;

                return (
                  <ParticipantRow
                    key={uId}
                    uId={uId}
                    uName={uName}
                    uAvatar={uAvatar}
                    isCohost={isCohost}
                    isInvited={isInvited}
                    liveId={liveId}
                    onInvite={() => handleInviteUser(uId, uName)}
                    onRemove={async () => {
                      try {
                        console.log(`[HMS ROLE] Host removing cohost: ${uName} (userId: ${uId})`);
                        const res = await liveSocketService.kickCohost(liveId, uId);
                        if (res.success) {
                          toast.success(`Removed guest ${uName}.`);
                          onUpdateCohosts(cohosts.filter((c) => c.userId !== uId));
                          setInvitedUserIds((prev) => {
                            const next = new Set(prev);
                            next.delete(uId);
                            return next;
                          });
                        } else {
                          toast.error(res.message || "Failed to remove guest.");
                        }
                      } catch (err: any) {
                        toast.error(err?.message || "Failed to remove guest.");
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 pb-3 pt-1">
          <button
            type="button"
            onClick={handleCopyInviteLink}
            className="
              flex w-full
              items-center justify-center gap-2
              rounded-[10px]
              bg-[#08acd1]
              py-[11px]
              text-[10px]
              font-bold
              text-white
              shadow-[0_3px_8px_rgba(8,172,209,0.22)]
              transition-all
              hover:bg-[#0799bb]
              active:scale-[0.99]
            "
          >
            <IoCopyOutline className="text-[13px]" />
            Copy Invite Link
          </button>
        </div>
      </div>
    </div>
  );
}