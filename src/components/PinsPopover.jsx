import React from 'react';
import { motion } from 'framer-motion';
import { Pin, X, MessageSquare, Trash2 } from 'lucide-react';
import Avatar from './Avatar';

const PinsPopover = ({ channelName, pins = [], onClose, onUnpin }) => {
  const springTransition = { type: "spring", stiffness: 400, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={springTransition}
      onClick={(e) => e.stopPropagation()}
      className="fixed top-14 right-[300px] w-[min(480px,90vw)] h-auto max-h-[min(560px,80vh)] bg-[#2b2d31] rounded-xl shadow-[0_8px_48px_rgba(0,0,0,0.6)] z-[10002] border border-white/5 overflow-hidden flex flex-col"
    >
      <div className="p-4 bg-[#1e1f22] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Pin size={18} className="text-[#949BA4]" />
           <h3 className="text-white font-bold text-base">Pinned Messages</h3>
           <span className="text-text-muted text-sm font-medium opacity-60">#{channelName}</span>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
        {pins.length > 0 ? (
          pins.map((pin) => (
            <div key={pin.id} className="bg-[#1e1f22] p-4 rounded-lg relative group border border-white/5 hover:border-brand-indigo/30 transition-all">
               <div className="flex gap-4">
                  <Avatar name={pin.user} size={40} />
                  <div className="flex flex-col min-w-0">
                     <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-[15px]">{pin.user}</span>
                        <span className="text-text-muted text-[11px] font-medium opacity-50">{pin.time}</span>
                     </div>
                     <p className="text-[#DBDEE1] text-sm mt-1 whitespace-pre-wrap">{pin.content}</p>
                  </div>
               </div>
               
               <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-[#2b2d31] text-[#949BA4] hover:text-white rounded-md transition-colors shadow-lg">Jump</button>
                  <button 
                    onClick={() => onUnpin(pin)}
                    className="p-1.5 bg-[#2b2d31] text-[#f23f42] hover:bg-[#f23f42] hover:text-white rounded-md transition-all shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
               <Pin size={32} className="text-text-muted opacity-20" />
            </div>
            <div className="space-y-1">
               <h4 className="text-white font-bold">No pins yet.</h4>
               <p className="text-text-muted text-sm px-4">Pin important messages in this channel to see them here later!</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-[#1e1f22]/50 text-center">
         <span className="text-[#949BA4] text-[11px] font-medium uppercase tracking-wider opacity-60">Pins are visible to everyone</span>
      </div>
    </motion.div>
  );
};

export default PinsPopover;
