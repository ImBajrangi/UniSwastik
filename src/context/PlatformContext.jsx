import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { dbService } from '../services/db';
import { authService } from '../services/auth';
import { seedDatabase } from '../utils/firebaseSeeder';
import { 
  servers as mockServers, 
  channels as mockChannels, 
  dmList as mockDmList
} from '../data/mockData';

const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [activeServerId, setActiveServerId] = useState('home');
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [activeDMId, setActiveDMId] = useState(null);
  const [view, setView] = useState('friends'); // 'friends', 'chat', 'discover'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Dynamic State - Driven by Firestore
  const [servers, setServers] = useState(mockServers);
  const [channels, setChannels] = useState(mockChannels);
  const [dmList, setDmList] = useState(mockDmList);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMemberList, setShowMemberList] = useState(true);
  const [showThreadsSidebar, setShowThreadsSidebar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mutedChannels, setMutedChannels] = useState([]);
  const [pinnedMessages, setPinnedMessages] = useState({});
  const [showInbox, setShowInbox] = useState(false);
  const [showPins, setShowPins] = useState(false);
  const [typingUsers, setTypingUsers] = useState({}); // { targetId: [userNames] }
  const [userStatuses, setUserStatuses] = useState({});

  // 1. Firebase Auth Initialization
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        // Fetch full user data from Firestore
        const userData = await authService.getUserData(user.uid);
        const newUser = userData || {
          uid: user.uid,
          id: user.uid,
          name: user.displayName || `Student_${user.uid.slice(0, 4)}`,
          avatar: user.photoURL || '',
          status: 'online',
          university: 'Swastik University',
          discriminator: Math.floor(1000 + Math.random() * 9000).toString()
        };
        setCurrentUser(newUser);
        dbService.updateUserStatus(user.uid, 'online');
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // 2. Real-time Firestore Subscriptions
  useEffect(() => {
    if (!currentUser?.id && !currentUser?.uid) return;
    const uid = currentUser.uid || currentUser.id;

    const prepareCloud = async () => {
      try {
        await seedDatabase();
      } catch (err) {
        console.warn("Seeding failed (Permissions?):", err.message);
      }
    };
    prepareCloud();

    const unsubServers = dbService.subscribeToServers((data) => {
      try {
        if (data && data.length > 0) {
          setServers(data);
          setIsHydrated(true);
        }
      } catch (err) {
        console.error("Cloud Server Sync Error:", err);
      }
    });

    const unsubUsers = dbService.subscribeToAllUsers((data) => {
      try {
        if (data && data.length > 0) {
          // Filter out the current user and map to match UI expectations
          const otherUsers = data
            .filter(u => u.uid !== uid)
            .map(u => ({
              ...u,
              relationship: u.relationship || 'friend' // Default for now
            }));
          setDmList(otherUsers);
        }
      } catch (err) {
        console.error("Cloud User Sync Error:", err);
      }
    });

    const unsubStatuses = dbService.subscribeToUserStatus((statuses) => {
      setUserStatuses(statuses);
    });

    // 3. Presence Tracking
    const handlePresence = () => {
      const status = document.visibilityState === 'visible' ? 'online' : 'away';
      dbService.updateUserStatus(uid, status);
    };

    const handleOffline = () => {
      dbService.updateUserStatus(uid, 'offline');
    };

    window.addEventListener('visibilitychange', handlePresence);
    window.addEventListener('beforeunload', handleOffline);
    dbService.updateUserStatus(uid, 'online');

    return () => {
      unsubServers();
      unsubUsers();
      unsubStatuses();
      window.removeEventListener('visibilitychange', handlePresence);
      window.removeEventListener('beforeunload', handleOffline);
      dbService.updateUserStatus(uid, 'offline');
    };
  }, [currentUser]);

  // Typing Subscription
  useEffect(() => {
    const targetId = activeDMId || activeChannelId;
    if (!targetId || !currentUser) return;

    const unsubTyping = dbService.subscribeToTyping(targetId, (users) => {
      setTypingUsers(prev => ({
        ...prev,
        [targetId]: users.filter(u => u !== currentUser?.name)
      }));
    });

    return unsubTyping;
  }, [activeDMId, activeChannelId, currentUser]);

  // Resilient Channel Syncing
  useEffect(() => {
    if (activeServerId === 'home' || !currentUser) return;
    
    try {
      const unsubChannels = dbService.subscribeToChannels(activeServerId, (data) => {
        if (data && data.length > 0) {
          setChannels(prev => ({ ...prev, [activeServerId]: data }));
        }
      });
      return unsubChannels;
    } catch (err) {
      console.error(`Cloud Channel Sync Error [${activeServerId}]:`, err);
    }
  }, [activeServerId, currentUser]);

  const selectServer = (serverId) => {
    setActiveServerId(serverId);
    setIsMobileMenuOpen(false);
    if (serverId === 'home') {
      setView('friends');
      setActiveChannelId(null);
    } else {
      setView('chat');
      const firstChannel = channels[serverId]?.[0];
      if (firstChannel) setActiveChannelId(firstChannel.id);
    }
    setActiveDMId(null);
  };

  const selectChannel = (channelId) => {
    setActiveChannelId(channelId);
    setIsMobileMenuOpen(false);
    setView('chat');
    setActiveDMId(null);
  };

  const selectDM = (dmId) => {
    setActiveDMId(dmId);
    setIsMobileMenuOpen(false);
    setActiveServerId('home');
    setView('chat');
    setActiveChannelId(null);
  };

  const sendMessage = async (targetId, content) => {
    const uid = currentUser?.uid || currentUser?.id;
    if (!uid) return;
    try {
      await dbService.sendMessage(targetId, uid, currentUser.name, content);
      setTyping(targetId, false);
    } catch (err) {
      console.error("Send Message Error:", err);
    }
  };

  const setTyping = (targetId, isTyping) => {
    const uid = currentUser?.uid || currentUser?.id;
    if (!uid || !targetId) return;
    dbService.setTypingStatus(targetId, uid, currentUser.name, isTyping);
  };

  const toggleMute = (channelId) => {
    setMutedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId) 
        : [...prev, channelId]
    );
  };

  const togglePinMessage = (channelId, message) => {
    setPinnedMessages(prev => {
      const channelPins = prev[channelId] || [];
      const isPinned = channelPins.some(p => p.id === message.id);
      
      if (isPinned) {
        return { ...prev, [channelId]: channelPins.filter(p => p.id !== message.id) };
      } else {
        return { ...prev, [channelId]: [...channelPins, message] };
      }
    });
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const value = {
    activeServerId,
    activeChannelId,
    activeDMId,
    view,
    selectServer,
    selectChannel,
    selectDM,
    sendMessage,
    currentUser,
    loading,
    logout,
    servers,
    channels,
    dmList,
    showMemberList,
    setShowMemberList,
    showThreadsSidebar,
    setShowThreadsSidebar,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setView,
    notifications,
    setNotifications,
    mutedChannels,
    toggleMute,
    pinnedMessages,
    togglePinMessage,
    showInbox,
    setShowInbox,
    showPins,
    setShowPins,
    typingUsers,
    setTyping,
    userStatuses
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};

