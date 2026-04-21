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

const HeaderIcon = ({ icon, label, onClick, active }) => (
  <Tooltip content={label}>
    <button 
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer relative group ${
        active ? 'text-white' : 'hover:bg-[#404249] hover:text-[#DBDEE1] text-[#B5BAC1]'
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
          <span className={`font-bold text-[16px] hover:underline cursor-pointer leading-tight text-white`}>{user}</span>
          <span className="text-[#949BA4] text-[12px] font-medium select-none">{time}</span>
        </div>
      )}
      <p className="text-[#DBDEE1] text-[16px] whitespace-pre-wrap leading-[22px] tracking-tight">{content}</p>
    </div>
  </motion.div>
);

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

  const handleRename = (e) => {
    if (e.key === 'Enter' && editName.trim()) {
      updateChannel(activeServerId, targetId, { name: editName.trim() });
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
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
    <div className="flex-1 flex min-h-0 h-full bg-[#313338] relative overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top Header - Discord Style */}
        <header className="h-12 px-4 flex items-center justify-between shadow-sm border-b border-black/20 shrink-0 bg-[#313338] z-10">
          <div className="flex items-center gap-2 overflow-hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-[#B5BAC1] hover:text-white mr-1 transition-colors"
            >
              <Menu size={24} />
            </button>
            {dm ? (
              <div className="flex items-center gap-2">
                <span className="text-[#80848E] text-2xl">@</span>
                <span className="font-bold text-white truncate">{dm.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Hash className="text-[#80848E]" size={24} />
                <span className="font-bold text-white truncate">
                  {title}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 p-1">
            <HeaderIcon icon={<Bell size={20} />} label="Mute" />
            <HeaderIcon icon={<Pin size={20} />} label="Pins" />
            <HeaderIcon 
              icon={<Users size={20} />} 
              label={showMemberList ? "Hide Member List" : "Show Member List"}
              active={showMemberList}
              onClick={() => setShowMemberList(!showMemberList)}
            />
            
            <div className="hidden sm:flex relative group ml-1 mr-1">
              <div className="bg-[#1E1F22] flex items-center h-6 px-2 rounded-md w-[144px] transition-all group-focus-within:w-[240px]">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search" 
                  className="bg-transparent border-none outline-none text-[13px] text-white w-full placeholder:text-[#949BA4]" 
                />
                <Search size={14} className="text-[#949BA4] shrink-0" />
              </div>
            </div>
            
            <div className="hidden sm:flex">
              <HeaderIcon icon={<Inbox size={20} />} label="Inbox" />
              <HeaderIcon icon={<HelpCircle size={20} />} label="Help" />
            </div>
          </div>
        </header>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-4 min-h-0">
          {/* Welcome Block - Discord UI */}
          <div className="px-4 py-8">
            <div className="w-20 h-20 rounded-full bg-[#41434A] flex items-center justify-center mb-4 transition-transform hover:scale-105 cursor-pointer">
              <Hash size={45} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to #{title}!</h1>
            <p className="text-[#B5BAC1]">This is the start of the #{title} channel.</p>
            {!dm && (
              <button 
                onClick={startEditing}
                className="flex items-center gap-1 text-[#00A8FC] hover:underline mt-2 text-sm font-medium"
              >
                <Pencil size={14} /> Edit Channel
              </button>
            )}
          </div>

          <div className="space-y-0 pb-4">
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

        {/* Message Input Container - Discord UI */}
        <div className="px-4 pb-6 shrink-0 bg-[#313338]">
          <div className="bg-[#383A40] rounded-lg flex items-center px-4 py-2 gap-4">
            <button className="text-[#B5BAC1] hover:text-white transition-colors shrink-0">
              <PlusCircle size={24} />
            </button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message #${title}`} 
              className="flex-1 bg-transparent text-[#DBDEE1] placeholder:text-[#949BA4] outline-none text-[16px]"
            />
            
            <div className="flex items-center gap-0.5 sm:gap-1 pr-1 sm:pr-2 text-[#B5BAC1] shrink-0">
              <div className="hidden xs:flex">
                <Tooltip content="Send a gift">
                  <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-[#404249] hover:text-white transition-all"><Gift size={20} /></button>
                </Tooltip>
              </div>
              <div className="hidden sm:flex">
                <Tooltip content="Send a GIF">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#404249] hover:text-white transition-all font-black text-[10px] px-1 border-2 border-current rounded-[3px] scale-90">GIF</button>
                </Tooltip>
              </div>
              <Tooltip content="Send a sticker">
                <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-[#404249] hover:text-white transition-all"><Sticker size={20} /></button>
              </Tooltip>
              <Tooltip content="Select Emoji">
                <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-[#404249] hover:text-white transition-all"><Smile size={20} /></button>
              </Tooltip>
              <div className="hidden xs:flex">
                <Tooltip content="Choose an activity">
                  <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-[#404249] hover:text-white transition-all"><LayoutGrid size={18} fill="currentColor" /></button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Sidebar - Desktop Column / Mobile Drawer */}
      <AnimatePresence>
        {showMemberList && (
          <>
            {/* Mobile Member Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMemberList(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-[100]"
            />
            {/* Member List */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:static inset-y-0 right-0 w-60 bg-[#2B2D31] flex flex-col z-[101] lg:z-auto border-l border-black/20 overflow-hidden"
            >
              <div className="p-4 h-12 flex items-center font-bold text-white border-b border-black/10 shrink-0">
                Members
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
                <MemberCategory label="Online — 1" members={[{ name: currentUser.name, status: 'online' }]} />
                <MemberCategory 
                  label="Offline — 3" 
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
  );
};

export default ChatView;
