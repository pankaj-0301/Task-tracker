import React, { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onDeleteTask, onEditTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate || '',
    category: task.category,
    tags: task.tags ? task.tags.join(', ') : ''
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || '',
      category: task.category,
      tags: task.tags ? task.tags.join(', ') : ''
    });
  };

  const handleSaveEdit = () => {
    if (editData.title.trim()) {
      const tags = editData.tags ? editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      onEditTask(task.id, {
        title: editData.title.trim(),
        description: editData.description.trim(),
        priority: editData.priority,
        dueDate: editData.dueDate || null,
        category: editData.category.trim() || 'General',
        tags: tags
      });
      setIsEditing(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (diffDays === 0) return { text: 'Due Today', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (diffDays === 1) return { text: 'Due Tomorrow', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: 'text-blue-600', bgColor: 'bg-blue-100' };
    return { text: date.toLocaleDateString(), color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-400 transform transition-all duration-300">
        <div className="space-y-4">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
            placeholder="Task title"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
            rows="3"
            placeholder="Task description"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
            
            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
            />
          </div>

          <input
            type="text"
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
            placeholder="Category"
          />

          <input
            type="text"
            value={editData.tags}
            onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition duration-200"
            placeholder="Tags (comma separated)"
          />
          
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 transform hover:scale-105"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${getPriorityColor(task.priority)} ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start space-x-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="sr-only"
          />
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition duration-200 ${
            task.completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
          }`}>
            {task.completed && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </label>
        
        <div className="flex-1 min-w-0">
          {/* Header with Priority and Category */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getPriorityIcon(task.priority)}</span>
              <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                {task.category || 'General'}
              </span>
            </div>
            {dueInfo && (
              <span className={`text-xs px-2 py-1 rounded-full ${dueInfo.bgColor} ${dueInfo.color}`}>
                {dueInfo.text}
              </span>
            )}
          </div>

          <h4 className={`font-semibold text-lg mb-2 transition duration-200 ${
            task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-white'
          }`}>
            {task.title}
          </h4>
          
          {task.description && (
            <p className={`text-gray-600 dark:text-gray-300 mb-3 leading-relaxed transition duration-200 ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Created: {formatDate(task.createdAt)}
            </span>
            
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;