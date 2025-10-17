import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { UserMenu } from './header/UserMenu';
import { FilterDropdown } from './header/FilterDropdown';
import { FilterState } from '../types/Event';

interface HeaderProps {
  totalEvents: number;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const Header: React.FC<HeaderProps> = ({ totalEvents, filters, onFiltersChange }) => {

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                Wattado
              </h1>
            </div>
            <p className="text-gray-600">
              Discover amazing events from all major platforms in one place
            </p>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="bg-blue-50 px-4 py-2 rounded-xl">
              <div className="flex items-center gap-2 text-blue-700">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">{totalEvents.toLocaleString()}</span>
                <span className="text-sm">events found</span>
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
      </div>
    </div>
  );
};