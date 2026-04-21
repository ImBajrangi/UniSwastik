import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Hash, ChevronRight, Hash as ThreadIcon, Clock, Users } from 'lucide-react';

const threads = [
  { id: 't1', name: 'Lab Repo Questions', channel: 'ml-papers', author: 'Prof. Dev', time: '12m ago', posts: 24 },
  { id: 't2', name: 'Assignment 3 Discussion', channel: 'ml-papers', author: 'Harsh g', time: '1h ago', posts: 42, active: true },
  { id: 't3', name: 'Project Group Matching', channel: 'ml-papers', author: 'Alex Verified', time: '3h ago', posts: 156 },
];

const ThreadsSidebar = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-[300px] h-full bg-[#2b2d31] border-l border-white/5 flex flex-col shrink-0 relative z-20"
    >
      <header className="h-14 px-4 flex items-center justify-between border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
           <ThreadIcon size={20} className="text-[#949BA4]" />
           <h2 className="text-white font-bold text-base">Threads</h2>
        </div>
        <button onClick={onClose} className="text-[#949BA4] hover:text-white transition-colors">
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
         <div className="px-4 py-3">
            <p className="text-[#B5BAC1] text-xs font-medium leading-relaxed opacity-80">
              Threads help you focus on a specific topic within a channel without cluttering the main view.
            </p>
         </div>

         <div className="px-4 pb-2 border-b border-white/5 flex gap-4">
            <button 
              onClick={() => setActiveTab('active')}
              className={`text-sm font-black transition-colors relative pb-2 ${activeTab === 'active' ? 'text-white' : 'text-text-muted hover:text-white'}`}
            >
              Active
              {activeTab === 'active' && <motion.div layoutId="threadTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-indigo" />}
            </button>
            <button 
              onClick={() => setActiveTab('archived')}
              className={`text-sm font-black transition-colors relative pb-2 ${activeTab === 'archived' ? 'text-white' : 'text-text-muted hover:text-white'}`}
            >
              Archived
              {activeTab === 'archived' && <motion.div layoutId="threadTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-indigo" />}
            </button>
         </div>

         <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
            {activeTab === 'active' ? (
              <div className="space-y-1">
                 {threads.map(thread => (
                    <div key={thread.id} className="p-3 hover:bg-white/5 rounded-lg group cursor-pointer border border-transparent hover:border-white/5 transition-all">
                       <div className="flex items-center gap-2 mb-1">
                          <ThreadIcon size={14} className="text-brand-indigo" />
                          <span className="text-white font-bold text-sm truncate">{thread.name}</span>
                       </div>
                       <div className="flex items-center gap-3 text-[11px] text-text-muted font-medium ml-5">
                          <div className="flex items-center gap-1">
                             <Users size={12} className="opacity-60" />
                             {thread.posts} posts
                          </div>
                          <div className="flex items-center gap-1">
                             <Clock size={12} className="opacity-60" />
                             {thread.time}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4 opacity-40">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <ThreadIcon size={32} className="text-[#949BA4]" />
                 </div>
                 <span className="text-[#949BA4] text-sm font-bold">No archived threads found</span>
              </div>
            )}
         </div>
      </div>
    </motion.div>
  );
};

export default ThreadsSidebar;
