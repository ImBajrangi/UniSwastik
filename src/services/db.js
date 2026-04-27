import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  getDocs,
  limit,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
  increment
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../lib/firebase";

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

  createServer: async (name, ownerId, privacy = 'public', password = null) => {
    try {
      const serverData = {
        name,
        ownerId,
        privacy,
        createdAt: serverTimestamp(),
        members: [ownerId],
        memberRoles: { [ownerId]: 'owner' },
        acronym: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      };

      if (password && privacy === 'private') {
        serverData.password = password;
      }

      const docRef = await addDoc(collection(db, "servers"), serverData);
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

  leaveServer: async (serverId, userId) => {
    try {
      const serverRef = doc(db, "servers", serverId);
      await updateDoc(serverRef, {
        members: arrayRemove(userId),
        [`memberRoles.${userId}`]: deleteField()
      });
    } catch (error) {
      console.error("LeaveServer Error:", error);
      throw error;
    }
  },

  // --- Messages ---
  subscribeToMessages: (targetId, callback, onError) => {
    // We remove orderBy to avoid index requirement during development
    const q = query(
      collection(db, "messages"), 
      where("targetId", "==", targetId),
      limit(100)
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          time: data.timestamp?.toDate()?.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) || 'just now'
        };
      });
      
      // Sort locally to avoid needing a composite index
      messages.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeA - timeB;
      });
      
      callback(messages);
    }, (err) => {
      if (onError) onError(err);
      else console.error("Firestore Messages Error:", err);
    });
  },

  deleteMessage: async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
    } catch (error) {
      console.error("DeleteMessage Error:", error);
      throw error;
    }
  },

  sendMessage: async (targetId, userId, userName, content, attachments = []) => {
    try {
      const msgData = {
        targetId,
        user: userName,
        userId,
        content,
        timestamp: serverTimestamp(),
        reactions: {},
        edited: false,
      };
      if (attachments.length > 0) {
        msgData.attachments = attachments;
      }
      await addDoc(collection(db, "messages"), msgData);
    } catch (error) {
      console.error("SendMessage Error:", error);
      throw error;
    }
  },

  // --- Message Editing ---
  updateMessage: async (messageId, newContent) => {
    try {
      const msgRef = doc(db, "messages", messageId);
      await updateDoc(msgRef, {
        content: newContent,
        edited: true,
        editedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("UpdateMessage Error:", error);
      throw error;
    }
  },

  // --- Reactions ---
  addReaction: async (messageId, emoji, userId) => {
    try {
      const msgRef = doc(db, "messages", messageId);
      // Store reactions as a map: { "👍": ["uid1", "uid2"], "❤️": ["uid3"] }
      await updateDoc(msgRef, {
        [`reactions.${emoji}`]: arrayUnion(userId)
      });
    } catch (error) {
      console.error("AddReaction Error:", error);
      throw error;
    }
  },

  removeReaction: async (messageId, emoji, userId) => {
    try {
      const msgRef = doc(db, "messages", messageId);
      await updateDoc(msgRef, {
        [`reactions.${emoji}`]: arrayRemove(userId)
      });
    } catch (error) {
      console.error("RemoveReaction Error:", error);
      throw error;
    }
  },

  // --- File Uploads ---
  uploadFile: async (file, path) => {
    try {
      const storageRef = ref(storage, path || `uploads/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return {
        url,
        name: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error("UploadFile Error:", error);
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
    const q = query(collection(db, "dms"), where("participantIds", "array-contains", userId), orderBy("lastMessageAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const dms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(dms);
    }, (err) => {
      if (onError) onError(err);
      else console.error("Firestore DMs Error:", err);
    });
  },

  startDM: async (participantIds) => {
    try {
      const sortedIds = [...participantIds].sort();
      const dmsRef = collection(db, "dms");
      const q = query(dmsRef, where("participantIds", "==", sortedIds));
      const snap = await getDocs(q);
      
      if (!snap.empty) return snap.docs[0].id;

      const docRef = await addDoc(dmsRef, {
        participantIds: sortedIds,
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("StartDM Error:", error);
      throw error;
    }
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

  subscribeToServerMembers: (serverId, callback) => {
    if (!serverId || serverId === 'home') {
      callback([]);
      return () => {};
    }

    // First get the server to get the list of member IDs
    const serverRef = doc(db, "servers", serverId);
    return onSnapshot(serverRef, (serverSnap) => {
      if (!serverSnap.exists()) {
        callback([]);
        return;
      }

      const memberIds = serverSnap.data().members || [];
      if (memberIds.length === 0) {
        callback([]);
        return;
      }

      // Then subscribe to the users collection, filtering for these IDs
      // Note: Firestore 'in' query is limited to 10-30 items, so for large groups we might need a different approach
      // For now, we'll subscribe to all users and filter locally to keep it simple and reactive for presence
      return onSnapshot(collection(db, "users"), (userSnap) => {
        const members = userSnap.docs
          .filter(doc => memberIds.includes(doc.id))
          .map(doc => ({
            id: doc.id,
            uid: doc.id,
            ...doc.data()
          }));
        callback(members);
      });
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

  // --- Custom Status (Discord-style) ---
  updateCustomStatus: async (userId, statusText, statusEmoji, clearAfter = null) => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        customStatus: {
          text: statusText || '',
          emoji: statusEmoji || '',
          clearAfter: clearAfter,
          updatedAt: serverTimestamp()
        }
      }, { merge: true });
    } catch (error) {
      console.error("UpdateCustomStatus Error:", error);
      throw error;
    }
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
  },

  joinServerWithPassword: async (serverId, userId, password) => {
    try {
      const serverRef = doc(db, "servers", serverId);
      const serverSnap = await getDoc(serverRef);
      
      if (!serverSnap.exists()) throw new Error("Server not found");
      
      const serverData = serverSnap.data();
      if (serverData.privacy === 'private' || serverData.password) {
        if (serverData.password !== password) {
          throw new Error("Invalid group password");
        }
      }
      
      await updateDoc(serverRef, {
        members: arrayUnion(userId),
        [`memberRoles.${userId}`]: 'member'
      });
      
      return serverSnap.id;
    } catch (error) {
      console.error("JoinWithPassword Error:", error);
      throw error;
    }
  },

  // --- Voice Channel State ---
  joinVoiceChannel: async (channelId, userId, userName) => {
    try {
      const voiceRef = doc(db, "voiceState", `${channelId}_${userId}`);
      await setDoc(voiceRef, {
        channelId,
        userId,
        userName,
        joinedAt: serverTimestamp(),
        muted: false,
        deafened: false
      });
    } catch (error) {
      console.error("JoinVoiceChannel Error:", error);
      throw error;
    }
  },

  leaveVoiceChannel: async (channelId, userId) => {
    try {
      const voiceRef = doc(db, "voiceState", `${channelId}_${userId}`);
      await deleteDoc(voiceRef);
    } catch (error) {
      console.error("LeaveVoiceChannel Error:", error);
      throw error;
    }
  },

  subscribeToVoiceState: (channelId, callback) => {
    const q = query(collection(db, "voiceState"), where("channelId", "==", channelId));
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(users);
    });
  },

  ensureMemberOfGlobalGroups: async (userId, university, domain) => {
    try {
      const serversRef = collection(db, "servers");
      
      const ensureGroup = async (name, extraData = {}) => {
        const q = query(serversRef, where("name", "==", name));
        const snap = await getDocs(q);
        let groupId;

        if (snap.empty) {
          // Create Group if it doesn't exist
          const newRef = await addDoc(serversRef, {
            name,
            ownerId: "system",
            privacy: "public",
            acronym: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
            members: [userId],
            memberRoles: { [userId]: 'member' },
            createdAt: serverTimestamp(),
            ...extraData
          });
          groupId = newRef.id;
          
          // Create default channel
          await addDoc(collection(db, "channels"), {
            name: "general",
            serverId: groupId,
            type: "text",
            createdAt: serverTimestamp()
          });
        } else {
          groupId = snap.docs[0].id;
          const groupDoc = snap.docs[0].data();
          if (!groupDoc.members?.includes(userId)) {
            await updateDoc(doc(db, "servers", groupId), {
              members: arrayUnion(userId),
              [`memberRoles.${userId}`]: 'member'
            });
          }
        }
        return groupId;
      };

      // 1. Handle Welcome Group
      const welcomeId = await ensureGroup("Welcome Group", { acronym: "WG" });

      // 2. Handle University-Specific Group
      const uniId = await ensureGroup(university, { 
        domain: domain, 
        privacy: "semi-public",
        acronym: university.split(' ').map(w => w[0]).join('').toUpperCase()
      });

      // 3. Handle Anonymous Campus
      const anonId = await ensureGroup("Anonymous Campus", { 
        isAnonymous: true, 
        acronym: "AC",
        description: "Interact freely without sharing your profile details."
      });

      return { welcomeId, uniId, anonId };
    } catch (error) {
      console.error("Enrollment Error:", error);
      throw error;
    }
  }
};
