import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Users, Shield, UserMinus, ChevronRight, Save } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Avatar from './Avatar';

const ServerSettingsModal = ({ serverId, onClose }) => {
  const { servers, dmList, updateServer, kickMember, updateMemberRole, currentUser } = usePlatform();
  const server = servers.find(s => s.id === serverId);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [serverName, setServerName] = useState(server?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!server) return null;

  const handleSaveOverview = async () => {
    setIsSaving(true);
    await updateServer(serverId, { name: serverName });
    setIsSaving(false);
  };

  const springTransition = { type: "spring", stiffness: 400, damping: 25 };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        transition={springTransition}
        className="relative w-full h-full sm:w-[800px] sm:h-[600px] bg-[#313338] sm:rounded-lg shadow-2xl overflow-hidden flex"
      >
        {/* Sidebar */}
        <div className="w-[220px] bg-[#2B2D31] flex flex-col p-6 pt-12 gap-1 border-r border-black/20">
          <h3 className="text-[#949BA4] text-[12px] font-black uppercase tracking-wider mb-2 px-2 opacity-60">Server Settings</h3>
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={<Settings size={18} />} />
          <div className="h-[1px] bg-white/5 my-2 mx-2" />
          <h3 className="text-[#949BA4] text-[12px] font-black uppercase tracking-wider mb-2 px-2 opacity-60">User Management</h3>
          <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} label="Members" icon={<Users size={18} />} />
          <TabButton active={activeTab === 'roles'} onClick={() => setActiveTab('roles')} label="Roles" icon={<Shield size={18} />} />
          
          <div className="mt-auto pt-6 border-t border-white/5">
            <button 
              onClick={onClose}
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-white/5 text-[#949BA4] hover:text-white transition-all group"
            >
              <span className="font-bold text-sm">ESC</span>
              <div className="w-8 h-8 rounded-full border-2 border-[#949BA4] group-hover:border-white flex items-center justify-center">
                <X size={16} />
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#313338] overflow-y-auto no-scrollbar p-10 pt-12">
          {activeTab === 'overview' && (
            <div className="max-w-[460px] animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h1 className="text-white text-2xl font-black mb-6 font-display">Server Overview</h1>
              
              <div className="space-y-6">
                <div className="flex items-center gap-8 bg-black/10 p-6 rounded-2xl border border-white/5">
                  <div className="w-24 h-24 rounded-full bg-brand-indigo flex items-center justify-center text-3xl font-black text-white shadow-2xl relative group cursor-pointer">
                    {server.acronym}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black uppercase">Change</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#B5BAC1] text-sm mb-4 leading-relaxed">We recommend an image of at least 512x512 for the server.</p>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-md transition-all">Upload Image</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[#B5BAC1] text-[12px] font-black uppercase tracking-wider">Server Name</label>
                  <input 
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full bg-[#1E1F22] text-white h-[40px] px-3 rounded-[3px] outline-none border-none focus:ring-2 focus:ring-brand-indigo transition-all"
                  />
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <p className="text-[#949BA4] text-xs">Careful — you have unsaved changes!</p>
                  <button 
                    onClick={handleSaveOverview}
                    disabled={isSaving || serverName === server.name}
                    className="flex items-center gap-2 px-6 py-2 bg-[#248046] hover:bg-[#1a6334] disabled:opacity-50 text-white rounded-[3px] font-bold transition-all active:scale-95 shadow-lg"
                  >
                    {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-white text-2xl font-black font-display">Server Members</h1>
                <span className="text-[#949BA4] text-sm font-bold uppercase tracking-wider opacity-60">{server.members.length} Members</span>
              </div>

              <div className="space-y-2">
                {server.members.map(memberId => {
                  const memberData = dmList.find(u => u.id === memberId) || { name: 'Unknown Student', id: memberId };
                  const role = server.memberRoles?.[memberId] || 'member';
                  const isOwner = role === 'owner';
                  const isMe = memberId === currentUser?.id;

                  return (
                    <div key={memberId} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl group transition-all">
                      <div className="flex items-center gap-4">
                        <Avatar userId={memberId} name={memberData.name} size={40} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{memberData.name}</span>
                            {role !== 'member' && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                                role === 'owner' ? 'bg-brand-indigo/20 text-brand-indigo' : 
                                role === 'admin' ? 'bg-status-online/20 text-status-online' : 
                                'bg-purple-400/20 text-purple-400'
                              }`}>
                                {role}
                              </span>
                            )}
                          </div>
                          <span className="text-[#949BA4] text-xs opacity-60">ID: {memberId.slice(0, 8)}...</span>
                        </div>
                      </div>

                      {!isOwner && !isMe && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <select 
                            value={role}
                            onChange={(e) => updateMemberRole(serverId, memberId, e.target.value)}
                            className="bg-[#1E1F22] text-white text-xs px-2 py-1 rounded border-none outline-none cursor-pointer hover:bg-[#2B2D31] transition-colors"
                          >
                            <option value="member">Member</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button 
                            onClick={() => {
                              if (confirm(`Are you sure you want to kick ${memberData.name}?`)) {
                                kickMember(serverId, memberId);
                              }
                            }}
                            className="p-2 text-[#949BA4] hover:text-brand-crimson transition-colors"
                            title="Kick Member"
                          >
                            <UserMinus size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

const TabButton = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-2 rounded-md transition-all font-medium text-sm mb-0.5 ${
      active ? 'bg-white/10 text-white shadow-sm' : 'text-[#949BA4] hover:bg-white/5 hover:text-[#DBDEE1]'
    }`}
  >
    <span className={active ? 'text-white' : 'text-[#80848E]'}>{icon}</span>
    {label}
    {active && <ChevronRight size={14} className="ml-auto opacity-40" />}
  </button>
);

export default ServerSettingsModal;
