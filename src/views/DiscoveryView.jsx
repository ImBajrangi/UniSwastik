import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, Globe, Users, ChevronRight, Hash, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

const DiscoveryView = () => {
  const { discoverableServers, joinServer, selectServer, setIsMobileMenuOpen } = usePlatform();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServers = discoverableServers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#313338] relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-indigo blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-status-online blur-[120px]" />
      </div>

      {/* Hero Header */}
      <header className="relative h-[280px] shrink-0 flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#1E1F22]">
           {/* Abstract University Grid */}
           <div className="absolute inset-0" style={{ 
             backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
             backgroundSize: '32px 32px'
           }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 text-brand-indigo text-[10px] font-black uppercase tracking-wider mb-6">
            <Compass size={14} /> Discovery Mode
          </div>
          <h1 className="text-white text-4xl sm:text-5xl font-black mb-4 tracking-tighter font-display leading-[0.95]">
            Find your <span className="text-brand-indigo">Community</span> on Campus
          </h1>
          <p className="text-[#B5BAC1] text-lg font-medium opacity-80 leading-relaxed mb-8 px-4">
            From study groups to social clubs, there's a space for every student at Swastik University.
          </p>

          {/* Premium Search Bar */}
          <div className="relative group max-w-xl mx-auto">
            <div className="absolute inset-0 bg-brand-indigo/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center h-14 bg-[#1E1F22] rounded-xl border border-white/5 group-focus-within:border-brand-indigo/50 transition-all px-4 gap-4 shadow-2xl">
              <Search className="text-[#949BA4] group-focus-within:text-white transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="Explore communities, subjects, or clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white font-bold placeholder:text-[#949BA4] text-base"
              />
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Globe className="text-brand-indigo" size={24} />
              <h2 className="text-white text-xl font-black tracking-tight font-display uppercase">Featured Communities</h2>
            </div>
            <div className="text-[#949BA4] text-sm font-bold opacity-60">
              Showing {filteredServers.length} servers
            </div>
          </div>

          {filteredServers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredServers.map((server, index) => (
                  <motion.div
                    key={server.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-[#2B2D31] hover:bg-[#232428] rounded-2xl overflow-hidden border border-white/5 hover:border-brand-indigo/30 transition-all shadow-xl flex flex-col"
                  >
                    {/* Banner Card */}
                    <div className="h-32 bg-[#1E1F22] relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/20 to-transparent" />
                       <div className="absolute top-4 right-4 flex gap-2">
                          <div className="bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full font-black uppercase flex items-center gap-1 border border-white/10">
                            <ShieldCheck size={12} className="text-status-online" /> Verified
                          </div>
                       </div>
                       {/* Server Icon Overlay */}
                       <div className="absolute -bottom-6 left-6">
                          <div className="w-16 h-16 rounded-2xl bg-brand-indigo flex items-center justify-center text-2xl font-black text-white shadow-2xl border-4 border-[#2B2D31] group-hover:scale-110 transition-transform">
                            {server.acronym}
                          </div>
                       </div>
                    </div>

                    <div className="p-6 pt-10 flex flex-1 flex-col">
                       <h3 className="text-white text-xl font-black mb-1 group-hover:text-brand-indigo transition-colors font-display tracking-tight">{server.name}</h3>
                       <p className="text-[#B5BAC1] text-[13px] font-medium leading-relaxed mb-6 opacity-80 flex-1 line-clamp-2">
                         The official community for {server.name}. Join to connect with classmates, share resources, and collaborate on projects.
                       </p>

                       <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-4 text-[#949BA4] text-xs font-bold uppercase tracking-widest">
                             <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-status-online" />
                                {server.members?.length || 0} Members
                             </div>
                          </div>
                          <button 
                            onClick={() => {
                              joinServer(server.id);
                              selectServer(server.id);
                            }}
                            className="bg-brand-indigo hover:bg-brand-indigo-hover text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center gap-2 group/btn"
                          >
                            <Plus size={16} /> Join Server
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                <Search size={40} className="text-[#949BA4] opacity-20" />
              </div>
              <h3 className="text-white text-2xl font-black mb-2 font-display">No communities found</h3>
              <p className="text-[#949BA4] font-medium max-w-md">We couldn't find any public communities matching your search. Why not start one yourself?</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DiscoveryView;
