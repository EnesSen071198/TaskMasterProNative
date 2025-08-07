import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent, CalendarViewType } from '../../types/calendar';

interface CalendarState {
  events: CalendarEvent[];
  selectedDate: Date;
  view: CalendarViewType;
  filter: {
    status?: string;
    tags?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
}

const initialState: CalendarState = {
  events: [],
  selectedDate: new Date(),
  view: 'dayGridMonth',
  filter: {},
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    setSelectedDate: (state, action: PayloadAction<Date>) => {
      state.selectedDate = action.payload;
    },
    setView: (state, action: PayloadAction<CalendarViewType>) => {
      state.view = action.payload;
    },
    setFilter: (state, action: PayloadAction<CalendarState['filter']>) => {
      state.filter = action.payload;
    },
    moveEvent: (
      state,
      action: PayloadAction<{ id: string; start: Date; end: Date }>
    ) => {
      const event = state.events.find(e => e.id === action.payload.id);
      if (event) {
        event.start = action.payload.start;
        event.end = action.payload.end;
      }
    },
    duplicateEvent: (state, action: PayloadAction<string>) => {
      const event = state.events.find(e => e.id === action.payload);
      if (event) {
        const newEvent = {
          ...event,
          id: crypto.randomUUID(),
          title: `${event.title} (Kopya)`,
          extendedProps: {
            ...event.extendedProps,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        state.events.push(newEvent);
      }
    },
    clearEvents: state => {
      state.events = [];
    },
    importEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
      state.events = [...state.events, ...action.payload];
    },
  },
});

export const {
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedDate,
  setView,
  setFilter,
  moveEvent,
  duplicateEvent,
  clearEvents,
  importEvents,
} = calendarSlice.actions;

export default calendarSlice.reducer;