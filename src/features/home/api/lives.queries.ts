import { useQuery } from "@tanstack/react-query";
import { fetchLiveStreamsAPI } from "./lives.service";
// export const liveKeys = {
//   all: ["lives"] as const,
// };

export function useLivesQuery(category?: string) {
  return useQuery({
    queryKey: ["lives", category || "All"],
    queryFn: () => fetchLiveStreamsAPI(category),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}