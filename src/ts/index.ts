import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth';
import { accountManagerPopup, addDevicePopup } from './constant-refs';
import { getMessaging, getToken } from 'firebase/messaging';
import { getFirestore, doc, updateDoc, getDoc, setDoc, onSnapshot, DocumentReference } from 'firebase/firestore';
import './popup';
import './manage-device';

// Initialize Firebase.
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
const db = getFirestore();
let unsub: () => void;
export let userRef: DocumentReference | undefined;

// Handles authState and related animations.
onAuthStateChanged(auth, async (user) => {
    document.body.style.opacity = '1';
    if (user == null) {
        accountManagerPopup.close();
        addDevicePopup.close();
        return;
    }
    if (!userRef) {
        userRef = doc(db, 'users', user.uid);
    }
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
    home.dataset.uid = user.uid;
    setupMessaging();
    unsub = onSnapshot(userRef, (doc) => {
        const data = doc.data();
        if (data == null) {
            return;
        }
        home.deviceList = data.devices;
    });
});

const setupMessaging = async () => {
    // This is scuffed but it works.
    (await navigator.serviceWorker.getRegistrations()).forEach((reg) => {
        reg.unregister();
    });
    if (!userRef) {
        userRef = doc(db, 'users', auth.currentUser!.uid);
    }
    const sw = await navigator.serviceWorker.register(new URL('sw.ts', import.meta.url), { type: 'module' });
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: 'BCQInMtzJKJTH9lcDgDpGjKMSRKdar1nu0AUNHD7b7ShTDssKlG1HrsuQalnYHqXljdcsoNe_bBW2SVv9Wkh87k', serviceWorkerRegistration: sw }).then(async (token) => {
        const current = (await getDoc(userRef!)).data()!;
        console.log(current);
        if (current?.notificationId) {
            await updateDoc(userRef!, { notificationId: token });
            return;
        }
        await setDoc(userRef!, { notificationId: token });
    });
};

export const login = () => {
    signInWithRedirect(auth, provider);
};

export const logout = async () => {
    await auth.signOut();
    document.querySelector('#main')?.appendChild(document.createElement('main-auth'));
    document.querySelector('home-page')?.remove();
    main.classList.remove('main-home');
};

export const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export function assert(condition: boolean, message: string): asserts condition is true {
    if (!condition) {
        throw new Error(message);
    }
}

// Error handling.
// Really poorly written code.
// Github copilot did it.
export const handleError = (e: Error) => {
    if (document.getElementById('engine_fatal_error') == null) {
        console.error('Failed to find engine_fatal_error element.');
        return;
    }
    console.error(e);
    console.trace('Call stack:');
    document.getElementById('engine_fatal_error')?.classList.remove('hidden');
    if (document.getElementById('engine_error_message') == null) {
        console.error('Failed to find engine_error_message element.');
        return;
    }
    const error = new Error();
    document.getElementById('engine_error_message')!.textContent = `Error Message: ${e.toString()}`;
    document.getElementById('engine_error_stack')!.textContent = error.stack?.toString().replaceAll('\n', '\r\n') ?? 'No stack trace available.';
};
window.addEventListener('error', (e) => handleError(e.error));
