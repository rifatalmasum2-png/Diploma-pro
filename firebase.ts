
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'BEZaZnuz6S4jK3IePvp_cmclIU5LAZEjU5-jC2IBtWaL_KnSEyrzBikUpO038CXmS39i7JWXlhFGcEr1klIRP3M'
    });
    if (currentToken) {
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
