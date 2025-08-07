import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage anahtarları
export const STORAGE_KEYS = {
  TODOS: '@TaskMaster:todos',
  NOTES: '@TaskMaster:notes',
  POMODORO: '@TaskMaster:pomodoro',
  CATEGORIES: '@TaskMaster:categories',
  PROGRESS: '@TaskMaster:progress',
  CALENDAR: '@TaskMaster:calendar',
  USER_PREFERENCES: '@TaskMaster:userPreferences',
};

// Generic storage functions
export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving to AsyncStorage (${key}):`, error);
    throw error;
  }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) {
      return null;
    }
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`Error reading from AsyncStorage (${key}):`, error);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from AsyncStorage (${key}):`, error);
    throw error;
  }
};

export const clear = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
    throw error;
  }
};

// Specific storage functions for app data
export const saveTodos = (todos: any[]) => setItem(STORAGE_KEYS.TODOS, todos);
export const loadTodos = () => getItem<any[]>(STORAGE_KEYS.TODOS);

export const saveNotes = (notes: any[]) => setItem(STORAGE_KEYS.NOTES, notes);
export const loadNotes = () => getItem<any[]>(STORAGE_KEYS.NOTES);

export const savePomodoro = (pomodoroState: any) => setItem(STORAGE_KEYS.POMODORO, pomodoroState);
export const loadPomodoro = () => getItem<any>(STORAGE_KEYS.POMODORO);

export const saveCategories = (categories: any[]) => setItem(STORAGE_KEYS.CATEGORIES, categories);
export const loadCategories = () => getItem<any[]>(STORAGE_KEYS.CATEGORIES);

export const saveProgress = (progress: any) => setItem(STORAGE_KEYS.PROGRESS, progress);
export const loadProgress = () => getItem<any>(STORAGE_KEYS.PROGRESS);

export const saveCalendar = (calendar: any) => setItem(STORAGE_KEYS.CALENDAR, calendar);
export const loadCalendar = () => getItem<any>(STORAGE_KEYS.CALENDAR);

export const saveUserPreferences = (preferences: any) => setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
export const loadUserPreferences = () => getItem<any>(STORAGE_KEYS.USER_PREFERENCES);

// Backup and restore functions
export const exportAllData = async () => {
  try {
    const todos = await loadTodos();
    const notes = await loadNotes();
    const pomodoro = await loadPomodoro();
    const categories = await loadCategories();
    const progress = await loadProgress();
    const calendar = await loadCalendar();
    const userPreferences = await loadUserPreferences();

    return {
      todos,
      notes,
      pomodoro,
      categories,
      progress,
      calendar,
      userPreferences,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const importAllData = async (data: any) => {
  try {
    if (data.todos) await saveTodos(data.todos);
    if (data.notes) await saveNotes(data.notes);
    if (data.pomodoro) await savePomodoro(data.pomodoro);
    if (data.categories) await saveCategories(data.categories);
    if (data.progress) await saveProgress(data.progress);
    if (data.calendar) await saveCalendar(data.calendar);
    if (data.userPreferences) await saveUserPreferences(data.userPreferences);
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

// Initialize default data
export const initializeDefaultData = async () => {
  try {
    const todos = await loadTodos();
    const notes = await loadNotes();
    const categories = await loadCategories();

    // Initialize with sample data if empty
    if (!todos || todos.length === 0) {
      const defaultTodos = [
        {
          id: '1',
          title: 'TaskMaster Pro\'ya hoş geldiniz!',
          description: 'Bu uygulamayı keşfetmeye başlayın',
          completed: false,
          priority: 'medium',
          status: 'not_started',
          category: { id: '1', name: 'Genel', color: '#2196F3' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          labels: ['hoş geldin'],
          subTasks: [],
          order: 0,
          attachments: [],
          progress: 0,
        },
      ];
      await saveTodos(defaultTodos);
    }

    if (!notes || notes.length === 0) {
      const defaultNotes = [
        {
          id: '1',
          title: 'İlk Notum',
          content: 'TaskMaster Pro ile notlarınızı organize edin!',
          tags: ['başlangıç'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          order: 0,
        },
      ];
      await saveNotes(defaultNotes);
    }

    if (!categories || categories.length === 0) {
      const defaultCategories = [
        { id: '1', name: 'Genel', color: '#2196F3', icon: 'folder' },
        { id: '2', name: 'İş', color: '#FF9800', icon: 'briefcase' },
        { id: '3', name: 'Kişisel', color: '#4CAF50', icon: 'account' },
        { id: '4', name: 'Alışveriş', color: '#E91E63', icon: 'cart' },
      ];
      await saveCategories(defaultCategories);
    }
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
};
