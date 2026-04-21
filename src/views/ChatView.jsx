import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash, Bell, Pin, Users, Search, Inbox, 
  HelpCircle, PlusCircle, Gift, Sticker, 
  Smile, LayoutGrid, Menu, Pencil
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';
import Tooltip from '../components/Tooltip';
import HeaderIcon from '../components/HeaderIcon';

const ThreadsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
    <path d="M12 12L2.1 12" />
    <path d="M12 12V22.1" />
  </svg>
);

const Message = ({ user, time, content, isMe, hideGutter }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    className={`flex gap-4 group hover:bg-black/10 -mx-4 px-4 ${hideGutter ? 'py-0.5' : 'py-2 mt-4'} transition-colors relative border-l-2 border-transparent hover:border-brand-indigo/30`}
  >
    <div className="w-10 shrink-0">
      {!hideGutter ? (
        <div className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95">
          <Avatar name={user} size={40} />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#313338] bg-status-online shadow-sm" />
        </div>
      ) : (
        <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-[#949BA4] mt-1 select-none font-bold">
          {time}
        </div>
      )}
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      {!hideGutter && (
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-[16px] hover:underline cursor-pointer leading-tight text-white font-display">{user}</span>
          <span className="text-[#949BA4] text-[11px] font-bold select-none opacity-80">{time}</span>
        </div>
      )}
      <p className="text-[#DBDEE1] text-[15px] whitespace-pre-wrap leading-[22px] tracking-tight font-medium">
        {content}
      </p>
    </div>
  </motion.div>
);

const MemberCategory = ({ label, members }) => (
  <div className="mb-6">
    <h3 className="text-[#949BA4] text-[11px] font-black uppercase tracking-[0.08em] mb-2 px-2 opacity-80">{label}</h3>
    <div className="space-y-0.5">
      {members.map(member => (
        <div 
          key={member.name}
          className="flex items-center gap-3 px-2 py-1.5 rounded-[8px] hover:bg-white/5 cursor-pointer group transition-all"
        >
          <div className="relative transition-transform group-hover:scale-105">
            <Avatar name={member.name} size={32} />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#2B2D31] ${
              member.status === 'online' ? 'bg-status-online' : 'bg-status-offline'
            }`} />
          </div>
          <span className={`text-[14px] font-bold truncate transition-colors ${
            member.status === 'online' ? 'text-[#DBDEE1] group-hover:text-white' : 'text-[#80848E]'
          }`}>
            {member.name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ChatView = ({ targetId }) => {
  const { 
    activeServerId, channels, dmList, 
    messageHistory, sendMessage, updateChannel,
    currentUser, showMemberList, setShowMemberList,
    setIsMobileMenuOpen
  } = usePlatform();
  
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const messagesEndRef = useRef(null);

  const channel = channels[activeServerId]?.find(c => c.id === targetId);
  const dm = dmList.find(d => d.id === targetId);
  const title = channel?.name || dm?.name || 'chat';

  const messages = (messageHistory[targetId] || []).filter(msg => 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(targetId, inputText);
      setInputText('');
    }
  };

  const startEditing = () => {
    if (!dm) {
      setEditName(title);
      setIsEditing(true);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 grid grid-cols-[1fr_auto] min-h-0 h-full bg-bg-primary relative overflow-hidden mesh-silk animate-mesh">
      {/* Main Chat Area - Ultra Responsive Resize */}
      <motion.div 
        layout
        transition={{ type: "spring", damping: 35, stiffness: 450 }}
        className="flex flex-col min-w-0 h-full relative"
      >
        {/* Top Header - Glass Design */}
        <header className="h-14 px-4 flex items-center justify-between glass z-20 shrink-0 shadow-lg border-b border-white/5">
          <div className="flex items-center gap-2 overflow-hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-[#B5BAC1] hover:text-white mr-1 transition-colors p-2 rounded-xl hover:bg-white/5"
            >
              <Menu size={24} />
            </button>
            {dm ? (
              <div className="flex items-center gap-2.5">
                <span className="text-brand-indigo font-black text-2xl drop-shadow-sm select-none">@</span>
                <span className="font-extrabold text-white truncate font-display tracking-tight text-lg">{dm.name}</span>
                <div className="w-2 h-2 rounded-full bg-status-online opacity-80" />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Hash className="text-text-muted" size={24} strokeWidth={3}/>
                <span className="font-extrabold text-white truncate font-display tracking-tight text-lg">
                  {title}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 p-1">
            <HeaderIcon icon={<Bell size={20} />} label="Mute" />
            <HeaderIcon icon={<Pin size={20} />} label="Pins" />
            <HeaderIcon icon={<ThreadsIcon />} label="Threads" />
            <HeaderIcon 
              icon={<Users size={20} />} 
              label={showMemberList ? "Hide Member List" : "Show Member List"}
              active={showMemberList}
              onClick={() => setShowMemberList(!showMemberList)}
            />
            
            <div className="hidden sm:flex relative group ml-1 mr-1">
              <div className="bg-bg-tertiary/60 border border-white/5 flex items-center h-7 px-2 rounded-lg w-[144px] transition-all group-focus-within:w-[240px] shadow-inner">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search" 
                  className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-text-muted font-medium" 
                />
                <Search size={14} className="text-[#949BA4] shrink-0" />
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-1">
              <HeaderIcon icon={<Inbox size={20} />} label="Inbox" />
              <HeaderIcon icon={<HelpCircle size={20} />} label="Help" />
            </div>
          </div>
        </header>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-28 min-h-0 bg-transparent">
          {/* Welcome Hero - MASTERPIECE DESIGN */}
          <div className="px-6 py-16 flex flex-col items-start max-w-[800px]">
            {dm ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start w-full"
              >
                <div className="relative mb-8">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 1 }}
                    className="relative z-10"
                  >
                    <Avatar name={dm.name} size={100} />
                  </motion.div>
                  <div className="absolute inset-0 bg-brand-indigo blur-[40px] opacity-20 -z-10 rounded-full scale-150" />
                </div>
                <h1 className="text-5xl font-black text-white mb-3 font-display tracking-tighter leading-none">
                  Welcome to <span className="opacity-40 select-none">@</span>{dm.name}
                </h1>
                <p className="text-text-muted text-[17px] font-medium leading-relaxed max-w-[500px]">
                  This is the very beginning of your direct message history with <span className="text-white">@{dm.name}</span>. Start something legendary.
                </p>
                <div className="flex gap-3 mt-8">
                  <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all border border-white/5 active:scale-95">View Profile</button>
                  <button className="px-5 py-2.5 rounded-xl bg-brand-indigo/10 hover:bg-brand-indigo/20 text-brand-indigo font-bold text-sm transition-all border border-brand-indigo/20 active:scale-95">Block User</button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-start w-full"
              >
                <motion.div 
                  initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-24 h-24 rounded-[32px] premium-gradient flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(88,101,242,0.5)] border border-white/20"
                >
                  <Hash size={52} className="text-white drop-shadow-lg" strokeWidth={3} />
                </motion.div>
                <h1 className="text-6xl font-black text-white mb-4 font-display tracking-tighter leading-none">
                  Welcome to <span className="opacity-30 select-none">#</span>{title}
                </h1>
                <p className="text-text-muted text-[18px] font-medium leading-relaxed max-w-[540px]">
                  Take center stage in <span className="text-white font-bold">#{title}</span>. This is where your community starts its journey.
                </p>
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={startEditing}
                    className="flex items-center gap-2 group px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-brand-indigo transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/20"
                  >
                    <Pencil size={18} className="group-hover:rotate-12 transition-transform" /> Edit Channel
                  </button>
                </div>
              </motion.div>
            )}
            <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mt-16" />
          </div>

          <div className="px-4 space-y-0">
            {messages.map((msg, idx) => (
              <Message 
                key={msg.id} 
                {...msg} 
                hideGutter={idx > 0 && messages[idx-1].user === msg.user}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input Container - MASTERPIECE GLASS DESIGN */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2 z-30 pointer-events-none lg:pb-8 lg:px-6">
          <div className="max-w-[1240px] mx-auto pointer-events-auto">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass p-2 rounded-[24px] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)] flex items-center gap-4 relative border border-white/5"
            >
              {/* Inner Glow Polish */}
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-none" />
              
              <button className="w-12 h-12 flex items-center justify-center rounded-[18px] bg-white/5 text-[#B5BAC1] hover:text-white transition-all hover:bg-brand-indigo hover:shadow-[0_0_15px_rgba(88,101,242,0.4)] group">
                <PlusCircle size={24} className="group-hover:scale-110 transition-transform" />
              </button>
              
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Message ${dm ? '@' : '#'}${title}`} 
                className="flex-1 bg-transparent text-[#DBDEE1] placeholder:text-[#949BA4] outline-none text-[16px] font-medium py-3 px-1"
              />
              
              <div className="flex items-center gap-2 pr-2 text-[#B5BAC1]">
                <Tooltip content="Premium Emoji">
                  <button className="w-11 h-11 flex items-center justify-center rounded-[16px] hover:bg-white/5 hover:text-white transition-all"><Smile size={24} /></button>
                </Tooltip>
                <div className="hidden sm:flex">
                  <Tooltip content="Choose layout">
                    <button className="w-11 h-11 flex items-center justify-center rounded-[16px] hover:bg-white/5 hover:text-white transition-all"><LayoutGrid size={24} fill="currentColor" /></button>
                  </Tooltip>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Member Sidebar - Premium Flex Drawer */}
      <div className="lg:static relative">
        <AnimatePresence>
          {showMemberList && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMemberList(false)}
                className="lg:hidden fixed inset-0 bg-black/70 z-[250] backdrop-blur-sm"
              />
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 40, stiffness: 500, mass: 1 }}
                className="fixed lg:static inset-y-0 right-0 bg-bg-secondary flex flex-col z-[251] lg:z-auto border-l border-black/20 overflow-hidden shadow-2xl shrink-0"
              >
                <div className="px-5 h-14 flex items-center justify-between font-black text-white border-b border-black/10 shrink-0 font-display uppercase tracking-widest text-[11px] opacity-80 shadow-sm">
                  <span>Member List</span>
                  <Users size={16} className="text-brand-indigo" />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-[100px] lg:pb-6 bg-black/5">
                  <MemberCategory label="The Founder — 1" members={[{ name: currentUser.name, status: 'online' }]} />
                  <MemberCategory 
                    label="Community — 3" 
                    members={[
                      { name: 'Harsh g', status: 'offline' },
                      { name: 'Swastik AI', status: 'offline' },
                      { name: 'Study Buddy', status: 'offline' }
                    ]} 
                  />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatView;
