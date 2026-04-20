import React, { createContext, useContext, useState, useEffect } from 'react';
import { servers, channels, dmList, currentUser } from '../data/mockData';

const PlatformContext = createContext();

export const usePlatform = () => useContext(PlatformContext);

export const PlatformProvider = ({ children }) => {
  const [activeServerId, setActiveServerId] = useState('home');
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [activeDMId, setActiveDMId] = useState(null);
  const [view, setView] = useState('friends'); // 'friends', 'chat', 'discover'
  
  // Message history state with persistence
  const [messageHistory, setMessageHistory] = useState(() => {
    const saved = localStorage.getItem('swastik_messages');
    return saved ? JSON.parse(saved) : {};
  });

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
      // Default to first channel of the server
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
    dmList
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};
