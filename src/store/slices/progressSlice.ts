import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ProgressState,
  GoalProgress,
  TaskProgress,
  TimeProgress,
  CategoryProgress,
} from '../../types/progress';
import { format, startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { tr } from 'date-fns/locale';

const calculateTaskProgress = (completed: number, total: number): TaskProgress => ({
  completed,
  total,
  percentage: total > 0 ? (completed / total) * 100 : 0,
});

const initialState: ProgressState = {
  taskProgress: {
    daily: calculateTaskProgress(0, 0),
    weekly: calculateTaskProgress(0, 0),
    monthly: calculateTaskProgress(0, 0),
    categoryProgress: [],
  },
  timeProgress: {
    daily: {
      focusTime: 0,
      breakTime: 0,
      totalSessions: 0,
      averageSessionLength: 0,
      mostProductiveHour: 0,
      mostProductiveDay: format(new Date(), 'EEEE', { locale: tr }),
    },
    weekly: {
      focusTime: 0,
      breakTime: 0,
      totalSessions: 0,
      averageSessionLength: 0,
      mostProductiveHour: 0,
      mostProductiveDay: format(new Date(), 'EEEE', { locale: tr }),
    },
    monthly: {
      focusTime: 0,
      breakTime: 0,
      totalSessions: 0,
      averageSessionLength: 0,
      mostProductiveHour: 0,
      mostProductiveDay: format(new Date(), 'EEEE', { locale: tr }),
    },
  },
  goals: [],
  productivityScore: {
    overall: 0,
    taskCompletion: 0,
    focusTime: 0,
    consistency: 0,
    breakdown: [],
    history: [],
  },
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    updateTaskProgress: (
      state,
      action: PayloadAction<{
        completed: number;
        total: number;
        categoryId?: string;
      }>
    ) => {
      const { completed, total, categoryId } = action.payload;
      const progress = calculateTaskProgress(completed, total);

      // Günlük, haftalık ve aylık ilerlemeyi güncelle
      state.taskProgress.daily = progress;
      state.taskProgress.weekly.completed += completed;
      state.taskProgress.weekly.total += total;
      state.taskProgress.weekly.percentage = (state.taskProgress.weekly.completed / state.taskProgress.weekly.total) * 100;
      state.taskProgress.monthly.completed += completed;
      state.taskProgress.monthly.total += total;
      state.taskProgress.monthly.percentage = (state.taskProgress.monthly.completed / state.taskProgress.monthly.total) * 100;

      // Kategori ilerlemesini güncelle
      if (categoryId) {
        const categoryIndex = state.taskProgress.categoryProgress.findIndex(
          cat => cat.categoryId === categoryId
        );
        if (categoryIndex !== -1) {
          state.taskProgress.categoryProgress[categoryIndex].tasks = progress;
        }
      }

      // Üretkenlik puanını güncelle
      state.productivityScore.taskCompletion = progress.percentage;
      state.productivityScore.overall = (
        state.productivityScore.taskCompletion +
        state.productivityScore.focusTime +
        state.productivityScore.consistency
      ) / 3;

      // Geçmişe ekle
      state.productivityScore.history.push({
        date: format(new Date(), 'yyyy-MM-dd'),
        score: state.productivityScore.overall,
      });
    },
    updateTimeProgress: (
      state,
      action: PayloadAction<{
        focusTime: number;
        breakTime: number;
        sessions: number;
      }>
    ) => {
      const { focusTime, breakTime, sessions } = action.payload;
      const timeProgress: TimeProgress = {
        focusTime,
        breakTime,
        totalSessions: sessions,
        averageSessionLength: sessions > 0 ? focusTime / sessions : 0,
        mostProductiveHour: new Date().getHours(),
        mostProductiveDay: format(new Date(), 'EEEE', { locale: tr }),
      };

      // Günlük, haftalık ve aylık ilerlemeyi güncelle
      state.timeProgress.daily = timeProgress;
      state.timeProgress.weekly.focusTime += focusTime;
      state.timeProgress.weekly.breakTime += breakTime;
      state.timeProgress.weekly.totalSessions += sessions;
      state.timeProgress.monthly.focusTime += focusTime;
      state.timeProgress.monthly.breakTime += breakTime;
      state.timeProgress.monthly.totalSessions += sessions;

      // Üretkenlik puanını güncelle
      const dailyGoal = 8 * 60; // 8 saat
      state.productivityScore.focusTime = (focusTime / dailyGoal) * 100;
      state.productivityScore.overall = (
        state.productivityScore.taskCompletion +
        state.productivityScore.focusTime +
        state.productivityScore.consistency
      ) / 3;
    },
    addGoal: (state, action: PayloadAction<GoalProgress>) => {
      state.goals.push(action.payload);
    },
    updateGoal: (state, action: PayloadAction<GoalProgress>) => {
      const index = state.goals.findIndex(goal => goal.id === action.payload.id);
      if (index !== -1) {
        // Mevcut değeri kaydet
        const previousValue = state.goals[index].currentValue;
        const newValue = action.payload.currentValue;

        // Hedefi güncelle
        state.goals[index] = action.payload;

        // Değişiklik geçmişini güncelle
        if (newValue !== previousValue) {
          state.goals[index].history.push({
            date: new Date(),
            value: newValue,
            change: newValue - previousValue,
          });
        }

        // Kilometre taşlarını kontrol et
        state.goals[index].milestones.forEach(milestone => {
          if (!milestone.achieved && newValue >= milestone.value) {
            milestone.achieved = true;
            milestone.achievedAt = new Date();
          }
        });

        // Hedef durumunu güncelle
        if (newValue >= action.payload.targetValue) {
          state.goals[index].status = 'completed';
        } else if (new Date() > new Date(action.payload.endDate)) {
          state.goals[index].status = 'failed';
        } else if (newValue > 0) {
          state.goals[index].status = 'in_progress';
        }
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(goal => goal.id !== action.payload);
    },
    updateCategoryProgress: (
      state,
      action: PayloadAction<CategoryProgress[]>
    ) => {
      state.taskProgress.categoryProgress = action.payload;
    },
    updateProductivityScore: (state) => {
      // Tutarlılık puanını hesapla
      const today = format(new Date(), 'yyyy-MM-dd');
      const lastWeekScores = state.productivityScore.history
        .filter(h => h.date >= format(startOfWeek(new Date(), { locale: tr }), 'yyyy-MM-dd'))
        .map(h => h.score);

      const consistency =
        lastWeekScores.length > 0
          ? lastWeekScores.reduce((a, b) => a + b) / lastWeekScores.length
          : 0;

      state.productivityScore.consistency = consistency;

      // Genel puanı güncelle
      state.productivityScore.overall = (
        state.productivityScore.taskCompletion +
        state.productivityScore.focusTime +
        state.productivityScore.consistency
      ) / 3;

      // Kategori bazlı kırılımı güncelle
      state.productivityScore.breakdown = state.taskProgress.categoryProgress.map(
        category => ({
          category: category.categoryName,
          score: category.tasks.percentage,
          weight: 1 / state.taskProgress.categoryProgress.length,
        })
      );
    },
  },
});

export const {
  updateTaskProgress,
  updateTimeProgress,
  addGoal,
  updateGoal,
  deleteGoal,
  updateCategoryProgress,
  updateProductivityScore,
} = progressSlice.actions;

export default progressSlice.reducer;