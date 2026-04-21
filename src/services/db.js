import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  setDoc,
  getDocs,
  limit
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

export const dbService = {
  // --- Servers & Channels ---
  subscribeToServers: (callback, onError) => {
    return onSnapshot(collection(db, "servers"), (snapshot) => {
      const servers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(servers);
    }, (err) => {
      if (onError) onError(err);
      else console.error("Firestore Servers Error:", err);
    });
  },

  subscribeToChannels: (serverId, callback, onError) => {
    const q = query(collection(db, "channels"), where("serverId", "==", serverId));
    return onSnapshot(q, (snapshot) => {
      const channels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(channels);
    }, (err) => {
      if (onError) onError(err);
      else console.error("Firestore Channels Error:", err);
    });
  },

  // --- Messages ---
  subscribeToMessages: (targetId, callback, onError) => {
    // Simplified query to avoid composite index requirement on first run
    const q = query(
      collection(db, "messages"), 
      where("targetId", "==", targetId),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          time: data.timestamp?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'just now'
        };
      }).sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)); // Sort locally first
      callback(messages);
    }, (err) => {
      if (onError) onError(err);
      else console.error("Firestore Messages Error:", err);
    });
  },

  sendMessage: async (targetId, userId, userName, content) => {
    try {
      await addDoc(collection(db, "messages"), {
        targetId,
        user: userName,
        userId,
        content,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("SendMessage Error:", error);
    }
  },

  // --- DMs ---
  subscribeToDMs: (userId, callback, onError) => {
    const q = query(collection(db, "dms"), where("participantIds", "array-contains", userId));
    return onSnapshot(q, (snapshot) => {
      const dms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(dms);
    }, (err) => {
      if (onError) onError(err);
      else console.error("Firestore DMs Error:", err);
    });
  },

  // --- User Presence & Profile ---
  updateUserStatus: async (userId, status) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { status, lastActive: serverTimestamp() });
  }
};
