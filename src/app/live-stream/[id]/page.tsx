import React from "react";
import LiveStreamPageView from "@/features/live-stream/components/live-stream-page-view";

export const metadata = {
  title: "Live Stream Broadcast | Markettoll",
  description: "Live video shopping broadcast powered by Markettoll.",
};

export default function DynamicLiveStreamPage() {
  return <LiveStreamPageView />;
}
