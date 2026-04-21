import React from 'react';
import { motion } from 'framer-motion';

const GlobalAtmosphere = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
      {/* Cinematic Pulse Layers - Optimized for GPU */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: 'transform, opacity' }}
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#5865F2_0%,_transparent_60%)] blur-[100px] opacity-20 transform-gpu"
      />
      
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
          x: [0, 25, -25, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: 'transform, opacity' }}
        className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#ed4245_0%,_transparent_60%)] blur-[120px] opacity-10 transform-gpu"
      />

      {/* Bioluminescent Particle System - Simplified for Speed */}
      <div className="absolute inset-0 pointer-events-none transform-gpu">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, "120%"],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 20 + Math.random() * 10, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "linear" 
            }}
            style={{ willChange: 'transform, opacity' }}
            className="absolute w-1 h-1 bg-brand-indigo rounded-full shadow-[0_0_15px_#5865F2]"
          />
        ))}
      </div>

      {/* Liquid Mesh Overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-screen pointer-events-none animate-mesh transform-gpu" 
           style={{ background: 'radial-gradient(circle at 50% 50%, rgba(88,101,242,0.1) 0%, transparent 80%)' }} />

      {/* Dynamic Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
           
      {/* Global Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)] pointer-events-none" />
    </div>
  );
};

export default GlobalAtmosphere;
