import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCQUaib_ZeNSBgIL2AEmvSSo6_ka4IXRfo",
  authDomain: "shopez-17906.firebaseapp.com",
  databaseURL: "https://shopez-17906-default-rtdb.firebaseio.com", 
  projectId: "shopez-17906",
  storageBucket: "shopez-17906.firebasestorage.app",
  messagingSenderId: "667823011227",
  appId: "1:667823011227:web:29b49f7fd902f50899dd3e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
