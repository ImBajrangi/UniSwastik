import React, { createContext, useContext, useState, useEffect } from 'react';
import { servers, channels as initialChannels, dmList as initialDmList, currentUser } from '../data/mockData';

const PlatformContext = createContext();

export const usePlatform = () => useContext(PlatformContext);

export const PlatformProvider = ({ children }) => {
  const [activeServerId, setActiveServerId] = useState('home');
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [activeDMId, setActiveDMId] = useState(null);
  const [view, setView] = useState('friends'); // 'friends', 'chat', 'discover'
  
  // Stateful Channels and DMs with persistence
  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem('swastik_channels');
    return saved ? JSON.parse(saved) : initialChannels;
  });

  const [dmList, setDmList] = useState(() => {
    const saved = localStorage.getItem('swastik_dms');
    return saved ? JSON.parse(saved) : initialDmList;
  });

  // Message history state with persistence
  const [messageHistory, setMessageHistory] = useState(() => {
    const saved = localStorage.getItem('swastik_messages');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('swastik_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('swastik_dms', JSON.stringify(dmList));
  }, [dmList]);

  useEffect(() => {
    localStorage.setItem('swastik_messages', JSON.stringify(messageHistory));
  }, [messageHistory]);

  const selectServer = (serverId) => {
    setActiveServerId(serverId);
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
    setView('chat');
    setActiveDMId(null);
  };

  const selectDM = (dmId) => {
    setActiveDMId(dmId);
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

  // MUTATIONS: Manage Chats and Channels
  const addChannel = (serverId, name, type = 'text') => {
    const newChannel = { id: `chan-${Date.now()}`, name, type };
    setChannels(prev => ({
      ...prev,
      [serverId]: [...(prev[serverId] || []), newChannel]
    }));
    return newChannel;
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
    addChannel,
    removeChannel,
    addDM,
    removeDM
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};
