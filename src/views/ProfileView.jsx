import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Bell, Moon, LogOut, ChevronRight, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from '../components/Avatar';

const ProfileView = () => {
  const { currentUser } = usePlatform();

  const settingsItems = [
    { icon: <User size={20} />, label: 'Edit Profile', color: 'text-blue-400' },
    { icon: <Shield size={20} />, label: 'Privacy & Safety', color: 'text-green-400' },
    { icon: <Bell size={20} />, label: 'Notifications', color: 'text-orange-400' },
    { icon: <Moon size={20} />, label: 'Appearance', color: 'text-purple-400' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111214] overflow-y-auto no-scrollbar pb-20">
      {/* Premium Banner */}
      <div className="relative h-48 shrink-0 bg-brand-indigo overflow-hidden">
        <div className="absolute inset-0 opacity-20 animate-mesh bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <button className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/60 transition-all">
          <Settings size={20} />
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="bg-[#1e1f22] rounded-2xl p-6 shadow-2xl border border-white/5">
          <div className="flex items-end justify-between mb-6">
            <div className="p-1.5 bg-[#1e1f22] rounded-full -mt-20">
              <Avatar name={currentUser.name} size={96} className="border-4 border-[#1e1f22]" />
            </div>
            <button className="px-4 py-2 bg-brand-indigo rounded-lg text-white font-bold text-sm shadow-lg hover:brightness-110 transition-all active:scale-95">
              Edit User Profile
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="text-white text-2xl font-black tracking-tight font-display flex items-center gap-2">
              {currentUser.name}
              <span className="text-text-muted text-lg font-medium opacity-60">#{currentUser.discriminator}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#B5BAC1] text-[13px] font-medium mt-2">
              <span className="flex items-center gap-1.5"><GraduationCap size={14} className="text-brand-indigo" /> {currentUser.university}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-brand-indigo" /> Main Campus, Block A</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-brand-indigo" /> Joined Oct 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="p-4 space-y-6">
        <section>
          <h3 className="text-[#949BA4] text-[11px] font-bold uppercase tracking-wider mb-3 px-1">User Settings</h3>
          <div className="bg-[#2b2d31]/50 rounded-2xl border border-white/5 overflow-hidden">
            {settingsItems.map((item, idx) => (
              <button 
                key={idx}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`${item.color} brightness-90`}>{item.icon}</div>
                  <span className="text-white font-bold text-[15px]">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-[#80848E] group-hover:text-white transition-all transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </section>

        <button className="w-full bg-[#ed4245]/10 border border-[#ed4245]/20 p-4 rounded-2xl flex items-center justify-center gap-2 text-[#ed4245] font-black hover:bg-[#ed4245] hover:text-white transition-all active:scale-95">
          <LogOut size={20} />
          Logout account
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
