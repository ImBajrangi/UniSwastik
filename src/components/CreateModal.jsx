import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, Volume2, UserPlus, Sparkles } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

const CreateModal = ({ type, serverId, onClose }) => {
  const [name, setName] = useState('');
  const [channelType, setChannelType] = useState('text');
  const { addChannel, addDM } = usePlatform();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (type === 'channel') {
      addChannel(serverId, name, channelType);
    } else {
      addDM({ name: name.trim() });
    }
    onClose();
  };

  const springTransition = { type: "spring", stiffness: 500, damping: 30 };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={springTransition}
        className="relative w-full max-w-md bg-bg-secondary rounded-lg shadow-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              {type === 'channel' ? (
                <>Create Channel <Sparkles size={20} className="text-yellow-400" /></>
              ) : (
                <>Start Direct Message <UserPlus size={20} className="text-blue-400" /></>
              )}
            </h2>
            <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {type === 'channel' && (
              <div className="space-y-3">
                <label className="text-text-muted text-xs font-bold uppercase tracking-wider">Channel Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setChannelType('text')}
                    className={`flex items-center gap-3 p-3 rounded-md border transition-all ${
                      channelType === 'text' 
                        ? 'bg-bg-modifier-selected border-white/20 text-white' 
                        : 'bg-bg-tertiary border-transparent text-text-muted hover:bg-bg-modifier-hover'
                    }`}
                  >
                    <Hash size={20} />
                    <div className="text-left">
                      <div className="font-bold text-sm">Text</div>
                      <div className="text-[10px] opacity-60">Send messages, images, and GIFs</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannelType('voice')}
                    className={`flex items-center gap-3 p-3 rounded-md border transition-all ${
                      channelType === 'voice' 
                        ? 'bg-bg-modifier-selected border-white/20 text-white' 
                        : 'bg-bg-tertiary border-transparent text-text-muted hover:bg-bg-modifier-hover'
                    }`}
                  >
                    <Volume2 size={20} />
                    <div className="text-left">
                      <div className="font-bold text-sm">Voice</div>
                      <div className="text-[10px] opacity-60">Hang out with voice and video</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-text-muted text-xs font-bold uppercase tracking-wider">
                {type === 'channel' ? 'Channel Name' : 'Recipient Name'}
              </label>
              <input 
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'channel' ? "new-channel" : "Hars g"}
                className="w-full bg-bg-tertiary text-white p-3 rounded-md border border-black/20 focus:border-white/20 outline-none transition-all placeholder:text-text-muted/50"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="text-white text-sm font-medium hover:underline px-4"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!name.trim()}
                className={`px-6 py-2 rounded font-bold text-white transition-all ${
                  name.trim() 
                    ? 'bg-bg-accent hover:bg-bg-accent-hover shadow-lg active:scale-95' 
                    : 'bg-bg-accent/50 cursor-not-allowed opacity-50'
                }`}
              >
                {type === 'channel' ? 'Create Channel' : 'Start DM'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateModal;
