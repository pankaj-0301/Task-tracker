import React from 'react';

const TaskFilter = ({ 
  currentFilter, 
  onFilterChange, 
  priorityFilter, 
  onPriorityFilterChange, 
  categoryFilter, 
  onCategoryFilterChange,
  availableCategories 
}) => {
  const statusFilters = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'pending', label: 'Pending', icon: '⏳' },
    { key: 'completed', label: 'Done', icon: '✅' }
  ];

  const priorityFilters = [
    { key: 'all', label: 'All', icon: '⚪' },
    { key: 'high', label: 'High', icon: '🔴' },
    { key: 'medium', label: 'Medium', icon: '🟡' },
    { key: 'low', label: 'Low', icon: '🟢' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-colors duration-300 w-full lg:w-64">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Filters</h3>
      
      {/* Status Filter */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">Status</h4>
        <div className="space-y-1">
          {statusFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentFilter === filter.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-sm">{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">Priority</h4>
        <div className="space-y-1">
          {priorityFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onPriorityFilterChange(filter.key)}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                priorityFilter === filter.key
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-sm">{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      {availableCategories.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">Category</h4>
          <div className="space-y-1">
            <button
              onClick={() => onCategoryFilterChange('all')}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                categoryFilter === 'all'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            {availableCategories.slice(0, 5).map((category) => (
              <button
                key={category}
                onClick={() => onCategoryFilterChange(category)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 truncate ${
                  categoryFilter === category
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={category}
              >
                {category}
              </button>
            ))}
            {availableCategories.length > 5 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1">
                +{availableCategories.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilter;