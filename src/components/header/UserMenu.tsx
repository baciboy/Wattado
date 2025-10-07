import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const UserMenu: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" aria-label="Loading user" />
    );
  }

  if (!user) {
    return (
      <a
        href="/login"
        className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
      >
        Log in
      </a>
    );
  }

  const name = user.user_metadata?.name || user.email || 'Account';
  return (
    <a
      href="#"
      className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-purple-100 transition-colors"
      aria-label="User menu"
    >
      {name}
    </a>
  );
};


