import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth';

initializeApp({
    apiKey: 'AIzaSyCteV4EPIhgZeqMlULv99ik5CEkDgbAXug',
    authDomain: 'system-collab-garbage.firebaseapp.com',
    projectId: 'system-collab-garbage',
    storageBucket: 'system-collab-garbage.appspot.com',
    messagingSenderId: '850555490171',
    appId: '1:850555490171:web:c9fcde8096e3ec7dc077de',
    measurementId: 'G-EDL6169ESW',
});

const provider = new GoogleAuthProvider();
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user == null) return;
    document.querySelector('main-auth')?.remove();
    const home = document.createElement('home-page');
    document.querySelector('#main')?.appendChild(home);
    home.dataset.name = user.displayName!;
});

export const login = () => {
    signInWithRedirect(auth, provider);
};

export const logout = async () => {
    await auth.signOut();
    document.querySelector('#main')?.appendChild(document.createElement('main-auth'));
    document.querySelector('home-page')?.remove();
};
