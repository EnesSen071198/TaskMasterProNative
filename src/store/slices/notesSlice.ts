import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '../../types';

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<Partial<Note> & { id: string }>) => {
      const index = state.notes.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = { 
          ...state.notes[index], 
          ...action.payload, 
          updatedAt: new Date() 
        };
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(item => item.id !== action.payload);
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
  setNotes,
  addNote, 
  updateNote, 
  deleteNote,
  setLoading,
  setError 
} = notesSlice.actions;

export default notesSlice.reducer;