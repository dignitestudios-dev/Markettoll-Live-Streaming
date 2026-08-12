importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyD8us3uTEnm7u43cqJHTVRCzaSHC2PzKNA",
  authDomain: "markettoll-12722.firebaseapp.com",
  databaseURL: "https://markettoll-12722-default-rtdb.firebaseio.com",
  projectId: "markettoll-12722",
  storageBucket: "markettoll-12722.firebasestorage.app",
  messagingSenderId: "415697624629",
  appId: "1:415697624629:web:bdb82c4ee69379c463db7c",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/logo-white.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
