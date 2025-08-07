import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Card, 
  FAB, 
  Portal, 
  Modal, 
  Button, 
  TextInput, 
  Chip,
  IconButton,
  List
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';

const CalendarScreen = () => {
  const dispatch = useDispatch();
  const { todos } = useSelector((state: RootState) => state.todos);
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Takvim için işaretli tarihleri oluştur
  const getMarkedDates = () => {
    const marked: any = {};
    
    todos.forEach(todo => {
      if (todo.dueDate) {
        const dateKey = todo.dueDate instanceof Date ? 
          todo.dueDate.toISOString().split('T')[0] : 
          new Date(todo.dueDate).toISOString().split('T')[0]; // YYYY-MM-DD formatına çevir
        marked[dateKey] = {
          marked: true,
          dotColor: todo.completed ? '#4CAF50' : '#FF9800',
        };
      }
    });

    // Seçilen tarih
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#6200EE',
      };
    }

    return marked;
  };

  // Seçilen tarihteki görevler
  const getTasksForDate = (date: string) => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const taskDate = todo.dueDate instanceof Date ? 
        todo.dueDate.toISOString().split('T')[0] : 
        new Date(todo.dueDate).toISOString().split('T')[0];
      return taskDate === date;
    });
  };

  const handleAddEvent = () => {
    if (eventTitle.trim() && selectedDate) {
      // Burada yeni görev ekleme işlemi yapılabilir
      setEventTitle('');
      setEventDescription('');
      setModalVisible(false);
    }
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Takvim Kartı */}
        <Card style={styles.calendarCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              📅 Takvim Görünümü
            </Text>
            
            {/* Görünüm Modu Seçici */}
            <View style={styles.viewSelector}>
              <Button
                mode={viewMode === 'daily' ? 'contained' : 'outlined'}
                onPress={() => setViewMode('daily')}
                style={styles.viewButton}
                compact
              >
                Günlük
              </Button>
              <Button
                mode={viewMode === 'weekly' ? 'contained' : 'outlined'}
                onPress={() => setViewMode('weekly')}
                style={styles.viewButton}
                compact
              >
                Haftalık
              </Button>
              <Button
                mode={viewMode === 'monthly' ? 'contained' : 'outlined'}
                onPress={() => setViewMode('monthly')}
                style={styles.viewButton}
                compact
              >
                Aylık
              </Button>
            </View>

            {/* Tarih Navigasyonu */}
            <View style={styles.dateNavigation}>
              <Button
                mode="text"
                compact
                onPress={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === 'daily') {
                    newDate.setDate(newDate.getDate() - 1);
                  } else if (viewMode === 'weekly') {
                    newDate.setDate(newDate.getDate() - 7);
                  } else {
                    newDate.setMonth(newDate.getMonth() - 1);
                  }
                  setCurrentDate(newDate);
                  setSelectedDate(newDate.toISOString().split('T')[0]);
                }}
              >
                ◀️
              </Button>
              <Text variant="titleMedium" style={styles.currentDateText}>
                {viewMode === 'daily' 
                  ? currentDate.toLocaleDateString('tr-TR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })
                  : viewMode === 'weekly'
                  ? `${currentDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} - Hafta`
                  : currentDate.toLocaleDateString('tr-TR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })
                }
              </Text>
              <Button
                mode="text"
                compact
                onPress={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === 'daily') {
                    newDate.setDate(newDate.getDate() + 1);
                  } else if (viewMode === 'weekly') {
                    newDate.setDate(newDate.getDate() + 7);
                  } else {
                    newDate.setMonth(newDate.getMonth() + 1);
                  }
                  setCurrentDate(newDate);
                  setSelectedDate(newDate.toISOString().split('T')[0]);
                }}
              >
                ▶️
              </Button>
            </View>
            
            {/* Bugüne Git Butonu */}
            <View style={styles.todayButton}>
              <Button
                mode="outlined"
                onPress={() => {
                  const today = new Date();
                  setCurrentDate(today);
                  setSelectedDate(today.toISOString().split('T')[0]);
                }}
              >
                📅 Bugün
              </Button>
            </View>
            
            {/* Hızlı tarih seçenekleri */}
            <View style={styles.quickDates}>
              <Button
                mode={selectedDate === new Date().toISOString().split('T')[0] ? 'contained' : 'outlined'}
                onPress={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                style={styles.quickDateButton}
                compact
              >
                Bugün
              </Button>
              <Button
                mode={selectedDate === new Date(Date.now() + 86400000).toISOString().split('T')[0] ? 'contained' : 'outlined'}
                onPress={() => setSelectedDate(new Date(Date.now() + 86400000).toISOString().split('T')[0])}
                style={styles.quickDateButton}
                compact
              >
                Yarın
              </Button>
              <Button
                mode={selectedDate === new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] ? 'contained' : 'outlined'}
                onPress={() => setSelectedDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0])}
                style={styles.quickDateButton}
                compact
              >
                1 Hafta
              </Button>
            </View>

            {/* Basit Takvim Grid */}
            {viewMode === 'monthly' && (
              <View style={styles.calendarGrid}>
                <View style={styles.weekDaysHeader}>
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
                    <Text key={index} style={styles.weekDayText}>{day}</Text>
                  ))}
                </View>
                <View style={styles.daysGrid}>
                  {Array.from({length: 35}, (_, index) => {
                    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    const startDay = (startOfMonth.getDay() + 6) % 7; // Pazartesi'yi 0 yapma
                    const dayNumber = index - startDay + 1;
                    const isCurrentMonth = dayNumber > 0 && dayNumber <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                    const dateStr = isCurrentMonth ? new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber).toISOString().split('T')[0] : '';
                    const isSelected = dateStr === selectedDate;
                    const hasTask = isCurrentMonth && getTasksForDate(dateStr).length > 0;

                    return (
                      <Button
                        key={index}
                        mode={isSelected ? 'contained' : 'text'}
                        style={[styles.dayButton, hasTask && styles.dayWithTask]}
                        compact
                        onPress={() => isCurrentMonth && setSelectedDate(dateStr)}
                        disabled={!isCurrentMonth}
                      >
                        {isCurrentMonth ? dayNumber.toString() : ''}
                      </Button>
                    );
                  })}
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Seçilen Tarih Bilgisi */}
        {selectedDate && (
          <Card style={styles.dateCard}>
            <Card.Content>
              <View style={styles.dateHeader}>
                <Text variant="titleMedium">
                  � {new Date(selectedDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
                <IconButton
                  icon="plus"
                  size={24}
                  onPress={() => setModalVisible(true)}
                />
              </View>
              
              {selectedDateTasks.length > 0 ? (
                selectedDateTasks.map((task, index) => (
                  <View key={index} style={styles.taskItem}>
                    <View style={styles.taskInfo}>
                      <Text variant="bodyLarge" style={[
                        styles.taskTitle,
                        task.completed && styles.completedTask
                      ]}>
                        {task.title}
                      </Text>
                      <Text variant="bodySmall" style={styles.taskDesc}>
                        {task.description}
                      </Text>
                    </View>
                    <Chip 
                      style={[
                        styles.priorityChip,
                        { backgroundColor: 
                          task.priority === 'high' ? '#FFEBEE' :
                          task.priority === 'medium' ? '#FFF3E0' : '#E8F5E8'
                        }
                      ]}
                    >
                      {task.priority === 'high' ? '🔴 Yüksek' :
                       task.priority === 'medium' ? '🟡 Orta' : '🟢 Düşük'}
                    </Chip>
                  </View>
                ))
              ) : (
                <Text variant="bodyMedium" style={styles.noTasksText}>
                  Bu tarihte henüz görev bulunmuyor
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Yaklaşan Görevler */}
        <Card style={styles.upcomingCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.upcomingTitle}>
              ⏰ Yaklaşan Görevler
            </Text>
            
            {todos
              .filter(todo => !todo.completed && todo.dueDate)
              .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
              .slice(0, 5)
              .map((task, index) => (
                <View key={index} style={styles.upcomingTask}>
                  <View style={styles.upcomingInfo}>
                    <Text variant="bodyMedium" style={styles.upcomingTaskTitle}>
                      {task.title}
                    </Text>
                    <Text variant="bodySmall" style={styles.upcomingDate}>
                      {new Date(task.dueDate!).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                  <Chip compact>
                    {Math.ceil((new Date(task.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} gün
                  </Chip>
                </View>
              ))
            }
            
            {todos.filter(todo => !todo.completed && todo.dueDate).length === 0 && (
              <Text variant="bodyMedium" style={styles.noTasksText}>
                Yaklaşan görev bulunmuyor
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Etkinlik Ekleme FAB */}
      <FAB
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        label="➕ Etkinlik Ekle"
      />

      {/* Etkinlik Ekleme Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            📅 Yeni Etkinlik Ekle
          </Text>
          
          <TextInput
            label="Etkinlik Başlığı"
            value={eventTitle}
            onChangeText={setEventTitle}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Açıklama"
            value={eventDescription}
            onChangeText={setEventDescription}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />
          
          <Text variant="bodyMedium" style={styles.selectedDateText}>
            Seçilen Tarih: {selectedDate ? 
              new Date(selectedDate).toLocaleDateString('tr-TR') : 
              'Lütfen bir tarih seçin'
            }
          </Text>
          
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleAddEvent}
              style={styles.modalButton}
              disabled={!eventTitle.trim() || !selectedDate}
            >
              Ekle
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  calendarCard: {
    margin: 16,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateLabel: {
    fontWeight: '500',
  },
  dateButton: {
    minWidth: 150,
  },
  viewSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  viewButton: {
    minWidth: 80,
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
  },
  currentDateText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
  todayButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarGrid: {
    marginTop: 16,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    width: 40,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14.28%',
    minHeight: 40,
    margin: 1,
    borderRadius: 20,
  },
  dayWithTask: {
    backgroundColor: '#E3F2FD',
  },
  quickDates: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  quickDateButton: {
    minWidth: 80,
  },
  dateCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontWeight: '500',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  taskDesc: {
    color: '#666',
    marginTop: 2,
  },
  priorityChip: {
    borderRadius: 12,
  },
  noTasksText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 16,
  },
  upcomingCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 100,
  },
  upcomingTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  upcomingTask: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTaskTitle: {
    fontWeight: '500',
  },
  upcomingDate: {
    color: '#666',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200EE',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  selectedDateText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    minWidth: 100,
  },
});

export default CalendarScreen;
