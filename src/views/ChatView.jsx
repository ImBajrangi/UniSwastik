import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hash, Bell, Pin, Users, Search, Inbox,
  HelpCircle, PlusCircle, Gift, Sticker,
  Smile, LayoutGrid, Menu, Pencil, ChevronRight, X, BellOff, Sparkles, Ghost,
  Paperclip, Image as ImageIcon, Check, SmilePlus, Reply, FileText, Download
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';
import Tooltip from '../components/Tooltip';
import HeaderIcon from '../components/HeaderIcon';
import PinsPopover from '../components/PinsPopover';
import InboxPopover from '../components/InboxPopover';
import HelpModal from '../components/HelpModal';
import ThreadsSidebar from '../components/ThreadsSidebar';
import EmojiPicker from '../components/EmojiPicker';
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

// --- Reaction Bar Component ---
const ReactionBar = ({ reactions = {}, messageId, currentUserId, onAddReaction, onRemoveReaction }) => {
  if (!reactions || Object.keys(reactions).length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {Object.entries(reactions).map(([emoji, userIds]) => {
        if (!Array.isArray(userIds) || userIds.length === 0) return null;
        const hasReacted = userIds.includes(currentUserId);
        return (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => hasReacted ? onRemoveReaction(messageId, emoji) : onAddReaction(messageId, emoji)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all duration-300 ${
              hasReacted 
                ? 'bg-brand-indigo/20 border-brand-indigo/40 text-brand-indigo shadow-[0_0_12px_rgba(88,101,242,0.2)]' 
                : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <span className="text-sm drop-shadow-sm">{emoji}</span>
            <span className="tracking-tighter">{userIds.length}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

// --- File Attachment Component ---
const FileAttachment = ({ attachment }) => {
  const isImage = attachment.type?.startsWith('image/');
  if (isImage) {
    return (
      <motion.a 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        href={attachment.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block mt-3 max-w-[400px] rounded-2xl overflow-hidden border border-white/10 hover:border-brand-indigo/40 transition-all group shadow-2xl"
      >
        <img src={attachment.url} alt={attachment.name} className="max-h-[350px] w-auto object-contain bg-black/40 group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
      </motion.a>
    );
  }
  return (
    <motion.a 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      href={attachment.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-4 mt-3 p-4 bg-[#2B2D31]/60 backdrop-blur-md border border-white/5 rounded-2xl max-w-[400px] hover:bg-white/5 hover:border-brand-indigo/30 transition-all group shadow-xl"
    >
      <div className="w-12 h-12 rounded-xl bg-brand-indigo/20 flex items-center justify-center shrink-0 shadow-inner"><FileText size={24} className="text-brand-indigo" /></div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[15px] font-bold truncate group-hover:text-brand-indigo transition-colors">{attachment.name}</p>
        <p className="text-text-muted text-[11px] font-black uppercase tracking-widest opacity-60 mt-0.5">{(attachment.size / 1024).toFixed(1)} KB • File</p>
      </div>
      <Download size={18} className="text-text-muted group-hover:text-white transition-colors shrink-0" />
    </motion.a>
  );
};

const Message = ({ id, user, userId, time, content, isMe, hideGutter, index, role, onDelete, canDelete, isAnonymous, reactions, attachments, edited, onAddReaction, onRemoveReaction, onEdit, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const quickReactions = ['👍', '❤️', '😂', '🔥', '👀'];

  const handleEditSave = () => {
    if (editText.trim() && (editText !== content)) {
      onEdit(id, editText);
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay: (index % 10) * 0.03 }}
      className={`flex gap-4 group hover:bg-white/[0.03] -mx-4 px-4 ${hideGutter ? 'py-0.5' : 'py-2 mt-4'} transition-all duration-200 relative border-l-2 border-transparent hover:border-brand-indigo/40`}
    >
      {/* Hover Action Toolbar - Elite Glassmorphism */}
      <div className="absolute -top-4 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 flex items-center gap-0.5 glass p-1 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 translate-y-1 group-hover:translate-y-0">
        <div className="flex items-center gap-0.5 px-1 border-r border-white/10 mr-1">
          {quickReactions.map(emoji => (
            <button key={emoji} onClick={() => onAddReaction(id, emoji)} className="w-8 h-8 flex items-center justify-center text-base rounded-lg hover:bg-white/10 transition-all hover:scale-125 active:scale-90">{emoji}</button>
          ))}
        </div>
        <button 
          onClick={() => setShowEmojiPicker(true)} 
          className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-white/10 transition-all" 
          title="Add Reaction"
        >
          <SmilePlus size={16} />
        </button>
        {userId === currentUserId && (
          <button 
            onClick={() => { setIsEditing(true); setEditText(content); }} 
            className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-white/10 transition-all" 
            title="Edit"
          >
            <Pencil size={16} />
          </button>
        )}
        {canDelete && (
          <button 
            onClick={() => onDelete(id)} 
            className="p-2 text-text-muted hover:text-brand-crimson rounded-lg hover:bg-white/10 transition-all" 
            title="Delete"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="w-10 shrink-0">
        {!hideGutter ? (
          <div className="relative cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-xl rounded-full">
            {isAnonymous ? (
              <div className="w-10 h-10 rounded-full bg-[#313338] border border-white/5 flex items-center justify-center text-[#B5BAC1] shadow-inner">
                <Ghost size={20} />
              </div>
            ) : (
              <Avatar userId={userId} name={user} size={40} />
            )}
          </div>
        ) : (
          <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-[#949BA4] mt-1 select-none font-black tracking-tighter transition-opacity">{time}</div>
        )}
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        {!hideGutter && (
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-bold text-[16px] hover:underline cursor-pointer leading-tight font-display tracking-tight transition-colors ${
              isAnonymous ? 'text-white' : role === 'owner' ? 'text-brand-indigo' : role === 'admin' ? 'text-status-online' : role === 'moderator' ? 'text-purple-400' : 'text-white'
            }`}>{isAnonymous ? "Anonymous" : user}</span>
            {role && role !== 'member' && !isAnonymous && (
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm ${
                role === 'owner' ? 'bg-brand-indigo/20 text-brand-indigo' : role === 'admin' ? 'bg-status-online/20 text-status-online' : 'bg-purple-400/20 text-purple-400'
              }`}>{role}</span>
            )}
            <span className="text-[#949BA4] text-[11px] font-bold select-none opacity-40 hover:opacity-100 transition-opacity">{time}</span>
          </div>
        )}
        
        {isEditing ? (
          <div className="bg-[#383A40] rounded-xl p-3 border border-brand-indigo/30 shadow-inner mt-1">
            <input
              type="text" 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setIsEditing(false); }}
              className="w-full bg-transparent text-white text-[15px] outline-none font-medium selection:bg-brand-indigo/40" 
              autoFocus
            />
            <div className="text-[10px] text-text-muted mt-2 font-bold uppercase tracking-widest flex gap-2">
              <span>escape to <button onClick={() => setIsEditing(false)} className="text-brand-crimson hover:underline">cancel</button></span>
              <span className="opacity-30">•</span>
              <span>enter to <button onClick={handleEditSave} className="text-brand-indigo hover:underline">save</button></span>
            </div>
          </div>
        ) : (
          <div className="text-[#DBDEE1] text-[15px] whitespace-pre-wrap leading-[22px] tracking-tight font-medium selection:bg-brand-indigo/30">
            {content}
            {edited && <span className="text-[10px] text-text-muted ml-2 font-black opacity-30 select-none">(edited)</span>}
          </div>
        )}

        {/* Attachments Rendering */}
        {attachments && attachments.length > 0 && (
          <div className="flex flex-col gap-1">
            {attachments.map((att, i) => <FileAttachment key={i} attachment={att} />)}
          </div>
        )}

        {/* Reactions Rendering */}
        <ReactionBar reactions={reactions} messageId={id} currentUserId={currentUserId} onAddReaction={onAddReaction} onRemoveReaction={onRemoveReaction} />
      </div>

      <AnimatePresence>
        {showEmojiPicker && (
          <EmojiPicker 
            onSelect={(emoji) => {
              onAddReaction(id, emoji);
              setShowEmojiPicker(false);
            }} 
            onClose={() => setShowEmojiPicker(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const MemberCategory = ({ label, members, isAnonymous }) => {
  const { selectDM } = usePlatform();
  
  return (
    <div className="mb-6">
      <h3 className="text-[#949BA4] text-[12px] font-bold tracking-wide mb-2 px-2 opacity-60 uppercase">{label}</h3>
      <div className="space-y-0.5">
        {members.map(member => (
          <div
            key={member.id || member.name}
            onClick={() => { if (member.id && !isAnonymous) selectDM(member.id); }}
            className={`flex items-center gap-3 px-2 py-1.5 rounded-[8px] hover:bg-white/5 cursor-pointer group transition-all ${isAnonymous ? 'cursor-default' : ''}`}
          >
          <div className="relative transition-transform group-hover:scale-105">
            {isAnonymous ? (
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#B5BAC1]">
                <Ghost size={16} />
              </div>
            ) : (
              <Avatar userId={member.id} name={member.name} size={32} status={member.status} />
            )}
          </div>
          <span className={`text-[14px] font-bold truncate transition-colors ${member.status === 'online' ? 'text-[#DBDEE1] group-hover:text-white' : 'text-[#80848E]'
            }`}>
            {isAnonymous ? "Anonymous student" : member.name}
          </span>
          {member.role && member.role !== 'member' && !isAnonymous && (
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
    userStatuses, selectDM, hasPermission, deleteMessage, joinServer,
    activeServerMembers, addReaction, removeReaction, updateMessage, uploadFile
  } = usePlatform();

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleSend = async () => {
    if (inputText.trim() || pendingFiles.length > 0) {
      // Upload files first
      let attachments = [];
      if (pendingFiles.length > 0) {
        setIsUploading(true);
        try {
          attachments = await Promise.all(
            pendingFiles.map(f => uploadFile(f))
          );
        } catch (err) {
          console.error("File upload failed:", err);
        }
        setIsUploading(false);
        setPendingFiles([]);
      }

      // Optimistic Update
      const optimisticMsg = {
        id: 'optimistic-' + Date.now(),
        user: currentUser.name,
        userId: currentUser.id,
        content: inputText,
        time: 'sending...',
        timestamp: { seconds: Date.now() / 1000 },
        reactions: {},
        attachments
      };
      setMessages(prev => [...prev, optimisticMsg]);
      
      sendMessage(targetId, inputText, attachments);
      setInputText('');
      setTyping(targetId, false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setPendingFiles(prev => [...prev, ...files]);
    }
    e.target.value = '';
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
  const isMember = (Array.isArray(activeServer?.members) && activeServer.members.includes(currentUser?.uid || currentUser?.id)) || activeServerId === 'home';
  
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
                  isAnonymous={activeServer?.isAnonymous}
                  hideGutter={idx > 0 && filteredMessages[idx - 1].user === msg.user}
                  onAddReaction={addReaction}
                  onRemoveReaction={removeReaction}
                  onEdit={updateMessage}
                  currentUserId={currentUser?.uid || currentUser?.id}
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
            <AnimatePresence mode="wait">
              {isMember ? (
                <motion.div
                  key="input"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="bg-bg-secondary w-full rounded-[8px] shadow-lg flex flex-col relative border border-white/5 mx-auto"
                >
                  {/* Hidden file input */}
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple className="hidden" />
                  
                  {/* Pending Files Preview */}
                  {pendingFiles.length > 0 && (
                    <div className="flex gap-2 px-3 pt-3 pb-1 overflow-x-auto no-scrollbar">
                      {pendingFiles.map((file, i) => (
                        <div key={i} className="relative shrink-0 w-[120px] h-[100px] rounded-lg bg-[#2B2D31] border border-white/10 overflow-hidden group">
                          {file.type?.startsWith('image/') ? (
                            <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                              <FileText size={24} className="text-brand-indigo" />
                              <span className="text-[10px] text-text-muted truncate w-full text-center">{file.name}</span>
                            </div>
                          )}
                          <button onClick={() => setPendingFiles(prev => prev.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 px-2 min-h-[44px]">
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-[#B5BAC1] hover:text-white transition-colors"><PlusCircle size={22} /></button>
                    </div>

                    <div className="flex-1 min-w-0 py-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isUploading ? 'Uploading...' : `Message ${dm ? '@' : '#'}${title}`}
                        disabled={isUploading}
                        className="w-full bg-transparent text-[#DBDEE1] placeholder:text-[#949BA4] outline-none border-none focus:ring-0 focus:outline-none text-[15px] font-medium disabled:opacity-50"
                      />
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 pr-1 shrink-0">
                      <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-[#B5BAC1] hover:text-white transition-colors hidden sm:block"><Paperclip size={20} /></button>
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
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="join-bar"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="bg-brand-indigo/10 border border-brand-indigo/30 p-4 rounded-xl flex items-center justify-between shadow-2xl backdrop-blur-md"
                >
                  <div className="p-3 bg-[#2B2D31]/80 backdrop-blur-md border border-white/5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="w-10 h-10 rounded-full bg-brand-indigo/20 flex items-center justify-center text-brand-indigo">
                      {activeServer?.isAnonymous ? <Ghost size={20} /> : <Hash size={20} />}
                    </div>
                    <div>
                      <h2 className="text-white font-black text-sm tracking-tight">{activeServer?.isAnonymous ? "Anonymous Campus" : `Welcome to #${title}!`}</h2>
                      <p className="text-[#B5BAC1] text-xs font-medium">
                        {activeServer?.isAnonymous 
                          ? "Your identity is hidden here. Speak your mind freely and respectfully." 
                          : `This is the start of the #${title} channel.`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => joinServer(activeServerId)}
                    className="bg-brand-indigo hover:bg-brand-indigo-hover text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                  >
                    Join Server
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
                  {currentUser && !activeServer?.isAnonymous && (
                    <MemberCategory 
                      label="The Founder — 1" 
                      isAnonymous={false}
                      members={activeServerMembers.filter(m => m.role === 'owner' || activeServer?.ownerId === m.id).map(m => ({
                        ...m,
                        status: userStatuses[m.id] || m.status
                      }))}
                    />
                  )}
                  <MemberCategory 
                    label={activeServer?.isAnonymous ? "Anonymous Students" : `Classmates — ${activeServerMembers.length}`} 
                    isAnonymous={activeServer?.isAnonymous}
                    members={activeServerMembers.filter(m => activeServer?.isAnonymous || (m.role !== 'owner' && activeServer?.ownerId !== m.id)).map(u => ({ 
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
