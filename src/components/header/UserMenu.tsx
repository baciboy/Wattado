import React from 'react';
import { Link } from 'react-router-dom';
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
      <Link
        to="/login"
        className="px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition-colors font-semibold shadow-sm hover:shadow-md whitespace-nowrap"
      >
        Log in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/account"
        className="px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition-colors font-semibold shadow-sm hover:shadow-md whitespace-nowrap"
      >
        My Account
      </Link>
    </div>
  );
};


