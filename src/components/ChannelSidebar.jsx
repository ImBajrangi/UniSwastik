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
        <div className="relative w-full h-[120px] bg-bg-tertiary overflow-hidden">
          <AnimatePresence mode="wait">
            {activeServer?.banner ? (
              <motion.div
                key={activeServerId + "-banner"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full"
              >
                <img src={activeServer.banner} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-black/30" />

                {/* Large Floating Symbol */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="absolute -bottom-2 right-4 text-5xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                >
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                    {activeServer.largeSymbol}
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : null}
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
    <div className="flex flex-col gap-0 px-2 pt-2" role="list">
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
              whileHover={{ x: 4 }}
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
              <button 
                onClick={(e) => { e.stopPropagation(); removeDM(dm.id); playClick(); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-white text-text-muted transition-opacity"
              >
                <Plus size={14} className="rotate-45" />
              </button>
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

const CollapsibleSection = ({ label, children, onAdd, spacing = "mt-2", className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className={`${spacing} ${className}`}>
      <div className="mb-1 px-1 flex items-center justify-between group cursor-pointer text-text-muted hover:text-white transition-colors">
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center gap-1"
        >
          <motion.span 
            animate={{ rotate: isExpanded ? 0 : -90 }}
            className="text-[8px] opacity-70"
          >
            ▼
          </motion.span>
          <span className="text-[11px] font-bold uppercase tracking-[0.1em]">{label}</span>
        </div>
        {onAdd && (
          <Plus 
            size={14} 
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className="text-text-muted hover:text-white transition-colors" 
          />
        )}
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="overflow-hidden"
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
    whileHover={{ x: 4, backgroundColor: 'rgba(78, 80, 88, 0.3)' }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className={`py-2.5 px-3 rounded-md flex items-center gap-3 cursor-pointer transition-colors mb-0.5 ${active ? 'bg-bg-modifier-selected text-white' : 'text-interactive-normal hover:text-interactive-hover'
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
    whileHover={{ x: 4, backgroundColor: 'rgba(78, 80, 88, 0.3)' }}
    className={`py-1.5 px-2 rounded-md flex items-center gap-2 cursor-pointer transition-colors group mb-0.5 ${
      active ? 'bg-bg-modifier-selected text-white' : 'text-text-muted hover:text-interactive-hover'
    }`}
  >
    <span className={`transition-colors ${active ? 'text-white' : 'text-channel-icon group-hover:text-interactive-hover'}`}>
      {icon}
    </span>
    <span className={`text-[15px] font-bold truncate flex-1 tracking-tight ${active ? 'text-white' : ''}`}>
      {label}
    </span>
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {onRemove && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); playClick(); }}
          className="p-0.5 hover:text-white"
        >
          <Plus size={14} className="rotate-45" />
        </button>
      )}
      {active && <Settings size={14} className="text-text-muted hover:text-white" />}
    </div>
  </motion.div>
);

export default ChannelSidebar;
