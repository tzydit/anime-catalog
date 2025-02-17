import { initializeApp, getApps, getApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3LOcrx-32CoVeJphp42MiWwHJ_nRWwmY",
  authDomain: "anime-catalog-1af03.firebaseapp.com",
  projectId: "anime-catalog-1af03",
  storageBucket: "anime-catalog-1af03.appspot.com", 
  messagingSenderId: "291110845495",
  appId: "1:291110845495:web:0a36fa538fb8624983d3b2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { app, auth, db, storage };
