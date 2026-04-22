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
  limit,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  deleteField
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

  createServer: async (name, ownerId, iconName = 'Hash') => {
    try {
      const docRef = await addDoc(collection(db, "servers"), {
        name,
        ownerId,
        iconName,
        createdAt: serverTimestamp(),
        members: [ownerId],
        memberRoles: { [ownerId]: 'owner' },
        acronym: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      });
      // Create a default general channel
      await addDoc(collection(db, "channels"), {
        name: "general",
        serverId: docRef.id,
        type: "text",
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("CreateServer Error:", error);
      throw error;
    }
  },

  createChannel: async (serverId, name, type = "text") => {
    try {
      const docRef = await addDoc(collection(db, "channels"), {
        serverId,
        name,
        type,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("CreateChannel Error:", error);
      throw error;
    }
  },

  updateServer: async (serverId, data) => {
    try {
      const serverRef = doc(db, "servers", serverId);
      await updateDoc(serverRef, data);
    } catch (error) {
      console.error("UpdateServer Error:", error);
      throw error;
    }
  },

  // --- Messages ---
  subscribeToMessages: (targetId, callback, onError) => {
    let currentUnsub = null;
    const q = query(
      collection(db, "messages"), 
      where("targetId", "==", targetId),
      orderBy("timestamp", "asc"),
      limit(100)
    );
    
    const startSubscription = (queryToUse, isFallback = false) => {
      return onSnapshot(queryToUse, (snapshot) => {
        const messages = snapshot.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            time: data.timestamp?.toDate()?.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) || 'just now'
          };
        });
        
        if (isFallback) {
          messages.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
        }
        
        callback(messages);
      }, (err) => {
        if (!isFallback && err.code === 'failed-precondition') {
          console.warn("Firestore: Composite index missing for messages. Falling back to local sort.");
          const fallbackQ = query(collection(db, "messages"), where("targetId", "==", targetId), limit(100));
          if (currentUnsub) currentUnsub();
          currentUnsub = startSubscription(fallbackQ, true);
        } else {
          if (onError) onError(err);
          else console.error("Firestore Messages Error:", err);
        }
      });
    };

    currentUnsub = startSubscription(q);
    return () => { if (currentUnsub) currentUnsub(); };
  },

  deleteMessage: async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
    } catch (error) {
      console.error("DeleteMessage Error:", error);
      throw error;
    }
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
      throw error;
    }
  },

  // --- Typing Indicators ---
  subscribeToTyping: (targetId, callback) => {
    const q = query(
      collection(db, "typing"),
      where("targetId", "==", targetId),
      where("isTyping", "==", true)
    );
    return onSnapshot(q, (snapshot) => {
      const typingUsers = snapshot.docs.map(doc => doc.data().userName);
      callback(typingUsers);
    });
  },

  setTypingStatus: async (targetId, userId, userName, isTyping) => {
    try {
      const typingRef = doc(db, "typing", `${targetId}_${userId}`);
      await setDoc(typingRef, {
        targetId,
        userId,
        userName,
        isTyping,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("SetTypingStatus Error:", error);
    }
  },

  deleteServer: async (serverId) => {
    try {
      await deleteDoc(doc(db, "servers", serverId));
      // Optionally delete associated channels/messages
    } catch (error) {
      console.error("DeleteServer Error:", error);
      throw error;
    }
  },

  deleteChannel: async (channelId) => {
    try {
      await deleteDoc(doc(db, "channels", channelId));
    } catch (error) {
      console.error("DeleteChannel Error:", error);
      throw error;
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
  subscribeToAllUsers: (callback) => {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const users = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        uid: doc.id,
        ...doc.data() 
      }));
      callback(users);
    });
  },

  subscribeToUserStatus: (callback) => {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const statuses = {};
      snapshot.docs.forEach(doc => {
        statuses[doc.id] = doc.data().status || 'offline';
      });
      callback(statuses);
    });
  },

  updateUserStatus: async (userId, status) => {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { 
      status, 
      lastActive: serverTimestamp() 
    }, { merge: true });
  },

  updateMemberRole: async (serverId, userId, role) => {
    try {
      const serverRef = doc(db, "servers", serverId);
      await updateDoc(serverRef, {
        [`memberRoles.${userId}`]: role
      });
    } catch (error) {
      console.error("UpdateMemberRole Error:", error);
      throw error;
    }
  },

  kickMember: async (serverId, userId) => {
    try {
      const serverRef = doc(db, "servers", serverId);
      await updateDoc(serverRef, {
        members: arrayRemove(userId),
        [`memberRoles.${userId}`]: deleteField()
      });
    } catch (error) {
      console.error("KickMember Error:", error);
      throw error;
    }
  }
};
