import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './slices/todosSlice';
import notesReducer from './slices/notesSlice';
import pomodoroReducer from './slices/pomodoroSlice';
import progressReducer from './slices/progressSlice';
import categoriesReducer from './slices/categoriesSlice';
import calendarReducer from './slices/calendarSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    notes: notesReducer,
    pomodoro: pomodoroReducer,
    progress: progressReducer,
    categories: categoriesReducer,
    calendar: calendarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['register'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;