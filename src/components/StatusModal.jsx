import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smile, ChevronDown } from 'lucide-react';
import Avatar from './Avatar';
import EmojiPicker from './EmojiPicker';

const StatusModal = ({ user, onClose, onSave }) => {
  const [statusText, setStatusText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  
  const springTransition = { type: "spring", stiffness: 400, damping: 28 };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <AnimatePresence>
        {showEmojiPicker && (
          <EmojiPicker 
            onSelect={(emoji) => {
              setSelectedEmoji(emoji);
              setShowEmojiPicker(false);
            }}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}
      </AnimatePresence>

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={springTransition}
        className="relative w-full max-w-[440px] bg-[#1e1f22] rounded-xl overflow-visible shadow-2xl border border-white/5 flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <h2 className="text-white text-lg font-black font-display tracking-tight">Set your status</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-5 pb-6 space-y-6">
          {/* Mini Preview Section */}
          <div className="bg-[#111214] rounded-xl overflow-hidden border border-white/5 relative">
             <div className="h-20 bg-[#23a559] relative" />
             <div className="px-4 pb-4 relative">
                <div className="absolute -top-[32px] left-4 p-1.5 bg-[#111214] rounded-full">
                   <Avatar src={user.avatar} name={user.name} size={64} status={user.status} />
                </div>
                
                {/* Status Bubble Preview */}
                <motion.div 
                   className="absolute top-1 left-24 bg-[#2b2d31] border border-white/10 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 max-w-[200px]"
                   animate={{ x: [0, 5, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                   {selectedEmoji && <span className="text-sm">{selectedEmoji}</span>}
                   <span className="text-text-muted italic text-[11px] font-bold truncate">
                     {statusText || 'Shower thought?'}
                   </span>
                </motion.div>

                <div className="mt-12">
                   <h3 className="text-white font-black text-xl leading-none">{user.name}</h3>
                   <p className="text-text-muted text-[13px] font-bold opacity-60">
                     {user.handle || 'harshg7471'}
                   </p>
                </div>
             </div>
          </div>

          {/* Status Input Section */}
          <div className="space-y-2">
            <label className="text-text-muted text-[11px] font-black uppercase tracking-wider opacity-60 ml-1">Status</label>
            <div className="bg-black/20 rounded-lg flex items-center p-0.5 border border-white/5 focus-within:border-brand-indigo transition-colors">
               <button 
                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                 className="p-2 text-text-muted hover:text-white transition-colors"
                >
                 {selectedEmoji ? <span className="text-xl">{selectedEmoji}</span> : <Smile size={24} />}
               </button>
               <input 
                 type="text" 
                 value={statusText}
                 onChange={(e) => setStatusText(e.target.value)}
                 placeholder="Shower thought?"
                 className="flex-1 bg-transparent border-none outline-none text-white text-[15px] font-medium py-2 pr-4 placeholder:text-white/10"
               />
            </div>
          </div>

          {/* Settings Section */}
          <div className="flex items-center justify-between pt-2">
             <div className="flex items-center gap-1 group cursor-pointer">
                <span className="text-white text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">Clear tomorrow at 9:53 PM</span>
                <ChevronDown size={16} className="text-text-muted" />
             </div>
             <button 
               onClick={() => { onSave && onSave(statusText, selectedEmoji); onClose(); }}
               className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-8 py-2 rounded-lg font-bold transition-all shadow-lg shadow-brand-indigo/20 active:scale-95"
             >
               Save
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatusModal;
