import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hash, Volume2, Plus, Users, ShoppingBag,
  Joystick, LayoutDashboard, Megaphone,
  BookOpen, Lock, Settings, ChevronDown
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import UserPanel from './UserPanel';
import Avatar from './Avatar';
import { playClick } from '../utils/sounds';
import CreateModal from './CreateModal';
import Tooltip from './Tooltip';

const ChannelSidebar = () => {
  const {
    activeServerId, activeChannelId, activeDMId,
    servers, channels, dmList,
    selectServer, selectChannel, selectDM
  } = usePlatform();

  const activeServer = servers.find(s => s.id === activeServerId);
  const isHome = activeServer?.isHome;

  return (
    <nav className="w-[240px] bg-bg-secondary flex flex-col h-full overflow-hidden border-r border-black/10 shrink-0" aria-label="Channels">
      {/* Sidebar Header with Banner Expansion - Stable Container */}
      {!isHome && (
        <div className="relative w-full h-[80px] bg-bg-tertiary overflow-hidden shadow-inner">
          <AnimatePresence mode="wait">
            {activeServer?.banner ? (
              <motion.div
                key={activeServerId + "-banner"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <img src={activeServer.banner} className="w-full h-full object-cover opacity-80" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-black/20 to-transparent" />
              </motion.div>
            ) : (
              <div className="absolute inset-0 premium-gradient opacity-60" />
            )}
          </AnimatePresence>
        </div>
      )}

      {isHome && (
        <div className="h-12 border-b border-black/20 flex items-center px-4 shadow-sm shrink-0">
          <div className="w-full bg-bg-tertiary h-7 px-2 rounded flex items-center text-text-muted text-[13px]">
            Find or start a conversation
          </div>
        </div>
      )}

      {!isHome && (
        <div className="h-12 px-4 flex items-center shadow-sm border-b border-black/20 overflow-hidden hover:bg-bg-modifier-hover cursor-pointer transition-colors group shrink-0">
          <header className="flex items-center justify-between w-full">
            <h2 className="text-white font-black text-[15px] truncate flex-1 tracking-tight uppercase">{activeServer?.name}</h2>
            <ChevronDown size={16} className="text-interactive-normal group-hover:text-white transition-colors" />
          </header>
        </div>
      )}

      {/* Content Area - No Flickering Stagger */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        {isHome ? (
          <HomeNavigation dmList={dmList} activeDMId={activeDMId} selectDM={selectDM} />
        ) : (
          <ServerNavigation
            serverId={activeServerId}
            activeChannelId={activeChannelId}
            selectChannel={selectChannel}
            brandingColor={activeServer?.brandingColor}
          />
        )}
      </div>

      <UserPanel />
    </nav>
  );
};

const HomeNavigation = ({ dmList, activeDMId, selectDM }) => {
  const { activeServerId, view, removeDM } = usePlatform();
  const [showCreateDM, setShowCreateDM] = useState(false);
  const springTransition = { type: "spring", stiffness: 400, damping: 25 };
  
  const isFriendsActive = activeServerId === 'home' && !activeDMId && view === 'friends';
  
  return (
    <div className="flex flex-col gap-1.5 px-2 pt-2" role="list">
      <HomeItem icon={<Users size={20} />} label="Friends" active={isFriendsActive} />
      <HomeItem icon={<LayoutDashboard size={20} />} label="Campus Feed" />
      <HomeItem icon={<ShoppingBag size={20} />} label="Academic Resources" />
      <HomeItem icon={<Joystick size={20} />} label="Quests & Polls" />

      <CollapsibleSection 
        label="Direct Messages" 
        onAdd={() => setShowCreateDM(true)}
        className="mt-4"
      >
        <AnimatePresence mode="popLayout">
          {dmList.map((dm, index) => (
            <motion.div
              layout
              key={dm.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              transition={{ ...springTransition, delay: index * 0.03 }}
              onClick={() => { selectDM(dm.id); playClick(); }}
              whileHover={{ backgroundColor: 'rgba(78, 80, 88, 0.3)' }}
              className={`group px-2 py-1.5 flex items-center gap-3 rounded-md cursor-pointer transition-colors relative mb-0.5 ${activeDMId === dm.id ? 'bg-bg-modifier-selected' : 'hover:bg-bg-modifier-hover'
                }`}
            >
              <Avatar src={dm.avatar} name={dm.name} status={dm.status} size={32} />
              <div className="flex flex-col min-w-0 flex-1">
                <span className={`text-[15px] font-bold truncate tracking-tight ${activeDMId === dm.id ? 'text-white' : 'text-text-muted group-hover:text-interactive-hover'
                  }`}>{dm.name}</span>
                <span className="text-text-muted text-[11px] truncate font-medium opacity-70">{dm.subText}</span>
              </div>
              
              {/* REMOVE BUTTON */}
              <Tooltip content="Close DM">
                <button 
                  onClick={(e) => { e.stopPropagation(); removeDM(dm.id); playClick(); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-white text-[#949BA4] transition-opacity"
                >
                  <Plus size={14} className="rotate-45" />
                </button>
              </Tooltip>
            </motion.div>
          ))}
        </AnimatePresence>
      </CollapsibleSection>

      {showCreateDM && <CreateModal type="dm" onClose={() => setShowCreateDM(false)} />}
    </div>
  );
};

const ServerNavigation = ({ serverId, activeChannelId, selectChannel, brandingColor }) => {
  const { channels, removeChannel } = usePlatform();
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const serverChannels = channels[serverId] || [];

  const getIcon = (type, name) => {
    if (type === 'voice') return <Volume2 size={18} />;
    if (name.includes('announce')) return <Megaphone size={18} />;
    if (name.includes('rules') || name.includes('academic')) return <BookOpen size={18} />;
    return <Hash size={18} />;
  };

  return (
    <div className="flex flex-col gap-1.5 px-2" role="list">
      <CollapsibleSection label="Text Channels" onAdd={() => setShowCreateChannel(true)}>
        <AnimatePresence mode="popLayout">
          {serverChannels.filter(c => c.type !== 'voice').map((channel, index) => (
            <ChannelItem
              key={channel.id}
              index={index}
              icon={getIcon(channel.type, channel.name)}
              label={channel.name}
              active={activeChannelId === channel.id}
              onClick={() => selectChannel(channel.id)}
              onRemove={() => removeChannel(serverId, channel.id)}
              accentColor={brandingColor}
            />
          ))}
        </AnimatePresence>
      </CollapsibleSection>

      <CollapsibleSection label="Voice Channels" spacing="mt-4">
        <AnimatePresence mode="popLayout">
          {serverChannels.filter(c => c.type === 'voice').map((channel, index) => (
            <ChannelItem
              key={channel.id}
              index={index}
              icon={getIcon(channel.type, channel.name)}
              label={channel.name}
              active={activeChannelId === channel.id}
              onClick={() => selectChannel(channel.id)}
              onRemove={() => removeChannel(serverId, channel.id)}
              accentColor={brandingColor}
            />
          ))}
        </AnimatePresence>
      </CollapsibleSection>

      {showCreateChannel && <CreateModal type="channel" serverId={serverId} onClose={() => setShowCreateChannel(false)} />}
    </div>
  );
};

const CollapsibleSection = ({ label, children, onAdd, spacing = "mt-6", className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className={`${spacing} ${className}`}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-2 px-0.5 flex items-center justify-between group cursor-pointer text-[#949BA4] hover:text-white transition-colors"
      >
        <div className="flex-1 flex items-center gap-1.5">
          <motion.div 
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center justify-center w-3 h-3"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
              <path d="M2.1 6.5l10.4 10.4L22.9 6.5z" />
            </svg>
          </motion.div>
          <span className="text-[12px] font-bold uppercase tracking-[0.03em] select-none">{label}</span>
        </div>
        {onAdd && (
          <Tooltip content={label === 'Direct Messages' ? "Start DM" : "Create Channel"}>
            <Plus 
              size={16} 
              strokeWidth={2.5}
              onClick={(e) => { e.stopPropagation(); onAdd(); playClick(); }}
              className="text-[#949BA4] hover:text-white transition-colors p-0.5" 
            />
          </Tooltip>
        )}
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="overflow-hidden pt-1.5 flex flex-col gap-0.5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HomeItem = ({ icon, label, active, onClick }) => (
  <motion.div
    onClick={() => { if (onClick) onClick(); playClick(); }}
    whileHover={{ backgroundColor: 'rgba(78, 80, 88, 0.3)' }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className={`py-3 px-3 rounded-md flex items-center gap-4 cursor-pointer transition-colors mb-0.5 ${active ? 'bg-bg-modifier-selected text-white' : 'text-interactive-normal hover:text-interactive-hover'
      }`}>
    <span className={active ? 'text-white' : 'text-channel-icon'}>{icon}</span>
    <span className="text-[14px] font-bold tracking-tight uppercase opacity-90 group-hover:opacity-100">{label}</span>
  </motion.div>
);

const ChannelItem = ({ icon, label, active, onClick, accentColor, index, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -5 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.03 }}
    onClick={() => { onClick(); playClick(); }}
    whileHover={{ backgroundColor: 'rgba(78, 80, 88, 0.3)' }}
    className={`py-2 px-2.5 rounded-md flex items-center gap-3 cursor-pointer transition-colors group mb-0.5 ${
      active ? 'bg-bg-modifier-selected text-white' : 'text-[#949BA4] hover:text-[#DBDEE1]'
    }`}
  >
    <span className={`transition-colors shrink-0 ${active ? 'text-white' : 'text-[#80848E] group-hover:text-[#DBDEE1]'}`}>
      {icon}
    </span>
    <span className={`text-[15px] font-bold truncate flex-1 tracking-tight ${active ? 'text-white' : ''}`}>
      {label}
    </span>
    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      {onRemove && (
        <Tooltip content="Close Channel">
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); playClick(); }}
            className="p-0.5 hover:text-white"
          >
            <Plus size={14} className="rotate-45" />
          </button>
        </Tooltip>
      )}
      {active && (
        <Tooltip content="Edit Channel">
          <Settings size={14} className="text-[#949BA4] hover:text-white" />
        </Tooltip>
      )}
    </div>
  </motion.div>
);

export default ChannelSidebar;
