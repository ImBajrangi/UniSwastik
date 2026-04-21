import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Headphones, Settings, MicOff, HeadphoneOff } from 'lucide-react';
import Avatar from './Avatar';
import { usePlatform } from '../context/PlatformContext';
import { playClick } from '../utils/sounds';

const UserPanel = () => {
  const { currentUser } = usePlatform();
  const [isMuted, setIsMuted] = React.useState(false);
  const [isDeafened, setIsDeafened] = React.useState(false);

  const springTransition = { type: "spring", stiffness: 500, damping: 30 };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springTransition}
      className="h-[52px] bg-bg-secondary-alt px-2 flex items-center gap-1 group shadow-[0_-1px_0_rgba(0,0,0,0.2)]"
    >
      <motion.div 
        whileHover={{ backgroundColor: "rgba(78, 80, 88, 0.3)" }}
        whileTap={{ scale: 0.98 }}
        transition={springTransition}
        className="flex items-center gap-2 flex-1 p-1 rounded-md cursor-pointer min-w-0 pr-1"
      >
        <div className="relative">
          <Avatar src={currentUser.avatar} name={currentUser.name} status={currentUser.status} size={32} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-white text-[13px] font-bold truncate leading-tight tracking-tight">{currentUser.name}</span>
          <span className="text-text-muted text-[11px] leading-tight truncate opacity-80 font-medium">#{currentUser.discriminator || '0001'}</span>
        </div>
      </motion.div>
      
      <div className="flex items-center">
        <PanelIcon 
          active={isMuted}
          icon={isMuted ? <MicOff size={18} className="text-text-danger" /> : <Mic size={18} />} 
          onClick={() => setIsMuted(!isMuted)}
          label={isMuted ? "Unmute" : "Mute"}
        />
        <PanelIcon 
          active={isDeafened}
          icon={isDeafened ? <HeadphoneOff size={18} className="text-text-danger" /> : <Headphones size={18} />} 
          onClick={() => { setIsDeafened(!isDeafened); if(!isDeafened) setIsMuted(true); }}
          label={isDeafened ? "Undeafen" : "Deafen"}
        />
        <PanelIcon 
          icon={<Settings size={18} />} 
          label="User Settings"
        />
      </div>
    </motion.div>
  );
};

const PanelIcon = ({ icon, onClick, active, label }) => {
  const springTransition = { type: "spring", stiffness: 500, damping: 30 };

  return (
    <motion.div 
      whileHover={{ backgroundColor: "rgba(78, 80, 88, 0.3)", color: "white" }}
      whileTap={{ scale: 0.85 }}
      transition={springTransition}
      onClick={(e) => { onClick && onClick(e); playClick(); }}
      className="w-8 h-8 flex items-center justify-center rounded-md text-interactive-normal cursor-pointer relative group/icon"
      title={label}
      aria-label={label}
    >
      {React.cloneElement(icon, { strokeWidth: 2.2 })}
      
      {/* Minimal Tooltip */}
      <motion.div 
        initial={{ opacity: 0, y: 5, scale: 0.9 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
        transition={springTransition}
        className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 glass text-white text-[11px] font-bold px-2 py-1 rounded pointer-events-none shadow-xl whitespace-nowrap z-50 transform"
      >
        {label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-bg-tertiary/80 rotate-45" />
      </motion.div>
    </motion.div>
  );
};

export default UserPanel;
