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

  // 1. Firebase Auth Initialization
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || 'Swastik Student',
          avatar: user.photoURL || '',
          status: 'online',
          university: 'Swastik University'
        });
      } else {
        await signInAnonymously(auth);
      }
    });
    return unsub;
  }, []);

  // 2. Real-time Firestore Subscriptions with Resilient Fallbacks
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

    return () => {
      unsubServers();
      unsubDMs();
    };
  }, [currentUser?.id]);

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
    await dbService.sendMessage(targetId, currentUser.id, currentUser.name, content);
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
    setShowPins
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
