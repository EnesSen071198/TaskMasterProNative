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
            
            {/* Basit tarih seçici */}
            <View style={styles.dateSelector}>
              <Text variant="bodyMedium" style={styles.dateLabel}>
                Tarih Seç:
              </Text>
              <Button
                mode="outlined"
                onPress={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setSelectedDate(today);
                }}
                style={styles.dateButton}
              >
                {selectedDate || 'Bugün Seç'}
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
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        label="Etkinlik Ekle"
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
