import React from 'react';
import { motion } from 'framer-motion';

const GlobalAtmosphere = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
      {/* High-Performance Static Gradient - Lite Architecture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(88,101,242,0.1)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(237,66,69,0.05)_0%,_transparent_50%)]" />
      
      {/* Global Vignette for depth without animation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />
    </div>
  );
};

export default GlobalAtmosphere;
