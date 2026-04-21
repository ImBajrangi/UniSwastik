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
    <nav className="w-[72px] bg-bg-tertiary flex flex-col items-center py-3 gap-2 overflow-y-auto no-scrollbar shadow-xl" aria-label="Servers">
      {servers.map((server) => (
        <ServerIcon 
          key={server.id}
          server={server}
          isActive={activeServerId === server.id}
          onClick={() => selectServer(server.id)}
        />
      ))}

      <div className="w-8 h-[2px] bg-bg-secondary rounded-[1px] my-1" role="separator" />

      <ServerActionIcon icon={<Plus size={24} />} label="Add a Server" />
      <ServerActionIcon icon={<Compass size={24} />} label="Explore Communities" color="green" />
      <div className="mt-auto">
        <ServerActionIcon icon={<Download size={24} />} label="Download Apps" color="green" />
      </div>
    </nav>
  );
};

const ServerIcon = ({ server, isActive, onClick }) => {
  const IconComponent = iconMap[server.iconName];
  const [isHovered, setIsHovered] = React.useState(false);

  // Professional spring transition
  const springTransition = {
    type: "spring",
    stiffness: 500,
    damping: 30,
    mass: 1
  };

  return (
    <Tooltip content={server.name} position="right">
      <div 
        className="relative group cursor-pointer"
        onClick={() => { onClick(); playClick(); }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        aria-label={server.name}
        aria-pressed={isActive}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        {/* Active indicator pill - Stable Spring Logic */}
        <motion.div 
          initial={false}
          animate={{ 
            height: isActive ? 40 : (isHovered ? 20 : 0),
            opacity: (isActive || isHovered) ? 1 : 0,
          }}
          transition={springTransition}
          className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-[4px] bg-white rounded-r-full z-20"
          style={{ originY: "50%" }}
        />
        
        {/* Icon Container with layout transition */}
        <motion.div 
          layout
          whileTap={{ scale: 0.90 }}
          animate={{ 
            borderRadius: isActive ? "16px" : "24px",
            backgroundColor: isActive ? (server.brandingColor || "var(--color-bg-accent)") : "var(--color-bg-primary)",
            color: isActive ? "white" : "var(--color-text-normal)"
          }}
          transition={springTransition}
          className={`w-12 h-12 flex items-center justify-center shadow-sm border border-white/5 relative ${
            isActive ? 'shadow-[0_0_20px_rgba(88,101,242,0.4)]' : ''
          }`}
        >
          <motion.div 
            className="w-full h-full flex items-center justify-center overflow-hidden rounded-[inherit]"
          >
            {IconComponent ? (
              <motion.div 
                transition={springTransition}
                animate={{ scale: isHovered ? 1.15 : 1 }}
              >
                <IconComponent 
                  size={28} 
                  strokeWidth={2.5} 
                />
              </motion.div>
            ) : (
              <span className="text-sm font-semibold">{server.acronym}</span>
            )}
          </motion.div>

          {/* NOTIFICATION BADGE - Fixed Circular Shape */}
          {server.notificationCount > 0 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...springTransition, delay: 0.1 }}
              className="absolute -bottom-1.5 -right-1.5 bg-status-dnd text-white text-[11px] font-bold h-[20px] min-w-[20px] px-1.5 flex items-center justify-center rounded-full border-[3px] border-bg-tertiary shadow-lg z-30 pointer-events-none"
              style={{ 
                boxSizing: 'border-box'
              }}
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
  const springTransition = {
    type: "spring",
    stiffness: 500,
    damping: 30
  };

  return (
    <Tooltip content={label} position="right">
      <div className="relative group cursor-pointer mb-2" role="button" aria-label={label} tabIndex={0} onClick={playClick}>
        <motion.div 
          layout
          whileHover={{ 
            borderRadius: "16px", 
            backgroundColor: color === 'green' ? "var(--color-status-online)" : "var(--color-bg-accent)",
            color: "white" 
          }}
          whileTap={{ scale: 0.88 }}
          transition={springTransition}
          className={`w-12 h-12 rounded-[24px] bg-bg-primary flex items-center justify-center hover:shadow-lg text-status-online border border-white/5`}
        >
          <motion.div transition={springTransition} whileHover={{ scale: 1.2 }}>
            {icon}
          </motion.div>
        </motion.div>
      </div>
    </Tooltip>
  );
};

export default ServerSidebar;
