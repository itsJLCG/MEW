importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAtQCse5GKvJOwziPJP9sKJJQedPKTl8Tg",
  authDomain: "mew-project-61e24.firebaseapp.com",
  projectId: "mew-project-61e24",
  storageBucket: "mew-project-61e24.firebasestorage.app",
  messagingSenderId: "289606729074",
  appId: "1:289606729074:web:84fe2cfccec0ddcae871eb",
  measurementId: "G-X66CB6JNYR"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Update Status';
  const notificationOptions = {
    body: `Dear Customer, ${payload.data.message}`,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});