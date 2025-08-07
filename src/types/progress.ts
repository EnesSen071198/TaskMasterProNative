export interface TaskProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface CategoryProgress {
  categoryId: string;
  categoryName: string;
  color: string;
  tasks: TaskProgress;
  subCategories?: CategoryProgress[];
}

export interface TimeProgress {
  focusTime: number; // dakika cinsinden
  breakTime: number; // dakika cinsinden
  totalSessions: number;
  averageSessionLength: number; // dakika cinsinden
  mostProductiveHour: number;
  mostProductiveDay: string;
}

export interface GoalProgress {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  category?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  type: 'task_completion' | 'focus_time' | 'custom';
  milestones: {
    value: number;
    achieved: boolean;
    achievedAt?: Date;
  }[];
  history: {
    date: Date;
    value: number;
    change: number;
  }[];
}

export interface ProductivityScore {
  overall: number; // 0-100 arası
  taskCompletion: number;
  focusTime: number;
  consistency: number;
  breakdown: {
    category: string;
    score: number;
    weight: number;
  }[];
  history: {
    date: string;
    score: number;
  }[];
}

export interface ProgressState {
  taskProgress: {
    daily: TaskProgress;
    weekly: TaskProgress;
    monthly: TaskProgress;
    categoryProgress: CategoryProgress[];
  };
  timeProgress: {
    daily: TimeProgress;
    weekly: TimeProgress;
    monthly: TimeProgress;
  };
  goals: GoalProgress[];
  productivityScore: ProductivityScore;
}