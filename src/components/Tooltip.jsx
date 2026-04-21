import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ children, content, position = 'top', delay = 0.2 }) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setShow(true), delay * 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setShow(false);
  };

  const positions = {
    top: {
      initial: { opacity: 0, scale: 0.9, y: 10, x: '-50%' },
      animate: { opacity: 1, scale: 1, y: 0, x: '-50%' },
      className: "bottom-[calc(100%+10px)] left-1/2",
      caret: "top-full left-1/2 -translate-x-1/2 border-t-[#111214] border-l-transparent border-r-transparent border-b-transparent"
    },
    right: {
      initial: { opacity: 0, scale: 0.9, x: -10, y: '-50%' },
      animate: { opacity: 1, scale: 1, x: 0, y: '-50%' },
      className: "left-[calc(100%+12px)] top-1/2",
      caret: "right-full top-1/2 -translate-y-1/2 border-r-[#111214] border-t-transparent border-l-transparent border-b-transparent"
    }
  };

  const pos = positions[position];

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {show && content && (
          <motion.div
            initial={pos.initial}
            animate={pos.animate}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`absolute z-[1000] pointer-events-none whitespace-nowrap bg-[#111214] text-white px-3 py-2 rounded-lg shadow-2xl ${pos.className}`}
          >
            <div className="relative text-[14px] font-bold tracking-tight">
              {content}
              {/* Caret arrow */}
              <div className={`absolute w-0 h-0 border-[6px] ${pos.caret}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
