export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  url?: string;
  classNames?: string[];
  rrule?: string;
  // Task-related properties
  color?: string;
  category?: {
    id: string;
    name: string;
    color: string;
    icon?: string;
  };
  type?: 'event' | 'task';
  taskId?: string;
  completed?: boolean;
  source?: 'taskmaster' | 'google' | 'external';
  location?: string;
  extendedProps?: {
    description?: string;
    location?: string;
    attendees?: {
      id: string;
      name: string;
      email: string;
      status: 'accepted' | 'declined' | 'tentative';
    }[];
    reminders?: {
      type: 'popup' | 'desktop';
      minutes: number;
    }[];
    tags?: string[];
    status?: 'confirmed' | 'tentative' | 'cancelled';
    attachments?: {
      id: string;
      name: string;
      url: string;
      type: string;
    }[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    recurringEventId?: string;
    originalStartTime?: Date;
    recurrence?: string[];
    transparency?: 'opaque' | 'transparent';
    visibility?: 'default' | 'public' | 'private';
    iCalUID?: string;
    sequence?: number;
  };
}

export type CalendarViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';