import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, ProgressBar, Portal, Modal, Chip, IconButton, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  startTimer, 
  pauseTimer, 
  resetTimer,
  tick,
  switchPhase
} from '../store/slices/pomodoroSlice';

const PomodoroScreen = () => {
  const dispatch = useDispatch();
  const { 
    timeRemaining,
    isRunning, 
    isBreak,
    currentSession,
    settings,
    stats,
    sessions 
  } = useSelector((state: RootState) => state.pomodoro);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);

  // Timer çalıştırma effect'i
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch(tick()); // tick action'ını dispatch et
      }, 1000);
    } else if (isRunning && timeRemaining === 0) {
      // Timer bitti, faz değiştir
      dispatch(switchPhase());
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, dispatch]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = () => {
    return isBreak ? settings.breakDuration : settings.workDuration;
  };

  const getProgress = () => {
    const totalTime = getSessionDuration();
    return (totalTime - timeRemaining) / totalTime;
  };

  const getSessionTitle = () => {
    if (isBreak) {
      return currentSession > 0 && currentSession % settings.sessionsUntilLongBreak === 0 
        ? '🏖️ Uzun Mola Zamanı' 
        : '☕ Kısa Mola Zamanı';
    }
    return `🍅 Pomodoro ${currentSession + 1}`;
  };

  const handleStart = () => {
    dispatch(startTimer());
  };

  const handlePause = () => {
    dispatch(pauseTimer());
  };

  const handleReset = () => {
    Alert.alert(
      'Timer Sıfırla',
      'Mevcut oturumu sıfırlamak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sıfırla', onPress: () => dispatch(resetTimer()) }
      ]
    );
  };

  // Bugünkü istatistikler
  const todayDate = new Date().toISOString().split('T')[0];
  const todayStats = stats.dailyStats.find(stat => stat.date === todayDate);
  const todayWorkSessions = sessions.filter(session => 
    session.type === 'work' && 
    session.completed &&
    new Date(session.startTime).toISOString().split('T')[0] === todayDate
  ).length;

  return (
    <ScrollView style={styles.container}>
      {/* Ana Timer Kartı */}
      <Card style={styles.timerCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.sessionTitle}>
            {getSessionTitle()}
          </Text>
          
          <View style={styles.timerContainer}>
            <Text variant="displayLarge" style={styles.timer}>
              {formatTime(timeRemaining)}
            </Text>
          </View>

          <ProgressBar 
            progress={getProgress()} 
            style={styles.progressBar}
            color="#6200EE"
          />

          <View style={styles.controlsContainer}>
            <Button
              mode="contained"
              onPress={isRunning ? handlePause : handleStart}
              style={[styles.button, styles.primaryButton]}
            >
              {isRunning ? '⏸️ Duraklat' : '▶️ Başlat'}
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleReset}
              style={styles.button}
            >
              🔄 Sıfırla
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Günlük İstatistikler */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge" style={styles.statsTitle}>
              📊 Bugünkü İstatistikler
            </Text>
            <Button
              mode="text"
              onPress={() => setStatsModalVisible(true)}
            >
              📈 Detaylar
            </Button>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {todayWorkSessions}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Bugünkü Oturum
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {todayWorkSessions * 25}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Dakika Odaklanma
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {stats.streaks?.current || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Günlük Seri
              </Text>
            </View>
          </View>

          <ProgressBar 
            progress={todayWorkSessions / 8} 
            style={styles.goalProgressBar}
            color="#4CAF50"
          />
          <Text variant="bodySmall" style={styles.goalText}>
            Günlük Hedef: {todayWorkSessions}/8 oturum (%{Math.round((todayWorkSessions / 8) * 100)})
          </Text>
        </Card.Content>
      </Card>

      {/* Hızlı Ayarlar */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.settingsTitle}>
            ⚙️ Hızlı Ayarlar
          </Text>
          
          <View style={styles.settingRow}>
            <Text variant="bodyMedium">Çalışma Süresi:</Text>
            <View style={styles.settingChips}>
              <Chip style={styles.timeChip}>25 dk</Chip>
              <Chip style={styles.timeChip}>30 dk</Chip>
              <Chip style={styles.timeChip}>45 dk</Chip>
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <Text variant="bodyMedium">Kısa Mola:</Text>
            <Text variant="bodyMedium" style={styles.settingValue}>
              {settings.breakDuration} dakika
            </Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text variant="bodyMedium">Uzun Mola:</Text>
            <Text variant="bodyMedium" style={styles.settingValue}>
              {settings.longBreakDuration} dakika
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <Button 
            mode="outlined" 
            onPress={() => setModalVisible(true)}
            style={styles.settingsButton}
          >
            Gelişmiş Ayarlar
          </Button>
        </Card.Content>
      </Card>

      {/* Son Oturumlar */}
      <Card style={styles.historyCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.historyTitle}>
            📋 Son Oturumlar
          </Text>
          
          {sessions.slice(-5).reverse().map((session, index) => (
            <View key={index} style={styles.sessionItem}>
              <View style={styles.sessionInfo}>
                <Text variant="bodyLarge" style={styles.sessionType}>
                  {session.type === 'work' ? '🍅 Çalışma' : '☕ Mola'}
                </Text>
                <Text variant="bodySmall" style={styles.sessionDate}>
                  {new Date(session.startTime).toLocaleDateString('tr-TR')} {new Date(session.startTime).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}
                </Text>
              </View>
              <Chip 
                style={[styles.statusChip, session.completed ? {backgroundColor: '#4CAF50'} : {backgroundColor: '#FF9800'}]}
                textStyle={styles.statusText}
              >
                {session.completed ? 'Tamamlandı' : 'Yarım Kaldı'}
              </Chip>
            </View>
          ))}
          
          {sessions.length === 0 && (
            <Text variant="bodyMedium" style={styles.emptyText}>
              Henüz oturum başlatılmamış. İlk pomodoro oturumunuzu başlatın!
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Settings Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            ⚙️ Pomodoro Ayarları
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            • Çalışma süresi: {settings.workDuration} dakika
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            • Kısa mola: {settings.breakDuration} dakika
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            • Uzun mola: {settings.longBreakDuration} dakika
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            • Uzun mola aralığı: {settings.sessionsUntilLongBreak} oturum
          </Text>
          <Button
            mode="contained"
            onPress={() => setModalVisible(false)}
            style={styles.modalButton}
          >
            Tamam
          </Button>
        </Modal>
      </Portal>

      {/* Stats Modal */}
      <Portal>
        <Modal
          visible={statsModalVisible}
          onDismiss={() => setStatsModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            📈 Detaylı İstatistikler
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            Toplam tamamlanan oturum: {sessions.filter(s => s.completed).length}
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            Toplam odaklanma süresi: {sessions.filter(s => s.completed).length * 25} dakika
          </Text>
          <Text variant="bodyMedium" style={styles.modalText}>
            En uzun seri: {stats.streaks?.longest || 0} gün
          </Text>
          <Button
            mode="contained"
            onPress={() => setStatsModalVisible(false)}
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
  timerCard: {
    marginBottom: 16,
    padding: 16,
  },
  sessionTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timer: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#6200EE',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 24,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#6200EE',
  },
  statsCard: {
    marginBottom: 16,
    padding: 8,
  },
  statsTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  statLabel: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  goalProgressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  goalText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  settingsCard: {
    marginBottom: 16,
    padding: 8,
  },
  settingsTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingChips: {
    flexDirection: 'row',
    gap: 8,
  },
  timeChip: {
    backgroundColor: '#E3F2FD',
  },
  settingValue: {
    fontWeight: 'bold',
    color: '#666',
  },
  divider: {
    marginVertical: 16,
  },
  settingsButton: {
    marginTop: 8,
  },
  historyCard: {
    marginBottom: 16,
    padding: 8,
  },
  historyTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionType: {
    fontWeight: '500',
  },
  sessionDate: {
    color: '#666',
    fontSize: 12,
  },
  statusChip: {
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  modalButton: {
    marginTop: 16,
  },
});

export default PomodoroScreen;
