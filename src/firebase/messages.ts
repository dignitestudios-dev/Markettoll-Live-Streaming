import { onMessage, MessagePayload } from "firebase/messaging";
import { getMessagingInstance } from "./firebase";

export const onMessageListener = async (): Promise<MessagePayload | null> => {
  if (typeof window === "undefined") return null;

  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    });
  } catch (err) {
    console.error("Error setting onMessage listener:", err);
    return null;
  }
};
