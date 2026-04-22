import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, HelpCircle, Search, MessageCircle, Plus, Smile, UserPlus, X, Check, Menu, TrendingUp } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';
import HeaderIcon from '../components/HeaderIcon';
import { playClick } from '../utils/sounds';

const FriendsView = () => {
  const { dmList, selectDM, setIsMobileMenuOpen } = usePlatform();
  const [activeTab, setActiveTab] = useState('online');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic
  const filteredFriends = dmList.filter(user => {
    let relationMatch = false;
    if (activeTab === 'online') relationMatch = user.relationship === 'friend' && user.status !== 'offline';
    else if (activeTab === 'all') relationMatch = user.relationship === 'friend';
    else if (activeTab === 'pending') relationMatch = user.relationship?.startsWith('pending');
    else if (activeTab === 'blocked') relationMatch = user.relationship === 'blocked';

    if (!relationMatch) return false;
    if (searchQuery.trim() === '') return true;
    return user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg-primary relative">
      {/* Header with Premium Tabs - Center Balanced */}
      <header className="h-14 px-4 flex items-center justify-between glass shadow-xl z-20 shrink-0">
        <div className="flex items-center gap-3 pr-4 border-r border-white/5 min-w-[140px]">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-text-muted hover:text-white transition-all p-1.5 hover:bg-white/5 rounded-xl active:scale-90 mr-1"
          >
            <Menu size={26} />
          </button>
          <Users size={24} className="text-brand-indigo shrink-0" />
          <span className="text-white font-black text-base tracking-tighter truncate font-display">Friends</span>
        </div>
        
        <nav className="flex items-center justify-center gap-3 flex-1 px-4 overflow-x-auto no-scrollbar" role="tablist">
          <HeaderTab label="Online" active={activeTab === 'online'} onClick={() => setActiveTab('online')} />
          <HeaderTab label="All" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          <HeaderTab label="Pending" active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} />
          <HeaderTab label="Blocked" active={activeTab === 'blocked'} onClick={() => setActiveTab('blocked')} />
          
          <div className="w-px h-6 bg-white/10 mx-4 hidden sm:block" />
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: '#248046' }}
            whileTap={{ scale: 0.98 }}
            className="bg-status-online text-white px-6 py-2 rounded-lg text-[12px] font-black shadow-lg transition-all tracking-widest uppercase font-display whitespace-nowrap ml-4"
          >
            Add Friend
          </motion.button>
        </nav>

        <div className="flex items-center gap-2 min-w-[140px] justify-end pr-2 text-[#B5BAC1]">
          <HeaderIcon icon={<HelpCircle size={22} />} label="Help" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar relative z-10">
          {/* Professional Search Input */}
          <div className="relative mb-8 group">
            <div className="glass p-1 rounded-xl shadow-inner transition-all focus-premium">
              <div className="flex items-center h-9 px-3 gap-3">
                <Search size={18} className="text-text-muted group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Seach through your connections..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-[14px] text-white w-full placeholder:text-text-muted font-medium" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[11px] font-black text-text-muted uppercase tracking-[0.15em] opacity-80 font-display">
              {activeTab} — {filteredFriends.length}
            </h2>
          </div>
          
          <div className="flex flex-col gap-1" role="list">
            <AnimatePresence mode="popLayout">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26, delay: index * 0.02 }}
                  >
                    <FriendRow 
                      friend={friend} 
                      tab={activeTab}
                      onMessage={() => selectDM(friend.id)} 
                    />
                  </motion.div>
                ))
              ) : (
                <div className="mt-20 flex flex-col items-center justify-center text-center py-12">
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                     <Search size={32} className="text-text-muted opacity-40" />
                   </div>
                   <h3 className="text-white font-bold text-lg mb-1 font-display">No classmates found</h3>
                   <p className="text-text-muted text-sm font-medium opacity-60">We searched the entire campus, but they're not here.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Improved Active Now Sidebar - Premium Branding */}
        <aside className="w-[360px] border-l border-white/5 p-6 hidden lg:flex flex-col gap-6 bg-black/10 backdrop-blur-sm">
          <header className="flex items-center justify-between">
            <h2 className="text-white text-xl font-black tracking-tighter uppercase font-display">Active Now</h2>
            <TrendingUp size={18} className="text-brand-indigo" />
          </header>

          <div className="flex flex-col gap-4">
             {/* Dynamic Activity Card Placeholder */}
             <div className="glass p-5 rounded-2xl border-white/5 hover:border-brand-indigo/30 transition-all cursor-pointer group shadow-premium">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 flex items-center justify-center">
                    <Smile size={24} className="text-brand-indigo" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm font-display leading-tight">It's quiet for now</span>
                    <span className="text-text-muted text-[11px] font-bold uppercase tracking-widest opacity-60">General Alert</span>
                  </div>
                </div>
                <p className="text-text-muted text-[13px] leading-relaxed font-medium opacity-80 mb-4">Classmates who are online or gaming will appear here. Invite someone to start the conversation!</p>
                <button className="w-full py-2.5 bg-white/5 hover:bg-brand-indigo text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-inner">
                  Invite Friends
                </button>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const HeaderTab = ({ label, active, onClick }) => (
  <motion.button 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.96 }}
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className="relative px-6 py-2 group outline-none min-w-[80px]"
  >
    <span className={`relative z-10 text-[14px] font-black transition-all duration-300 uppercase tracking-widest font-display ${
      active ? 'text-white' : 'text-text-muted hover:text-[#DBDEE1]'
    }`}>
      {label}
    </span>
    {active && (
      <motion.div
        layoutId="friendsTab"
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-indigo rounded-full shadow-[0_0_12px_rgba(88,101,242,0.6)]"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    {/* Subtle Glass Pill on Hover */}
    {!active && (
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] rounded-xl transition-colors duration-200" />
    )}
  </motion.button>
);

const FriendRow = ({ friend, onMessage, tab }) => (
  <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl group cursor-pointer transition-all border-b border-white/5 last:border-0 relative" role="listitem">
    <div className="relative transition-transform group-hover:scale-105">
      <Avatar userId={friend.id} src={friend.avatar} name={friend.name} status={friend.status} size={40} />
    </div>
    
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-white font-bold text-[16px] truncate group-hover:text-brand-indigo transition-colors font-display leading-tight">{friend.name}</span>
        {friend.badge && <span className="bg-brand-indigo/20 text-brand-indigo text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">{friend.badge}</span>}
      </div>
      <span className="text-text-muted text-[13px] truncate font-medium opacity-70">{friend.subText}</span>
    </div>
    <div className="flex items-center gap-2">
      {tab === 'pending' ? (
        <div className="flex gap-2">
          <ActionCircle icon={<Check size={20} />} color="green" label="Accept" onClick={playClick} />
          <ActionCircle icon={<X size={20} />} color="red" label="Decline" onClick={playClick} />
        </div>
      ) : tab === 'blocked' ? (
        <ActionCircle icon={<UserPlus size={20} />} label="Unblock" onClick={playClick} />
      ) : (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionCircle icon={<MessageCircle size={20} />} onClick={(e) => { e.stopPropagation(); onMessage(); playClick(); }} label="Chat" />
          <ActionCircle icon={<span className="font-black text-[10px]">...</span>} label="More" onClick={playClick} />
        </div>
      )}
    </div>
  </div>
);

const HeroActionCard = ({ icon, label, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.2 + (index * 0.05) }}
    whileHover={{ x: 4 }}
    onClick={onClick}
    className="w-full bg-black/10 hover:bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group cursor-pointer transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-indigo">
        {icon}
      </div>
      <span className="text-white font-bold text-sm">{label}</span>
    </div>
  </motion.div>
);

const ActionCircle = ({ icon, onClick, label, color }) => (
  <motion.button 
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all glass ${
      color === 'green' ? 'text-status-online hover:bg-status-online/20' : 
      color === 'red' ? 'text-brand-crimson hover:bg-brand-crimson/20' : 
      'text-text-muted hover:text-white'
    }`}
    title={label}
    aria-label={label}
  >
    {icon}
  </motion.button>
);

export default FriendsView;
