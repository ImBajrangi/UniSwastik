import React from 'react';
import { motion } from 'framer-motion';
import { X, HelpCircle, Book, ShieldCheck, Zap, Hash } from 'lucide-react';

const HelpModal = ({ onClose }) => {
  const springTransition = { type: "spring", stiffness: 400, damping: 28 };

  return (
    <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={springTransition}
        className="relative w-full max-w-[640px] bg-[#2b2d31] rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex flex-col h-[min(640px,90vh)]"
      >
        {/* Banner */}
        <div className="h-32 bg-brand-indigo relative overflow-hidden flex items-center px-8 shrink-0">
           <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-12 gap-1 rotate-12 -translate-y-12">
                 {[...Array(48)].map((_, i) => (
                    <Hash key={i} size={40} className="text-white" />
                 ))}
              </div>
           </div>
           <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                 <HelpCircle size={40} className="text-white" />
              </div>
              <div className="flex flex-col">
                 <h2 className="text-white text-3xl font-black font-display tracking-tight">Help Center</h2>
                 <p className="text-white/80 font-bold">Discover everything Swastik Platform has to offer.</p>
              </div>
           </div>
           <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all">
              <X size={20} />
           </button>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth thin-scrollbar">
           <section className="space-y-4">
              <h3 className="text-white/40 text-xs font-black uppercase tracking-widest pl-1">QUICK START</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <HelpCard 
                  icon={<Zap className="text-yellow-400" size={24} />} 
                  title="Shortcuts" 
                  desc="Learn the pro-level hotkeys for lightning speed."
                 />
                 <HelpCard 
                  icon={<Book className="text-blue-400" size={24} />} 
                  title="Guidebook" 
                  desc="Everything you need to know about servers."
                 />
                 <HelpCard 
                  icon={<ShieldCheck className="text-green-400" size={24} />} 
                  title="Safety" 
                  desc="Privacy settings and community guidelines."
                 />
                 <HelpCard 
                  icon={<Hash className="text-brand-indigo" size={24} />} 
                  title="Channels" 
                  desc="Differences between text, voice, and rules."
                 />
              </div>
           </section>

           <section className="space-y-4">
              <h3 className="text-white/40 text-xs font-black uppercase tracking-widest pl-1">POPULAR ARTICLES</h3>
              <div className="space-y-2">
                 <HelpListItem title="How to verify your Swastik ID?" />
                 <HelpListItem title="Connecting your University schedule" />
                 <HelpListItem title="Creating your first private society" />
                 <HelpListItem title="Customizing your campus profile" />
              </div>
           </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1e1f22] border-t border-white/5 flex items-center justify-between">
           <span className="text-text-muted text-xs font-bold opacity-60 ml-2">Version 4.2.0 (Elite Edition)</span>
           <button className="bg-brand-indigo hover:bg-brand-indigo/90 text-white px-6 py-2 rounded-lg font-black text-sm transition-all shadow-lg active:scale-95">
              Contact Support
           </button>
        </div>
      </motion.div>
    </div>
  );
};

const HelpCard = ({ icon, title, desc }) => (
  <div className="p-4 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-xl transition-all group cursor-pointer">
     <div className="mb-3 transform transition-transform group-hover:scale-110 group-hover:-rotate-3">{icon}</div>
     <h4 className="text-white font-black text-lg mb-1">{title}</h4>
     <p className="text-text-muted text-sm leading-snug">{desc}</p>
  </div>
);

const HelpListItem = ({ title }) => (
  <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
     <span className="text-[#DBDEE1] font-bold group-hover:text-white transition-colors">{title}</span>
     <ChevronRight className="text-text-muted opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" size={18} />
  </div>
);

// Shorthand for internal Chevron
const ChevronRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default HelpModal;
