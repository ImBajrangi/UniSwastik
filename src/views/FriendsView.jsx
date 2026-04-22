import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, HelpCircle, Search, MessageCircle, Plus, Smile, UserPlus, 
  X, Check, Menu, TrendingUp, QrCode, Scan, User, Hash, ArrowRight,
  Sparkles, History, ShieldCheck
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';
import HeaderIcon from '../components/HeaderIcon';
import { playClick } from '../utils/sounds';

const QRModal = ({ user, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#1E1F22] w-full max-w-sm rounded-[32px] overflow-hidden border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-brand-indigo rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <QrCode size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Your Campus Pass</h2>
          <p className="text-[#949BA4] text-sm font-medium mb-8">Let classmates scan this to start a chat instantly.</p>
          
          {/* Mock QR Code SVG */}
          <div className="bg-white p-4 rounded-3xl shadow-inner mb-8">
            <div className="w-48 h-48 bg-white flex flex-wrap gap-1 p-1">
               {Array.from({ length: 49 }).map((_, i) => (
                 <div key={i} className={`w-[24px] h-[24px] ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} rounded-sm`} />
               ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-white font-black text-lg uppercase tracking-widest">{user?.name}</span>
            <span className="text-brand-indigo font-black text-xs uppercase tracking-widest opacity-60">#{user?.discriminator || '0001'}</span>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full bg-white/5 hover:bg-white/10 py-4 text-text-muted font-bold transition-colors border-t border-white/5 uppercase tracking-widest text-[10px]"
        >
          Close Passport
        </button>
      </motion.div>
    </motion.div>
  );
};

const FriendsView = () => {
  const { dmList, allUsers, startDM, setIsMobileMenuOpen, userStatuses, currentUser } = usePlatform();
  const [activeTab, setActiveTab] = useState('chats'); // 'chats', 'search', 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Filtering for Chats (Recent DMs)
  const recentChats = useMemo(() => {
    return dmList.filter(u => u.relationship === 'friend');
  }, [dmList]);

  // Filtering for Global User Search
  const searchResults = useMemo(() => {
    if (activeTab !== 'search') return [];
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allUsers.filter(u => u.uid !== currentUser?.uid).slice(0, 10);
    return allUsers.filter(u => 
      u.uid !== currentUser?.uid && 
      (u.name?.toLowerCase().includes(query) || 
       u.username?.toLowerCase().includes(query) ||
       u.id?.toLowerCase().includes(query))
    );
  }, [allUsers, searchQuery, activeTab, currentUser]);

  const displayedList = activeTab === 'chats' ? recentChats : searchResults;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#313338] relative overflow-hidden">
      {/* Header with Premium Tabs */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-black/20 bg-[#313338]/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-4 pr-6 border-r border-white/5">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-[#949BA4] hover:text-white transition-all p-1.5 hover:bg-white/5 rounded-xl mr-1"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-indigo/20 flex items-center justify-center text-brand-indigo">
              <MessageCircle size={20} />
            </div>
            <span className="text-white font-black text-lg tracking-tight uppercase font-display">Hub</span>
          </div>
        </div>
        
        <nav className="flex items-center justify-start gap-2 flex-1 px-6 overflow-x-auto no-scrollbar">
          <HeaderTab label="Chats" icon={<History size={16} />} active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
          <HeaderTab label="Search" icon={<Search size={16} />} active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
          <HeaderTab label="Requests" icon={<UserPlus size={16} />} active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} />
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowQR(true)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 border border-white/5"
            title="Your QR Passport"
          >
            <QrCode size={20} />
          </button>
          <button className="p-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo-hover text-white transition-all active:scale-95 shadow-lg shadow-brand-indigo/20 flex items-center gap-2 px-4 group">
            <Scan size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Scan QR</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar">
          {/* Contextual Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white tracking-tight uppercase mb-1">
              {activeTab === 'chats' ? 'Your Conversations' : activeTab === 'search' ? 'Campus Directory' : 'Pending Requests'}
            </h1>
            <p className="text-[#949BA4] text-sm font-medium">
              {activeTab === 'chats' ? 'People you have talked to recently.' : activeTab === 'search' ? 'Find any student or staff across the hub.' : 'New connection requests from classmates.'}
            </p>
          </div>

          {/* Search Input for Search Tab */}
          {activeTab === 'search' && (
            <div className="relative mb-8 group">
              <input 
                type="text" 
                placeholder="Search by name, @username, or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/5 focus:border-brand-indigo/50 text-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-[#4E5058] font-bold shadow-inner" 
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4E5058] group-focus-within:text-brand-indigo transition-colors" />
            </div>
          )}

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {displayedList.length > 0 ? (
                displayedList.map((user, index) => (
                  <motion.div
                    key={user.id || user.uid}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => startDM(user.uid || user.id)}
                    className="flex items-center gap-4 p-4 hover:bg-white/[0.03] rounded-2xl cursor-pointer group transition-all border border-transparent hover:border-white/5"
                  >
                    <div className="relative shrink-0">
                      <Avatar userId={user.uid || user.id} name={user.name} status={userStatuses[user.uid || user.id] || user.status} size={48} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-bold text-lg tracking-tight group-hover:text-brand-indigo transition-colors">{user.name}</span>
                        {user.university && (
                          <span className="text-[10px] font-black text-brand-indigo bg-brand-indigo/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            {user.university}
                          </span>
                        )}
                      </div>
                      <div className="text-[#949BA4] text-xs font-medium truncate flex items-center gap-2">
                        <span>@{user.username || user.id?.slice(0, 8)}</span>
                        <div className="w-1 h-1 rounded-full bg-[#4E5058]" />
                        <span>Online</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                      <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center text-white shadow-lg shadow-brand-indigo/30">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="mt-20 flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                    <Search size={40} className="text-[#949BA4]" />
                  </div>
                  <h3 className="text-white font-black text-xl uppercase tracking-widest mb-1">It's a bit empty here</h3>
                  <p className="text-[#949BA4] text-sm font-medium">Try searching for a classmate to start a chat.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar - Campus Highlights */}
        <aside className="w-[380px] hidden xl:flex flex-col p-8 border-l border-black/20 bg-black/5 overflow-y-auto no-scrollbar gap-8">
           <section>
              <h2 className="text-white font-black text-lg uppercase tracking-widest mb-6 flex items-center gap-3">
                <Sparkles size={20} className="text-brand-indigo" />
                Campus Trending
              </h2>
              <div className="space-y-4">
                 <TrendingCard title="Global Hackathon 2026" category="Events" members="1.2k" />
                 <TrendingCard title="Advanced AI Ethics" category="Study Groups" members="450" />
                 <TrendingCard title="Music Production" category="Clubs" members="890" />
              </div>
           </section>

           <section className="bg-brand-indigo p-6 rounded-3xl shadow-2xl relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform">
                <ShieldCheck size={80} />
              </div>
              <div className="relative z-10">
                <h3 className="text-white font-black text-xl uppercase leading-none mb-2">Verified Campus</h3>
                <p className="text-white/80 text-xs font-bold leading-relaxed mb-4">Every user on this platform is a verified student or staff at Swastik University.</p>
                <button className="bg-white text-brand-indigo px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Read Safety Guide</button>
              </div>
           </section>
        </aside>
      </div>

      <AnimatePresence>
        {showQR && <QRModal user={currentUser} onClose={() => setShowQR(false)} />}
      </AnimatePresence>
    </div>
  );
};

const HeaderTab = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all relative group ${
      active ? 'bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20' : 'text-[#949BA4] hover:bg-white/5 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-[12px] font-black uppercase tracking-widest font-display whitespace-nowrap">{label}</span>
  </button>
);

const TrendingCard = ({ title, category, members }) => (
  <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition-all cursor-pointer group">
    <div className="flex items-center justify-between mb-1">
      <span className="text-brand-indigo text-[9px] font-black uppercase tracking-widest">{category}</span>
      <span className="text-[#949BA4] text-[9px] font-black uppercase tracking-widest">{members} students</span>
    </div>
    <h3 className="text-white font-bold text-[15px] group-hover:text-brand-indigo transition-colors">{title}</h3>
  </div>
);

export default FriendsView;
