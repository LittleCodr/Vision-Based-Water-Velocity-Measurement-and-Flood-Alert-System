import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase admin credentials. Check env vars.');
}
const serviceAccount = {
    projectId,
    clientEmail,
    privateKey
};
if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
        storageBucket
    });
}
export const authAdmin = getAuth();
export const db = getFirestore();
export const storage = getStorage().bucket();
