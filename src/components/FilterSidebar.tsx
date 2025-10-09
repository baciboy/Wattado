import React, { useState } from 'react';
import { Search, Filter, X, Calendar, MapPin, DollarSign, Tag, Monitor, ChevronDown } from 'lucide-react';
import { FilterState } from '../types/Event';
import { categories, platforms } from '../data/mockEvents';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
  eventCount: number;
}

const platformNames = {
  eventbrite: 'Eventbrite',
  ticketmaster: 'Ticketmaster',
  stubhub: 'StubHub',
  seatgeek: 'SeatGeek',
  'vivid-seats': 'Vivid Seats'
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  eventCount
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    platforms: false,
    availability: false
  });

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleArrayFilter = (key: 'categories' | 'platforms' | 'availability', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    updateFilters({ [key]: newArray });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      dateRange: { start: '', end: '' },
      location: '',
      categories: [],
      priceRange: { min: 0, max: 1000 },
      platforms: [],
      availability: []
    });
  };

  // Quick date presets
  const setDatePreset = (preset: 'today' | 'tomorrow' | 'this-week' | 'this-weekend' | 'this-month') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let start = new Date(today);
    let end = new Date(today);

    switch (preset) {
      case 'today':
        // start and end are already today
        break;
      case 'tomorrow':
        start.setDate(start.getDate() + 1);
        end.setDate(end.getDate() + 1);
        break;
      case 'this-week':
        // Start from today, end 7 days later
        end.setDate(end.getDate() + 7);
        break;
      case 'this-weekend':
        // Find next Saturday
        const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
        start.setDate(start.getDate() + daysUntilSaturday);
        end.setDate(start.getDate() + 1); // Sunday
        break;
      case 'this-month':
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
    }

    updateFilters({
      dateRange: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      }
    });
  };

  // UK cities for dropdown
  const ukCities = [
    'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Glasgow', 'Edinburgh', 'Bristol', 'Cardiff', 'Belfast', 'Newcastle', 'Sheffield', 'Nottingham', 'Southampton', 'Brighton'
  ];

  const hasActiveFilters = filters.search || filters.location || filters.dateRange.start ||
    filters.categories.length > 0 || filters.platforms.length > 0 || filters.availability.length > 0 ||
    filters.priceRange.min > 0 || filters.priceRange.max < 1000;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out w-80
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto flex-shrink-0 shadow-lg lg:shadow-none
      `}>
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Filter className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Filters</h2>
                <p className="text-xs text-gray-500">{eventCount} results</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Search Events
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search by name or venue..."
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-shadow hover:shadow-sm"
              />
            </div>
          </div>

          {/* Date Range with Quick Presets */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              When
            </label>

            {/* Quick Date Presets */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() => setDatePreset('today')}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 rounded-md hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setDatePreset('tomorrow')}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 rounded-md hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
              >
                Tomorrow
              </button>
              <button
                onClick={() => setDatePreset('this-weekend')}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 rounded-md hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
              >
                Weekend
              </button>
              <button
                onClick={() => setDatePreset('this-week')}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 rounded-md hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
              >
                This Week
              </button>
            </div>

            {/* Date Inputs */}
            <div className="space-y-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => updateFilters({
                    dateRange: { ...filters.dateRange, start: e.target.value }
                  })}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-shadow hover:shadow-sm"
                  placeholder="Start date"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => updateFilters({
                    dateRange: { ...filters.dateRange, end: e.target.value }
                  })}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-shadow hover:shadow-sm"
                  placeholder="End date"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={filters.location}
                onChange={(e) => updateFilters({ location: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-shadow hover:shadow-sm appearance-none cursor-pointer"
              >
                <option value="">All cities</option>
                {ukCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Price Range (£)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="number"
                  value={filters.priceRange.min || ''}
                  onChange={(e) => updateFilters({
                    priceRange: { ...filters.priceRange, min: Number(e.target.value) || 0 }
                  })}
                  placeholder="Min"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-shadow hover:shadow-sm"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="number"
                  value={filters.priceRange.max === 1000 ? '' : filters.priceRange.max}
                  onChange={(e) => updateFilters({
                    priceRange: { ...filters.priceRange, max: Number(e.target.value) || 1000 }
                  })}
                  placeholder="Max"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-shadow hover:shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Collapsible Categories */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide hover:text-purple-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" />
                Categories
                {filters.categories.length > 0 && (
                  <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {filters.categories.length}
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.categories && (
              <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                {categories.map(category => (
                  <label key={category} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => toggleArrayFilter('categories', category)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Collapsible Platforms */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('platforms')}
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide hover:text-purple-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5" />
                Platforms
                {filters.platforms.length > 0 && (
                  <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {filters.platforms.length}
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.platforms ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.platforms && (
              <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                {platforms.map(platform => (
                  <label key={platform} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.platforms.includes(platform)}
                      onChange={() => toggleArrayFilter('platforms', platform)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      {platformNames[platform as keyof typeof platformNames]}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Collapsible Availability */}
          <div className="mb-5">
            <button
              onClick={() => toggleSection('availability')}
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide hover:text-purple-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                Availability
                {filters.availability.length > 0 && (
                  <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {filters.availability.length}
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.availability ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.availability && (
              <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                {[
                  { value: 'available', label: 'Available' },
                  { value: 'low', label: 'Few tickets left' },
                  { value: 'sold-out', label: 'Sold out' }
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes(value)}
                      onChange={() => toggleArrayFilter('availability', value)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="w-full py-2.5 px-4 text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all border border-purple-200 hover:border-purple-300"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </>
  );
};
