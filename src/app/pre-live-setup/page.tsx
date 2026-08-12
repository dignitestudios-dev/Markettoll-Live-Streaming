import React from "react";
import PreStreamSetupView from "@/features/pre-stream-setup/components/pre-stream-setup-view";

export const metadata = {
  title: "Pre-Live Setup | Markettoll",
  description: "Verify your camera, microphone, and stream settings before going live.",
};

export default function PreLiveSetupPage() {
  return <PreStreamSetupView />;
}
