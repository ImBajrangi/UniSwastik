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
  const [servers, setServers] = useState([]);
  const [discoverableServers, setDiscoverableServers] = useState([]);
  const [channels, setChannels] = useState({});
  const [dmList, setDmList] = useState([]);
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
  const [allUsers, setAllUsers] = useState([]);

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
        
        // Automatic Campus Enrollment (Step 1 of PDF Roadmap)
        if (newUser.university && newUser.domain) {
          dbService.ensureMemberOfGlobalGroups(user.uid, newUser.university, newUser.domain);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // 2. Real-time Firestore Subscriptions
  useEffect(() => {
    if (!currentUser) return;
    const uid = currentUser.uid || currentUser.id;

    const unsubServers = dbService.subscribeToServers((data) => {
      try {
        if (data && data.length > 0) {
          const joined = data.filter(s => Array.isArray(s.members) && s.members.includes(uid));
          const discoverable = data.filter(s => {
            if (s.privacy === 'public') return true;
            if (s.privacy === 'semi-public' && s.domain === currentUser?.domain) return true;
            return false; // private groups are NOT discoverable
          });
          setServers(joined);
          setDiscoverableServers(discoverable);
          setIsHydrated(true);
        }
      } catch (err) {
        console.error("Cloud Server Sync Error:", err);
      }
    });

    const unsubUsers = dbService.subscribeToAllUsers((data) => {
      try {
          if (data && data.length > 0) {
            setAllUsers(data);
            const otherUsers = data
              .filter(u => u.uid !== uid)
              .map(u => ({
                ...u,
                relationship: u.relationship || 'friend'
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
  }, [currentUser?.uid]);

  // Seeding Effect - Separate to avoid re-triggering subscriptions
  useEffect(() => {
    if (!currentUser?.uid) return;
    const runSeeding = async () => {
      try {
        await seedDatabase();
      } catch (err) {
        console.warn("Seeding background task:", err.message);
      }
    };
    runSeeding();
  }, [currentUser?.uid]);

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

  const selectDM = (participantId) => {
    const uid = currentUser?.uid || currentUser?.id;
    if (!uid) return;

    // Deterministic ID for 1:1 DMs
    const dmId = [uid, participantId].sort().join('_');

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

  const createServer = async (name, privacy = 'public', password = null) => {
    const uid = currentUser?.uid || currentUser?.id;
    if (!uid) return;
    try {
      await dbService.createServer(name, uid, privacy, password);
    } catch (err) {
      console.error("Context CreateServer Error:", err);
    }
  };

  const joinServer = async (serverId, password = null) => {
    const uid = currentUser?.uid || currentUser?.id;
    if (!uid) return;
    try {
      await dbService.joinServerWithPassword(serverId, uid, password);
    } catch (err) {
      console.error("Context JoinServer Error:", err);
      throw err;
    }
  };

  const createChannel = async (serverId, name) => {
    try {
      await dbService.createChannel(serverId, name);
    } catch (err) {
      console.error("Context CreateChannel Error:", err);
    }
  };

  const removeServer = async (serverId) => {
    try {
      await dbService.deleteServer(serverId);
      if (activeServerId === serverId) selectServer('home');
    } catch (err) {
      console.error("Context RemoveServer Error:", err);
    }
  };

  const leaveServer = async (serverId) => {
    const uid = currentUser?.uid || currentUser?.id;
    if (!uid) return;
    try {
      await dbService.leaveServer(serverId, uid);
      if (activeServerId === serverId) selectServer('home');
    } catch (err) {
      console.error("Context LeaveServer Error:", err);
    }
  };

  const removeChannel = async (serverId, channelId) => {
    try {
      await dbService.deleteChannel(channelId);
      if (activeChannelId === channelId) {
        const remaining = channels[serverId]?.filter(c => c.id !== channelId);
        if (remaining?.length > 0) selectChannel(remaining[0].id);
      }
    } catch (err) {
      console.error("Context RemoveChannel Error:", err);
    }
  };

  const updateMemberRole = async (serverId, userId, role) => {
    try {
      await dbService.updateMemberRole(serverId, userId, role);
    } catch (err) {
      console.error("Context UpdateMemberRole Error:", err);
    }
  };

  const kickMember = async (serverId, userId) => {
    try {
      await dbService.kickMember(serverId, userId);
    } catch (err) {
      console.error("Context KickMember Error:", err);
    }
  };

  const updateServer = async (serverId, data) => {
    try {
      await dbService.updateServer(serverId, data);
    } catch (err) {
      console.error("Context UpdateServer Error:", err);
    }
  };

  const hasPermission = (action, serverId = activeServerId) => {
    if (!currentUser || !serverId || serverId === 'home') return false;
    const server = servers.find(s => s.id === serverId);
    if (!server) return false;

    const userRole = server.memberRoles?.[currentUser.id || currentUser.uid] || 'member';

    const permissions = {
      manage_channels: ['owner', 'admin'],
      delete_server: ['owner'],
      manage_messages: ['owner', 'admin', 'moderator'],
      manage_members: ['owner', 'admin'],
      manage_server: ['owner', 'admin']
    };

    return permissions[action]?.includes(userRole) || false;
  };

  const deleteMessage = async (messageId) => {
    try {
      await dbService.deleteMessage(messageId);
    } catch (err) {
      console.error("Context DeleteMessage Error:", err);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  const startDM = async (otherUserId) => {
    if (!currentUser) return;
    try {
      const dmId = await dbService.startDM([currentUser.uid, otherUserId]);
      setActiveDMId(dmId);
      setActiveServerId('home');
      setView('chat');
    } catch (err) {
      console.error("PlatformContext startDM Error:", err);
    }
  };

  const value = {
    activeServerId,
    activeChannelId,
    activeDMId,
    view,
    selectServer,
    selectChannel,
    selectDM,
    startDM,
    joinServer,
    sendMessage,
    currentUser,
    loading,
    logout,
    servers,
    discoverableServers,
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
    userStatuses,
    allUsers,
    createServer,
    createChannel,
    removeServer,
    removeChannel,
    hasPermission,
    updateMemberRole,
    deleteMessage,
    kickMember,
    updateServer,
    joinServer,
    leaveServer
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

