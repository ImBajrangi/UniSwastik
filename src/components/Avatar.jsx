import React from 'react';
import { motion } from 'framer-motion';

const Avatar = ({ src, name, size = 32, status, badge, isBot }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  
  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 20
  };

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={springTransition}
      className="relative flex-shrink-0" 
      style={{ width: size, height: size }}
    >
      <div 
        className="flex items-center justify-center rounded-full overflow-hidden bg-bg-accent shadow-lg"
        style={{ width: size, height: size }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-medium select-none" style={{ fontSize: size * 0.4 }}>{initials}</span>
        )}
      </div>
      
      {status && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...springTransition, delay: 0.2 }}
          className="absolute bottom-0 right-0 rounded-full border-2 border-bg-secondary shadow-sm"
          style={{ 
            width: size * 0.35, 
            height: size * 0.35,
            backgroundColor: `var(--color-status-${status})`
          }}
        />
      )}
    </motion.div>
  );
};

export default Avatar;
