import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Settings, Sliders } from 'lucide-react';

const VoiceSettingsPopover = ({ type = 'input', onClose }) => {
  const isInput = type === 'input';
  const springTransition = { type: "spring", stiffness: 400, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={springTransition}
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-[60px] left-[72px] w-[240px] bg-[#1e1f22] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] z-[9999] border border-white/5 overflow-hidden p-2 flex flex-col gap-1"
    >
      <div className="space-y-1">
        {/* Device Selection Section */}
        <button className="w-full text-left p-2 hover:bg-white/5 rounded-lg transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white text-[13px] font-bold">{isInput ? 'Input Device' : 'Output Device'}</span>
              <span className="text-text-muted text-[11px] font-medium leading-none opacity-80">{isInput ? 'Default' : 'No Output Devices'}</span>
            </div>
            <ChevronRight size={16} className="text-text-muted group-hover:text-white transition-colors" />
          </div>
        </button>

        {isInput && (
          <button className="w-full text-left p-2 hover:bg-white/5 rounded-lg transition-colors group">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white text-[13px] font-bold">Input Profile</span>
                <span className="text-text-muted text-[11px] font-medium leading-none opacity-80">Custom</span>
              </div>
              <ChevronRight size={16} className="text-text-muted group-hover:text-white transition-colors" />
            </div>
          </button>
        )}

        <div className="px-2 py-3 mt-1 space-y-2 border-t border-white/5">
          <div className="flex items-center justify-between">
             <span className="text-white text-[13px] font-bold">{isInput ? 'Input Volume' : 'Output Volume'}</span>
          </div>
          {/* Pro Slider */}
          <div className="relative h-1.5 w-full bg-brand-overlay/30 rounded-full group/slider cursor-pointer">
            <div className="absolute top-0 left-0 h-full w-[80%] bg-[#5865f2] rounded-full" />
            <div className="absolute top-1/2 left-[80%] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover/slider:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="w-full px-2 pt-1">
           <div className="w-full h-px bg-white/5" />
        </div>

        {/* Global Settings Link */}
        <button className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors group">
          <span className="text-white text-[13px] font-bold">Voice Settings</span>
          <Settings size={16} className="text-text-muted group-hover:text-white transition-colors" />
        </button>
      </div>
    </motion.div>
  );
};

export default VoiceSettingsPopover;
