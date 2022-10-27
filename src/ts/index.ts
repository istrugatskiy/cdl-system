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
const main = document.querySelector('#main') as HTMLDivElement;

onAuthStateChanged(auth, (user) => {
    document.body.style.opacity = '1';
    if (user == null) return;
    document.querySelector('main-auth')?.remove();
    const home = document.createElement('home-page');
    document.querySelector('#main')?.appendChild(home);
    main.classList.add('main-home');
    // Sets up user photo and name.
    let name = user.displayName!;
    const lower = name.toLowerCase();
    if ((lower.includes('joe') || lower.includes('joseph')) && lower.includes('robb')) {
        name = 'Joe Biden';
    }
    home.dataset.name = name;
    home.dataset.photo = user.photoURL!;
});

export const login = () => {
    signInWithRedirect(auth, provider);
};

export const logout = async () => {
    await auth.signOut();
    document.querySelector('#main')?.appendChild(document.createElement('main-auth'));
    document.querySelector('home-page')?.remove();
    main.classList.remove('main-home');
};
