import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  TrendingUp,
  Heart,
  Clock,
  Tag,
  ChevronDown,
  Sliders,
  RefreshCw,
  Layers,
} from "lucide-react";

const PostFilters = ({
  searchTerm,
  setSearchTerm,
  selectedTag,
  setSelectedTag,
  sortBy,
  setSortBy,
  dateFilter,
  setDateFilter,
  selectedCategory, // 1. ACCEPT NEW PROPS
  setSelectedCategory, // 1. ACCEPT NEW PROPS
  categories = [], // 1. ACCEPT NEW PROPS (with default empty array)
  onClearAll,
  isLoading = false,
  totalResults = 0,
  popularTags = [],
  recentSearches = [],
  onSearch,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchRef = useRef(null);
  const sortMenuRef = useRef(null);
  const tagSuggestionsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
      if (
        tagSuggestionsRef.current &&
        !tagSuggestionsRef.current.contains(event.target)
      ) {
        setShowTagSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions = [
    {
      value: "latest",
      label: "Latest First",
      icon: <Clock className="w-4 h-4" />,
      description: "Most recently published",
    },
    {
      value: "oldest",
      label: "Oldest First",
      icon: <Calendar className="w-4 h-4" />,
      description: "Oldest articles first",
    },
    {
      value: "popular",
      label: "Most Popular",
      icon: <Heart className="w-4 h-4" />,
      description: "Most liked articles",
    },
    {
      value: "trending",
      label: "Trending",
      icon: <TrendingUp className="w-4 h-4" />,
      description: "Currently trending",
    },
  ];

  const dateOptions = [
    { value: "", label: "All time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
    { value: "year", label: "This year" },
  ];

  const getCurrentSortOption = () => {
    return (
      sortOptions.find((option) => option.value === sortBy) || sortOptions[0]
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Trigger search after user stops typing (debounce effect)
    if (onSearch) {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        onSearch(value);
      }, 300);
    }
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setShowTagSuggestions(false);
    setTagSearchTerm("");
  };

  const filteredPopularTags = popularTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );

  const hasActiveFilters =
    searchTerm ||
    selectedTag ||
    dateFilter ||
    selectedCategory ||
    sortBy !== "latest";
  const activeFiltersCount = [
    searchTerm,
    selectedTag,
    dateFilter,
    selectedCategory,
    sortBy !== "latest",
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      {/* Main Search Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Enhanced Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <div
              className={`relative transition-all duration-200 ${
                isSearchFocused ? "transform scale-[1.02]" : ""
              }`}
            >
              <Search
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                  isSearchFocused ? "text-blue-500" : "text-gray-400"
                }`}
              />

              <input
                ref={searchRef}
                type="text"
                placeholder="Search articles, tutorials, guides..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full pl-12 pr-12 py-3 text-gray-900 bg-gray-50 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:bg-white ${
                  isSearchFocused
                    ? "border-blue-500 shadow-lg shadow-blue-500/10"
                    : "border-transparent hover:border-gray-300"
                }`}
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                </div>
              )}
            </div>

            {/* Search suggestions (recent searches) */}
            {isSearchFocused && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900">
                    Recent searches
                  </h4>
                </div>
                <div className="py-2">
                  {recentSearches.slice(0, 5).map((term, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(term)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortMenuRef}>
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center space-x-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 rounded-xl transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white min-w-[180px]"
          >
            {getCurrentSortOption().icon}
            <span className="font-medium text-gray-700">
              {getCurrentSortOption().label}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showSortMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showSortMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <div className="p-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      sortBy === option.value
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {option.icon}
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none relative ${
            showAdvancedFilters || hasActiveFilters
              ? "bg-blue-50 text-blue-700 border-2 border-blue-200"
              : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 text-gray-700"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span className="font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Tag
              </label>
              <div className="relative" ref={tagSuggestionsRef}>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tags..."
                    value={tagSearchTerm}
                    onChange={(e) => setTagSearchTerm(e.target.value)}
                    onFocus={() => setShowTagSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {showTagSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-48 overflow-y-auto">
                    {filteredPopularTags.length > 0 ? (
                      <div className="py-2">
                        {filteredPopularTags.map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => handleTagSelect(tag)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2"
                          >
                            <Tag className="w-3 h-3 text-gray-400" />
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        No matching tags found
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Published
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {dateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-3 flex-wrap">
              <span className="text-sm font-medium text-gray-700">
                Active filters ({activeFiltersCount}):
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedTag && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <Tag className="w-3 h-3" />
                    <span>{selectedTag}</span>
                    <button
                      onClick={() => setSelectedTag("")}
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {dateFilter && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {
                        dateOptions.find((opt) => opt.value === dateFilter)
                          ?.label
                      }
                    </span>
                    <button
                      onClick={() => setDateFilter("")}
                      className="text-green-600 hover:text-green-800 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {sortBy !== "latest" && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {getCurrentSortOption().icon}
                    <span>{getCurrentSortOption().label}</span>
                  </span>
                )}

                {selectedCategory && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    <Layers className="w-3 h-3" />
                    <span>{selectedCategory}</span>
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="text-indigo-600 hover:text-indigo-800 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {totalResults} result{totalResults !== 1 ? "s" : ""}
              </span>
              <button
                onClick={onClearAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Clear all</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostFilters;
