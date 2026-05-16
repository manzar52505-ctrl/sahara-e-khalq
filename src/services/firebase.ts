import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore,
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  setDoc,
  query,
  orderBy,
  where,
  Timestamp,
  getDocFromServer,
  onSnapshot
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { OperationType, FirestoreErrorInfo } from '../types';

import { uploadToCloudinary } from './cloudinary';

console.log('[Firebase] Initializing with config:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);

// Use initializeFirestore instead of getFirestore to enable forced long polling
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

// Monitor Auth State
onSnapshot(doc(db, 'campaigns', 'connection_test_ping'), () => {}, (err) => {
  console.log('[AuthMonitor] Connection status error:', err.code);
});

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(`[AuthUpdate] Logged in as: ${user.email} (${user.uid})`);
  } else {
    console.log('[AuthUpdate] User is logged out');
  }
});

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const message = error instanceof Error ? error.message : String(error);
  
  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };

  console.error(`[Firebase ${operationType}] Error on ${path}:`, message);
  throw new Error(message);
}

// Image Upload - Wrapper for the new service
export const uploadImage = async (
  file: File, 
  _folder: string, // Kept for interface compatibility
  onProgress?: (progress: number) => void
): Promise<string> => {
  return uploadToCloudinary(file, onProgress);
};

export const deleteImage = async (_url: string) => {
  // Client-side deletion requires signature/API secret which is unsafe.
  // We will let Cloudinary manage storage or implement a production-safe backend later.
  console.log('TRACE: deleteImage [SKIP] Client-side deletion skipped for safety');
};

// Campaigns
export const subscribeToCampaigns = (callback: (data: any[]) => void) => {
  const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'campaigns');
  });
};

export const addCampaign = async (data: any) => {
  const path = 'campaigns';
  console.log(`TRACE: addCampaign [STEP 1] Starting...`);
  
  if (!auth.currentUser) {
    console.error('TRACE: addCampaign [ABORT] No user session');
    throw new Error('Authentication required.');
  }
  
  const campaignData = {
    ...data,
    ownerId: auth.currentUser.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Sanitize data
  Object.keys(campaignData).forEach(key => {
    if (campaignData[key] === undefined) delete campaignData[key];
  });

  try {
    const docRef = await addDoc(collection(db, path), campaignData);
    console.log(`TRACE: addCampaign [STEP 4] SUCCESS! ID: ${docRef.id}`);
    return docRef.id;
  } catch (error: any) {
    console.error(`TRACE: addCampaign [FATAL]`, error);
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const updateCampaign = async (id: string, data: any) => {
  const path = `campaigns/${id}`;
  try {
    const docRef = doc(db, 'campaigns', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const deleteCampaign = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'campaigns', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `campaigns/${id}`);
  }
};

// Quick Connection Check
export const checkFirestoreConnection = async () => {
  try {
    const docRef = doc(db, 'campaigns', 'connection_test_ping'); 
    await getDocFromServer(docRef).catch(() => null);
    return { ok: true, message: 'Connected to Database' };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
};

export const checkStorageConnection = async () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return { ok: false, message: 'Cloudinary Cloud Name missing' };
  return { ok: true, message: 'Cloudinary Ready' };
};

// Simplified Gallery & News
export const subscribeToGallery = (callback: (data: any[]) => void) => {
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'gallery'));
};

export const addGalleryItem = async (data: any) => {
  const path = 'gallery';
  const itemData = {
    ...data,
    ownerId: auth.currentUser?.uid,
    createdAt: new Date().toISOString(),
  };
  try {
    const docRef = await addDoc(collection(db, path), itemData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const deleteGalleryItem = async (id: string) => {
  await deleteDoc(doc(db, 'gallery', id)).catch(err => handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`));
};

export const subscribeToNews = (callback: (data: any[]) => void) => {
  const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'news'));
};

export const addNews = async (data: any) => {
  const path = 'news';
  const newsData = {
    ...data,
    ownerId: auth.currentUser?.uid,
    createdAt: new Date().toISOString(),
  };
  try {
    const docRef = await addDoc(collection(db, path), newsData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const deleteNews = async (id: string) => {
  await deleteDoc(doc(db, 'news', id)).catch(err => handleFirestoreError(err, OperationType.DELETE, `news/${id}`));
};

// Stats
export const subscribeToStats = (callback: (data: any) => void) => {
  const docRef = doc(db, 'stats', 'main');
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback({ totalDonations: 0, totalVolunteers: 0 });
    }
  }, (error) => handleFirestoreError(error, OperationType.GET, 'stats/main'));
};

export const updateStats = async (data: any) => {
  const docRef = doc(db, 'stats', 'main');
  await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true })
    .catch(err => handleFirestoreError(err, OperationType.WRITE, 'stats/main'));
};
