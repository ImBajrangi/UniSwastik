import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Compass, Download, Home, 
  GraduationCap, FlaskConical, Cpu 
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { playClick } from '../utils/sounds';

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

  return (
    <div 
      className="relative group cursor-pointer"
      onClick={() => { onClick(); playClick(); }}
      role="button"
      aria-label={server.name}
      aria-pressed={isActive}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Active indicator pill */}
      <motion.div 
        initial={false}
        animate={{ 
          height: isActive ? 40 : 8,
          opacity: isActive ? 1 : 0,
          scaleY: isActive ? 1 : 0.5
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-white rounded-r-full group-hover:opacity-100 group-hover:h-5 transition-all"
        style={{ originY: 0.5 }}
      />
      
      <motion.div 
        whileHover={{ borderRadius: "16px", backgroundColor: server.brandingColor || "#5865f2", color: "white" }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          borderRadius: isActive ? "16px" : "24px",
          backgroundColor: isActive ? (server.brandingColor || "var(--color-bg-accent)") : "var(--color-bg-primary)",
          color: isActive ? "white" : "var(--color-text-normal)"
        }}
        className={`w-12 h-12 flex items-center justify-center transition-all shadow-sm overflow-hidden border border-white/5 active:scale-90 ${
          isActive ? 'shadow-[0_0_15px_rgba(88,101,242,0.4)]' : ''
        }`}
      >
        {IconComponent ? (
          <IconComponent 
            size={28} 
            strokeWidth={2.5} 
            className="group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <span className="text-sm font-semibold">{server.acronym}</span>
        )}
        
        {server.notificationCount > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-status-dnd text-white text-[10px] font-bold px-1 rounded-full border-4 border-bg-tertiary shadow-lg">
            {server.notificationCount}
          </div>
        )}
      </motion.div>
      
      {/* Tooltip */}
      <div className="absolute left-[80px] top-1/2 -translate-y-1/2 glass text-white text-xs px-3 py-2 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-2xl font-bold tracking-tight">
        {server.name}
        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1e1f22] rotate-45 border-l border-b border-white/5" />
      </div>
    </div>
  );
};

const ServerActionIcon = ({ icon, label, color }) => (
    <div className="relative group cursor-pointer mb-2" role="button" aria-label={label} tabIndex={0} onClick={playClick}>
    <motion.div 
      whileHover={{ 
        borderRadius: "16px", 
        backgroundColor: color === 'green' ? "var(--color-status-online)" : "var(--color-bg-accent)",
        color: "white" 
      }}
      whileTap={{ scale: 0.92 }}
      className={`w-12 h-12 rounded-[24px] bg-bg-primary flex items-center justify-center transition-all text-status-online border border-white/5`}
    >
      {icon}
    </motion.div>
    <div className="absolute left-[80px] top-1/2 -translate-y-1/2 glass text-white text-xs px-3 py-2 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 font-bold shadow-2xl tracking-tight">
      {label}
      <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1e1f22] rotate-45 border-l border-b border-white/5" />
    </div>
  </div>
);

export default ServerSidebar;
