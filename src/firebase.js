import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAAJ0T2wcbu6UxTgwxzOcGw6n_AvlLDTVU",
    authDomain: "images-storage-55af2.firebaseapp.com",
    projectId: "images-storage-55af2",
    storageBucket: "images-storage-55af2.appspot.com",
    messagingSenderId: "1016687259649",
    appId: "1:1016687259649:web:7c69468ab42b1f4cb3d000",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
