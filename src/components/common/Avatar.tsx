import React from 'react';

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const COLOR_PALETTES = [
  'bg-rose-500 text-white',
  'bg-indigo-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-purple-500 text-white',
  'bg-sky-500 text-white',
  'bg-pink-500 text-white',
  'bg-teal-500 text-white',
];

export const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm font-semibold',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return 'LN';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getPalette = (n: string) => {
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLOR_PALETTES.length;
    return COLOR_PALETTES[index];
  };

  if (avatarUrl && avatarUrl.startsWith('http')) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-slate-800 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center select-none shadow-sm ${sizeClasses[size]} ${getPalette(
        name
      )} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
