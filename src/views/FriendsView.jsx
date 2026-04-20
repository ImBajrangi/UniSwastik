import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, HelpCircle, Search, MessageCircle, Plus, Smile, UserPlus, X, Check } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';
import { playClick } from '../utils/sounds';

const FriendsView = () => {
  const { dmList, selectDM } = usePlatform();
  const [activeTab, setActiveTab] = useState('online');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic
  const filteredFriends = dmList.filter(user => {
    // 1. Relationship Filter
    let relationMatch = false;
    if (activeTab === 'online') relationMatch = user.relationship === 'friend' && user.status !== 'offline';
    else if (activeTab === 'all') relationMatch = user.relationship === 'friend';
    else if (activeTab === 'pending') relationMatch = user.relationship?.startsWith('pending');
    else if (activeTab === 'blocked') relationMatch = user.relationship === 'blocked';

    if (!relationMatch) return false;

    // 2. Search Filter
    if (searchQuery.trim() === '') return true;
    return user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg-primary">
      {/* Header with Functional Tabs */}
      <header className="view-header gap-4 glass z-10 shrink-0">
        <div className="flex items-center gap-2 pr-4 border-r border-white/5">
          <Users size={24} className="text-text-muted" />
          <span className="text-white font-bold text-sm tracking-tight">Friends</span>
        </div>
        
        <nav className="flex items-center gap-4 flex-1" role="tablist">
          <HeaderTab label="Online" active={activeTab === 'online'} onClick={() => setActiveTab('online')} />
          <HeaderTab label="All" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          <HeaderTab label="Pending" active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} />
          <HeaderTab label="Blocked" active={activeTab === 'blocked'} onClick={() => setActiveTab('blocked')} />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-status-online text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#1a8b4b] transition-colors ml-2 shadow-lg tracking-tight"
          >
            Add Friend
          </motion.button>
        </nav>

        <div className="flex items-center gap-3 ml-auto pr-2 text-interactive-normal">
          <motion.div whileHover={{ color: "white" }} className="cursor-pointer transition-colors" aria-label="Support">
            <HelpCircle size={24} />
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col p-4 overflow-y-auto no-scrollbar">
          {/* Search Input */}
          <div className="relative mb-6 group">
            <input 
              type="text" 
              placeholder="Search classmates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-tertiary h-9 px-4 rounded-md text-sm text-text-normal placeholder:text-text-muted outline-none focus:ring-2 focus:ring-bg-accent transition-all border border-white/5"
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-white transition-colors" />
          </div>

          <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.1em] mb-4">
            {activeTab} — {filteredFriends.length}
          </p>
          
          <div className="flex flex-col" role="list">
            <AnimatePresence mode="popLayout">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FriendRow 
                      friend={friend} 
                      tab={activeTab}
                      onMessage={() => selectDM(friend.id)} 
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 flex flex-col items-center justify-center text-center py-12"
                >
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="text-6xl mb-6 select-none grayscale opacity-40"
                  >
                    🔍
                  </motion.div>
                  <h3 className="text-text-muted text-lg font-bold mb-1">No one matches your search here.</h3>
                  <p className="text-text-muted text-sm opacity-60">Try checking another tab or looking for someone else.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Improved Active Now Sidebar */}
        <aside className="w-[340px] border-l border-white/5 p-4 hidden lg:flex flex-col gap-4 bg-bg-secondary/20">
          <h2 className="text-white text-xl font-black tracking-tight uppercase">Active Now</h2>
          <div className="bg-bg-secondary/40 p-6 rounded-xl flex flex-col items-center text-center gap-4 border border-white/5 shadow-inner">
            <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center">
              <Smile size={24} className="text-text-muted" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-white font-bold text-sm">Silence is Golden...</p>
              <p className="text-text-muted text-[13px] leading-relaxed">It's pretty quiet right now. When classmates start hanging out, you'll see them here!</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const HeaderTab = ({ label, active, onClick }) => (
  <motion.button 
    whileHover={{ backgroundColor: "rgba(78, 80, 88, 0.3)" }}
    whileTap={{ scale: 0.95 }}
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={`px-4 py-1 rounded-md text-[15px] font-bold transition-all ${
      active ? 'bg-bg-modifier-selected text-white' : 'text-text-muted hover:text-interactive-hover'
    }`}
  >
    {label}
  </motion.button>
);

const FriendRow = ({ friend, onMessage, tab }) => (
  <div className="flex items-center gap-3 p-2.5 hover:bg-bg-modifier-hover/60 rounded-lg group cursor-pointer transition-all relative border-b border-white/5 last:border-0" role="listitem">
    <Avatar src={friend.avatar} name={friend.name} status={friend.status} size={36} />
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-white font-bold text-[15px] truncate group-hover:underline">{friend.name}</span>
        {friend.badge && <span className="bg-bg-accent/20 text-bg-accent text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">{friend.badge}</span>}
      </div>
      <span className="text-text-muted text-xs truncate font-medium">{friend.subText}</span>
    </div>
    
    <div className="flex items-center gap-2 pr-2">
      {tab === 'pending' ? (
        <div className="flex gap-2">
          <ActionCircle icon={<Check size={20} />} color="green" label="Accept" />
          <ActionCircle icon={<Check size={20} />} color="green" label="Accept" onClick={playClick} />
          <ActionCircle icon={<X size={20} />} color="red" label="Decline" onClick={playClick} />
        </div>
      ) : tab === 'blocked' ? (
        <ActionCircle icon={<UserPlus size={20} />} label="Unblock" onClick={playClick} />
      ) : (
        <>
          <ActionCircle icon={<MessageCircle size={20} />} onClick={(e) => { e.stopPropagation(); onMessage(); playClick(); }} label="Message" />
          <ActionCircle icon={<Plus size={20} />} label="More" onClick={playClick} />
        </>
      )}
    </div>
  </div>
);

const ActionCircle = ({ icon, onClick, label, color }) => (
  <motion.button 
    whileHover={{ scale: 1.1, backgroundColor: "var(--color-bg-tertiary)" }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center transition-all shadow-sm ${
      color === 'green' ? 'text-status-online hover:bg-status-online/20' : 
      color === 'red' ? 'text-text-danger hover:bg-text-danger/20' : 
      'text-interactive-normal hover:text-white'
    }`}
    title={label}
    aria-label={label}
  >
    {icon}
  </motion.button>
);

export default FriendsView;
