import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ children, content, position = 'top', delay = 0.2 }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    timeoutRef.current = setTimeout(() => setShow(true), delay * 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setShow(false);
  };

  // Re-calculate position on scroll/resize to keep tooltip anchored
  useLayoutEffect(() => {
    if (show) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [show]);

  const getTooltipStyles = () => {
    if (position === 'top') {
      return {
        initial: { opacity: 0, scale: 0.9, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        // Positioned above the center of the trigger
        style: {
          top: coords.top - 8, // 8px gap
          left: coords.left + coords.width / 2,
          transform: 'translate(-50%, -100%)'
        },
        caret: "top-full left-1/2 -translate-x-1/2 border-t-[#111214] border-l-transparent border-r-transparent border-b-transparent"
      };
    } else if (position === 'right') {
      return {
        initial: { opacity: 0, scale: 0.9, x: -8 },
        animate: { opacity: 1, scale: 1, x: 0 },
        // Positioned to the right center of the trigger
        style: {
          top: coords.top + coords.height / 2,
          left: coords.left + coords.width + 8, // 8px gap
          transform: 'translate(0, -50%)'
        },
        caret: "right-full top-1/2 -translate-y-1/2 border-r-[#111214] border-t-transparent border-l-transparent border-b-transparent"
      };
    }
    return {};
  };

  const tooltipState = getTooltipStyles();

  return (
    <>
      <div
        ref={triggerRef}
        className="flex items-center justify-center shrink-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {createPortal(
        <AnimatePresence>
          {show && content && (
            <motion.div
              initial={tooltipState.initial}
              animate={tooltipState.animate}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.05 } }}
              transition={{ type: "spring", stiffness: 600, damping: 35 }}
              className="fixed z-[9999] pointer-events-none whitespace-nowrap bg-[#111214] text-white px-3 py-1.5 rounded-[5px] shadow-[0_8px_16px_rgba(0,0,0,0.3)] filter drop-shadow-lg"
              style={tooltipState.style}
            >
              <div className="relative text-[14px] font-semibold tracking-tight text-center">
                {content}
                {/* Caret arrow */}
                <div className={`absolute w-0 h-0 border-[5px] ${tooltipState.caret}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
