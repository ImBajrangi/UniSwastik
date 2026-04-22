import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Headphones, Settings, MicOff, HeadphoneOff, ChevronDown } from 'lucide-react';
import Avatar from './Avatar';
import UserProfileCard from './UserProfileCard';
import VoiceSettingsPopover from './VoiceSettingsPopover';
import { usePlatform } from '../context/PlatformContext';
import { playClick } from '../utils/sounds';

const UserPanel = () => {
  const { currentUser } = usePlatform();
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activePopover, setActivePopover] = useState(null); // 'mic' or 'audio'
  const panelRef = useRef(null);

  const springTransition = { type: "spring", stiffness: 500, damping: 32 };

  // Handle click outside to close popovers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowProfile(false);
        setActivePopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopover = (type, e) => {
    e.stopPropagation();
    setActivePopover(activePopover === type ? null : type);
    playClick();
  };

  return (
    <div className="relative" ref={panelRef}>
      <AnimatePresence>
        {showProfile && (
          <UserProfileCard 
            user={currentUser} 
            onClose={() => setShowProfile(false)} 
          />
        )}
        {activePopover && (
          <VoiceSettingsPopover 
            type={activePopover === 'mic' ? 'input' : 'output'} 
            onClose={() => setActivePopover(null)} 
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springTransition}
        className="h-[52px] bg-[#232428] px-2 flex items-center justify-between group select-none relative z-10"
      >
        {/* User Info Area */}
        <motion.div 
          onClick={() => { setShowProfile(!showProfile); setActivePopover(null); }}
          whileHover={{ backgroundColor: "rgba(78, 80, 88, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          transition={springTransition}
          className="flex items-center gap-2 flex-1 p-1 rounded-md cursor-pointer min-w-0 mr-1"
        >
          <div className="relative">
            <Avatar 
               src={currentUser.avatar} 
               name={currentUser.name} 
               userId={currentUser.id}
               status={currentUser.status || 'online'} 
               size={32} 
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white text-[13px] font-bold truncate leading-tight tracking-tight">
              {currentUser.name}
            </span>
            <span className="text-[#B5BAC1] text-[11px] leading-tight truncate font-medium opacity-80 uppercase tracking-tighter">
              {currentUser.handle || 'harshg7471'}
            </span>
          </div>
        </motion.div>
        
        {/* Action Buttons - DISCORD REFERENCE STYLE */}
        <div className="flex items-center gap-0.5">
          <PanelIcon 
            active={isMuted}
            isRed={isMuted}
            hasDropdown
            icon={isMuted ? <MicOff size={18} /> : <Mic size={18} />} 
            onClick={() => setIsMuted(!isMuted)}
            onDropdown={(e) => togglePopover('mic', e)}
            label={isMuted ? "Unmute" : "Mute"}
          />
          <PanelIcon 
            active={isDeafened}
            hasDropdown
            icon={isDeafened ? <HeadphoneOff size={18} /> : <Headphones size={18} />} 
            onClick={() => { 
                setIsDeafened(!isDeafened); 
                if(!isDeafened) setIsMuted(true); 
            }}
            onDropdown={(e) => togglePopover('audio', e)}
            label={isDeafened ? "Undeafen" : "Deafen"}
          />
          <PanelIcon 
            icon={<Settings size={18} />} 
            label="User Settings"
          />
        </div>
      </motion.div>
    </div>
  );
};

const PanelIcon = ({ icon, onClick, onDropdown, active, isRed, hasDropdown, label }) => {
  const springTransition = { type: "spring", stiffness: 500, damping: 30 };

  return (
    <div className="flex items-center group/icon-container">
      <motion.div 
        whileHover={{ backgroundColor: isRed ? "none" : "rgba(78, 80, 88, 0.3)", color: "white" }}
        whileTap={{ scale: 0.9 }}
        transition={springTransition}
        onClick={(e) => { onClick && onClick(e); playClick(); }}
        className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer relative transition-colors ${
          isRed ? 'bg-[#f23f42]/20 text-[#f23f42] hover:bg-[#f23f42]/30' : 'text-[#B5BAC1] hover:text-[#DBDEE1]'
        }`}
        title={label}
      >
        {React.cloneElement(icon, { strokeWidth: 2.2 })}
        
        {/* Minimal Tooltip */}
        <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-[#111214] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/icon-container:opacity-100 transition-all duration-150 shadow-2xl whitespace-nowrap z-[110] translate-y-1 group-hover/icon-container:translate-y-0">
          {label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111214] rotate-45 -mt-1" />
        </div>
      </motion.div>
      {hasDropdown && (
        <span 
          onClick={onDropdown}
          className="text-[#B5BAC1] opacity-40 hover:opacity-100 cursor-pointer p-0.5 -ml-1 transition-opacity"
        >
           <ChevronDown size={14} strokeWidth={3} />
        </span>
      )}
    </div>
  );
};

export default UserPanel;

