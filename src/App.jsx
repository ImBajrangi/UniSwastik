import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import ServerSidebar from './components/ServerSidebar';
import ChannelSidebar from './components/ChannelSidebar';
import FriendsView from './views/FriendsView';
import ChatView from './views/ChatView';
import DiscoverView from './views/DiscoverView';
import NotificationsView from './views/NotificationsView';
import ProfileView from './views/ProfileView';
import { 
  MessageSquare, Bell, Compass, Users, User, Menu
} from 'lucide-react';
import Avatar from './components/Avatar';
import GlobalAtmosphere from './components/GlobalAtmosphere';

const BottomNav = () => {
  const { view, setView, setIsMobileMenuOpen, currentUser } = usePlatform();

  const tabs = [
    { id: 'servers', label: 'Home', icon: <MessageSquare size={24} />, action: () => { setView('chat'); } },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={24} />, action: () => { setView('notifications'); } },
    { id: 'profile', label: 'You', icon: <Avatar name={currentUser.name} size={24} />, action: () => { setView('profile'); } },
  ];

  return (
    <div className="lg:hidden relative h-[70px] bg-[#111214] border-t border-white/5 flex items-center justify-around px-2 z-[400] pb-safe shadow-[0_-8px_24px_rgba(0,0,0,0.3)] shrink-0">
      {tabs.map((tab) => {
        const isActive = (tab.id === 'servers' && view === 'chat') || 
                        (tab.id === 'servers' && view === 'friends') ||
                        (tab.id === 'notifications' && view === 'notifications') ||
                        (tab.id === 'profile' && view === 'profile');
        
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              tab.action();
            }}
            className="relative flex flex-col items-center justify-center gap-1.5 w-16 group outline-none"
          >
            {/* Active Glow/Indicator */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="bottomTab"
                  className="absolute -top-1 w-8 h-1 bg-brand-indigo rounded-full shadow-[0_0_8px_rgba(88,101,242,0.8)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </AnimatePresence>

            <div className={`relative p-2 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'text-white scale-110' 
                : 'text-[#949BA4] group-hover:bg-white/5 hover:text-[#DBDEE1]'
            }`}>
              {/* Subtle Icon Background for active */}
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-brand-indigo/10 rounded-xl blur-sm"
                />
              )}
              <div className="relative z-10">{tab.icon}</div>
            </div>
            
            <span className={`text-[10px] font-bold tracking-tight font-display transition-colors ${
              isActive ? 'text-white' : 'text-[#949BA4]'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

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
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="flex-1 flex flex-col min-h-0 h-full overflow-hidden bg-transparent"
          role="main"
          id="main-content"
        >
          {view === 'friends' && <FriendsView />}
          {view === 'chat' && <ChatView targetId={targetId} />}
          {view === 'discover' && <DiscoverView />}
          {view === 'notifications' && <NotificationsView />}
          {view === 'profile' && <ProfileView />}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden relative">
      <GlobalAtmosphere />
      
      {/* Desktop Sidebars */}
      <div className="hidden lg:flex shrink-0">
        <ServerSidebar />
        {/* Sidebar remains visible for Home (Chat/Friends), Notifications, and Profile */}
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
              className="fixed inset-0 bg-black/70 z-[150] lg:hidden"
            />
            {/* Drawer Content */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-[500] flex lg:hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] bg-bg-tertiary"
            >
              <ServerSidebar />
              <ChannelSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <main className="flex-1 min-h-0 relative">
          {renderView()}
        </main>
        <BottomNav />
      </div>
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
