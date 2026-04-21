import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import ServerSidebar from './components/ServerSidebar';
import ChannelSidebar from './components/ChannelSidebar';
import FriendsView from './views/FriendsView';
import ChatView from './views/ChatView';
import DiscoverView from './views/DiscoverView';

const AppContent = () => {
  const { view, activeChannelId, activeDMId, isMobileMenuOpen, setIsMobileMenuOpen } = usePlatform();

  const renderView = () => {
    const targetId = activeDMId || activeChannelId;
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, ease: "linear" }}
          className="flex-1 flex flex-col min-h-0 h-full overflow-hidden bg-[#313338]"
          role="main"
          id="main-content"
        >
          {view === 'friends' && <FriendsView />}
          {view === 'chat' && <ChatView targetId={targetId} />}
          {view === 'discover' && <DiscoverView />}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#1e1f22] overflow-hidden relative">
      <a href="#main-content" className="skip-link">Skip to content</a>
      
      {/* Desktop Sidebars */}
      <div className="hidden lg:flex shrink-0">
        <ServerSidebar />
        <ChannelSidebar />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] lg:hidden"
            />
            {/* Drawer Content */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[101] flex lg:hidden"
            >
              <ServerSidebar />
              <ChannelSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {renderView()}
    </div>
  );
};

function App() {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
}

export default App;
