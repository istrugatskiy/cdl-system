import { initializeApp } from 'firebase/app';
import { onBackgroundMessage, getMessaging } from 'firebase/messaging/sw';

const app = initializeApp({
    apiKey: 'AIzaSyCteV4EPIhgZeqMlULv99ik5CEkDgbAXug',
    authDomain: 'system-collab-garbage.firebaseapp.com',
    projectId: 'system-collab-garbage',
    storageBucket: 'system-collab-garbage.appspot.com',
    messagingSenderId: '850555490171',
    appId: '1:850555490171:web:c9fcde8096e3ec7dc077de',
    measurementId: 'G-EDL6169ESW',
});
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
});
