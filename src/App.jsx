import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Modal from './components/Modal';
import SearchBar from './components/SearchBar';
import DarkModeToggle from './components/DarkModeToggle';
import { loadTasks, saveTasks, loadUser, saveUser, clearUser, loadSettings, saveSettings } from './utils/localStorage';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = loadUser();
    const savedSettings = loadSettings();
    
    setDarkMode(savedSettings.darkMode);
    
    if (savedUser) {
      setUser(savedUser);
      setTasks(loadTasks());
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (username) => {
    setUser(username);
    saveUser(username);
    setTasks(loadTasks());
  };

  const handleLogout = () => {
    clearUser();
    setUser(null);
    setTasks([]);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveSettings({ darkMode: newDarkMode });
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      category: taskData.category || 'General',
      tags: taskData.tags || [],
      completed: false,
      createdAt: Date.now()
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleTaskComplete = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const editTask = (taskId, updatedData) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updatedData } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Filter by completion status
    switch (filter) {
      case 'pending':
        filteredTasks = filteredTasks.filter(task => !task.completed);
        break;
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.completed);
        break;
      default:
        // 'all' - no filtering needed
        break;
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.category === categoryFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.category.toLowerCase().includes(searchLower) ||
        task.priority.toLowerCase().includes(searchLower) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Sort by priority (high first) and then by creation date
    return filteredTasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt - a.createdAt;
    });
  };

  const getAvailableCategories = () => {
    const categories = [...new Set(tasks.map(task => task.category).filter(Boolean))];
    return categories.sort();
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks();
  const availableCategories = getAvailableCategories();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Personal Task Tracker</h1>
                <div className="hidden sm:flex items-center space-x-4 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full transition-colors duration-300">
                    Total: {stats.total}
                  </span>
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full transition-colors duration-300">
                    Pending: {stats.pending}
                  </span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full transition-colors duration-300">
                    Completed: {stats.completed}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
                <span className="text-gray-600 dark:text-gray-300">Welcome, {user}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Stats */}
          <div className="sm:hidden flex justify-between mb-6 text-sm space-x-2">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-full transition-colors duration-300">
              Total: {stats.total}
            </span>
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-full transition-colors duration-300">
              Pending: {stats.pending}
            </span>
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-2 rounded-full transition-colors duration-300">
              Completed: {stats.completed}
            </span>
          </div>

          {/* Desktop Layout - Sidebar + Main Content */}
          <div className="hidden lg:flex gap-6">
            {/* Left Sidebar - Filters */}
            <div className="flex-shrink-0">
              <TaskFilter 
                currentFilter={filter} 
                onFilterChange={setFilter}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={setPriorityFilter}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                availableCategories={availableCategories}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Add Task Button */}
              <div className="mb-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add New Task</span>
                </button>
              </div>

              {/* Search Bar */}
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onClearSearch={() => setSearchTerm('')}
              />

           

              {/* Task List */}
              <TaskList
                tasks={filteredTasks}
                onToggleComplete={toggleTaskComplete}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
              />
            </div>
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="lg:hidden">
            {/* Add Task Button */}
            <div className="mb-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Task</span>
              </button>
            </div>

            {/* Search Bar */}
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClearSearch={() => setSearchTerm('')}
            />

            {/* Mobile Filter - Collapsible */}
            <details className="mb-6">
              <summary className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 cursor-pointer transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Filters</h3>
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="mt-4">
                <TaskFilter 
                  currentFilter={filter} 
                  onFilterChange={setFilter}
                  priorityFilter={priorityFilter}
                  onPriorityFilterChange={setPriorityFilter}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  availableCategories={availableCategories}
                />
              </div>
            </details>

            {/* Results Summary */}
            {(searchTerm || filter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} 
                  {searchTerm && ` matching "${searchTerm}"`}
                  {filter !== 'all' && ` • Status: ${filter}`}
                  {priorityFilter !== 'all' && ` • Priority: ${priorityFilter}`}
                  {categoryFilter !== 'all' && ` • Category: ${categoryFilter}`}
                </p>
              </div>
            )}

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
              onEditTask={editTask}
            />
          </div>

          {/* Add Task Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <TaskForm 
              onAddTask={addTask} 
              onClose={() => setIsModalOpen(false)}
            />
          </Modal>
        </main>
      </div>
  );
}

export default App;