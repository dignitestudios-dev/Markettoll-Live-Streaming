import { useQuery } from "@tanstack/react-query";
import { fetchLiveStreamsAPI } from "./lives.service";
// export const liveKeys = {
//   all: ["lives"] as const,
// };

export function useLivesQuery() {
  return useQuery({
    queryKey: ["lives"],
    queryFn: fetchLiveStreamsAPI,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}