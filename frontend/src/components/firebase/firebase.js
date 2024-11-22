import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAtQCse5GKvJOwziPJP9sKJJQedPKTl8Tg",
  authDomain: "mew-project-61e24.firebaseapp.com",
  projectId: "mew-project-61e24",
  storageBucket: "mew-project-61e24.firebasestorage.app",
  messagingSenderId: "289606729074",
  appId: "1:289606729074:web:84fe2cfccec0ddcae871eb",
  measurementId: "G-X66CB6JNYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export default app;