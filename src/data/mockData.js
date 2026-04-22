export const servers = [
  { 
    id: 'swastik-eng', 
    name: 'Swastik Engineering', 
    iconName: 'GraduationCap', 
    notificationCount: 12, 
    brandingColor: '#5865F2', 
    banner: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    acronym: 'SE',
    description: 'The pulse of Swastik engineering students. Collaborative coding and lab help.',
    members: ['user-1'],
    memberRoles: { 'user-1': 'member' },
    privacy: 'public'
  },
  { 
    id: 'science-hub', 
    name: 'Faculty of Science', 
    iconName: 'FlaskConical', 
    notificationCount: 0, 
    brandingColor: '#248046',
    banner: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    acronym: 'FS',
    description: 'Research, seminars, and academic discussions for science enthusiasts.',
    members: ['user-1'],
    memberRoles: { 'user-1': 'member' },
    privacy: 'public'
  },
  { 
    id: 'tech-innovators', 
    name: 'Tech Innovators', 
    iconName: 'Cpu', 
    notificationCount: 5, 
    brandingColor: '#eb459e',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    acronym: 'TI',
    description: 'Hacking, building, and exploring the future of tech at Swastik.',
    members: ['user-1'],
    memberRoles: { 'user-1': 'member' },
    privacy: 'public'
  }
];

export const dmList = [
  {
    id: 'midjourney',
    name: 'Midjourney Bot',
    status: 'online',
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&q=80',
    subText: 'Official Bot',
    isBot: true,
    relationship: 'friend'
  },
  {
    id: 'alex-v',
    name: 'Alex Verified',
    status: 'online',
    avatar: '',
    subText: 'Playing Valorant',
    relationship: 'friend'
  },
  {
    id: 'priya-s',
    name: 'Priya Sharma',
    status: 'idle',
    avatar: '',
    subText: 'University Representative',
    badge: 'Campus Star',
    relationship: 'friend'
  },
  {
    id: 'pro-dev',
    name: 'Prof. Dev',
    status: 'dnd',
    avatar: '',
    subText: 'Office Hours',
    relationship: 'friend'
  },
  {
    id: 'rahul-m',
    name: 'Rahul Maurya',
    status: 'offline',
    avatar: '',
    subText: 'Sent you a friend request',
    relationship: 'pending_incoming'
  },
  {
    id: 'sneha-k',
    name: 'Sneha Kapoor',
    status: 'online',
    avatar: '',
    subText: 'Friend request sent',
    relationship: 'pending_outgoing'
  },
  {
    id: 'spammer-99',
    name: 'Unknown User',
    status: 'offline',
    avatar: '',
    subText: 'Blocked',
    relationship: 'blocked'
  }
];

export const channels = {
  'su-main': [
    { id: 'welcome', name: 'welcome-and-rules', type: 'text' },
    { id: 'announcements', name: 'announcements', type: 'announcement' },
    { id: 'general', name: 'general-chat', type: 'text' },
    { id: 'academic', name: 'academic-resources', type: 'text' },
    { id: 'voice1', name: 'Lounge', type: 'voice' },
    { id: 'voice2', name: 'Study Room', type: 'voice' },
  ],
  'ai-ml': [
    { id: 'resources', name: 'ml-papers', type: 'text' },
    { id: 'projects', name: 'active-projects', type: 'text' },
    { id: 'voice-ai', name: 'Project Lab', type: 'voice' },
  ]
};

export const campusNews = [
  {
    id: 'news-1',
    title: 'New AI Innovation Lab Opening',
    category: 'Academic',
    date: 'Oct 24, 2026',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    summary: 'Swastik University is proud to announce the inauguration of our state-of-the-art AI Lab.'
  },
  {
    id: 'news-2',
    title: 'Green Campus Initiative',
    category: 'Sustainability',
    date: 'Oct 22, 2026',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    summary: 'Join the mission to plant 5000 trees across our campus this semester.'
  },
  {
    id: 'news-3',
    title: 'Cybersecurity Seminar',
    category: 'Events',
    date: 'Oct 20, 2026',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    summary: 'Industry experts from Google and Microsoft join us for a two-day workshop.'
  }
];

export const upcomingEvents = [
  {
    id: 'event-1',
    title: 'Hackathon 2026',
    date: '15',
    month: 'NOV',
    location: 'Main Hall',
    tags: ['Tech', 'Coding']
  },
  {
    id: 'event-2',
    title: 'Annual Cultural Fest',
    date: '22',
    month: 'DEC',
    location: 'Campus Arena',
    tags: ['Music', 'Art']
  },
  {
    id: 'event-3',
    title: 'Career Fair Q4',
    date: '05',
    month: 'NOV',
    location: 'Placement Center',
    tags: ['Jobs', 'Future']
  }
];

export const currentUser = {
  id: 'user-1',
  name: 'Harsh g',
  status: 'online',
  discriminator: '0001',
  avatar: '',
  university: 'Swastik University',
};

export const notifications = [
  {
    id: 'notif-1',
    user: 'Alex Verified',
    avatar: '',
    content: 'mentioned you in #general-chat',
    time: '2m ago',
    type: 'mention',
    unread: true
  },
  {
    id: 'notif-2',
    user: 'Priya Sharma',
    avatar: '',
    content: 'sent you a star for your "AI Lab" response.',
    time: '45m ago',
    type: 'reaction',
    unread: false
  },
  {
    id: 'notif-3',
    user: 'Prof. Dev',
    avatar: '',
    content: 'accepted your friend request.',
    time: '2h ago',
    type: 'request',
    unread: false
  },
  {
    id: 'notif-4',
    user: 'Campus Hub',
    avatar: '',
    content: 'The "Hackathon 2026" registration is now open!',
    time: '1d ago',
    type: 'system',
    unread: false
  }
];
