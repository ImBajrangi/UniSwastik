import React from 'react';

const Avatar = ({ src, name, size = 32, status, badge, isBot }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div 
        className="flex items-center justify-center rounded-full overflow-hidden bg-bg-accent"
        style={{ width: size, height: size }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-medium" style={{ fontSize: size * 0.4 }}>{initials}</span>
        )}
      </div>
      
      {status && (
        <div 
          className="absolute bottom-0 right-0 rounded-full border-2 border-bg-secondary"
          style={{ 
            width: size * 0.35, 
            height: size * 0.35,
            backgroundColor: `var(--color-status-${status})`
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
