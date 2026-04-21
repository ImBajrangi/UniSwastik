import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  servers, 
  channels as initialChannels, 
  dmList as initialDmList, 
  currentUser,
  notifications as initialNotifications
} from '../data/mockData';

const PlatformContext = createContext();

export const usePlatform = () => useContext(PlatformContext);

export const PlatformProvider = ({ children }) => {
  const [activeServerId, setActiveServerId] = useState('home');
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [activeDMId, setActiveDMId] = useState(null);
  const [view, setView] = useState('friends'); // 'friends', 'chat', 'discover'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Stateful Channels and DMs with persistence
  const [channels, setChannels] = useState(initialChannels);
  const [dmList, setDmList] = useState(initialDmList);
  const [messageHistory, setMessageHistory] = useState({});
  const [showMemberList, setShowMemberList] = useState(true);
  const [showThreadsSidebar, setShowThreadsSidebar] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [mutedChannels, setMutedChannels] = useState([]);
const [pinnedMessages, setPinnedMessages] = useState({
  'welcome': [
    { id: 'pin-1', user: 'Prof. Dev', time: 'Oct 24', content: 'Welcome to Swastik University! Please read the rules in this channel before proceeding.' },
    { id: 'pin-2', user: 'Alex Verified', time: 'Oct 25', content: 'The Hackathon registration link is now live!' }
  ],
  'general': [
    { id: 'pin-3', user: 'Priya Sharma', time: 'Today', content: 'Remember to pick up your campus ID cards at the registrar office!' }
  ]
});
  const [showInbox, setShowInbox] = useState(false);
  const [showPins, setShowPins] = useState(false);

  // Hybrid Hydration - Market Ready Cache System
  useEffect(() => {
    const loadCache = () => {
      try {
        const savedChannels = localStorage.getItem('swastik_channels');
        const savedDms = localStorage.getItem('swastik_dms');
        const savedMessages = localStorage.getItem('swastik_messages');
        const savedShowMembers = localStorage.getItem('swastik_show_members');
        const savedMuted = localStorage.getItem('swastik_muted_channels');
        const savedPins = localStorage.getItem('swastik_pins');

        if (savedChannels) setChannels(JSON.parse(savedChannels));
        if (savedDms) setDmList(JSON.parse(savedDms));
        if (savedMessages) setMessageHistory(JSON.parse(savedMessages));
        if (savedShowMembers !== null) setShowMemberList(JSON.parse(savedShowMembers));
        if (savedMuted) setMutedChannels(JSON.parse(savedMuted));
        if (savedPins) setPinnedMessages(JSON.parse(savedPins));
      } catch (e) {
        console.error("Cache Hydration Error:", e);
      } finally {
        setIsHydrated(true);
      }
    };

    loadCache();
  }, []);

  // Persistent Write-Through Cache
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('swastik_show_members', JSON.stringify(showMemberList));
    localStorage.setItem('swastik_channels', JSON.stringify(channels));
    localStorage.setItem('swastik_dms', JSON.stringify(dmList));
    localStorage.setItem('swastik_messages', JSON.stringify(messageHistory));
    localStorage.setItem('swastik_muted_channels', JSON.stringify(mutedChannels));
    localStorage.setItem('swastik_pins', JSON.stringify(pinnedMessages));
  }, [showMemberList, channels, dmList, messageHistory, mutedChannels, pinnedMessages, isHydrated]);

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

  const sendMessage = (targetId, content) => {
    const newMessage = {
      id: Date.now(),
      user: currentUser.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content,
      isMe: true
    };

    setMessageHistory(prev => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), newMessage]
    }));
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

  // MUTATIONS: Manage Chats and Channels
  const addChannel = (serverId, name, type = 'text') => {
    const newChannel = { id: `chan-${Date.now()}`, name, type };
    setChannels(prev => ({
      ...prev,
      [serverId]: [...(prev[serverId] || []), newChannel]
    }));
    return newChannel;
  };

  const updateChannel = (serverId, channelId, newData) => {
    setChannels(prev => ({
      ...prev,
      [serverId]: prev[serverId].map(c => c.id === channelId ? { ...c, ...newData } : c)
    }));
  };

  const removeChannel = (serverId, channelId) => {
    setChannels(prev => ({
      ...prev,
      [serverId]: prev[serverId].filter(c => c.id !== channelId)
    }));
    if (activeChannelId === channelId) setActiveChannelId(null);
  };

  const addDM = (user) => {
    const newDM = {
      id: `dm-${Date.now()}`,
      name: user.name,
      status: 'online',
      avatar: user.avatar || '',
      subText: 'Just connected',
      relationship: 'friend'
    };
    setDmList(prev => [newDM, ...prev]);
    return newDM;
  };

  const removeDM = (dmId) => {
    setDmList(prev => prev.filter(dm => dm.id !== dmId));
    if (activeDMId === dmId) setActiveDMId(null);
  };

  const value = {
    activeServerId,
    activeChannelId,
    activeDMId,
    view,
    messageHistory,
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
    addChannel,
    updateChannel,
    removeChannel,
    addDM,
    removeDM,
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
