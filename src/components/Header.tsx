import React, { useState } from 'react';
import { Calendar, TrendingUp, Search } from 'lucide-react';
import { UserMenu } from './header/UserMenu';
import { FilterDropdown } from './header/FilterDropdown';
import { FilterState } from '../types/Event';

interface HeaderProps {
  totalEvents: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const Header: React.FC<HeaderProps> = ({ totalEvents, filters, onFiltersChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const quickFilters = [
    { label: 'This Weekend', action: () => {
      const now = new Date();
      const weekend = new Date(now);
      weekend.setDate(now.getDate() + (6 - now.getDay()));
      onFiltersChange({ ...filters, dateRange: { start: now.toISOString().split('T')[0], end: weekend.toISOString().split('T')[0] } });
    }},
    { label: 'Free', action: () => onFiltersChange({ ...filters, priceRange: { min: 0, max: 0 } }) },
    { label: 'Music', action: () => onFiltersChange({ ...filters, categories: ['Music'] }) },
    { label: 'Sports', action: () => onFiltersChange({ ...filters, categories: ['Sports'] }) },
    { label: 'Arts', action: () => onFiltersChange({ ...filters, categories: ['Arts'] }) },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput });
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="w-full px-4 py-8 lg:px-8 xl:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Wattado
              </h1>
            </div>
            <p className="text-gray-600 text-base ml-[4.5rem]">
              Discover amazing events from all major platforms in one place
            </p>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 px-5 py-3 rounded-2xl border border-blue-100/50 shadow-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold text-lg">{totalEvents.toLocaleString()}</span>
                <span className="text-sm font-medium">events found</span>
              </div>
            </div>

            <FilterDropdown
              filters={filters}
              onFiltersChange={onFiltersChange}
              eventCount={totalEvents}
            />

            <UserMenu />
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, artists, or venues..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-28 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 bg-white shadow-sm hover:shadow-md transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter, index) => (
            <button
              key={index}
              type="button"
              onClick={filter.action}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all shadow-sm"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};