import { getToken } from "firebase/messaging";
import { getMessagingInstance } from "./firebase";

let fcmTokenPromise: Promise<string | null> | null = null;

const getFcmToken = async (): Promise<string | null> => {
  // 1. SSR & Browser Capability Checks
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    !window.isSecureContext
  ) {
    return null;
  }

  // 2. Return cached token if already retrieved
  const existingToken = localStorage.getItem("fcmToken");
  if (existingToken) {
    return existingToken;
  }

  // 3. Deduplicate concurrent calls (Singleton Lock)
  if (fcmTokenPromise) {
    return fcmTokenPromise;
  }

  fcmTokenPromise = (async () => {
    try {
      // 4. Check notification permission
      let permission = Notification.permission;
      if (permission === "default") {
        permission = await Notification.requestPermission();
      }

      if (permission !== "granted") {
        console.warn("Notification permission was not granted:", permission);
        return null;
      }

      // 5. Get Messaging instance safely
      const messaging = await getMessagingInstance();
      if (!messaging) {
        console.warn("Firebase Messaging instance unavailable.");
        return null;
      }

      // 6. Explicitly register Service Worker
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
        scope: "/firebase-cloud-messaging-push-scope",
      });

      // 7. Get FCM token passing serviceWorkerRegistration
      const token = await getToken(messaging, {
        vapidKey:
          process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
          "BKGaHhuqh_eiZAL-zfFX8S1sONZ3733G8-yIlchOxgUpayZmAF7RUQyCgN2Uoh3_ql1X55_IMiK0x9_fcFhcEOY",
        serviceWorkerRegistration: registration,
      });

      if (token) {
        localStorage.setItem("fcmToken", token);
        return token;
      }

      return null;
    } catch (err) {
      console.error("Error getting FCM token:", err);
      return null;
    } finally {
      fcmTokenPromise = null;
    }
  })();

  return fcmTokenPromise;
};

export { getFcmToken };
