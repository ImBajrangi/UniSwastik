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
    <div className="flex-1 flex flex-col min-h-0 bg-[#2B2D31] relative overflow-hidden">
      {/* High-Fidelity Header */}
      <header className="h-[72px] px-8 flex items-center justify-between border-b border-black/30 bg-[#2B2D31]/95 backdrop-blur-xl z-20 shrink-0">
        <div className="flex items-center gap-6 pr-8 border-r border-white/5">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-[#949BA4] hover:text-white transition-all p-2 hover:bg-white/5 rounded-2xl mr-1"
          >
            <Menu size={26} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-indigo flex items-center justify-center text-white shadow-lg shadow-brand-indigo/30">
              <MessageCircle size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-tight leading-none">THE HUB</span>
              <span className="text-brand-indigo text-[9px] font-black tracking-widest uppercase opacity-70 mt-0.5">Community Network</span>
            </div>
          </div>
        </div>
        
        <nav className="flex items-center justify-start gap-4 flex-1 px-8 overflow-x-auto no-scrollbar">
          <HeaderTab label="Messages" icon={<History size={18} />} active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
          <HeaderTab label="Student Directory" icon={<Search size={18} />} active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
          <HeaderTab label="Friend Requests" icon={<UserPlus size={18} />} active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} />
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowQR(true)}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all active:scale-95 border border-white/5 flex items-center gap-2 group"
          >
            <QrCode size={22} className="group-hover:rotate-12 transition-transform" />
          </button>
          <button className="h-12 rounded-2xl bg-brand-indigo hover:bg-brand-indigo-hover text-white transition-all active:scale-95 shadow-xl shadow-brand-indigo/20 flex items-center gap-3 px-6 group border border-white/10">
            <Scan size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest hidden lg:block">Scan Passport</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-10 overflow-y-auto no-scrollbar">
          {/* Enhanced Contextual Header */}
          <div className="mb-10 max-w-4xl">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
              {activeTab === 'chats' ? 'Your Network' : activeTab === 'search' ? 'Campus Directory' : 'Pending Requests'}
            </h1>
            <div className="flex items-center gap-3 text-[#949BA4] font-semibold text-lg">
               <div className="w-2 h-2 rounded-full bg-brand-indigo shadow-[0_0_8px_rgba(88,101,242,0.8)]" />
               <p>
                {activeTab === 'chats' ? 'Access your private encrypted conversations.' : activeTab === 'search' ? 'Discover and connect with verified university members.' : 'Manage your incoming connection requests.'}
              </p>
            </div>
          </div>

          {/* Search Input for Search Tab */}
          {activeTab === 'search' && (
            <div className="relative mb-12 group max-w-4xl">
              <input 
                type="text" 
                placeholder="Search by student name, @handle, or faculty ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 border border-white/5 focus:border-brand-indigo/50 text-white rounded-[24px] py-6 pl-16 pr-6 outline-none transition-all placeholder:text-[#4E5058] text-lg font-bold shadow-2xl" 
              />
              <Search size={28} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4E5058] group-focus-within:text-brand-indigo transition-colors" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 max-w-5xl">
            <AnimatePresence mode="popLayout">
              {displayedList.length > 0 ? (
                displayedList.map((user, index) => (
                  <motion.div
                    key={user.id || user.uid}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => startDM(user.uid || user.id)}
                    className="flex items-center gap-5 p-5 bg-white/[0.02] hover:bg-white/[0.05] rounded-[24px] cursor-pointer group transition-all border border-white/5 hover:border-brand-indigo/30 hover:shadow-2xl"
                  >
                    <div className="relative shrink-0">
                      <Avatar userId={user.uid || user.id} name={user.name} status={userStatuses[user.uid || user.id] || user.status} size={64} />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-black text-xl tracking-tight group-hover:text-brand-indigo transition-colors">
                          {user.name?.replace(/[^\w\s@]/gi, '')}
                        </span>
                        {user.university && (
                          <span className="text-[10px] font-black text-brand-indigo bg-brand-indigo/10 px-3 py-1 rounded-full uppercase tracking-widest border border-brand-indigo/20">
                            {user.university}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#949BA4] text-sm font-bold opacity-80">@{user.username || user.id?.slice(0, 8)}</span>
                        <div className="w-1 h-1 rounded-full bg-[#4E5058]" />
                        <span className="text-status-online text-[10px] font-black uppercase tracking-widest">Active Now</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pr-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-indigo flex items-center justify-center text-white shadow-2xl shadow-brand-indigo/40 ring-4 ring-brand-indigo/10">
                        <ArrowRight size={24} />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="mt-32 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                    <Search size={48} className="text-[#4E5058]" />
                  </div>
                  <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">No Connections Found</h3>
                  <p className="text-[#949BA4] text-lg font-medium max-w-sm mx-auto opacity-70">Expand your network by searching the directory or scanning a peer's passport.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar - Campus Highlights */}
        <aside className="w-[420px] hidden xl:flex flex-col p-10 border-l border-black/30 bg-black/10 overflow-y-auto no-scrollbar gap-10 shadow-inner">
           <section>
              <h2 className="text-white font-black text-xl uppercase tracking-tight mb-8 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-indigo" />
                Campus Trending
              </h2>
              <div className="space-y-5">
                 <TrendingCard title="Global Hackathon 2026" category="Events" members="1,248" />
                 <TrendingCard title="Advanced AI Ethics" category="Study Groups" members="452" />
                 <TrendingCard title="Electronic Music Lab" category="Clubs" members="893" />
              </div>
           </section>

           <section className="bg-brand-indigo p-8 rounded-[32px] shadow-2xl relative overflow-hidden group cursor-pointer border border-white/10 hover:scale-[1.02] transition-all">
              <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:scale-125 transition-transform group-hover:opacity-20">
                <ShieldCheck size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10">
                  <ShieldCheck size={24} className="text-white" />
                </div>
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter leading-none mb-3">Verified Safe</h3>
                <p className="text-white/80 text-sm font-bold leading-relaxed mb-6">You are browsing a secure, encrypted hub limited to verified Swastik University students.</p>
                <button className="bg-white text-brand-indigo px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:shadow-white/20 transition-all">
                  Security Hub
                </button>
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
    className={`flex items-center gap-3 px-6 py-3 rounded-[20px] transition-all relative group ${
      active ? 'bg-brand-indigo text-white shadow-xl shadow-brand-indigo/30' : 'text-[#949BA4] hover:bg-white/5 hover:text-white'
    }`}
  >
    <div className={active ? 'text-white' : 'text-brand-indigo opacity-60 group-hover:opacity-100'}>
      {icon}
    </div>
    <span className="text-xs font-black uppercase tracking-widest font-display whitespace-nowrap">{label}</span>
  </button>
);

const TrendingCard = ({ title, category, members }) => (
  <div className="p-5 bg-white/[0.03] border border-white/5 rounded-[24px] hover:bg-white/[0.06] transition-all cursor-pointer group hover:border-brand-indigo/20">
    <div className="flex items-center justify-between mb-2">
      <span className="text-brand-indigo text-[10px] font-black uppercase tracking-[0.2em]">{category}</span>
      <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-full border border-white/5">
        <Users size={10} className="text-status-online" />
        <span className="text-white text-[9px] font-black uppercase tracking-tighter">{members}</span>
      </div>
    </div>
    <h3 className="text-white font-black text-lg tracking-tight group-hover:text-brand-indigo transition-colors leading-tight">{title}</h3>
  </div>
);

export default FriendsView;
