
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCEN34Xj_82fgj-_LZZ6JdZWi81LRL594Y',
  authDomain: 'diplomapro-e2f6e.firebaseapp.com',
  projectId: 'diplomapro-e2f6e',
  storageBucket: 'diplomapro-e2f6e.firebasestorage.app',
  messagingSenderId: '865900203774',
  appId: '1:865900203774:web:4eb80406e112057ce61faf',
  measurementId: 'G-ERE1PS1WSJ'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
