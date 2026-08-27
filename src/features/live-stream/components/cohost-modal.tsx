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
  IoRefreshOutline,
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
  profileImage: string;
  isCohost: boolean;
  isInvited: boolean;
  liveId: string;
  onInvite: () => void;
  onRemove: () => void;
}

function ParticipantRow({
  uId,
  uName,
  profileImage,
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

  const handleToggleMute = async () => {
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
            src={profileImage}
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

  React.useEffect(() => {
    const socket = liveSocketService.connect();

    const handleCohostRejected = (data: any) => {
      const userId = data?.data?.userId;
      if (userId) {
        setInvitedUserIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    };

    const handleCohostRemoved = (data: any) => {
      const userId = data?.data?.userId;
      if (userId) {
        setInvitedUserIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    };

    const handleCohostAdded = (data: any) => {
      const resData = data?.data || data;
      const userId = resData?.userId || resData?.user?._id || resData?._id;
      if (userId) {
        setInvitedUserIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    };

    socket.on("live:cohost-rejected", handleCohostRejected);
    socket.on("live:cohost-removed", handleCohostRemoved);
    socket.on("live:cohost-added", handleCohostAdded);

    return () => {
      socket.off("live:cohost-rejected", handleCohostRejected);
      socket.off("live:cohost-removed", handleCohostRemoved);
      socket.off("live:cohost-added", handleCohostAdded);
    };
  }, []);

  const {
    data: participantsData,
    isLoading,
    isFetching,
    refetch,
  } = useLiveParticipantsQuery(liveId, isOpen);

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
          profileImage: cohost.avatar,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div
        className="
          w-full max-w-[420px]
          rounded-[28px]
          bg-white
          text-[#171717]
          shadow-[0_25px_80px_rgba(0,0,0,0.45)]
          ring-1 ring-black/5
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="relative bg-gradient-to-b from-[#f3fbfd] to-white px-6 pt-6 pb-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-extrabold tracking-tight text-[#101010]">
              Invite Guests
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                title="Refresh viewers list"
                aria-label="Refresh viewers"
                className="
                  flex h-[30px] w-[30px]
                  items-center justify-center
                  rounded-full
                  bg-[#efefef]
                  text-[#4b4b4b]
                  transition
                  hover:bg-[#e2e2e2]
                  active:scale-95
                  disabled:opacity-60
                  cursor-pointer
                "
              >
                <IoRefreshOutline
                  className={`text-[17px] ${
                    isFetching ? "animate-spin text-[#0098EA]" : ""
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="
                  flex h-[30px] w-[30px]
                  items-center justify-center
                  rounded-full
                  bg-[#efefef]
                  text-[#4b4b4b]
                  transition
                  hover:bg-[#e2e2e2]
                  active:scale-95
                  cursor-pointer
                "
              >
                <IoClose className="text-[17px]" />
              </button>
            </div>
          </div>

          {/* Guest slots */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center -space-x-1.5">
              {Array.from({ length: 5 }).map((_, index) => {
                const filled = index < cohostCount;

                return (
                  <div
                    key={index}
                    className={`
                      flex h-[28px] w-[28px]
                      items-center justify-center
                      rounded-full
                      border-2
                      ring-2 ring-white
                      transition-all
                      ${
                        filled
                          ? "border-[#08add0] bg-gradient-to-br from-[#0ecbef] to-[#0891b0] shadow-[0_2px_6px_rgba(8,173,208,0.45)]"
                          : "border-dashed border-[#c6c6c6] bg-[#fafafa]"
                      }
                    `}
                  >
                    {!filled && (
                      <span className="text-[15px] leading-none text-[#b0b0b0]">
                        +
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="ml-2 flex flex-col leading-tight">
              <span className="text-[12px] font-semibold text-[#3a3a3a]">
                {cohostCount}/5 guests
              </span>
              <span className="text-[11px] font-medium text-[#08a9cf]">
                {openSlots} {openSlots === 1 ? "slot" : "slots"} open
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-[12px] font-medium text-[#9a9a9a]">
              Followers currently watching this stream
            </p>
            {isFetching && !isLoading && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#08a9cf] animate-pulse">
                <IoRefreshOutline className="animate-spin text-xs" />
                Updating...
              </span>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-[#f0f0f0]" />

        {/* Participants (Unified List) */}
        <div className="px-4 pb-3 pt-4">
          {isLoading ? (
            <div className="py-12 text-center text-[13px] text-[#999] flex flex-col items-center justify-center gap-2">
              <IoRefreshOutline className="animate-spin text-lg text-[#08a9cf]" />
              <span>Loading viewers...</span>
            </div>
          ) : mergedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <p className="text-[13px] text-[#999]">
                No viewers currently watching this stream.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#f0f9fc] px-3.5 py-1.5 text-xs font-semibold text-[#08a9cf] hover:bg-[#e0f4fa] transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <IoRefreshOutline
                  className={`text-sm ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh List
              </button>
            </div>
          ) : (
            <div className="flex max-h-[360px] flex-col gap-2 overflow-y-auto pr-1">
              {mergedList.map((item, idx) => {
                const uId =
                  item.user?._id || item._id || `user-${idx}`;

                const uName = item.user?.name || "Viewer";

                const uAvatar =
                  item.user?.profileImage ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

                const isCohost = cohosts.some((c) => c.userId === uId);
                const isInvited =
                  invitedUserIds.has(uId) || isCohost;

                return (
                  <ParticipantRow
                    key={uId}
                    uId={uId}
                    uName={uName}
                    profileImage={uAvatar}
                    isCohost={isCohost}
                    isInvited={isInvited}
                    liveId={liveId}
                    onInvite={() => handleInviteUser(uId, uName)}
                    onRemove={async () => {
                      try {
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
        <div className="px-4 pb-5 pt-2">
          <button
            type="button"
            onClick={handleCopyInviteLink}
            className="
              flex w-full
              items-center justify-center gap-2.5
              rounded-[14px]
              bg-gradient-to-r from-[#0ecbef] to-[#08acd1]
              py-[14px]
              text-[13px]
              font-bold
              tracking-wide
              text-white
              shadow-[0_6px_16px_rgba(8,172,209,0.35)]
              transition-all
              hover:brightness-105 hover:shadow-[0_8px_20px_rgba(8,172,209,0.45)]
              active:scale-[0.98]
            "
          >
            <IoCopyOutline className="text-[16px]" />
            Copy Invite Link
          </button>
        </div>
      </div>
    </div>
  );
}