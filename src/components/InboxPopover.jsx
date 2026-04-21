import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, CheckCircle2, MessageSquare, AtSign, Settings2, Trash2 } from 'lucide-react';
import Avatar from './Avatar';

const InboxPopover = ({ notifications = [], onClose }) => {
  const [activeTab, setActiveTab] = useState('unread');
  const springTransition = { type: "spring", stiffness: 400, damping: 30 };

  const unreadCount = notifications.filter(n => n.unread).length;
  const filteredNotifs = activeTab === 'unread' 
    ? notifications.filter(n => n.unread) 
    : notifications.filter(n => n.type === 'mention');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={springTransition}
      onClick={(e) => e.stopPropagation()}
      className="fixed top-14 right-[120px] w-[min(480px,94vw)] h-auto max-h-[min(640px,85vh)] bg-[#2b2d31] rounded-xl shadow-[0_8px_48px_rgba(0,0,0,0.6)] z-[10002] border border-white/5 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 bg-[#1e1f22] border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2">
             <Inbox size={20} className="text-white" />
             <h3 className="text-white font-black text-lg tracking-tight">Inbox</h3>
             {unreadCount > 0 && (
               <span className="bg-[#f23f42] text-white text-[11px] font-black px-1.5 py-0.5 rounded-full">
                 {unreadCount}
               </span>
             )}
           </div>
           <div className="flex items-center gap-1">
              <button className="p-2 text-text-muted hover:text-white transition-colors" title="Settings">
                 <Settings2 size={18} />
              </button>
              <button className="p-2 text-text-muted hover:text-white transition-colors" title="Mark all as read">
                 <CheckCircle2 size={18} />
              </button>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
           <TabButton 
            active={activeTab === 'unread'} 
            onClick={() => setActiveTab('unread')}
            label="Unread"
           />
           <TabButton 
            active={activeTab === 'mentions'} 
            onClick={() => setActiveTab('mentions')}
            label="Mentions"
           />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div key={notif.id} className="p-3 hover:bg-white/5 rounded-lg group transition-all relative flex gap-3 cursor-pointer">
               <Avatar name={notif.user} size={32} />
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                     <span className="text-white font-bold text-[14px]">{notif.user}</span>
                     <span className="text-text-muted text-[11px] font-medium opacity-50">{notif.time}</span>
                  </div>
                  <p className="text-text-muted text-[13px] leading-tight mt-0.5">
                     {notif.content}
                  </p>
               </div>
               {notif.unread && (
                 <div className="w-2 h-2 rounded-full bg-brand-indigo shrink-0 self-center" />
               )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-brand-indigo/10 blur-xl rounded-full" />
               <Inbox size={32} className="text-text-muted opacity-40" />
            </div>
            <div className="space-y-1">
               <h4 className="text-white font-bold text-base">All caught up!</h4>
               <p className="text-text-muted text-sm px-10">Take center stage and start a conversation.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-[#1e1f22]/50 text-center border-t border-white/5">
         <button className="text-brand-indigo hover:underline text-[12px] font-bold">View all notifications</button>
      </div>
    </motion.div>
  );
};

const TabButton = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`pb-2 px-1 relative text-sm font-black transition-colors ${
      active ? 'text-white' : 'text-text-muted hover:text-white'
    }`}
  >
    {label}
    {active && (
      <motion.div 
        layoutId="inboxTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-indigo"
      />
    )}
  </button>
);

export default InboxPopover;
