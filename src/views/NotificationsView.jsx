import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Inbox, AtSign, UserPlus, Star, Info } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';
import HeaderIcon from '../components/HeaderIcon';

const NotificationsView = () => {
  const { notifications, setNotifications } = usePlatform();

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'mention': return <AtSign size={15} className="text-[#5865F2]" />;
      case 'request': return <UserPlus size={15} className="text-[#23A559]" />;
      case 'reaction': return <Star size={15} className="text-[#F0B232]" />;
      default: return <Info size={15} className="text-[#949BA4]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338]">
      {/* Header - Standardized to h-14 */}
      <header className="h-14 px-6 flex items-center justify-between border-b border-black/10 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <Bell size={22} className="text-text-muted" />
          <h1 className="text-white font-black text-[15px] tracking-tight font-display">Notifications</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[12px] font-bold text-white transition-all active:scale-95 border border-white/5"
          >
            <Check size={14} /> Mark all as read
          </button>
          <HeaderIcon icon={<Inbox size={22} />} label="Inbox" />
        </div>
      </header>

      {/* Content - Responsive Max-Width for Desktop */}
      <div className="flex-1 overflow-y-auto no-scrollbar mesh-silk">
        <div className="max-w-[800px] mx-auto p-6 sm:p-10 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] opacity-50 text-center px-8">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Bell size={48} className="text-text-muted" />
              </div>
              <h2 className="text-white font-bold text-lg mb-1 font-display">Quiet as a library</h2>
              <p className="text-sm">You're all caught up with your campus notifications.</p>
            </div>
          ) : (
            notifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ y: 30, opacity: 0, rotateX: -10, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
                transition={{ 
                  delay: idx * 0.08,
                  type: "spring",
                  stiffness: 260,
                  damping: 24
                }}
                className={`p-6 rounded-[24px] flex items-start gap-6 transition-all group cursor-pointer relative overflow-hidden ${
                  notif.unread ? 'glass border-brand-indigo/30 shadow-[0_20px_50px_rgba(88,101,242,0.1)]' : 'hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar name={notif.user} size={48} />
                  <div className="absolute -bottom-1.5 -right-1.5 bg-[#2b2d31] p-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-2 border-[#313338] transition-transform group-hover:scale-110">
                    {getIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold text-[15px] font-display">{notif.user}</span>
                    <span className="text-text-muted text-[12px] font-medium opacity-60 tracking-wider uppercase">{notif.time}</span>
                  </div>
                  <p className="text-[14px] text-text-normal leading-relaxed font-medium">{notif.content}</p>
                </div>
                {notif.unread && (
                  <div className="w-3 h-3 bg-brand-indigo rounded-full mt-2.5 shrink-0 shadow-[0_0_12px_rgba(88,101,242,0.8)] animate-pulse" />
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
