import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
console.log(process.env);

const firebaseConfig = {
  apiKey: "AIzaSyB7S-p-5ymg2VkkE4kanqNTeLVA94cG3Ck",
  authDomain: "fir-expo-13336.firebaseapp.com",
  projectId: "fir-expo-13336",
  storageBucket: "fir-expo-13336.appspot.com",
  messagingSenderId: "190676815337",
  appId: "1:190676815337:web:f15f00583c4d53c63d8f78",
  measurementId: "G-Y83QPF3Y0V",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db=getFirestore(app)
export const imageStorage=getStorage(app)

export default app;
