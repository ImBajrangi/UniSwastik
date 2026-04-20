import React from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, ShieldCheck, Calendar, ArrowRight, TrendingUp, Newspaper } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import ParallaxCard from '../components/ParallaxCard';
import { campusNews, upcomingEvents } from '../data/mockData';

const DiscoverView = () => {
  const { servers, selectServer } = usePlatform();

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex-1 bg-bg-primary overflow-y-auto no-scrollbar relative pb-12">
      {/* Animated Hero Banner */}
      <div className="h-[280px] w-full relative flex flex-col items-center justify-center p-8 overflow-hidden premium-gradient shadow-2xl">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)]"
        />
        
        <div className="relative z-10 text-center max-w-[600px]">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white text-4xl font-extrabold mb-3 uppercase tracking-tighter drop-shadow-lg"
          >
            Your Home for Campus Life
          </motion.h1>
          <div className="relative w-full group mt-4">
            <input 
              type="text" 
              placeholder="Search academic labs, societies, and more..." 
              className="w-full bg-white h-12 px-5 pr-14 rounded-md text-base text-gray-900 placeholder:text-gray-500 outline-none shadow-xl focus:ring-4 focus:ring-bg-accent/40 transition-all border-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-bg-accent transition-colors">
              <Search size={22} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-[1200px] mx-auto flex flex-col gap-12">
        
        {/* Section 1: Featured Communities (Parallax) */}
        <section>
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-black flex items-center gap-2 tracking-tight uppercase">
              <Compass className="text-bg-accent" /> Featured Communities
            </h2>
            <CategoryChip label="View All" />
          </header>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {servers.filter(s => !s.isHome).map(server => (
              <motion.div key={server.id} variants={fadeInUp}>
                <ParallaxCard onClick={() => selectServer(server.id)} className="cursor-pointer">
                  <div className="bg-bg-secondary rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-white/5 h-full">
                    <div className="h-24 premium-gradient flex items-center justify-center text-5xl font-black text-white/40 tracking-tighter">
                      {server.acronym}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center font-bold text-white shadow-inner">{server.acronym}</div>
                        <div>
                          <h3 className="text-white font-bold leading-tight flex items-center gap-1">{server.name} <ShieldCheck size={14} className="text-bg-accent" /></h3>
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Official</span>
                        </div>
                      </div>
                      <p className="text-text-muted text-[13px] leading-relaxed line-clamp-2 mb-3">{server.description}</p>
                      <div className="flex items-center gap-4 text-xs font-bold text-text-muted">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-status-online" /> {server.online?.toLocaleString()} Online</span>
                        <span>{server.members?.toLocaleString()} Members</span>
                      </div>
                    </div>
                  </div>
                </ParallaxCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Section 2: Campus Pulse (News) */}
        <section>
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-black flex items-center gap-2 tracking-tight uppercase">
              <Newspaper className="text-bg-accent" /> Campus Pulse
            </h2>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campusNews.map(news => (
              <motion.div 
                key={news.id} 
                whileHover={{ y: -5 }}
                className="bg-bg-secondary/40 border border-white/5 rounded-xl overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="h-40 overflow-hidden">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-bg-accent text-[10px] font-black uppercase tracking-widest mb-1">{news.category}</span>
                  <h3 className="text-white font-bold text-base mb-2 group-hover:text-bg-accent transition-colors">{news.title}</h3>
                  <p className="text-text-muted text-xs line-clamp-2 mb-4 flex-1">{news.summary}</p>
                  <div className="flex items-center justify-between text-[10px] font-bold text-text-muted">
                    <span>{news.date}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 3: Upcoming Events */}
        <section>
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-black flex items-center gap-2 tracking-tight uppercase">
              <Calendar className="text-bg-accent" /> Upcoming Events
            </h2>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map(event => (
              <motion.div 
                key={event.id}
                whileHover={{ x: 5 }}
                className="glass p-4 rounded-xl flex items-center gap-4 cursor-pointer"
              >
                <div className="bg-bg-accent/10 border border-bg-accent/30 rounded-lg w-14 h-14 flex flex-col items-center justify-center p-1">
                  <span className="text-white text-lg font-black leading-none">{event.date}</span>
                  <span className="text-bg-accent text-[8px] font-black">{event.month}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm truncate">{event.title}</h3>
                  <p className="text-text-muted text-[11px] font-medium">{event.location}</p>
                  <div className="flex gap-1 mt-1">
                    {event.tags.map(tag => (
                      <span key={tag} className="text-[8px] bg-bg-tertiary px-1 py-0.5 rounded text-white/60 font-bold uppercase">{tag}</span>
                    ))}
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-interactive-normal hover:text-white">
                  <ArrowRight size={16} />
                </motion.div>
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
