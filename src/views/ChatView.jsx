import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hash, Bell, Pin, Users, Search, Inbox,
  HelpCircle, PlusCircle, Gift, Sticker,
  Smile, LayoutGrid, Menu, Pencil, ChevronRight, X, BellOff
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';
import Tooltip from '../components/Tooltip';
import HeaderIcon from '../components/HeaderIcon';
import PinsPopover from '../components/PinsPopover';
import InboxPopover from '../components/InboxPopover';
import HelpModal from '../components/HelpModal';
import ThreadsSidebar from '../components/ThreadsSidebar';
import { dbService } from '../services/db';

const HeroActionCard = ({ icon, label, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.1 + (index * 0.04) }}
    whileHover={{ x: 4 }}
    onClick={onClick}
    className="w-full bg-black/10 hover:bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group cursor-pointer transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-white font-bold text-base font-display">{label}</span>
    </div>
    <ChevronRight className="text-text-muted group-hover:text-white transition-colors" size={20} />
  </motion.div>
);

const ThreadsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
    <path d="M12 12L2.1 12" />
    <path d="M12 12V22.1" />
  </svg>
);

const Message = ({ id, user, userId, time, content, isMe, hideGutter, index, role, onDelete, canDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 26, delay: (index % 10) * 0.02 }}
    className={`flex gap-4 group hover:bg-white/[0.03] -mx-4 px-4 ${hideGutter ? 'py-0.5' : 'py-2 mt-4'} transition-colors relative border-l-2 border-transparent hover:border-brand-indigo/30`}
  >
    {canDelete && (
      <div className="absolute top-1 right-8 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button 
          onClick={() => onDelete(id)}
          className="p-1.5 bg-bg-secondary hover:bg-brand-crimson text-text-muted hover:text-white rounded-lg shadow-xl border border-white/10 transition-all active:scale-90"
          title="Delete Message"
        >
          <X size={14} />
        </button>
      </div>
    )}
    <div className="w-10 shrink-0">
      {!hideGutter ? (
        <div className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95">
          <Avatar userId={userId} name={user} size={40} />
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
          <span className={`font-bold text-[16px] hover:underline cursor-pointer leading-tight font-display tracking-tight ${
            role === 'owner' ? 'text-brand-indigo' : role === 'admin' ? 'text-status-online' : role === 'moderator' ? 'text-purple-400' : 'text-white'
          }`}>{user}</span>
          
          {role && role !== 'member' && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm ${
              role === 'owner' ? 'bg-brand-indigo/20 text-brand-indigo' : 
              role === 'admin' ? 'bg-status-online/20 text-status-online' : 
              'bg-purple-400/20 text-purple-400'
            }`}>
              {role}
            </span>
          )}

          {user.toLowerCase().includes('bot') || user.toLowerCase().includes('ai') ? (
            <span className="bg-[#5865F2] text-white text-[10px] px-1 py-0.5 rounded-[4px] font-black flex items-center gap-0.5 select-none -translate-y-0.5 shadow-[0_0_10px_rgba(88,101,242,0.4)]">
              APP
            </span>
          ) : null}
          <span className="text-[#949BA4] text-[11px] font-bold select-none opacity-50">{time}</span>
        </div>
      )}
      <p className="text-[#DBDEE1] text-[15px] whitespace-pre-wrap leading-[22px] tracking-tight font-medium">
        {content}
      </p>
    </div>
  </motion.div>
);

const MemberCategory = ({ label, members }) => {
  const { selectDM } = usePlatform();
  
  return (
    <div className="mb-6">
      <h3 className="text-[#949BA4] text-[12px] font-bold tracking-wide mb-2 px-2 opacity-60 uppercase">{label}</h3>
      <div className="space-y-0.5">
        {members.map(member => (
          <div
            key={member.id || member.name}
            onClick={() => { if (member.id) selectDM(member.id); }}
            className="flex items-center gap-3 px-2 py-1.5 rounded-[8px] hover:bg-white/5 cursor-pointer group transition-all"
          >
          <div className="relative transition-transform group-hover:scale-105">
            <Avatar userId={member.id} name={member.name} size={32} status={member.status} />
          </div>
          <span className={`text-[14px] font-bold truncate transition-colors ${member.status === 'online' ? 'text-[#DBDEE1] group-hover:text-white' : 'text-[#80848E]'
            }`}>
            {member.name}
          </span>
          {member.role && member.role !== 'member' && (
            <span className={`ml-auto text-[8px] px-1 py-0.5 rounded-full font-black uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity ${
              member.role === 'owner' ? 'bg-brand-indigo/20 text-brand-indigo' : 
              member.role === 'admin' ? 'bg-status-online/20 text-status-online' : 
              'bg-purple-400/20 text-purple-400'
            }`}>
              {member.role}
            </span>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

const ChatView = ({ targetId }) => {
  const {
    activeServerId, channels, dmList, servers,
    sendMessage, setTyping, typingUsers,
    currentUser, showMemberList, setShowMemberList,
    setIsMobileMenuOpen, showThreadsSidebar, setShowThreadsSidebar,
    mutedChannels, toggleMute, pinnedMessages, togglePinMessage,
    showInbox, setShowInbox, showPins, setShowPins, notifications,
    userStatuses, selectDM, hasPermission, deleteMessage
  } = usePlatform();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const activeServer = servers.find(s => s.id === activeServerId);
  const channel = channels[activeServerId]?.find(c => c.id === targetId);
  
  // Find DM recipient from combined ID or direct ID
  let dm = null;
  if (targetId?.includes('_')) {
    const recipientId = targetId.split('_').find(id => id !== (currentUser?.uid || currentUser?.id));
    dm = dmList.find(d => d.id === recipientId);
  } else {
    dm = dmList.find(d => d.id === targetId);
  }

  const title = channel?.name || dm?.name || 'chat';
  const isMuted = mutedChannels.includes(targetId);
  const activeTypingUsers = typingUsers[targetId] || [];

  // Real-time Message Subscription with Crash Protection
  useEffect(() => {
    if (!targetId) return;
    try {
      const unsub = dbService.subscribeToMessages(targetId, (data) => {
        setMessages(data);
      }, (err) => {
        console.warn("Chat Firestore Error (Permissions?):", err.message);
        setMessages([]); // Fallback to empty instead of crashing
      });
      return unsub;
    } catch (err) {
      console.error("Critical Chat Subscription Error:", err);
    }
  }, [targetId]);

  // Filtering for local search
  const filteredMessages = messages.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (inputText.trim()) {
      // Optimistic Update
      const optimisticMsg = {
        id: 'optimistic-' + Date.now(),
        user: currentUser.name,
        userId: currentUser.id,
        content: inputText,
        time: 'sending...',
        timestamp: { seconds: Date.now() / 1000 }
      };
      setMessages(prev => [...prev, optimisticMsg]);
      
      sendMessage(targetId, inputText);
      setInputText('');
      setTyping(targetId, false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);

    // Typing Indicator Logic
    if (value.trim()) {
      setTyping(targetId, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(targetId, false);
      }, 3000);
    } else {
      setTyping(targetId, false);
    }
  };

  const startEditing = () => {
    if (!dm) {
      setEditName(title);
      setIsEditing(true);
    }
  };

  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: 'end'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Immediate scroll on channel switch to prevent the "hiding" effect
    scrollToBottom('auto');
  }, [targetId]);

  // Exclusive Sidebar Toggles
  const toggleMemberList = () => {
    setShowMemberList(!showMemberList);
    if (!showMemberList) setShowThreadsSidebar(false);
  };

  const toggleThreadsSidebar = () => {
    setShowThreadsSidebar(!showThreadsSidebar);
    if (!showThreadsSidebar) setShowMemberList(false);
  };

  // FORCE SCROLL RECOVERY SYSTEM
  return (
    <div className="flex-1 flex min-h-0 h-full bg-bg-primary relative overflow-hidden mesh-silk animate-mesh">
      <AnimatePresence>
        {showPins && (
          <PinsPopover
            channelName={title}
            pins={pinnedMessages[targetId] || []}
            onClose={() => setShowPins(false)}
            onUnpin={(msg) => togglePinMessage(targetId, msg)}
          />
        )}
        {showInbox && (
          <InboxPopover
            notifications={notifications}
            onClose={() => setShowInbox(false)}
          />
        )}
        {showHelp && (
          <HelpModal onClose={() => setShowHelp(false)} />
        )}
      </AnimatePresence>

      {/* Main Chat Area - STABLIZED FLEX HIERARCHY */}
      <div
        className="flex-1 flex flex-col min-w-0 h-full relative bg-transparent"
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
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-brand-indigo font-black text-2xl select-none leading-none">@</span>
                  <span className="font-extrabold text-white truncate font-display tracking-tight text-lg leading-tight">{dm.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold -mt-0.5 ml-0.5">
                  <div className="w-2 h-2 rounded-full bg-status-online" />
                  <span className="opacity-80">2 Online</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <Hash className="text-text-muted" size={24} strokeWidth={3} />
                  <span className="font-extrabold text-white truncate font-display tracking-tight text-lg leading-tight">
                    {title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold -mt-0.5 ml-0.5">
                  <div className="w-2 h-2 rounded-full bg-status-online" />
                  <span className="opacity-80">2 Online</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 p-1">
            <HeaderIcon
              icon={isMuted ? <BellOff size={20} className="text-[#f23f42]" /> : <Bell size={20} />}
              label={isMuted ? "Unmute" : "Mute"}
              active={isMuted}
              onClick={() => toggleMute(targetId)}
            />
            <HeaderIcon
              icon={<Pin size={20} />}
              label="Pins"
              active={showPins}
              onClick={() => setShowPins(!showPins)}
            />
            <HeaderIcon
              icon={<ThreadsIcon />}
              label="Threads"
              active={showThreadsSidebar}
              onClick={toggleThreadsSidebar}
            />
            <HeaderIcon
              icon={<Users size={20} />}
              label={showMemberList ? "Hide Member List" : "Show Member List"}
              active={showMemberList}
              onClick={toggleMemberList}
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
              <HeaderIcon
                icon={<Inbox size={20} />}
                label="Inbox"
                active={showInbox}
                onClick={() => setShowInbox(!showInbox)}
              />
              <HeaderIcon
                icon={<HelpCircle size={20} />}
                label="Help"
                onClick={() => setShowHelp(true)}
              />
            </div>
          </div>
        </header>

        {/* Messages Scroll Area - STRICT VIEWPORT CONSTRAINT */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-transparent scroll-smooth pb-32">
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
                <p className="text-text-muted text-[17px] font-medium leading-relaxed max-w-[500px] mb-8">
                  This is the very beginning of your direct message history with <span className="text-white">@{dm.name}</span>. Start something legendary.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-[400px]">
                  <HeroActionCard index={0} icon={<Users className="text-purple-400" size={24} />} label="Invite your friends" />
                  <HeroActionCard index={1} icon={<Pencil className="text-blue-400" size={24} />} label="Personalize your server" />
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
                <p className="text-text-muted text-[18px] font-medium leading-relaxed max-w-[540px] mb-8">
                  Take center stage in <span className="text-white font-bold">#{title}</span>. This is where your community starts its journey.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-[400px]">
                  <HeroActionCard index={0} icon={<Users className="text-purple-400" size={24} />} label="Invite your friends" />
                  <HeroActionCard index={1} icon={<Pencil className="text-blue-400" size={24} />} label="Personalize your server" />
                </div>
              </motion.div>
            )}
            <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent mt-16" />
          </div>

          <div className="px-4 space-y-0">
            {filteredMessages.map((msg, idx) => {
              const userRole = activeServer?.memberRoles?.[msg.userId] || 'member';
              const canDelete = hasPermission('manage_messages') || msg.userId === currentUser?.id;
              
              return (
                <Message
                  key={msg.id}
                  index={idx}
                  {...msg}
                  role={userRole}
                  onDelete={deleteMessage}
                  canDelete={canDelete}
                  hideGutter={idx > 0 && filteredMessages[idx - 1].user === msg.user}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Integrated Message Input Bar - PRO ERGONOMICS */}
        <div className="shrink-0 bg-bg-primary px-4 pb-6 pt-2 z-30 relative">
          {/* Typing Indicator Overlay */}
          <AnimatePresence>
            {activeTypingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-[-20px] left-8 flex items-center gap-2"
              >
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-brand-indigo rounded-full animate-bounce" />
                  <span className="w-1 h-1 bg-brand-indigo rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 h-1 bg-brand-indigo rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[12px] text-text-muted font-bold">
                  {activeTypingUsers.length === 1 
                    ? <><span className="text-white">{activeTypingUsers[0]}</span> is typing...</>
                    : <><span className="text-white">{activeTypingUsers.length} people</span> are typing...</>
                  }
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-[1240px] mx-auto flex flex-col items-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-bg-secondary w-full min-h-[44px] rounded-[8px] shadow-lg flex items-center gap-2 relative px-2 border border-white/5 mx-auto"
            >
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button className="p-1.5 text-[#B5BAC1] hover:text-white transition-colors"><PlusCircle size={22} /></button>
              </div>

              <div className="flex-1 min-w-0 py-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Message ${dm ? '@' : '#'}${title}`}
                  className="w-full bg-transparent text-[#DBDEE1] placeholder:text-[#949BA4] outline-none border-none focus:ring-0 focus:outline-none text-[15px] font-medium"
                />
              </div>

              <div className="flex items-center gap-1 sm:gap-2 pr-1 shrink-0">
                <button className="p-1.5 text-[#B5BAC1] hover:text-white transition-colors hidden sm:block"><Gift size={20} /></button>
                <button className="p-1.5 text-[#B5BAC1] hover:text-white transition-colors hidden sm:block"><Sticker size={20} /></button>
                <button className="p-1.5 text-[#B5BAC1] hover:text-white transition-colors"><Smile size={20} /></button>
                <button className="p-1.5 flex items-center justify-center text-[#B5BAC1] hover:text-[#DBDEE1] transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Utility Sidebars (Members/Threads) - Premium Flex Drawer */}
      <div className="lg:static relative h-full flex flex-col shrink-0">
        <AnimatePresence mode="wait">
          {showMemberList && !showThreadsSidebar && (
            <React.Fragment key="members">
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
                transition={{ type: "spring", damping: 40, stiffness: 500 }}
                className="fixed lg:static inset-y-0 right-0 bg-bg-secondary flex flex-col z-[251] lg:z-auto border-l border-black/20 overflow-hidden shadow-2xl h-full shrink-0"
              >
                <div className="px-5 h-14 flex items-center justify-between font-bold text-white border-b border-black/10 shrink-0 font-display transition-all">
                  <span className="text-[15px] tracking-tight">Members</span>
                  <div className="p-1 px-2.5 rounded-lg bg-brand-indigo/10 border border-brand-indigo/20">
                    <Users size={16} className="text-brand-indigo" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-[100px] lg:pb-6 bg-black/5">
                  {currentUser && (
                    <MemberCategory 
                      label="The Founder — 1" 
                      members={[{ 
                        id: currentUser.uid || currentUser.id, 
                        name: currentUser.displayName || currentUser.name, 
                        status: 'online',
                        role: activeServer?.memberRoles?.[currentUser.uid || currentUser.id] || 'owner'
                      }]} 
                    />
                  )}
                  <MemberCategory 
                    label={`Classmates — ${dmList.length}`} 
                    members={dmList.map(u => ({ 
                      ...u, 
                      status: userStatuses[u.id] || u.status,
                      role: activeServer?.memberRoles?.[u.id] || 'member'
                    }))} 
                  />
                </div>
              </motion.aside>
            </React.Fragment>
          )}

          {showThreadsSidebar && (
            <React.Fragment key="threads">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowThreadsSidebar(false)}
                className="lg:hidden fixed inset-0 bg-black/70 z-[250] backdrop-blur-sm"
              />
              <ThreadsSidebar key="threads" onClose={() => setShowThreadsSidebar(false)} />
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatView;
