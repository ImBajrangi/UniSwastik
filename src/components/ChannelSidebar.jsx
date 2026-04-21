import React from 'react';
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
  const springTransition = { type: "spring", stiffness: 400, damping: 25 };

  return (
    <div className="flex flex-col gap-2 px-2 pt-2" role="list">
      <HomeItem icon={<Users size={20} />} label="Friends" active={!activeDMId} />
      <HomeItem icon={<LayoutDashboard size={20} />} label="Campus Feed" />
      <HomeItem icon={<ShoppingBag size={20} />} label="Academic Resources" />
      <HomeItem icon={<Joystick size={20} />} label="Quests & Polls" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 mb-2 px-2 flex items-center justify-between group"
      >
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.1em]">Direct Messages</span>
        <Plus size={14} className="text-text-muted cursor-pointer hover:text-white transition-colors" />
      </motion.div>

      {dmList.map((dm, index) => (
        <motion.div
          key={dm.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...springTransition, delay: 0.3 + index * 0.05 }}
          onClick={() => { selectDM(dm.id); playClick(); }}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={`group px-2 py-1.5 flex items-center gap-3 rounded-md cursor-pointer transition-colors ${activeDMId === dm.id ? 'bg-bg-modifier-selected' : 'hover:bg-bg-modifier-hover'
            }`}
        >
          <Avatar src={dm.avatar} name={dm.name} status={dm.status} size={32} />
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`text-[15px] font-bold truncate tracking-tight ${activeDMId === dm.id ? 'text-white' : 'text-text-muted group-hover:text-interactive-hover'
              }`}>{dm.name}</span>
            <span className="text-text-muted text-[11px] truncate font-medium opacity-70">{dm.subText}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const ServerNavigation = ({ serverId, activeChannelId, selectChannel, brandingColor }) => {
  const { channels } = usePlatform();
  const serverChannels = channels[serverId] || [];

  const getIcon = (type, name) => {
    if (type === 'voice') return <Volume2 size={18} />;
    if (name.includes('announce')) return <Megaphone size={18} />;
    if (name.includes('rules') || name.includes('academic')) return <BookOpen size={18} />;
    return <Hash size={18} />;
  };

  return (
    <div className="flex flex-col gap-1.5 px-2" role="list">
      <SectionHeader label="Text Channels" />
      {serverChannels.filter(c => c.type !== 'voice').map((channel, index) => (
        <ChannelItem
          key={channel.id}
          index={index}
          icon={getIcon(channel.type, channel.name)}
          label={channel.name}
          active={activeChannelId === channel.id}
          onClick={() => selectChannel(channel.id)}
          accentColor={brandingColor}
        />
      ))}

      <SectionHeader label="Voice Channels" spacing="mt-4" />
      {serverChannels.filter(c => c.type === 'voice').map((channel, index) => (
        <ChannelItem
          key={channel.id}
          index={index}
          icon={getIcon(channel.type, channel.name)}
          label={channel.name}
          active={activeChannelId === channel.id}
          onClick={() => selectChannel(channel.id)}
          accentColor={brandingColor}
        />
      ))}
    </div>
  );
};

const SectionHeader = ({ label, spacing = "mt-2" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`${spacing} mb-1 px-1 flex items-center justify-between group cursor-pointer hover:text-white transition-colors`}
  >
    <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.1em] flex items-center gap-1 group-hover:text-interactive-hover">
      <span className="-rotate-90 text-[8px] opacity-70 transition-transform group-hover:rotate-0">▼</span> {label}
    </span>
    <Plus size={14} className="text-text-muted group-hover:text-interactive-hover" />
  </motion.div>
);

const HomeItem = ({ icon, label, active, onClick }) => (
  <motion.div
    onClick={() => { if (onClick) onClick(); playClick(); }}
    whileHover={{ x: 4, backgroundColor: 'var(--color-bg-modifier-hover)' }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className={`py-2.5 px-3 rounded-md flex items-center gap-3 cursor-pointer transition-colors ${active ? 'bg-bg-modifier-selected text-white' : 'text-interactive-normal hover:text-interactive-hover'
      }`}>
    <span className={active ? 'text-white' : 'text-channel-icon'}>{icon}</span>
    <span className="text-[14px] font-bold tracking-tight uppercase opacity-90 group-hover:opacity-100">{label}</span>
  </motion.div>
);

const ChannelItem = ({ icon, label, active, onClick, accentColor, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -5 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.03 }}
    onClick={() => { onClick(); playClick(); }}
    whileHover={{ x: 4, backgroundColor: 'var(--color-bg-modifier-hover)' }}
    whileTap={{ scale: 0.98 }}
    className={`py-1.5 px-2 rounded-md flex items-center gap-2 cursor-pointer transition-colors group ${active ? 'bg-bg-modifier-selected text-white' : 'text-text-muted hover:text-interactive-hover'
      }`}
    style={{ borderLeft: active ? `2px solid ${accentColor || '#5865f2'}` : '2px solid transparent' }}
  >
    <span className={`transition-colors ${active ? 'text-white' : 'text-channel-icon group-hover:text-interactive-hover'}`}>
      {icon}
    </span>
    <span className={`text-[15px] font-bold truncate flex-1 tracking-tight ${active ? 'text-white' : ''}`}>
      {label}
    </span>
    {active && (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Settings size={14} className="text-text-muted" />
      </div>
    )}
  </motion.div>
);

// export default ChannelSidebar;

// export default ChannelSidebar;
