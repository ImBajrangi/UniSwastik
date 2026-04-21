import React from 'react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';

const HeaderIcon = ({ icon, label, onClick, active, position = 'bottom' }) => (
  <Tooltip content={label} position={position}>
    <button 
      onClick={onClick}
      aria-label={label}
      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer relative group ${
        active ? 'text-white' : 'hover:bg-white/5 hover:text-white text-[#B5BAC1]'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="headerActive"
          className="absolute inset-0 bg-white/10 rounded-full blur-[2px]"
        />
      )}
      <div className="relative z-10">{icon}</div>
    </button>
  </Tooltip>
);

export default HeaderIcon;
