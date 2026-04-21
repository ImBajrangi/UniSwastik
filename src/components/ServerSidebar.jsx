import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Compass, Download, Home, 
  GraduationCap, FlaskConical, Cpu 
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { playClick } from '../utils/sounds';
import Tooltip from './Tooltip';

const iconMap = {
  Home,
  GraduationCap,
  FlaskConical,
  Cpu
};

const ServerSidebar = () => {
  const { servers, activeServerId, selectServer } = usePlatform();

  return (
    <nav className="w-[72px] bg-bg-tertiary flex flex-col items-center py-3 gap-2 overflow-y-auto no-scrollbar shadow-2xl relative z-50 h-full border-r border-black/20" aria-label="Servers">
      {servers.map((server) => (
        <ServerIcon 
          key={server.id}
          server={server}
          isActive={activeServerId === server.id}
          onClick={() => selectServer(server.id)}
        />
      ))}

      <div className="w-8 h-[2px] bg-white/5 rounded-full my-1 shadow-inner" role="separator" />

      <ServerActionIcon icon={<Plus size={24} />} label="Add a Server" />
      <ServerActionIcon icon={<Compass size={24} />} label="Explore Communities" color="green" />
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <ServerActionIcon icon={<Download size={24} />} label="Download Apps" color="green" />
      </div>
    </nav>
  );
};

const ServerIcon = ({ server, isActive, onClick }) => {
  const IconComponent = iconMap[server.iconName];
  const [isHovered, setIsHovered] = React.useState(false);

  const springTransition = {
    type: "spring",
    stiffness: 450,
    damping: 25,
    mass: 1
  };

  return (
    <Tooltip content={server.name} position="right">
      <div 
        className="relative flex items-center justify-center w-full group cursor-pointer"
        onClick={() => { onClick(); playClick(); }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        aria-label={server.name}
        aria-pressed={isActive}
        tabIndex={0}
      >
        {/* Active indicator pill - Floating Physics */}
        <motion.div 
          initial={false}
          animate={{ 
            height: isActive ? 40 : (isHovered ? 20 : 0),
            opacity: (isActive || isHovered) ? 1 : 0,
            scaleY: isActive ? 1 : 0.6
          }}
          transition={springTransition}
          className="absolute left-0 w-[4px] bg-white rounded-r-full z-20 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          style={{ originX: 0 }}
        />
        
        {/* Icon Container */}
        <motion.div 
          layout
          whileTap={{ scale: 0.90 }}
          animate={{ 
            borderRadius: isActive ? "16px" : (isHovered ? "16px" : "24px"),
            backgroundColor: isActive ? (server.brandingColor || "var(--color-brand-indigo)") : "var(--color-bg-primary)",
            color: isActive ? "white" : "var(--color-text-normal)",
            boxShadow: isActive ? "0 8px 16px rgba(0,0,0,0.4), 0 0 12px rgba(88,101,242,0.3)" : "none"
          }}
          transition={springTransition}
          className={`w-12 h-12 flex items-center justify-center relative border border-white/5 overflow-visible`}
        >
          <motion.div 
            className="w-full h-full flex items-center justify-center overflow-hidden rounded-[inherit]"
          >
            {IconComponent ? (
              <motion.div 
                animate={{ scale: isHovered ? 1.15 : 1 }}
                transition={springTransition}
              >
                <IconComponent size={28} strokeWidth={2.2} />
              </motion.div>
            ) : (
              <span className="text-sm font-bold font-display">{server.acronym}</span>
            )}
          </motion.div>

          {/* NOTIFICATION BADGE */}
          {server.notificationCount > 0 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -bottom-1 -right-1 bg-status-dnd text-white text-[10px] font-black h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full border-[3px] border-bg-tertiary shadow-xl z-30"
            >
              {server.notificationCount}
            </motion.div>
          )}
        </motion.div>
      </div>
    </Tooltip>
  );
};

const ServerActionIcon = ({ icon, label, color }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Tooltip content={label} position="right">
      <div 
        className="relative group cursor-pointer" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={playClick}
      >
        <motion.div 
          animate={{ 
            borderRadius: isHovered ? "16px" : "24px",
            backgroundColor: isHovered 
              ? (color === 'green' ? "var(--color-status-online)" : "var(--color-brand-indigo)") 
              : "var(--color-bg-primary)",
            color: isHovered ? "white" : (color === 'green' ? "var(--color-status-online)" : "var(--color-brand-indigo)")
          }}
          whileTap={{ scale: 0.85 }}
          className="w-12 h-12 flex items-center justify-center transition-all duration-300 border border-white/5 shadow-inner"
        >
          <motion.div animate={{ rotate: isHovered ? 90 : 0 }} className="relative z-10 transition-transform">
            {icon}
          </motion.div>
        </motion.div>
      </div>
    </Tooltip>
  );
};

export default ServerSidebar;
