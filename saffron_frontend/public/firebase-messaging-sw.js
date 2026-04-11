// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyCaUD_HCYJfOeGDwM6VEIcsGFtpqKhgJcw",
  authDomain: "zprincess-saffron.firebaseapp.com",
  projectId: "zprincess-saffron",
  storageBucket: "zprincess-saffron.firebasestorage.app",
  messagingSenderId: "644557349672",
  appId: "1:644557349672:web:b8b9295e0baac46377a61d"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || "Notification";
  const notificationOptions = {
    body: payload.notification.body || "You have a new message",
    icon: payload.notification.icon || '/logo192.png', // Fallback icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
