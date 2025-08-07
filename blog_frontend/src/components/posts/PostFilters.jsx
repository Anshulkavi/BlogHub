import React from 'react';
import { Search, X } from 'lucide-react';

const PostFilters = ({
  searchTerm,
  setSearchTerm,
  selectedTag,
  setSelectedTag,
}) => {
  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Display for selected tag */}
      {selectedTag && (
        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm text-gray-600">Filtered by tag:</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 font-medium">
            {selectedTag}
            <button
              onClick={() => setSelectedTag('')}
              className="ml-2 text-blue-600 hover:text-blue-800"
              aria-label="Clear tag filter"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
};

export default PostFilters;