import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import ServerSidebar from './components/ServerSidebar';
import ChannelSidebar from './components/ChannelSidebar';
import FriendsView from './views/FriendsView';
import ChatView from './views/ChatView';
import DiscoverView from './views/DiscoverView';

const AppContent = () => {
  const { view, activeServerId, activeChannelId, activeDMId } = usePlatform();

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
          className="flex-1 flex flex-col min-h-0 h-full overflow-hidden bg-bg-primary"
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
    <div className="app-container bg-bg-tertiary">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ServerSidebar />
      <ChannelSidebar />
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
