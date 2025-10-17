import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabaseClient';

export const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" aria-label="Loading user" />
    );
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition-colors"
      >
        Log in
      </Link>
    );
  }

  const name = user.user_metadata?.name || user.email || 'Account';
  return (
    <div className="flex items-center gap-2">
      <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800" aria-label="User">
        {name}
      </span>
      <button
        onClick={handleLogout}
        className="px-3 py-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};


