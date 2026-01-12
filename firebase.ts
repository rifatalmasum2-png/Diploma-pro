
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyCEN34Xj_82fgj-_LZZ6JdZWi81LRL594Y',
  authDomain: 'diplomapro-e2f6e.firebaseapp.com',
  projectId: 'diplomapro-e2f6e',
  storageBucket: 'diplomapro-e2f6e.firebasestorage.app',
  messagingSenderId: '865900203774',
  appId: '1:865900203774:web:4eb80406e112057ce61faf',
  measurementId: 'G-ERE1PS1WSJ'
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
