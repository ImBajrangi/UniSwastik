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
import ServerSettingsModal from './ServerSettingsModal';
import Tooltip from './Tooltip';

const ChannelSidebar = () => {
  const {
    activeServerId, activeChannelId, activeDMId,
    servers, channels, dmList,
    selectServer, selectChannel, selectDM, removeServer, removeChannel,
    hasPermission
  } = usePlatform();

  const [showSettings, setShowSettings] = useState(false);

  const activeServer = servers.find(s => s.id === activeServerId);
  const isHome = activeServer?.isHome;

  return (
    <nav className="w-[240px] bg-bg-secondary/80 glass-thin flex flex-col h-full overflow-hidden border-r border-white/10 shrink-0 relative z-[200] transform-gpu" aria-label="Channels">
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
          <div className="w-full bg-bg-tertiary h-7 px-2 rounded flex items-center text-text-muted text-[13px] transition-all focus-premium">
            Find or start a conversation
          </div>
        </div>
      )}

      {!isHome && (
        <div className="h-14 px-4 flex items-center shadow-lg border-b border-black/10 overflow-hidden hover:bg-white/5 cursor-pointer transition-all group shrink-0 relative">
          <header className="flex items-center justify-between w-full" onClick={() => {
            if (hasPermission('manage_server')) {
              setShowSettings(true);
              playClick();
            } else if (hasPermission('delete_server')) {
              if (confirm(`Are you sure you want to delete ${activeServer?.name}?`)) {
                removeServer(activeServerId);
              }
            }
          }}>
            <h2 className="text-white font-black text-[15px] truncate flex-1 tracking-tight capitalize font-display">{activeServer?.name}</h2>
            <div className="flex items-center gap-1">
              {hasPermission('manage_server') ? (
                <Settings size={18} className="text-[#949BA4] group-hover:text-white transition-all group-hover:rotate-45" />
              ) : (
                <>
                  {hasPermission('delete_server') && <span className="text-[10px] text-brand-crimson font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">Delete</span>}
                  <ChevronDown size={18} className="text-[#949BA4] group-hover:text-white transition-colors" />
                </>
              )}
            </div>
          </header>
        </div>
      )}

      {/* Content Area - Macro Animated Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {isHome ? (
            <motion.div
              key="home-nav"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HomeNavigation dmList={dmList} activeDMId={activeDMId} selectDM={selectDM} />
            </motion.div>
          ) : (
            <motion.div
              key="server-nav"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ServerNavigation
                serverId={activeServerId}
                activeChannelId={activeChannelId}
                selectChannel={selectChannel}
                brandingColor={activeServer?.brandingColor}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <UserPanel />

      <AnimatePresence>
        {showSettings && (
          <ServerSettingsModal 
            serverId={activeServerId} 
            onClose={() => setShowSettings(false)} 
          />
        )}
      </AnimatePresence>
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
      <HomeItem 
        icon={<Users size={20} />} 
        label="Friends" 
        active={isFriendsActive} 
        onClick={() => setView('friends')} 
        index={0} 
      />
      <HomeItem 
        icon={<LayoutDashboard size={20} />} 
        label="Campus Feed" 
        onClick={() => setView('feed')} 
        index={1} 
      />
      <HomeItem 
        icon={<ShoppingBag size={20} />} 
        label="Academic Resources" 
        onClick={() => setView('resources')} 
        index={2} 
      />
      <HomeItem 
        icon={<Joystick size={20} />} 
        label="Quests & Polls" 
        onClick={() => setView('quests')} 
        index={3} 
      />

      <CollapsibleSection 
        label="Direct Messages" 
        onAdd={() => setShowCreateDM(true)}
        className="mt-4"
      >
        <AnimatePresence mode="popLayout">
          {dmList.map((dm, index) => (
            <motion.div
              key={dm.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26, delay: index * 0.01 }}
              onClick={() => { selectDM(dm.id); playClick(); }}
              className={`group px-2 py-1.5 flex items-center gap-3 rounded-md cursor-pointer transition-colors relative mb-0.5 ${activeDMId?.includes(dm.id) ? 'bg-bg-modifier-selected' : 'hover:bg-white/5'
                }`}
            >
              <Avatar userId={dm.id} src={dm.avatar} name={dm.name} status={dm.status} size={32} />
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

      <AnimatePresence>
        {showCreateDM && <CreateModal type="dm" onClose={() => setShowCreateDM(false)} />}
      </AnimatePresence>
    </div>
  );
};

const ServerNavigation = ({ serverId, activeChannelId, selectChannel, brandingColor }) => {
  const { channels, removeChannel, hasPermission } = usePlatform();
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
      <CollapsibleSection label="Text Channels" onAdd={hasPermission('manage_channels') ? () => setShowCreateChannel(true) : null}>
        <AnimatePresence mode="popLayout">
          {serverChannels.filter(c => c.type !== 'voice').map((channel, index) => (
            <ChannelItem
              key={channel.id}
              index={index}
              icon={getIcon(channel.type, channel.name)}
              label={channel.name}
              active={activeChannelId === channel.id}
              onClick={() => selectChannel(channel.id)}
              onRemove={hasPermission('manage_channels') ? () => removeChannel(serverId, channel.id) : null}
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
              onRemove={hasPermission('manage_channels') ? () => removeChannel(serverId, channel.id) : null}
              accentColor={brandingColor}
            />
          ))}
        </AnimatePresence>
      </CollapsibleSection>

      <AnimatePresence>
        {showCreateChannel && <CreateModal type="channel" serverId={serverId} onClose={() => setShowCreateChannel(false)} />}
      </AnimatePresence>
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
        <div className="flex-1 flex items-center gap-2 pl-2.5">
          <motion.div 
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center justify-center w-3 h-3"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
              <path d="M2.1 6.5l10.4 10.4L22.9 6.5z" />
            </svg>
          </motion.div>
          <span className="text-[11px] font-black uppercase tracking-[0.15em] select-none opacity-50 group-hover:opacity-100 transition-opacity whitespace-nowrap">{label}</span>
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
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="overflow-hidden pt-1.5 flex flex-col gap-0.5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HomeItem = ({ icon, label, active, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -4 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 26, delay: index * 0.015 }}
    onClick={() => { if (onClick) onClick(); playClick(); }}
    whileTap={{ scale: 0.96 }}
    className={`py-3 px-3 rounded-md flex items-center gap-4 cursor-pointer transition-colors mb-0.5 ${active ? 'bg-bg-modifier-selected text-white' : 'text-interactive-normal hover:bg-white/5 hover:text-interactive-hover'
      }`}>
    <span className={active ? 'text-white' : 'text-channel-icon'}>{icon}</span>
    <span className="text-[15px] font-bold tracking-tight opacity-90 group-hover:opacity-100">{label}</span>
  </motion.div>
);

const ChannelItem = ({ icon, label, active, onClick, accentColor, index, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, x: -4 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 26, delay: index * 0.01 }}
    onClick={() => { onClick(); playClick(); }}
    className={`py-1.5 px-3 rounded-md flex items-center gap-3 cursor-pointer transition-all group mb-0.5 relative ${
      active ? 'bg-white/10 text-white shadow-sm' : 'text-[#949BA4] hover:bg-white/5 hover:text-[#DBDEE1]'
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
