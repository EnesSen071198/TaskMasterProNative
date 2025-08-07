export interface PomodoroSettings {
  workDuration: number; // saniye cinsinden
  breakDuration: number; // saniye cinsinden
  longBreakDuration: number; // saniye cinsinden
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  alarmSound: string;
  tickSound: boolean;
  volume: number; // 0-1 arası
}

export interface PomodoroSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  type: 'work' | 'break' | 'long-break';
  completed: boolean;
  duration: number; // saniye cinsinden
  taskId?: string; // bağlı olduğu görev
  notes?: string;
  interruptions: {
    startTime: Date;
    endTime: Date;
    reason: string;
  }[];
}

export interface PomodoroStats {
  dailyStats: {
    date: string;
    totalWorkTime: number; // dakika cinsinden
    totalBreakTime: number; // dakika cinsinden
    completedSessions: number;
    interruptedSessions: number;
    totalInterruptions: number;
    mostProductiveHour: number;
  }[];
  weeklyStats: {
    weekStart: string;
    totalWorkTime: number;
    totalBreakTime: number;
    completedSessions: number;
    averageSessionsPerDay: number;
    mostProductiveDay: string;
  }[];
  monthlyStats: {
    month: string;
    totalWorkTime: number;
    totalBreakTime: number;
    completedSessions: number;
    averageSessionsPerDay: number;
    mostProductiveWeek: string;
  }[];
  streaks: {
    current: number;
    longest: number;
    history: {
      startDate: string;
      endDate: string;
      length: number;
    }[];
  };
  tags: {
    name: string;
    totalSessions: number;
    totalTime: number;
  }[];
}

export interface PomodoroState {
  settings: PomodoroSettings;
  isActive: boolean;
  isRunning: boolean;
  currentSession: number;
  timeRemaining: number;
  isBreak: boolean;
  totalFocusTime: number;
  dailyGoal: number;
  streak: number;
  sessions: PomodoroSession[];
  stats: PomodoroStats;
  selectedTaskId: string | null;
}