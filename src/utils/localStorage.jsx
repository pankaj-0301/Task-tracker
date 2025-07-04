export const loadTasks = () => {
  try {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const loadUser = () => {
  try {
    return localStorage.getItem('username') || null;
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
};

export const saveUser = (username) => {
  try {
    localStorage.setItem('username', username);
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const clearUser = () => {
  try {
    localStorage.removeItem('username');
  } catch (error) {
    console.error('Error clearing user:', error);
  }
};

export const loadSettings = () => {
  try {
    const settings = localStorage.getItem('settings');
    return settings ? JSON.parse(settings) : { darkMode: false };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { darkMode: false };
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem('settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};