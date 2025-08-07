import { TaskCategory } from './categories';

// Re-export TaskCategory
export type { TaskCategory };

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: TaskCategory;
  subCategory?: TaskCategory;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assignedTo?: string;
  labels: string[];
  subTasks: SubTask[];
  order: number;
  parentId?: string;
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
    size?: number;
    uploadedAt: Date;
  }[];
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  estimatedTime?: number; // dakika cinsinden
  actualTime?: number; // dakika cinsinden
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    daysOfWeek?: number[]; // 0 = Pazar, 1 = Pazartesi, vs.
  };
  notifications?: {
    type: 'email' | 'push' | 'in_app';
    time: number; // dakika cinsinden, görev başlangıcından önce
    sound?: boolean;
    vibration?: boolean;
  }[];
  customFields?: Record<string, any>;
  progress: number; // 0-100 arası yüzde
  comments?: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    author: string;
    attachments?: {
      id: string;
      name: string;
      url: string;
      type: string;
    }[];
  }[];
  history?: {
    id: string;
    action: 'created' | 'updated' | 'completed' | 'deleted' | 'status_changed' | 'assigned';
    timestamp: Date;
    user: string;
    details?: string;
    previousValue?: any;
    newValue?: any;
  }[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  order: number;
  collaborators?: {
    id: string;
    name: string;
    email: string;
    role: 'viewer' | 'editor';
    addedAt: Date;
  }[];
}

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export interface UserProgress {
  completedTodos: number;
  totalTodos: number;
  pomodoroSessions: number;
  totalFocusTime: number;
}