import React from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, ShieldCheck, Calendar, ArrowRight, TrendingUp, Newspaper, Menu } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import ParallaxCard from '../components/ParallaxCard';
import { campusNews, upcomingEvents } from '../data/mockData';

const DiscoverView = () => {
  const { servers, selectServer, setIsMobileMenuOpen } = usePlatform();

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } }
  };

  return (
    <div className="flex-1 bg-bg-primary overflow-y-auto no-scrollbar relative pb-12">
      {/* Mobile Sticky Header - Premium Polish */}
      <header className="lg:hidden sticky top-0 left-0 right-0 h-14 px-4 flex items-center glass-dark z-[100] shadow-2xl">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-[#B5BAC1] hover:text-white mr-auto transition-all p-2 rounded-xl hover:bg-white/5 active:scale-90"
        >
          <Menu size={26} />
        </button>
        <span className="text-white font-black text-xs uppercase tracking-[0.2em] absolute left-1/2 -translate-x-1/2 font-display opacity-90">Discover</span>
      </header>

      {/* Animated Hero Banner - High Fidelity */}
      <div className="h-[380px] w-full relative flex flex-col items-center justify-center overflow-hidden">
        {/* The Generated Hero Asset */}
        <div className="absolute inset-0 bg-[#0A0B0E]">
          <img 
            src="/Users/sakhi/.gemini/antigravity/brain/3a9d93cf-aa3a-4ea4-96cb-65c6ed86c6ad/campus_discover_hero_1776747519333.png" 
            alt="Campus Network Illustration" 
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/80 via-transparent to-bg-primary/80" />
        </div>
        
        <div className="relative z-10 text-center max-w-[800px] px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-white text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] font-display leading-tight">
              Universe for <br/> <span className="text-brand-indigo">Students</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ y: 0, opacity: 1 }}
            className="relative w-full max-w-[540px] mx-auto group mt-8"
          >
            <div className="glass p-1 rounded-2xl shadow-2xl transition-all focus-premium">
              <div className="flex items-center h-12 px-4 gap-3">
                <Search size={22} className="text-text-muted group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Find your tribe, labs, or circles..." 
                  className="bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-[15px] text-white w-full placeholder:text-text-muted font-medium" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-8 max-w-[1300px] mx-auto flex flex-col gap-16 relative -mt-10 z-20">
        
        {/* Section 1: Featured Communities */}
        <section>
          <header className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h2 className="text-white text-2xl font-black flex items-center gap-3 tracking-tighter uppercase font-display">
                <Compass className="text-brand-indigo" size={28} /> Featured Spaces
              </h2>
              <span className="text-text-muted text-xs font-bold opacity-60 mt-1 uppercase tracking-widest pl-10">Hand-picked for you</span>
            </div>
            <CategoryChip label="View Catalog" />
          </header>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {servers.filter(s => !s.isHome).map(server => (
              <motion.div key={server.id} variants={fadeInUp}>
                <ParallaxCard onClick={() => selectServer(server.id)} className="cursor-pointer group h-full">
                  <div className="bg-bg-secondary rounded-[20px] overflow-hidden shadow-premium border border-white/5 h-full transition-all group-hover:bg-bg-secondary-alt group-hover:border-white/10">
                    <div className="h-28 premium-gradient relative flex items-center justify-center p-6">
                      <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                      <span className="text-5xl font-black text-white/20 select-none tracking-tighter uppercase font-display">{server.acronym}</span>
                    </div>
                    
                    <div className="p-6 relative">
                      <div className="absolute -top-10 left-6">
                        <div className="w-16 h-16 rounded-2xl bg-bg-tertiary flex items-center justify-center font-black text-white text-xl shadow-2xl border-4 border-bg-secondary group-hover:scale-105 transition-transform duration-300">
                          {server.acronym}
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-bold text-lg leading-tight flex items-center gap-1.5 font-display">
                            {server.name} 
                            <ShieldCheck size={18} className="text-brand-indigo" />
                          </h3>
                        </div>
                        <p className="text-text-muted text-[13px] leading-relaxed line-clamp-2 mb-4 font-medium opacity-80">{server.description}</p>
                        
                        <div className="flex items-center gap-4 text-[11px] font-black text-text-muted uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-status-online shadow-[0_0_8px_rgba(35,165,89,0.5)]" /> 
                            {server.online?.toLocaleString()} Online
                          </span>
                          <span className="opacity-50">•</span>
                          <span>{server.members?.toLocaleString()} Members</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ParallaxCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Section 2: Campus Pulse - Modern Magazine Design */}
        <section>
          <header className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h2 className="text-white text-2xl font-black flex items-center gap-3 tracking-tighter uppercase font-display">
                <Newspaper className="text-brand-indigo" size={28} /> Campus Pulse
              </h2>
              <span className="text-text-muted text-xs font-bold opacity-60 mt-1 uppercase tracking-widest pl-10">Real-time alerts & news</span>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campusNews.map((news, idx) => (
              <motion.div 
                key={news.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-transparent rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="h-48 overflow-hidden rounded-2xl shadow-premium relative">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 glass px-2 py-1 rounded text-[10px] font-black text-white uppercase tracking-widest">
                    {news.category}
                  </span>
                </div>
                <div className="pt-5 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-xl mb-3 group-hover:text-brand-indigo transition-colors font-display leading-tight">{news.title}</h3>
                  <p className="text-text-muted text-sm font-medium line-clamp-3 mb-4 flex-1 opacity-70 leading-relaxed">{news.summary}</p>
                  <div className="flex items-center justify-between text-[11px] font-black text-text-muted uppercase tracking-widest border-t border-white/5 pt-4 group-hover:border-brand-indigo/30 transition-colors">
                    <span>{news.date}</span>
                    <div className="flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                      Read story <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 3: Upcoming Events - Premium Glass */}
        <section className="pb-12">
          <header className="flex items-center justify-between mb-8">
            <h2 className="text-white text-2xl font-black flex items-center gap-3 tracking-tighter uppercase font-display">
              <Calendar className="text-brand-indigo" size={28} /> Campus Timeline
            </h2>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
                className="glass p-4 rounded-2xl flex flex-col gap-4 cursor-pointer transition-all border-white/5 hover:border-brand-indigo/40"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="bg-brand-indigo/10 border border-brand-indigo/30 rounded-xl w-14 h-14 flex flex-col items-center justify-center p-1 shadow-[0_0_15px_rgba(88,101,242,0.1)]">
                    <span className="text-white text-lg font-black leading-none font-display">{event.date}</span>
                    <span className="text-brand-indigo text-[9px] font-black uppercase tracking-tighter">{event.month}</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-bg-secondary bg-bg-tertiary flex items-center justify-center text-[8px] font-bold text-white">+{i}</div>)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base truncate font-display mb-1">{event.title}</h3>
                  <p className="text-text-muted text-[12px] font-bold opacity-70 mb-3">{event.location}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {event.tags.map(tag => (
                      <span key={tag} className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider group-hover:bg-brand-indigo/20 transition-colors">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

const CategoryChip = ({ label }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-3 py-1 bg-bg-tertiary rounded-md text-[11px] font-bold text-text-muted uppercase tracking-widest hover:text-white transition-colors border border-white/5"
  >
    {label}
  </motion.button>
);

export default DiscoverView;
