import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Bell, Pin, Users, Inbox, HelpCircle, PlusCircle, Gift, Sticker, Smile } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';

const ChatView = ({ targetId }) => {
  const { 
    activeServerId, channels, dmList, 
    messageHistory, sendMessage 
  } = usePlatform();
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const channel = channels[activeServerId]?.find(c => c.id === targetId);
  const dm = dmList.find(d => d.id === targetId);
  const title = channel?.name || dm?.name || 'chat';

  const messages = messageHistory[targetId] || [];

  const handleSend = (e) => {
    if (e.key === 'Enter' && inputText.trim()) {
      sendMessage(targetId, inputText);
      setInputText('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Header with Glassmorphism */}
      <header className="view-header justify-between glass sticky top-0 bg-transparent">
        <div className="flex items-center gap-2">
          {dm ? <span className="text-channel-icon text-xl">@</span> : <Hash size={24} className="text-channel-icon" />}
          <span className="text-white font-bold text-sm tracking-tight">{title}</span>
        </div>
        
        <div className="flex items-center gap-4 text-interactive-normal" role="toolbar" aria-label="Chat actions">
          <HeaderIcon icon={<Bell size={20} />} label="Notifications" />
          <HeaderIcon icon={<Pin size={20} />} label="Pinned Messages" />
          <HeaderIcon icon={<Users size={20} />} label="Member List" />
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-bg-tertiary h-6 px-2 rounded text-xs w-[144px] focus:w-[240px] outline-none transition-all placeholder:text-text-muted" 
              aria-label="Search channel messages"
            />
          </div>
          <HeaderIcon icon={<Inbox size={20} />} label="Inbox" />
          <HeaderIcon icon={<HelpCircle size={20} />} label="Help" />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col no-scrollbar">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mb-2 shadow-inner">
            {dm ? <Avatar src={dm.avatar} name={dm.name} size={64} /> : <Hash size={40} className="text-white" />}
          </div>
          <h1 className="text-white text-3xl font-bold mb-1">Welcome to {dm ? dm.name : `#${title}`}!</h1>
          <p className="text-text-muted text-sm font-medium">
            {dm ? `This is the beginning of your direct message history with ${dm.name}.` : `This is the start of the #${title} channel.` }
          </p>
        </motion.div>

        <div className="flex flex-col">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Message 
                  user={msg.user} 
                  time={msg.time} 
                  content={msg.content} 
                  isMe={msg.isMe} 
                  hideGutter={idx > 0 && messages[idx-1].user === msg.user}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Bar with Polish */}
      <div className="px-4 pb-6">
        <div className="bg-[#383a40] rounded-lg p-2.5 flex items-center gap-3 shadow-lg border border-white/5 focus-within:shadow-xl transition-shadow">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-interactive-normal hover:text-interactive-hover">
            <PlusCircle size={24} />
          </motion.button>
          
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleSend}
            placeholder={`Message ${dm ? '@' + dm.name : '#' + title}`}
            className="flex-1 bg-transparent text-text-normal placeholder:text-text-muted outline-none text-[15px]"
            aria-label={`Send message to ${title}`}
          />
          
          <div className="flex items-center gap-3 text-interactive-normal pr-1">
            <PremiumInputIcon icon={<Gift size={22} />} />
            <PremiumInputIcon icon={<Sticker size={22} />} />
            <PremiumInputIcon icon={<Smile size={22} />} />
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderIcon = ({ icon, label }) => (
  <motion.div 
    whileHover={{ color: "white" }} 
    className="hover:text-interactive-hover cursor-pointer transition-colors relative group"
    title={label}
    aria-label={label}
    tabIndex={0}
  >
    {React.cloneElement(icon, { strokeWidth: 2.2 })}
  </motion.div>
);

const PremiumInputIcon = ({ icon }) => (
  <motion.div whileHover={{ scale: 1.1, color: "white" }} className="cursor-pointer transition-colors">
    {icon}
  </motion.div>
);

const Message = ({ user, time, content, badge, isMe, hideGutter }) => (
  <div className={`flex gap-4 group hover:bg-[#2e3035]/50 -mx-4 px-4 ${hideGutter ? 'py-[2px]' : 'py-2 mt-3'} transition-colors relative`}>
    {!hideGutter ? (
      <Avatar name={user} size={40} status="online" />
    ) : (
      <div className="w-10 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-text-muted mt-1">
        {time}
      </div>
    )}
    <div className="flex flex-col min-w-0">
      {!hideGutter && (
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`font-semibold text-sm hover:underline cursor-pointer tracking-tight ${isMe ? 'text-status-online' : 'text-white'}`}>{user}</span>
          {badge && <span className="bg-bg-accent text-white text-[10px] px-1 rounded font-bold uppercase">{badge}</span>}
          <span className="text-text-muted text-[10px] font-medium">{time}</span>
        </div>
      )}
      <p className="text-text-normal text-[15px] whitespace-pre-wrap leading-tight">{content}</p>
    </div>
  </div>
);

export default ChatView;
