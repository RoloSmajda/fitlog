import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC0qWZO6qJhQmSykTfc_UGyEo2pF3Mkme0",
  authDomain: "workout-app-5e841.firebaseapp.com",
  projectId: "workout-app-5e841",
  storageBucket: "workout-app-5e841.appspot.com",
  messagingSenderId: "927228264495",
  appId: "1:927228264495:web:09d6509e6b910a962786da",
  measurementId: "G-5J820E18NH"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInGoogle = async () => {
    let result = await signInWithPopup(auth, provider);
    return result;
};
