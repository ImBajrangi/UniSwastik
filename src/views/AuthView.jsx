import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { authService } from '../services/auth';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.86-2.59 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden font-display p-4">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-indigo/15 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[140px] animate-pulse delay-700" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="glass rounded-[32px] p-8 sm:p-10 shadow-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Logo/Branding */}
          <div className="text-center mb-10 relative">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-brand-indigo rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(88,101,242,0.4)] border border-white/20"
            >
              <ShieldCheck className="text-white" size={40} />
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase font-display">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[#949BA4] text-sm font-medium opacity-80">
              {isLogin ? "We're so excited to see you again!" : "Join the Swastik University community today."}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[11px] font-black text-[#B5BAC1] uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative flex items-center group">
                    <div className="absolute left-4 text-[#949BA4] group-focus-within:text-brand-indigo transition-colors duration-300">
                      <User size={18} />
                    </div>
                    <input 
                      type="text"
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-black/40 border border-white/5 focus:border-brand-indigo/50 text-[#DBDEE1] rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all duration-300 placeholder:text-[#4E5058] font-medium shadow-inner"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#B5BAC1] uppercase tracking-[0.2em] ml-1">Email</label>
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-[#949BA4] group-focus-within:text-brand-indigo transition-colors duration-300">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full bg-black/40 border border-white/5 focus:border-brand-indigo/50 text-[#DBDEE1] rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all duration-300 placeholder:text-[#4E5058] font-medium shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-[#B5BAC1] uppercase tracking-[0.2em]">Password</label>
                {isLogin && (
                  <button type="button" className="text-[11px] font-black text-brand-indigo hover:text-white transition-colors uppercase tracking-widest">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-[#949BA4] group-focus-within:text-brand-indigo transition-colors duration-300">
                  <Lock size={18} />
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/5 focus:border-brand-indigo/50 text-[#DBDEE1] rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all duration-300 placeholder:text-[#4E5058] font-medium shadow-inner"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 p-3.5 rounded-xl font-bold flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_#f87171]" />
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#4752c4' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-brand-indigo text-white font-black text-[14px] uppercase tracking-[0.2em] py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-brand-indigo/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Log In' : 'Get Started'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center relative">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center"><span className="bg-[#121214] px-4 text-[#4E5058] font-black text-[10px] uppercase tracking-[0.3em] rounded-full border border-white/5 py-1 shadow-xl">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SocialButton onClick={handleGoogleLogin} disabled={loading} icon={<GoogleIcon />} label="Google" />
              <SocialButton disabled={loading} icon={<GithubIcon />} label="GitHub" />
            </div>

            <p className="mt-10 text-[#949BA4] text-sm font-medium">
              {isLogin ? "Need an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-white hover:text-brand-indigo font-black transition-colors uppercase tracking-widest text-[11px] ml-1 underline decoration-white/20 underline-offset-4"
              >
                {isLogin ? 'Register' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SocialButton = ({ icon, label, onClick, disabled }) => (
  <motion.button 
    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.05)' }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    disabled={disabled}
    className="flex items-center justify-center gap-3 bg-white/[0.03] text-[#DBDEE1] py-3.5 rounded-xl border border-white/5 transition-all duration-300 shadow-lg group"
  >
    <div className="group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </motion.button>
);

export default AuthView;
