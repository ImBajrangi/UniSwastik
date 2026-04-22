import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hash, Volume2, MessagesSquare, Lock, Sparkles } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

const CreateModal = ({ type, serverId, onClose }) => {
  const [name, setName] = useState('');
  const [channelType, setChannelType] = useState('text');
  const [isPrivate, setIsPrivate] = useState(false);
  const { createChannel, createServer, selectDM } = usePlatform();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (type === 'channel') {
      createChannel(serverId, name, channelType);
    } else if (type === 'server') {
      createServer(name.trim());
    } else {
      // Mock for DMs for now
      selectDM({ name: name.trim() });
    }
    onClose();
  };

  const springTransition = { type: "spring", stiffness: 400, damping: 25 };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop - Solid dark look */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80"
      />

      {/* Modal - Discord Palette */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: -20 }}
        transition={springTransition}
        className="relative w-[90%] max-w-[460px] bg-[#313338] rounded-md shadow-2xl overflow-hidden"
      >
        <div className="p-4 pt-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <h2 className="text-white text-[20px] font-bold">
                {type === 'server' ? 'Create a server' : type === 'channel' ? 'Create Channel' : 'Start DM'}
              </h2>
              {type === 'channel' && <div className="text-[#B5BAC1] text-[12px] opacity-80 font-medium">in Information</div>}
              {type === 'server' && <div className="text-[#B5BAC1] text-[12px] opacity-80 font-medium">Give your new server a personality with a name. You can always change it later.</div>}
            </div>
            <button onClick={onClose} className="text-[#B5BAC1] hover:text-white transition-colors">
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'channel' && (
              <div className="space-y-2 px-2">
                <label className="text-[#B5BAC1] text-[12px] font-bold uppercase tracking-tight">Channel Type</label>
                <div className="flex flex-col gap-2">
                  <ChannelTypeOption 
                    active={channelType === 'text'}
                    onClick={() => setChannelType('text')}
                    icon={<Hash size={24} strokeWidth={2.5} />}
                    label="Text"
                    description="Send messages, images, GIFs, emoji, opinions, and puns"
                  />
                  <ChannelTypeOption 
                    active={channelType === 'voice'}
                    onClick={() => setChannelType('voice')}
                    icon={<Volume2 size={24} strokeWidth={2.5} />}
                    label="Voice"
                    description="Hang out together with voice, video, and screen share"
                  />
                  <ChannelTypeOption 
                    active={channelType === 'forum'}
                    onClick={() => setChannelType('forum')}
                    icon={<MessagesSquare size={24} strokeWidth={2.5} />}
                    label="Forum"
                    description="Create a space for organized discussions"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 px-2 pt-2">
              <label className="text-[#B5BAC1] text-[12px] font-bold uppercase tracking-tight">
                {type === 'server' ? 'Server Name' : type === 'channel' ? 'Channel Name' : 'Recipient Name'}
              </label>
              <div className="relative">
                {type === 'channel' && channelType === 'text' && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#80848E]">
                    <Hash size={20} strokeWidth={2.5} />
                  </div>
                )}
                <input 
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={type === 'server' ? "Swastik Study Group" : type === 'channel' ? "new-channel" : "Hars g"}
                  className={`w-full bg-[#1E1F22] text-white h-[40px] rounded-[3px] outline-none transition-all placeholder:text-white/20 text-[16px] ${
                    type === 'channel' && channelType === 'text' ? 'pl-10 pr-3' : 'px-3'
                  }`}
                />
              </div>
            </div>

            {/* Private Channel Toggle - Only for channels */}
            {type === 'channel' && (
              <div className="px-2 pt-2">
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIsPrivate(!isPrivate)}>
                  <div className="flex items-center gap-2">
                    <Lock size={18} className="text-white" />
                    <div>
                      <div className="text-white text-[16px] font-bold">Private Channel</div>
                      <div className="text-[#B5BAC1] text-[12px] leading-tight">Only selected members and roles will be able to view this channel.</div>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${isPrivate ? 'bg-[#248046]' : 'bg-[#4E5058]'}`}>
                    <motion.div 
                      animate={{ x: isPrivate ? 18 : 2 }}
                      className="absolute top-1 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer with specific styling */}
            <div className="bg-[#2B2D31] -mx-4 p-4 flex items-center justify-end gap-2 mt-4">
              <button 
                type="button"
                onClick={onClose}
                className="text-white text-[14px] font-medium hover:underline px-4 py-2"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!name.trim()}
                className={`px-7 py-2.5 rounded-[3px] text-[14px] font-bold text-white transition-all ${
                  name.trim() 
                    ? 'bg-[#5865F2] hover:bg-[#4752C4] shadow-lg active:scale-95' 
                    : 'bg-[#5865F2] opacity-50 cursor-not-allowed'
                }`}
              >
                {type === 'server' ? 'Create Server' : type === 'channel' ? 'Create Channel' : 'Start DM'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

const ChannelTypeOption = ({ active, onClick, icon, label, description }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-[4px] border-none transition-all relative ${
      active 
        ? 'bg-[#404249] text-white' 
        : 'bg-[#2B2D31] text-[#B5BAC1] hover:bg-[#35373C]'
    }`}
  >
    <div className={active ? 'text-white' : 'text-[#80848E]'}>{icon}</div>
    <div className="text-left flex-1">
      <div className="font-bold text-[16px] leading-none mb-1">{label}</div>
      <div className="text-[12px] opacity-80 leading-tight">{description}</div>
    </div>
    {/* Radio circle */}
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
      active ? 'border-white' : 'border-[#80848E]'
    }`}>
      {active && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
    </div>
  </button>
);

export default CreateModal;
