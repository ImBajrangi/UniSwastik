import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { dbService } from '../services/db';
import { seedDatabase } from '../utils/firebaseSeeder';
import { 
  servers as mockServers, 
  channels as mockChannels, 
  dmList as mockDmList, 
  currentUser as mockUser
} from '../data/mockData';

const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [activeServerId, setActiveServerId] = useState('home');
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [activeDMId, setActiveDMId] = useState(null);
  const [view, setView] = useState('friends'); // 'friends', 'chat', 'discover'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Dynamic State - Driven by Firestore
  const [servers, setServers] = useState(mockServers);
  const [channels, setChannels] = useState(mockChannels);
  const [dmList, setDmList] = useState(mockDmList);
  const [currentUser, setCurrentUser] = useState(mockUser);
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
      if (user) {
        const newUser = {
          id: user.uid,
          name: user.displayName || `Student_${user.uid.slice(0, 4)}`,
          avatar: user.photoURL || '',
          status: 'online',
          university: 'Swastik University'
        };
        setCurrentUser(newUser);
        // Sync user info to Firestore for presence
        dbService.updateUserStatus(user.uid, 'online');
      } else {
        await signInAnonymously(auth);
      }
    });
    return unsub;
  }, []);

  // 2. Real-time Firestore Subscriptions
  useEffect(() => {
    if (!currentUser?.id) return;

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

    const unsubDMs = dbService.subscribeToDMs(currentUser.id, (data) => {
      try {
        if (data && data.length > 0) setDmList(data);
      } catch (err) {
        console.error("Cloud DM Sync Error:", err);
      }
    });

    const unsubStatuses = dbService.subscribeToUserStatus((statuses) => {
      setUserStatuses(statuses);
    });

    return () => {
      unsubServers();
      unsubDMs();
      unsubStatuses();
      // Set offline on logout/close
      if (currentUser?.id) dbService.updateUserStatus(currentUser.id, 'offline');
    };
  }, [currentUser?.id]);

  // Typing Subscription
  useEffect(() => {
    const targetId = activeDMId || activeChannelId;
    if (!targetId) return;

    const unsubTyping = dbService.subscribeToTyping(targetId, (users) => {
      setTypingUsers(prev => ({
        ...prev,
        [targetId]: users.filter(u => u !== currentUser?.name)
      }));
    });

    return unsubTyping;
  }, [activeDMId, activeChannelId, currentUser?.name]);

  // Resilient Channel Syncing
  useEffect(() => {
    if (activeServerId === 'home') return;
    
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
  }, [activeServerId]);

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
    if (!currentUser) return;
    try {
      // Optimistic update could be handled in ChatView's messages state
      await dbService.sendMessage(targetId, currentUser.id, currentUser.name, content);
      // Immediately stop typing
      setTyping(targetId, false);
    } catch (err) {
      console.error("Send Message Error:", err);
    }
  };

  const setTyping = (targetId, isTyping) => {
    if (!currentUser || !targetId) return;
    dbService.setTypingStatus(targetId, currentUser.id, currentUser.name, isTyping);
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
