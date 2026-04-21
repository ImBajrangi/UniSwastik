import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash, Bell, Pin, Users, Inbox, HelpCircle, 
  PlusCircle, Gift, Sticker, Smile, Pencil,
  ChevronRight, Search, FileText, LayoutGrid
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';
import Tooltip from '../components/Tooltip';

// Custom Threads icon since Lucide doesn't have a perfect match
const ThreadsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
    <path d="M12 12L2.1 12" />
    <path d="M12 12V22.1" />
  </svg>
);

const ChatView = ({ targetId }) => {
  const { 
    activeServerId, channels, dmList, 
    messageHistory, sendMessage, updateChannel,
    currentUser, showMemberList, setShowMemberList
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

  const handleSend = (e) => {
    if (e.key === 'Enter' && inputText.trim()) {
      sendMessage(targetId, inputText);
      setInputText('');
    }
  };

  const handleRename = (e) => {
    if (e.key === 'Enter' && editName.trim()) {
      updateChannel(activeServerId, targetId, { name: editName.trim() });
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setEditName(title);
    setIsEditing(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex min-h-0 bg-[#313338] relative overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header - Discord Style */}
        <header className="h-12 px-4 flex items-center justify-between shadow-sm border-b border-black/20 shrink-0 bg-[#313338] z-10">
          <div className="flex items-center gap-2 overflow-hidden">
            {dm ? (
              <div className="flex items-center gap-2">
                <span className="text-[#80848E] text-2xl">@</span>
                <span className="text-white font-bold text-[15px] truncate">{dm.name}</span>
                <div className="w-2.5 h-2.5 rounded-full bg-[#23A559] border-2 border-[#313338]" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Hash size={24} className="text-[#80848E]" strokeWidth={2.5} />
                <span className="text-white font-bold text-[15px] truncate">{title}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-[#B5BAC1]">
            <HeaderIcon icon={<Bell size={20} />} label="Mute" />
            <HeaderIcon icon={<Pin size={20} />} label="Pins" />
            <HeaderIcon icon={<ThreadsIcon />} label="Threads" />
            <HeaderIcon 
              icon={<Users size={20} />} 
              label={showMemberList ? "Hide Member List" : "Show Member List"}
              active={showMemberList}
              onClick={() => setShowMemberList(!showMemberList)}
            />
            
            <div className="relative group">
              <div className="bg-[#1E1F22] flex items-center h-6 px-2 rounded-md w-[144px] transition-all group-focus-within:w-[240px]">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search" 
                  className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-[#949BA4]" 
                />
                <Search size={14} className="text-[#949BA4]" />
              </div>
            </div>
            
            <HeaderIcon icon={<Inbox size={20} />} label="Inbox" />
            <HeaderIcon icon={<HelpCircle size={20} />} label="Help" />
          </div>
        </header>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
          {/* Welcome Block - Discord UI */}
          <div className="px-4 py-8">
            <div className="w-20 h-20 rounded-full bg-[#41434A] flex items-center justify-center mb-4 transition-transform hover:scale-105 cursor-pointer">
              {dm ? (
                <Avatar src={dm.avatar} name={dm.name} size={80} />
              ) : (
                <Hash size={48} className="text-white" strokeWidth={2.5} />
              )}
            </div>
            
            {isEditing ? (
              <div className="mb-2">
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleRename}
                  onBlur={() => setIsEditing(false)}
                  className="bg-[#1E1F22] text-white text-[32px] font-bold p-1 rounded outline-none border-2 border-[#5865F2] w-full max-w-[400px]"
                />
                <div className="text-[12px] text-[#B5BAC1] mt-1">Press <span className="font-bold">Enter</span> to save, <span className="font-bold">Esc</span> to cancel</div>
              </div>
            ) : (
              <h1 className="text-white text-[32px] font-bold mb-2 leading-tight flex items-center gap-2 group">
                Welcome to {dm ? dm.name : `#${title}`}!
                {!dm && (
                  <button onClick={startEditing} className="opacity-0 group-hover:opacity-100 text-[#B5BAC1] hover:text-white transition-opacity">
                    <Pencil size={18} />
                  </button>
                )}
              </h1>
            )}

            <p className="text-[#B5BAC1] text-[16px] leading-[20px] mb-4">
              {dm 
                ? `This is the beginning of your direct message history with ${dm.name}.` 
                : `This is the start of the #${title} channel.` 
              }
            </p>
            
            {/* Edit Channel Button */}
            {!dm && !isEditing && (
              <button
                onClick={startEditing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#4E5058]/60 hover:bg-[#4E5058] text-white text-[14px] font-medium transition-colors"
              >
                <Pencil size={14} />
                Edit Channel
              </button>
            )}
          </div>

          {/* Message List */}
          <div className="flex flex-col">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <Message 
                  key={msg.id}
                  user={msg.user} 
                  time={msg.time} 
                  content={msg.content} 
                  isMe={msg.isMe} 
                  hideGutter={idx > 0 && messages[idx-1].user === msg.user}
                />
              ))}
            </AnimatePresence>
            {searchQuery && messages.length === 0 && (
              <div className="px-4 py-8 text-center text-[#949BA4]">
                <div className="mb-2">No results for <span className="text-white font-bold">"{searchQuery}"</span></div>
                <button onClick={() => setSearchQuery('')} className="text-[#00A8FC] hover:underline text-sm">Clear search</button>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Message Input Bar - Perfected Discord UI */}
        <div className="px-4 pb-6 shrink-0 z-10">
          <div className="bg-[#383A40] rounded-lg min-h-[44px] px-3 py-2 flex items-center gap-4 transition-all focus-within:shadow-md">
            <button className="text-[#B5BAC1] hover:text-white transition-colors">
              <PlusCircle size={24} fill="currentColor" stroke="#383A40" />
            </button>
            
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleSend}
              placeholder={`Message ${dm ? '@' + dm.name : '#' + title}`}
              className="flex-1 bg-transparent text-[#DBDEE1] placeholder:text-[#949BA4] outline-none text-[16px]"
            />
            
            <div className="flex items-center gap-3 text-[#B5BAC1] shrink-0">
              <Tooltip content="Send a gift">
                <button className="hover:text-white transition-colors"><Gift size={22} /></button>
              </Tooltip>
              <Tooltip content="Send a GIF">
                <button className="hover:text-white transition-colors font-black text-xs px-1 border-2 border-current rounded-[3px] scale-90">GIF</button>
              </Tooltip>
              <Tooltip content="Send a sticker">
                <button className="hover:text-white transition-colors"><Sticker size={22} /></button>
              </Tooltip>
              <Tooltip content="Select Emoji">
                <button className="hover:text-white transition-colors"><Smile size={22} /></button>
              </Tooltip>
              <Tooltip content="Choose an activity">
                <button className="hover:text-white transition-colors"><LayoutGrid size={18} fill="currentColor" /></button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Member List */}
      <AnimatePresence>
        {showMemberList && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[#2B2D31] shrink-0 border-l border-black/20 overflow-hidden flex flex-col"
          >
            <div className="h-12 h-px" /> {/* Header alignment spacer */}
            <div className="flex-1 overflow-y-auto p-3 pt-6 no-scrollbar">
              <MemberCategory label="Online — 1" members={[{ name: currentUser.name, status: 'online', isMe: true }]} />
              <MemberCategory 
                label="Offline — 3" 
                members={[
                  { name: 'Hars g', status: 'offline' },
                  { name: 'Swastik AI', status: 'offline' },
                  { name: 'Study Buddy', status: 'offline' }
                ]} 
              />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

const MemberCategory = ({ label, members }) => (
  <div className="mb-6">
    <h3 className="text-[#949BA4] text-[12px] font-bold uppercase tracking-wider mb-2 px-2">{label}</h3>
    <div className="space-y-0.5">
      {members.map(member => (
        <div 
          key={member.name}
          className="flex items-center gap-3 px-2 py-1.5 rounded-[4px] hover:bg-[#35373C] cursor-pointer group transition-colors"
        >
          <div className="relative">
            <Avatar name={member.name} size={32} />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#2B2D31] ${
              member.status === 'online' ? 'bg-[#23A559]' : 'bg-[#80848E]'
            }`} />
          </div>
          <span className={`text-[15px] font-medium leading-tight truncate ${
            member.status === 'online' ? 'text-white' : 'text-[#80848E]'
          }`}>
            {member.name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const HeaderIcon = ({ icon, label, onClick, active }) => (
  <Tooltip content={label}>
    <button 
      onClick={onClick}
      className={`transition-colors cursor-pointer relative group p-1 ${
        active ? 'text-white' : 'hover:text-[#DBDEE1] text-[#B5BAC1]'
      }`}
    >
      {icon}
    </button>
  </Tooltip>
);

const Message = ({ user, time, content, isMe, hideGutter }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`flex gap-4 group hover:bg-[#2e3035]/30 -mx-4 px-4 ${hideGutter ? 'py-0.5' : 'py-2 mt-4'} transition-colors relative`}
  >
    <div className="w-10 shrink-0">
      {!hideGutter ? (
        <Avatar name={user} size={40} />
      ) : (
        <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-[#949BA4] mt-1 select-none font-medium">
          {time}
        </div>
      )}
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      {!hideGutter && (
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`font-bold text-[16px] hover:underline cursor-pointer leading-tight ${isMe ? 'text-white' : 'text-white'}`}>{user}</span>
          <span className="text-[#949BA4] text-[12px] font-medium select-none">{time}</span>
        </div>
      )}
      <p className="text-[#DBDEE1] text-[16px] whitespace-pre-wrap leading-[22px] tracking-tight">{content}</p>
    </div>
  </motion.div>
);

export default ChatView;
