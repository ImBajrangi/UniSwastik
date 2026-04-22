import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, KeyRound, Sparkles } from 'lucide-react';

const JoinPasswordModal = ({ serverName, onConfirm, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    onConfirm(password);
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-[400px] bg-[#313338] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
      >
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-indigo/20 flex items-center justify-center text-brand-indigo mb-4 shadow-inner">
              <Lock size={32} />
            </div>
            <h2 className="text-white text-2xl font-black mb-2 font-display">Private Group Access</h2>
            <p className="text-[#B5BAC1] text-sm font-medium">
              You need a password to join <span className="text-white font-bold">{serverName}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#949BA4] group-focus-within:text-brand-indigo transition-colors">
                  <KeyRound size={20} />
                </div>
                <input 
                  autoFocus
                  type="password"
                  placeholder="Enter the group password..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-[#1E1F22] text-white rounded-xl h-12 pl-12 pr-4 outline-none border border-white/5 focus:border-brand-indigo/50 transition-all font-bold tracking-widest placeholder:tracking-normal placeholder:font-medium"
                />
              </div>
              {error && <p className="text-status-red text-[12px] font-bold px-1 animate-pulse">{error}</p>}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button 
                type="submit"
                className="w-full bg-brand-indigo hover:bg-brand-indigo-hover text-white h-12 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
              >
                Join Community
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-xl text-[#B5BAC1] hover:text-white font-bold text-sm transition-all hover:bg-white/5"
              >
                Nevermind
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default JoinPasswordModal;
