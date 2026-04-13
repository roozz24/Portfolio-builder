import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5qj6H486dU2xq0mrBu5wd4OKZwZ3Dm-4",
  authDomain: "portfolio-builder-7728e.firebaseapp.com",
  projectId: "portfolio-builder-7728e",
  storageBucket: "portfolio-builder-7728e.firebasestorage.app",
  messagingSenderId: "999142929712",
  appId: "1:999142929712:web:4eda8fee07c2ac143044f5",
  measurementId: "G-RM9HL1NYTB"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);