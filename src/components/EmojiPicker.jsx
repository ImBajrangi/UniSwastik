import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Smile, Leaf, Coffee, Gamepad2, Bike, Lightbulb, Heart, Flag } from 'lucide-react';

const categories = [
  { id: 'recent', icon: <Clock size={18} /> },
  { id: 'people', icon: <Smile size={18} /> },
  { id: 'nature', icon: <Leaf size={18} /> },
  { id: 'food', icon: <Coffee size={18} /> },
  { id: 'activity', icon: <Gamepad2 size={18} /> },
  { id: 'travel', icon: <Bike size={18} /> },
  { id: 'objects', icon: <Lightbulb size={18} /> },
  { id: 'symbols', icon: <Heart size={18} /> },
  { id: 'flags', icon: <Flag size={18} /> },
];

const frequentlyUsed = ['💯', '👍', '👀', '😆', '🍉', '🍴', '😊', '😩', '😫', '💩'];
const people = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', 'points', '😰', '😱', '🥵', '🥶', '🥴'];

const EmojiPicker = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const [hoveredEmoji, setHoveredEmoji] = useState(null);

  const springTransition = { type: "spring", stiffness: 400, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed z-[10001] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(400px,90vw)] h-[min(480px,80vh)] bg-[#2b2d31] rounded-xl shadow-[0_12px_64px_rgba(0,0,0,0.8)] border border-white/10 flex overflow-hidden lg:relative lg:top-auto lg:left-auto lg:translate-x-0 lg:translate-y-0"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Category Sidebar */}
      <div className="w-12 bg-[#1e1f22] flex flex-col items-center py-4 gap-4 border-r border-white/5">
         {categories.map(cat => (
           <button key={cat.id} className="text-text-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
             {cat.icon}
           </button>
         ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 space-y-4 shadow-lg bg-[#2b2d31] z-10">
          <div className="bg-black/20 rounded-lg flex items-center px-3 border border-white/5 focus-within:border-brand-indigo transition-all">
             <input 
               type="text" 
               placeholder="Search emojis..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="flex-1 bg-transparent border-none outline-none text-white text-sm py-2"
             />
             <Search size={16} className="text-text-muted" />
          </div>
        </div>

        {/* Emojis Grid */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 no-scrollbar">
          <section>
            <h4 className="text-text-muted text-[11px] font-black uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock size={12} /> Frequently Used
            </h4>
            <div className="grid grid-cols-8 gap-1">
              {frequentlyUsed.map((emoji, i) => (
                <button 
                  key={i} 
                  onMouseEnter={() => setHoveredEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-xl rounded-lg hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-text-muted text-[11px] font-black uppercase tracking-wider mb-2 flex items-center gap-2">
              <Smile size={12} /> People
            </h4>
            <div className="grid grid-cols-8 gap-1">
              {people.map((emoji, i) => (
                <button 
                  key={i} 
                  onMouseEnter={() => setHoveredEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-xl rounded-lg hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Emoji Info Footer */}
        <div className="h-12 bg-[#1e1f22] border-t border-white/5 flex items-center px-4 gap-3">
          <span className="text-2xl">{hoveredEmoji || '🤔'}</span>
          <span className="text-white text-sm font-bold truncate">
            {hoveredEmoji ? `:${hoveredEmoji.codePointAt(0).toString(16).toUpperCase()}:` : 'Select an emoji'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default EmojiPicker;
