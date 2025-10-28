import React, { useState } from 'react';
import { Calendar, TrendingUp, Search, Sparkles } from 'lucide-react';
import { UserMenu } from './header/UserMenu';
import { FilterDropdown } from './header/FilterDropdown';
import { FilterState } from '../types/Event';
import { parseNaturalLanguageQuery } from '../services/aiService';

interface HeaderProps {
  totalEvents: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const Header: React.FC<HeaderProps> = ({ totalEvents, filters, onFiltersChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchInput.trim()) {
      return;
    }

    // Check if query looks like natural language (more than 2 words)
    const wordCount = searchInput.trim().split(/\s+/).length;
    const hasNaturalLanguagePattern =
      wordCount > 2 ||
      /\b(find|show|looking for|want|need|romantic|stylish|fun|cool)\b/i.test(searchInput);

    if (hasNaturalLanguagePattern) {
      // Use AI to parse the query
      setIsAISearching(true);
      setAiExplanation('');

      try {
        const aiResult = await parseNaturalLanguageQuery(searchInput);

        // Show explanation to user
        setAiExplanation(aiResult.explanation);

        // Update filters based on AI params
        const newFilters: FilterState = {
          ...filters,
          search: searchInput,
        };

        if (aiResult.searchParams.location) {
          newFilters.location = aiResult.searchParams.location;
        }

        if (aiResult.searchParams.category) {
          newFilters.categories = [aiResult.searchParams.category];
        }

        if (aiResult.searchParams.priceRange) {
          newFilters.priceRange = {
            min: aiResult.searchParams.priceRange.min || filters.priceRange.min,
            max: aiResult.searchParams.priceRange.max || filters.priceRange.max,
          };
        }

        if (aiResult.searchParams.dateRange) {
          newFilters.dateRange = {
            start: aiResult.searchParams.dateRange.start || filters.dateRange.start,
            end: aiResult.searchParams.dateRange.end || filters.dateRange.end,
          };
        }

        onFiltersChange(newFilters);

        // Clear explanation after 5 seconds
        setTimeout(() => setAiExplanation(''), 5000);

      } catch (error) {
        console.error('AI search failed, falling back to regular search:', error);
        // Fall back to regular search
        onFiltersChange({ ...filters, search: searchInput });
      } finally {
        setIsAISearching(false);
      }
    } else {
      // Regular search for simple queries
      onFiltersChange({ ...filters, search: searchInput });
    }
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

          <div className="flex flex-wrap items-center gap-4 relative">
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

        {/* AI-Powered Search Bar */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Try: 'romantic date night events' or 'stylish art shows this weekend'"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={isAISearching}
              className="w-full pl-12 pr-28 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 bg-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isAISearching && (
              <div className="absolute right-32 top-1/2 -translate-y-1/2 flex items-center gap-2 text-purple-600">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-medium">AI thinking...</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isAISearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAISearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* AI Explanation */}
          {aiExplanation && (
            <div className="mt-3 flex items-start gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl px-4 py-2.5 max-w-2xl">
              <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-purple-900 font-medium">{aiExplanation}</p>
            </div>
          )}
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