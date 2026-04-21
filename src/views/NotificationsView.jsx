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
      case 'mention': return <AtSign size={16} className="text-[#5865F2]" />;
      case 'request': return <UserPlus size={16} className="text-[#23A559]" />;
      case 'reaction': return <Star size={16} className="text-[#F0B232]" />;
      default: return <Info size={16} className="text-[#949BA4]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338]">
      {/* Header */}
      <header className="h-12 px-4 flex items-center justify-between border-b border-black/20 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-text-muted" />
          <h1 className="text-white font-black text-[15px] tracking-tight font-display">Notifications</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[12px] font-bold text-white transition-colors"
          >
            <Check size={14} /> Mark all as read
          </button>
          <HeaderIcon icon={<Inbox size={20} />} label="Inbox" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2 mesh-silk">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] opacity-50 text-center px-8">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Bell size={48} className="text-text-muted" />
            </div>
            <h2 className="text-white font-bold text-lg mb-1">Quiet as a library</h2>
            <p className="text-sm">You're all caught up with your campus notifications.</p>
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-xl flex items-start gap-4 transition-all group cursor-pointer ${
                notif.unread ? 'bg-brand-indigo/5 border border-brand-indigo/20 shadow-lg' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="relative">
                <Avatar name={notif.user} size={40} />
                <div className="absolute -bottom-1 -right-1 bg-[#2b2d31] p-1 rounded-full shadow-lg">
                  {getIcon(notif.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white font-bold text-[14px]">{notif.user}</span>
                  <span className="text-text-muted text-[11px] font-medium">{notif.time}</span>
                </div>
                <p className="text-[14px] text-text-normal leading-relaxed">{notif.content}</p>
              </div>
              {notif.unread && (
                <div className="w-2.5 h-2.5 bg-brand-indigo rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(88,101,242,0.8)]" />
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
