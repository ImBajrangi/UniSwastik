import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, ChevronRight, UserCircle } from 'lucide-react';
import Avatar from './Avatar';

const UserProfileCard = ({ user, onClose }) => {
  const springTransition = { type: "spring", stiffness: 400, damping: 28 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={springTransition}
      className="fixed bottom-[72px] left-[72px] w-[340px] bg-[#111214] rounded-2xl overflow-visible shadow-[0_8px_48px_rgba(0,0,0,0.6)] z-[9999] border border-white/10"
    >
      {/* Banner */}
      <div className="h-[60px] w-full bg-[#23a559] relative shrink-0" />

      {/* Profile Section */}
      <div className="px-4 pb-4 relative flex flex-col">
        {/* Avatar Overlap */}
        <div className="absolute -top-[42px] left-4 p-1.5 bg-[#111214] rounded-full z-10">
          <Avatar src={user.avatar} name={user.name} size={80} status={user.status} />
        </div>

        <div className="mt-14 space-y-3 flex flex-col">
          {/* Identity */}
          <div className="bg-[#1e1f22] p-3 rounded-xl border border-white/5">
            <h2 className="text-white text-xl font-black font-display tracking-tight leading-tight">{user.name}</h2>
            <p className="text-text-muted text-sm font-bold opacity-80">{user.handle || (user.name.toLowerCase().replace(' ', '') + (user.discriminator || '7471'))}</p>
            
            <div className="w-full h-px bg-white/5 my-3" />

            <button className="w-full flex items-center justify-between group p-2 -mx-2 hover:bg-white/5 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Pencil size={16} className="text-text-muted group-hover:text-white transition-colors" />
                <span className="text-white text-sm font-bold">Edit Profile</span>
              </div>
              <ChevronRight size={16} className="text-text-muted group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Status Section */}
          <div className="bg-[#1e1f22] p-1 rounded-xl border border-white/5 overflow-hidden">
             <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors group">
               <div className="flex items-center gap-3">
                 <div className="w-4 h-4 rounded-full bg-[#23a559] border-2 border-[#1e1f22]" />
                 <span className="text-white text-[15px] font-bold">Online</span>
               </div>
               <ChevronRight size={18} className="text-text-muted group-hover:text-white transition-colors" />
             </button>
          </div>

          {/* Account Switch Section */}
          <div className="bg-[#1e1f22] p-1 rounded-xl border border-white/5 overflow-hidden">
             <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors group">
               <div className="flex items-center gap-3">
                 <UserCircle size={20} className="text-text-muted" />
                 <span className="text-white text-[15px] font-bold">Switch Accounts</span>
               </div>
               <ChevronRight size={18} className="text-text-muted group-hover:text-white transition-colors" />
             </button>
          </div>
        </div>
      </div>

      {/* Floating Badge (optional elite touch) */}
      <div className="absolute top-2 right-2 flex gap-1">
        <div className="w-6 h-6 rounded-md bg-black/20 flex items-center justify-center backdrop-blur-sm">
           <div className="w-3 h-3 rounded-full bg-brand-indigo" />
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfileCard;
