import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../../types';

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = new Date();
        if (todo.completed) {
          todo.completedAt = new Date();
          todo.status = 'completed';
        } else {
          todo.completedAt = undefined;
          todo.status = 'not_started';
        }
      }
    },
    updateTodo: (state, action: PayloadAction<Partial<Todo> & { id: string }>) => {
      const index = state.todos.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...action.payload, updatedAt: new Date() };
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(item => item.id !== action.payload);
    },
    updateTodoStatus: (state, action: PayloadAction<{id: string, status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'}>) => {
      const todo = state.todos.find(item => item.id === action.payload.id);
      if (todo) {
        todo.status = action.payload.status;
        todo.updatedAt = new Date();
        if (action.payload.status === 'completed') {
          todo.completed = true;
          todo.completedAt = new Date();
        } else {
          todo.completed = false;
          todo.completedAt = undefined;
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setTodos, 
  addTodo, 
  toggleTodo, 
  updateTodo, 
  deleteTodo, 
  updateTodoStatus,
  setLoading,
  setError 
} = todosSlice.actions;

export default todosSlice.reducer;