import { useQuery } from "@tanstack/react-query";
import { fetchLiveParticipants, LiveParticipantsResponse } from "./live-participants.service";

export const liveParticipantsKeys = {
  all: ["live-participants"] as const,
  detail: (liveId: string) => [...liveParticipantsKeys.all, liveId] as const,
};

export function useLiveParticipantsQuery(liveId: string, enabled: boolean = true) {
  return useQuery<LiveParticipantsResponse>({
    queryKey: liveParticipantsKeys.detail(liveId),
    queryFn: () => fetchLiveParticipants(liveId),
    enabled: Boolean(liveId) && enabled,
    staleTime: 1000 * 10,
  });
}
