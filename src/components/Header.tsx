import React, { useState, useRef } from 'react';
import { Filter, Calendar, TrendingUp, User } from 'lucide-react';

interface HeaderProps {
  onFilterToggle: () => void;
  totalEvents: number;
}

export const Header: React.FC<HeaderProps> = ({ onFilterToggle, totalEvents }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Wattado
              </h1>
            </div>
            <p className="text-gray-600">
              Discover amazing events from all major platforms in one place
            </p>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="bg-purple-50 px-4 py-2 rounded-xl">
              <div className="flex items-center gap-2 text-purple-700">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">{totalEvents.toLocaleString()}</span>
                <span className="text-sm">events found</span>
              </div>
            </div>

            <button
              onClick={onFilterToggle}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* User Icon and Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-purple-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="User menu"
              >
                <User className="w-6 h-6 text-purple-700" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <ul className="py-2">
                    <li>
                      <button className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 font-medium">Profile</button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 font-medium">Favourites</button>
                    </li>
                    <li>
                      <button className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-700 font-medium">Settings</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};