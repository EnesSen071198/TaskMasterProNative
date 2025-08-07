import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PomodoroSettings, PomodoroState, PomodoroSession, PomodoroStats } from '../../types/pomodoro';
import { startOfDay, format, addDays, startOfWeek, startOfMonth } from 'date-fns';
import { tr } from 'date-fns/locale';

const defaultSettings: PomodoroSettings = {
  workDuration: 25 * 60, // 25 dakika
  breakDuration: 5 * 60, // 5 dakika
  longBreakDuration: 15 * 60, // 15 dakika
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  alarmSound: 'bell',
  tickSound: true,
  volume: 0.7,
};

const defaultStats: PomodoroStats = {
  dailyStats: [],
  weeklyStats: [],
  monthlyStats: [],
  streaks: {
    current: 0,
    longest: 0,
    history: [],
  },
  tags: [],
};

const initialState: PomodoroState = {
  settings: defaultSettings,
  isActive: false,
  isRunning: false,
  currentSession: 0,
  timeRemaining: defaultSettings.workDuration,
  isBreak: false,
  totalFocusTime: 0,
  dailyGoal: 8, // 8 pomodoro
  streak: 0,
  sessions: [],
  stats: defaultStats,
  selectedTaskId: null,
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<PomodoroSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
      if (!state.isActive) {
        state.timeRemaining = state.isBreak
          ? state.settings.breakDuration
          : state.settings.workDuration;
      }
    },
    startTimer: (state) => {
      state.isActive = true;
      state.isRunning = true;
      // Yeni oturum başlat
      if (!state.isBreak) {
        const newSession: PomodoroSession = {
          id: crypto.randomUUID(),
          startTime: new Date(),
          type: 'work',
          completed: false,
          duration: state.settings.workDuration,
          interruptions: [],
        };
        state.sessions.push(newSession);
      }
    },
    pauseTimer: (state) => {
      state.isActive = false;
      state.isRunning = false;
      // Mevcut oturuma kesinti ekle
      if (!state.isBreak && state.sessions.length > 0) {
        const currentSession = state.sessions[state.sessions.length - 1];
        currentSession.interruptions.push({
          startTime: new Date(),
          endTime: new Date(),
          reason: 'manual_pause',
        });
      }
    },
    resetTimer: (state) => {
      state.isActive = false;
      state.isRunning = false;
      state.timeRemaining = state.settings.workDuration;
      state.isBreak = false;
      state.currentSession = 0;
      // Mevcut oturumu iptal et
      if (state.sessions.length > 0) {
        const currentSession = state.sessions[state.sessions.length - 1];
        if (!currentSession.completed) {
          currentSession.endTime = new Date();
        }
      }
    },
    tick: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    switchPhase: (state) => {
      // Mevcut oturumu tamamla
      if (!state.isBreak && state.sessions.length > 0) {
        const currentSession = state.sessions[state.sessions.length - 1];
        currentSession.completed = true;
        currentSession.endTime = new Date();
        state.totalFocusTime += Math.floor(currentSession.duration / 60);

        // İstatistikleri güncelle
        const today = format(new Date(), 'yyyy-MM-dd');
        const dailyStats = state.stats.dailyStats.find(stat => stat.date === today);
        if (dailyStats) {
          dailyStats.totalWorkTime += currentSession.duration / 60;
          dailyStats.completedSessions += 1;
          dailyStats.totalInterruptions += currentSession.interruptions.length;
        } else {
          state.stats.dailyStats.push({
            date: today,
            totalWorkTime: currentSession.duration / 60,
            totalBreakTime: 0,
            completedSessions: 1,
            interruptedSessions: currentSession.interruptions.length > 0 ? 1 : 0,
            totalInterruptions: currentSession.interruptions.length,
            mostProductiveHour: new Date().getHours(),
          });
        }
      }

      if (state.isBreak) {
        // Moladan çalışmaya geç
        state.isBreak = false;
        state.timeRemaining = state.settings.workDuration;
      } else {
        // Çalışmadan molaya geç
        state.currentSession += 1;
        state.isBreak = true;
        if (state.currentSession % state.settings.sessionsUntilLongBreak === 0) {
          state.timeRemaining = state.settings.longBreakDuration;
        } else {
          state.timeRemaining = state.settings.breakDuration;
        }
      }

      // Otomatik başlatma ayarlarını kontrol et
      if (state.isBreak) {
        state.isActive = state.settings.autoStartBreaks;
      } else {
        state.isActive = state.settings.autoStartPomodoros;
      }
    },
    updateStats: (state) => {
      const today = startOfDay(new Date());
      const weekStart = startOfWeek(today, { locale: tr });
      const monthStart = startOfMonth(today);

      // Günlük istatistikleri güncelle
      const todayStr = format(today, 'yyyy-MM-dd');
      const todayStats = state.stats.dailyStats.find(stat => stat.date === todayStr);
      if (todayStats && todayStats.totalWorkTime >= state.dailyGoal) {
        // Streak'i güncelle
        state.stats.streaks.current += 1;
        if (state.stats.streaks.current > state.stats.streaks.longest) {
          state.stats.streaks.longest = state.stats.streaks.current;
        }
      } else {
        // Streak'i sıfırla ve geçmişe ekle
        if (state.stats.streaks.current > 0) {
          state.stats.streaks.history.push({
            startDate: format(addDays(today, -state.stats.streaks.current), 'yyyy-MM-dd'),
            endDate: format(addDays(today, -1), 'yyyy-MM-dd'),
            length: state.stats.streaks.current,
          });
        }
        state.stats.streaks.current = 0;
      }

      // Haftalık istatistikleri güncelle
      const weekStartStr = format(weekStart, 'yyyy-MM-dd');
      const weekStats = state.stats.weeklyStats.find(stat => stat.weekStart === weekStartStr);
      if (weekStats) {
        weekStats.totalWorkTime = state.stats.dailyStats
          .filter(day => {
            const dayDate = new Date(day.date);
            return dayDate >= weekStart && dayDate < addDays(weekStart, 7);
          })
          .reduce((total, day) => total + day.totalWorkTime, 0);
        weekStats.completedSessions = state.stats.dailyStats
          .filter(day => {
            const dayDate = new Date(day.date);
            return dayDate >= weekStart && dayDate < addDays(weekStart, 7);
          })
          .reduce((total, day) => total + day.completedSessions, 0);
        weekStats.averageSessionsPerDay = weekStats.completedSessions / 7;
      } else {
        state.stats.weeklyStats.push({
          weekStart: weekStartStr,
          totalWorkTime: todayStats?.totalWorkTime || 0,
          totalBreakTime: todayStats?.totalBreakTime || 0,
          completedSessions: todayStats?.completedSessions || 0,
          averageSessionsPerDay: (todayStats?.completedSessions || 0) / 7,
          mostProductiveDay: todayStr,
        });
      }

      // Aylık istatistikleri güncelle
      const monthStartStr = format(monthStart, 'yyyy-MM');
      const monthStats = state.stats.monthlyStats.find(stat => stat.month === monthStartStr);
      if (monthStats) {
        monthStats.totalWorkTime = state.stats.dailyStats
          .filter(day => day.date.startsWith(monthStartStr))
          .reduce((total, day) => total + day.totalWorkTime, 0);
        monthStats.completedSessions = state.stats.dailyStats
          .filter(day => day.date.startsWith(monthStartStr))
          .reduce((total, day) => total + day.completedSessions, 0);
        monthStats.averageSessionsPerDay = monthStats.completedSessions / 30;
      } else {
        state.stats.monthlyStats.push({
          month: monthStartStr,
          totalWorkTime: todayStats?.totalWorkTime || 0,
          totalBreakTime: todayStats?.totalBreakTime || 0,
          completedSessions: todayStats?.completedSessions || 0,
          averageSessionsPerDay: (todayStats?.completedSessions || 0) / 30,
          mostProductiveWeek: weekStartStr,
        });
      }
    },
  },
});

export const {
  setSelectedTask,
  updateSettings,
  startTimer,
  pauseTimer,
  resetTimer,
  tick,
  switchPhase,
  updateStats,
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;