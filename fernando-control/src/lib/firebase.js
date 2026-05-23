import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqhx9sjYpiS-AblhYW66-X8vM8oFLm82Y",
  authDomain: "fernando-control.firebaseapp.com",
  projectId: "fernando-control",
  storageBucket: "fernando-control.firebasestorage.app",
  messagingSenderId: "976395016858",
  appId: "1:976395016858:web:bbdfe8fa1f7c46f8a51d23"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
