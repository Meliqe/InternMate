import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBlBOtMN1BPm3fZx3mcKlr_ly7V4CI_abA",
    authDomain: "internmate-8a634.firebaseapp.com",
    projectId: "internmate-8a634",
    storageBucket: "internmate-8a634.appspot.com",
    messagingSenderId: "943849649937",
    appId: "1:943849649937:web:8104206a98f2dc37e4beb0"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
