import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { authService } from '../services/auth';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.86-2.59 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(email, password);
      } else {
        await authService.register(email, password, name);
      }
    } catch (err) {
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.loginWithGoogle();
    } catch (err) {
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden font-display p-6">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-indigo/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="bg-[#111111]/80 backdrop-blur-3xl rounded-[40px] p-8 sm:p-12 shadow-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-indigo to-transparent opacity-50" />

          {/* Logo & Header */}
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-20 h-20 bg-brand-indigo rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-indigo/30 rotate-[-4deg] border border-white/20"
            >
              <ShieldCheck className="text-white" size={42} />
            </motion.div>
            <h1 className="text-4xl font-black text-white mb-3 tracking-tight font-display uppercase leading-none">
              {isLogin ? 'Welcome Back' : 'Join the Hub'}
            </h1>
            <p className="text-[#949BA4] text-[15px] font-medium max-w-[260px] mx-auto leading-relaxed">
              {isLogin ? "Your campus community is waiting for you." : "The exclusive social space for students."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <label className="block text-[11px] font-black text-[#949BA4] uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4E5058] group-focus-within:text-brand-indigo transition-colors" size={20} />
                    <input 
                      type="text"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Student Name"
                      className="w-full h-14 bg-[#1E1F22] border border-white/5 focus:border-brand-indigo/50 text-white rounded-2xl pl-12 pr-4 outline-none transition-all placeholder:text-[#4E5058] font-bold"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="block text-[11px] font-black text-[#949BA4] uppercase tracking-widest ml-1">University Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4E5058] group-focus-within:text-brand-indigo transition-colors" size={20} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full h-14 bg-[#1E1F22] border border-white/5 focus:border-brand-indigo/50 text-white rounded-2xl pl-12 pr-4 outline-none transition-all placeholder:text-[#4E5058] font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-[#949BA4] uppercase tracking-widest">Security Key</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-black text-brand-indigo hover:text-white transition-colors uppercase tracking-widest">
                    Recovery?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4E5058] group-focus-within:text-brand-indigo transition-colors" size={20} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-[#1E1F22] border border-white/5 focus:border-brand-indigo/50 text-white rounded-2xl pl-12 pr-4 outline-none transition-all placeholder:text-[#4E5058] font-bold"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-brand-indigo hover:bg-brand-indigo-hover text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-brand-indigo/20 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Enter Platform' : 'Begin Journey'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12">
            <div className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <span className="relative bg-[#111111] px-4 text-[#4E5058] font-black text-[10px] uppercase tracking-widest">Connect with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SocialButton onClick={handleGoogleLogin} icon={<GoogleIcon />} label="Google" />
              <SocialButton icon={<GithubIcon />} label="GitHub" />
            </div>

            <p className="mt-10 text-center text-[#949BA4] text-sm font-medium">
              {isLogin ? "New on campus?" : "Already verified?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-white hover:text-brand-indigo font-black uppercase tracking-widest text-[11px] ml-1 transition-colors underline underline-offset-4 decoration-white/10"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SocialButton = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    type="button"
    className="h-14 flex items-center justify-center gap-3 bg-white/[0.03] hover:bg-white/[0.08] text-white rounded-2xl border border-white/5 transition-all active:scale-95 group"
  >
    <div className="transition-transform group-hover:scale-110">{icon}</div>
    <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default AuthView;
