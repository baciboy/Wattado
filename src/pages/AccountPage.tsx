import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFavourites } from '../hooks/useFavourites';
import { supabase } from '../services/supabaseClient';
import { User, Mail, Calendar as CalendarIcon, LogOut, Users, Heart, Settings, Home, MapPin, Calendar, Star, Key, X, Check, AlertCircle } from 'lucide-react';
import { Event } from '../types/Event';

type MenuSection = 'overview' | 'friends' | 'favourites' | 'settings';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { favourites, isLoading: favouritesLoading, toggleFavourite } = useFavourites();
  const [activeSection, setActiveSection] = useState<MenuSection>('overview');

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Validation
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess(true);
        setPasswordForm({ newPassword: '', confirmPassword: '' });

        // Close modal after 2 seconds
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess(false);
        }, 2000);
      }
    } catch (error) {
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess(false);
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const name = user.user_metadata?.name || 'User';
  const email = user.email || '';
  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const menuItems = [
    { id: 'overview' as MenuSection, label: 'My Account', icon: User },
    { id: 'friends' as MenuSection, label: 'My Friends', icon: Users },
    { id: 'favourites' as MenuSection, label: 'Favourites', icon: Heart },
    { id: 'settings' as MenuSection, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="w-full px-4 py-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Events
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Account
            </h1>
            <div className="w-40"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Menu */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* User Profile Summary */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-4"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </nav>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-8">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Account Overview</h2>
                  <p className="text-gray-600">View and manage your account information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{name}</h3>
                      <p className="text-gray-600">Event Explorer</p>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="font-semibold text-gray-900">{createdAt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Friends Section */}
            {activeSection === 'friends' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">My Friends</h2>
                  <p className="text-gray-600">Connect with other event enthusiasts</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon!</h3>
                  <p className="text-gray-600">
                    Connect with friends, share events, and plan together. This feature is currently in development.
                  </p>
                </div>
              </div>
            )}

            {/* Favourites Section */}
            {activeSection === 'favourites' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">My Favourites</h2>
                  <p className="text-gray-600">
                    {favourites.length > 0
                      ? `You have ${favourites.length} favourite ${favourites.length === 1 ? 'event' : 'events'}`
                      : 'Events you\'ve saved for later'}
                  </p>
                </div>

                {favouritesLoading ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Heart className="w-8 h-8 text-pink-600" />
                    </div>
                    <p className="text-gray-600">Loading your favourites...</p>
                  </div>
                ) : favourites.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-10 h-10 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Favourites Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start adding events to your favourites to see them here. Look for the heart icon on event cards!
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Explore Events
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favourites.map((event: Event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                      >
                        <div className="relative overflow-hidden group">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={() => toggleFavourite(event)}
                            className="absolute top-3 right-3 p-2 bg-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition-all z-20"
                            aria-label="Remove from favourites"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                          <div className="absolute top-3 left-3 z-10">
                            <span className="bg-blue-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              {event.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                            {event.title}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span>
                                {event.date.includes(' - ')
                                  ? event.date
                                  : new Date(event.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                {event.time ? ` at ${event.time}` : ''}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <span className="line-clamp-1">{event.location.venue}, {event.location.city}</span>
                            </div>

                            {event.rating && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>{event.rating} rating</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="text-lg font-extrabold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                              {event.price
                                ? event.price.min === 0 && event.price.max === 0
                                  ? 'Free'
                                  : event.price.min === event.price.max
                                  ? `${event.price.currency} ${event.price.min}`
                                  : `${event.price.currency} ${event.price.min} - ${event.price.max}`
                                : 'Free'}
                            </div>
                            <a
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                            >
                              View Tickets
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
                  <p className="text-gray-600">Manage your account preferences and security</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Account Security</h3>

                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Key className="w-5 h-5 text-blue-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Change Password</p>
                            <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Email Preferences</p>
                          <p className="text-sm text-gray-600">Manage your email notifications</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                          Manage
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-red-200 rounded-xl bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-red-900">Delete Account</p>
                          <p className="text-sm text-red-700">Permanently delete your account and data</p>
                        </div>
                        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={closePasswordModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Key className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h2>
              <p className="text-gray-600 text-sm">Enter your new password below</p>
            </div>

            {/* Success Message */}
            {passwordSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Password Changed!</p>
                  <p className="text-sm text-green-700">Your password has been updated successfully</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {passwordError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{passwordError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  disabled={isChangingPassword || passwordSuccess}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  disabled={isChangingPassword || passwordSuccess}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword || passwordSuccess}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
