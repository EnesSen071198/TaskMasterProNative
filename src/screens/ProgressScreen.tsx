import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, ProgressBar, Button, Portal, Modal, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { format } from 'date-fns';

const ProgressScreen = () => {
  const { todos } = useSelector((state: RootState) => state.todos);
  const { sessions, streak } = useSelector((state: RootState) => state.pomodoro);
  const { notes } = useSelector((state: RootState) => state.notes);
  const [modalVisible, setModalVisible] = useState(false);

  // Bugünkü istatistikler
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTodos = todos.filter(todo => 
    format(new Date(todo.createdAt), 'yyyy-MM-dd') === today
  );
  const completedTodayTodos = todayTodos.filter(todo => todo.completed);
  
  const todaySessions = sessions.filter(session => 
    session.completed && format(new Date(session.startTime), 'yyyy-MM-dd') === today
  );

  // Genel istatistikler
  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const completionRate = totalTodos > 0 ? completedTodos / totalTodos : 0;

  const sessionsCompleted = sessions.filter(session => session.completed).length;
  const todayGoal = 8; // Günlük hedef
  const pomodoroProgress = todaySessions.length / todayGoal;

  // Bu haftaki istatistikler
  const thisWeek = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayTodos = todos.filter(todo => 
      format(new Date(todo.createdAt), 'yyyy-MM-dd') === dateStr
    ).length;
    
    const daySessions = sessions.filter(session => 
      session.completed && format(new Date(session.startTime), 'yyyy-MM-dd') === dateStr
    ).length;
    
    thisWeek.push({
      date: dateStr,
      day: format(date, 'EEE'),
      todos: dayTodos,
      sessions: daySessions,
      isToday: dateStr === today
    });
  }

  const getMotivationalMessage = () => {
    const rate = completionRate * 100;
    if (rate >= 80) return "🌟 Muhteşem! Süper verimli bir gün!";
    if (rate >= 60) return "💪 Harika gidiyorsun! Devam et!";
    if (rate >= 40) return "👍 İyi bir başlangıç yaptın!";
    if (rate >= 20) return "🌱 Her başlangıç bir umuttur!";
    return "🚀 Bugün yeni bir gün, hadi başla!";
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        📊 İlerleme Dashboard
      </Text>

      {/* Bugünkü Özet */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            🗓️ Bugünkü Özet
          </Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant="headlineMedium" style={[styles.summaryNumber, {color: '#4CAF50'}]}>
                ✅ {completedTodayTodos.length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Tamamlanan Görev
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="headlineMedium" style={[styles.summaryNumber, {color: '#FF9800'}]}>
                🍅 {todaySessions.length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Pomodoro Oturumu
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="headlineMedium" style={[styles.summaryNumber, {color: '#2196F3'}]}>
                {notes.length}
              </Text>
              <Text variant="bodySmall" style={styles.summaryLabel}>
                Toplam Not
              </Text>
            </View>
          </View>

          {/* Motivasyon Mesajı */}
          <Text variant="bodyMedium" style={styles.motivationText}>
            {getMotivationalMessage()}
          </Text>
        </Card.Content>
      </Card>

      {/* Görev İlerlemesi */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            🎯 Görev İlerlemesi
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text variant="bodyLarge">Tamamlanan Görevler</Text>
              <Text variant="bodyLarge" style={styles.progressValue}>
                {completedTodos}/{totalTodos}
              </Text>
            </View>
            <ProgressBar 
              progress={completionRate} 
              style={styles.progressBar}
              color="#4CAF50"
            />
            <Text variant="bodyMedium" style={styles.progressText}>
              %{Math.round(completionRate * 100)} tamamlandı
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={[styles.statNumber, {color: '#4CAF50'}]}>
                {completedTodos}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Tamamlanan
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={[styles.statNumber, {color: '#FF9800'}]}>
                {totalTodos - completedTodos}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                Bekleyen
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Pomodoro İstatistikleri */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            🍅 Pomodoro İstatistikleri
          </Text>
          
          <View style={styles.pomodoroStats}>
            <View style={styles.pomodoroStatItem}>
              <Text variant="headlineMedium" style={styles.pomodoroNumber}>
                {sessionsCompleted}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Toplam Oturum
              </Text>
            </View>
            
            <View style={styles.pomodoroStatItem}>
              <Text variant="headlineMedium" style={styles.pomodoroNumber}>
                {todaySessions.length}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Bugünkü Oturum
              </Text>
            </View>
            
            <View style={styles.pomodoroStatItem}>
              <Text variant="headlineMedium" style={styles.pomodoroNumber}>
                {streak}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Günlük Seri
              </Text>
            </View>
          </View>

          <View style={styles.goalContainer}>
            <Text variant="bodyLarge" style={styles.goalText}>
              Günlük Hedef: {todaySessions.length}/{todayGoal} oturum
            </Text>
            <ProgressBar 
              progress={pomodoroProgress} 
              style={styles.goalProgressBar}
              color="#FF9800"
            />
            <Text variant="bodySmall" style={styles.goalText}>
              %{Math.round(pomodoroProgress * 100)} tamamlandı
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Haftalık Aktivite */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            📈 Haftalık Aktivite
          </Text>
          
          <View style={styles.weeklyContainer}>
            {thisWeek.map((day, index) => (
              <View key={index} style={[styles.dayItem, day.isToday && styles.todayItem]}>
                <Text variant="bodySmall" style={[styles.dayLabel, day.isToday && styles.todayLabel]}>
                  {day.day}
                </Text>
                <View style={styles.dayBars}>
                  <View style={[styles.activityBar, {height: Math.max(4, day.todos * 4), backgroundColor: '#4CAF50'}]} />
                  <View style={[styles.activityBar, {height: Math.max(4, day.sessions * 4), backgroundColor: '#FF9800'}]} />
                </View>
                <Text variant="bodySmall" style={styles.dayCount}>
                  {day.todos + day.sessions}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, {backgroundColor: '#4CAF50'}]} />
              <Text variant="bodySmall">Görevler</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, {backgroundColor: '#FF9800'}]} />
              <Text variant="bodySmall">Pomodoro</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Not İstatistikleri */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            📝 Not İstatistikleri
          </Text>
          
          <View style={styles.noteStats}>
            <View style={styles.noteStatItem}>
              <Text variant="headlineMedium" style={styles.noteNumber}>
                {notes.length}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Toplam Not
              </Text>
            </View>
            
            <View style={styles.noteStatItem}>
              <Text variant="headlineMedium" style={styles.noteNumber}>
                {notes.reduce((total, note) => total + note.tags.length, 0)}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Toplam Etiket
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Motivasyonel Kart */}
      <Card style={styles.motivationCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.motivationTitle}>
            � Motivasyon
          </Text>
          
          <Text variant="bodyLarge" style={styles.motivationText}>
            {getMotivationalMessage()}
          </Text>
          
          <Text variant="bodyMedium" style={styles.motivationDetails}>
            Bu hafta {thisWeek.reduce((sum, day) => sum + day.todos, 0)} görev, {thisWeek.reduce((sum, day) => sum + day.sessions, 0)} pomodoro oturumu tamamladınız. 
          </Text>
          
          <Button 
            mode="outlined" 
            onPress={() => setModalVisible(true)}
            style={styles.motivationButton}
          >
            Detaylı Analiz
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            📈 Detaylı Analiz
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            Gelişmiş analiz özellikleri yakında eklenecek!
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            • Haftalık/aylık raporlar
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            • Produktivite trendi
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            • Hedef takibi
          </Text>
          <Button
            mode="contained"
            onPress={() => setModalVisible(false)}
            style={styles.modalButton}
          >
            Kapat
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
    elevation: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  summaryLabel: {
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
  },
  motivationText: {
    textAlign: 'center',
    color: '#6200EE',
    fontStyle: 'italic',
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressValue: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
  },
  pomodoroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  pomodoroStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  pomodoroNumber: {
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 4,
  },
  goalContainer: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  goalProgressBar: {
    height: 6,
    borderRadius: 3,
    marginVertical: 8,
  },
  goalText: {
    textAlign: 'center',
    color: '#E65100',
  },
  weeklyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  dayItem: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
    borderRadius: 8,
  },
  todayItem: {
    backgroundColor: '#E3F2FD',
  },
  dayLabel: {
    marginBottom: 4,
    fontSize: 12,
    color: '#666',
  },
  todayLabel: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  dayBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    marginBottom: 4,
  },
  activityBar: {
    width: 8,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  dayCount: {
    fontSize: 10,
    color: '#999',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 4,
    borderRadius: 2,
  },
  noteStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  noteStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  noteNumber: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  motivationCard: {
    marginBottom: 16,
    backgroundColor: '#F3E5F5',
    elevation: 3,
  },
  motivationTitle: {
    textAlign: 'center',
    color: '#7B1FA2',
    marginBottom: 16,
  },
  motivationDetails: {
    textAlign: 'center',
    color: '#4A148C',
    marginBottom: 16,
    lineHeight: 20,
  },
  motivationButton: {
    marginTop: 8,
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#6200EE',
  },
  modalText: {
    marginBottom: 8,
    color: '#666',
  },
  modalButton: {
    marginTop: 16,
  },
});

export default ProgressScreen;
