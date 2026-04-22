import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Bell, Moon, LogOut, ChevronRight, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';

const ProfileView = () => {
  const { currentUser, logout } = usePlatform();

  const settingsItems = [
    { icon: <User size={20} />, label: 'Edit Profile', color: 'text-blue-400' },
    { icon: <Shield size={20} />, label: 'Privacy & Safety', color: 'text-green-400' },
    { icon: <Bell size={20} />, label: 'Notifications', color: 'text-orange-400' },
    { icon: <Moon size={20} />, label: 'Appearance', color: 'text-purple-400' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-y-auto no-scrollbar pb-24">
      <div className="max-w-[800px] mx-auto w-full px-6 sm:px-10 pt-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group perspective-[1000px]"
        >
          {/* Elite University Banner - Animate Mesh */}
          <div className="relative h-44 sm:h-64 shrink-0 bg-[#1e1f22] overflow-hidden rounded-t-[40px] shadow-2xl border-x border-t border-white/5">
            <div className="absolute inset-0 mesh-silk opacity-60 animate-mesh" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1e1f22] to-transparent" />
            <button className="absolute top-6 right-6 glass p-2.5 rounded-full text-white hover:scale-110 transition-all z-20 shadow-premium">
              <Settings size={22} />
            </button>
          </div>

          {/* Profile Header Glass Card - Elite HUD */}
          <motion.div 
            whileHover={{ rotateX: 2, rotateY: -1, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass relative z-10 p-6 sm:p-12 -mt-1 shadow-premium rounded-b-[40px]"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-8 mb-10 text-center sm:text-left">
              <div className="relative p-2 bg-[#1e1f22] rounded-full -mt-24 sm:-mt-32 shadow-premium">
                <Avatar name={currentUser?.name || 'User'} size={130} className="border-[10px] border-[#1e1f22]" />
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-status-online rounded-full border-4 border-[#1e1f22] shadow-premium" />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-3.5 premium-gradient rounded-2xl text-white font-black text-[16px] tracking-widest uppercase transition-all shadow-[0_12px_40px_rgba(88,101,242,0.4)]"
              >
                Edit Profile
              </motion.button>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <h1 className="text-white text-4xl sm:text-5xl font-black tracking-tighter font-display flex flex-col sm:flex-row items-center gap-2">
                {currentUser?.name || 'Swastik Student'}
                {currentUser?.discriminator && (
                  <span className="text-white/20 text-2xl font-medium tracking-tight">#{currentUser.discriminator}</span>
                )}
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-x-10 gap-y-4 text-text-muted text-[16px] font-semibold mt-6">
                <span className="flex items-center gap-3 transition-colors hover:text-white"><GraduationCap size={20} className="text-brand-indigo" /> {currentUser?.university || 'Swastik University'}</span>
                <span className="flex items-center gap-3 transition-colors hover:text-white"><MapPin size={20} className="text-brand-indigo" /> Main Campus</span>
                <span className="flex items-center gap-3 transition-colors hover:text-white"><Calendar size={20} className="text-brand-indigo" /> Joined Oct 2026</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Improved Settings Section */}
        <div className="py-12 space-y-12">
          <section>
            <h3 className="text-white/20 text-[12px] font-black uppercase tracking-[0.3em] mb-6 px-4">University Account</h3>
            <div className="glass rounded-[32px] overflow-hidden">
              {settingsItems.map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className={`w-full flex items-center justify-between p-7 transition-all group border-b border-white/5 last:border-0`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`${item.color} p-2.5 bg-white/5 rounded-2xl shadow-inner`}>
                      {item.icon}
                    </div>
                    <span className="text-white font-bold text-[18px] tracking-tight">{item.label}</span>
                  </div>
                  <ChevronRight size={24} className="text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-3" />
                </motion.button>
              ))}
            </div>
          </section>

          <motion.button 
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(237, 66, 69, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full bg-[#ed4245]/10 border-2 border-[#ed4245]/20 p-7 rounded-[32px] flex items-center justify-center gap-4 text-[#ed4245] font-black text-[18px] tracking-widest uppercase transition-all shadow-premium"
          >
            <LogOut size={24} />
            Logout Account
          </motion.button>
        </div>
      </div>
    </div>

  );
};

export default ProfileView;
