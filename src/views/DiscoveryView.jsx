import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, ShieldCheck, Calendar, ArrowRight, TrendingUp, Newspaper, Menu } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import ParallaxCard from '../components/ParallaxCard';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { useListDiscoverableServers } from '../dataconnect-generated/react';

const DiscoveryView = () => {
  const { selectServer, setIsMobileMenuOpen, joinServer, currentUser } = usePlatform();
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  // Use Data Connect for high-performance relational discovery
  const { data: dcData, isLoading: dcLoading } = useListDiscoverableServers({
    domain: currentUser?.domain || ''
  });

  const discoverableServers = dcData?.servers || [];

  useEffect(() => {
    // Subscribe to News with Resilience
    const qNews = query(collection(db, "news"), orderBy("id", "asc"), limit(6));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      if (!snapshot.empty) {
        setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    }, (err) => {
      console.warn("Discover News Error (Permissions?):", err.message);
    });

    // Subscribe to Events with Resilience
    const qEvents = query(collection(db, "events"), orderBy("date", "asc"), limit(8));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      if (!snapshot.empty) {
        setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    }, (err) => {
      console.warn("Discover Events Error (Permissions?):", err.message);
    });

    return () => {
      unsubNews();
      unsubEvents();
    };
  }, []);

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

      {/* Mindblowing Portal Hero - High Fidelity 3D Parallax */}
      <div className="h-[480px] w-full relative flex flex-col items-center justify-center overflow-hidden perspective-[1500px]">
        {/* Multilayered Atmospheric Backdrop */}
        <div className="absolute inset-0 bg-[#050505]">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 opacity-40 mix-blend-screen"
          >
            <img 
              src="/Users/sakhi/.gemini/antigravity/brain/3a9d93cf-aa3a-4ea4-96cb-65c6ed86c6ad/campus_discover_hero_1776747519333.png" 
              alt="Campus Network" 
              className="w-full h-full object-cover blur-[2px]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
          
          {/* Bioluminescent Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-indigo/20 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-crimson/10 blur-[150px] rounded-full animate-pulse" />
        </div>
        
        <div className="relative z-10 text-center max-w-[900px] px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="mb-10"
          >
            <h1 className="text-white text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] font-display leading-[0.85] text-glow select-none">
              The Student <br/> <span className="text-brand-indigo opacity-90">Universe</span>
            </h1>
            <p className="text-text-muted text-lg sm:text-xl font-bold tracking-wide opacity-60 uppercase mt-4 max-w-[600px] mx-auto leading-relaxed">
              Experience the next generation of campus life and global community.
            </p>
          </motion.div>
          
          {/* Elite Magnetic Search HUD */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative w-full max-w-[600px] mx-auto group"
          >
            <div className="glass p-1.5 rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-white/10 group-focus-within:border-brand-indigo/50 transition-all duration-500 scale-100 group-focus-within:scale-[1.02]">
              <div className="flex items-center h-14 px-6 gap-4">
                <Search size={24} className="text-brand-indigo group-focus-within:scale-110 transition-transform" />
                <input 
                  type="text" 
                  placeholder="Seach through the student network..." 
                  className="bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-[17px] text-white w-full placeholder:text-text-muted/50 font-bold" 
                />
                <div className="bg-white/5 px-3 py-1 rounded-lg text-[10px] font-black text-white/30 uppercase tracking-widest hidden sm:block border border-white/5">
                  Press Enter
                </div>
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
            {discoverableServers.map(server => (
              <motion.div key={server.id} variants={fadeInUp}>
                <ParallaxCard onClick={() => selectServer(server.id)} className="cursor-pointer group h-full">
                  <div className="bg-bg-secondary rounded-[20px] overflow-hidden shadow-premium border border-white/5 h-full transition-all group-hover:bg-bg-secondary-alt group-hover:border-white/10 relative">
                    <div className="h-28 premium-gradient relative flex items-center justify-center p-6">
                      <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                      <span className="text-5xl font-black text-white/20 select-none tracking-tighter uppercase font-display">{server.acronym}</span>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          joinServer(server.id);
                        }}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-brand-indigo text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                      >
                        Join Community
                      </button>
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
                        <p className="text-text-muted text-[13px] leading-relaxed line-clamp-2 mb-4 font-medium opacity-80">{server.description || 'A growing community of students sharing interests and resources.'}</p>
                        
                        <div className="flex items-center gap-4 text-[11px] font-black text-text-muted uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-status-online shadow-[0_0_8px_rgba(35,165,89,0.5)]" /> 
                            {server.onlineCount || 0} Online
                          </span>
                          <span className="opacity-50">•</span>
                          <span>{server.members?.length || 0} Members</span>
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
            {news.map((item, idx) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-transparent rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
              >
                <div className="h-48 overflow-hidden rounded-2xl shadow-premium relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 glass px-2 py-1 rounded text-[10px] font-black text-white uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
                <div className="pt-5 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-xl mb-3 group-hover:text-brand-indigo transition-colors font-display leading-tight">{item.title}</h3>
                  <p className="text-text-muted text-sm font-medium line-clamp-3 mb-4 flex-1 opacity-70 leading-relaxed">{item.summary}</p>
                  <div className="flex items-center justify-between text-[11px] font-black text-text-muted uppercase tracking-widest border-t border-white/5 pt-4 group-hover:border-brand-indigo/30 transition-colors">
                    <span>{item.date}</span>
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
            {events.map((event, idx) => (
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

export default DiscoveryView;
