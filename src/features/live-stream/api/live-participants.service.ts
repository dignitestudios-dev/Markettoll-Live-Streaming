import axiosInstance from "@/lib/axios";

export interface ParticipantUser {
  _id: string;
  name?: string;
  avatar?: string;
}

export interface ParticipantItem {
  _id: string;
  user?: ParticipantUser;
  role: string;
  status: string;
}

export interface LiveParticipantsResponse {
  host?: ParticipantItem;
  coHosts?: ParticipantItem[];
  viewers?: ParticipantItem[];
  participants?: ParticipantItem[];
  totalParticipants?: number;
  activeParticipants?: number;
  coHostCount?: number;
  viewerCount?: number;
}

export async function fetchLiveParticipants(liveId: string): Promise<LiveParticipantsResponse> {
  const response = await axiosInstance.get(`/lives/${liveId}/participants`);
  return response.data?.data || {};
}
