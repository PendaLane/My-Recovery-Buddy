import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { UserProfile, JournalEntry, MeetingLog, Contact, StepWork, Badge, Streak } from '../types';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBJ0PAdWplp8X_VJSb5_viJoyF_CWqCtX0",
  authDomain: "myrecoverybuddy-25e3c.firebaseapp.com",
  projectId: "myrecoverybuddy-25e3c",
  storageBucket: "myrecoverybuddy-25e3c.firebasestorage.app",
  messagingSenderId: "543776149340",
  appId: "1:543776149340:web:2b8587b843bc8e5c7e7b99",
  measurementId: "G-RWFF57D95P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- TYPES FOR WORDPRESS STATE ---
export interface WPState {
  logs: MeetingLog[];
  contacts: Contact[];
  sponsors: StepWork[];
  sobrietyDate: string | null;
  badges: Badge[];
  streak: Streak;
  journalCount: number;
  chatCount: number;
}

// --- WORDPRESS & AUTH SERVICE ---

export const getCurrentUser = async (): Promise<UserProfile> => {
  // Check if we are in a WP environment by looking for the body class
  const isWpLoggedIn = document.body.classList.contains("logged-in");
  
  if (!isWpLoggedIn) {
    return {
      id: 'guest',
      displayName: 'Guest',
      email: '',
      avatar: 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g',
      isLoggedIn: false
    };
  }

  try {
    const res = await fetch("/wp-json/wp/v2/users/me", { credentials: "include" });
    if (!res.ok) throw new Error("Not logged in");
    const user = await res.json();
    
    return {
      id: String(user.id || "wp"),
      displayName: user.name || user.username || "Member",
      email: user.email || "",
      avatar: (user.avatar_urls && user.avatar_urls["96"]) ? user.avatar_urls["96"] : "https://secure.gravatar.com/avatar/?s=96&d=mm&r=g",
      isLoggedIn: true
    };
  } catch (e) {
    console.warn("WP User fetch failed, defaulting to guest", e);
    return {
      id: 'guest',
      displayName: 'Guest',
      email: '',
      avatar: 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g',
      isLoggedIn: false
    };
  }
};

// --- DATA SYNC SERVICE ---

const DEFAULT_STATE: WPState = {
  logs: [],
  contacts: [],
  sponsors: [],
  sobrietyDate: null,
  badges: [],
  streak: { current: 0, longest: 0, lastCheckInDate: null },
  journalCount: 0,
  chatCount: 0
};

export const loadState = async (isLoggedIn: boolean): Promise<WPState> => {
  if (!isLoggedIn) {
    // Attempt to load from localStorage as fallback
    const local = localStorage.getItem('mrb_local_state');
    return local ? { ...DEFAULT_STATE, ...JSON.parse(local) } : DEFAULT_STATE;
  }

  try {
    const res = await fetch("/wp-json/mrb/v1/state", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      return { ...DEFAULT_STATE, ...data };
    }
    throw new Error("API Error");
  } catch (e) {
    console.warn("Error loading MRB state from WP, falling back to local", e);
    const local = localStorage.getItem('mrb_local_state');
    return local ? { ...DEFAULT_STATE, ...JSON.parse(local) } : DEFAULT_STATE;
  }
};

export const saveState = async (state: WPState, isLoggedIn: boolean): Promise<void> => {
  // Always save locally as backup
  localStorage.setItem('mrb_local_state', JSON.stringify(state));

  if (!isLoggedIn) return;

  try {
    await fetch("/wp-json/mrb/v1/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(state)
    });
  } catch (e) {
    console.error("Error saving MRB state to WP", e);
  }
};

// --- FIREBASE JOURNAL SERVICE ---

export const saveJournalEntryToFirebase = async (entry: JournalEntry, user: UserProfile) => {
  if (!user.isLoggedIn || user.id === 'guest') {
    // Only save locally if guest
    return;
  }

  try {
    await addDoc(collection(db, "journals"), {
      userId: user.id,
      displayName: user.displayName,
      mood: entry.mood,
      text: entry.text,
      aiReflection: entry.aiReflection,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Error saving journal to Firebase", e);
    throw e;
  }
};

export const subscribeToJournals = (user: UserProfile, callback: (entries: JournalEntry[]) => void) => {
  if (!user.isLoggedIn || user.id === 'guest') {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "journals"),
    where("userId", "==", user.id),
    orderBy("createdAt", "desc"),
    limit(20)
  );

  return onSnapshot(q, (snap) => {
    const entries: JournalEntry[] = [];
    snap.forEach((doc) => {
      const d = doc.data();
      entries.push({
        id: doc.id,
        date: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : new Date().toISOString(),
        mood: d.mood,
        text: d.text,
        aiReflection: d.aiReflection,
        userId: d.userId
      });
    });
    callback(entries);
  });
};
