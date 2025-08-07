import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  FAB,
  Chip,
  IconButton,
  Portal,
  Modal,
  Button,
  ProgressBar,
  Searchbar,
  Divider,
  TextInput,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleTodo, addTodo, deleteTodo, updateTodo } from '../store/slices/todosSlice';
import { Todo, TaskCategory } from '../types';

const TasksScreen = () => {
  const dispatch = useDispatch();
  const { todos } = useSelector((state: RootState) => state.todos);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, pending
  const [filterPriority, setFilterPriority] = useState('all'); // all, high, medium, low
  
  // Görev ekleme form states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showStatusPicker, setShowStatusPicker] = useState<string | null>(null);

  // İstatistikler
  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);
  const completionRate = todos.length > 0 ? completedTodos.length / todos.length : 0;

  // Filtrelenmiş görevler
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = searchQuery === '' || 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && todo.completed) ||
      (filterStatus === 'pending' && !todo.completed);
    
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleAddTodo = () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('Hata', 'Görev başlığı boş olamaz!');
      return;
    }

    // Default category oluştur
    const defaultCategory: TaskCategory = {
      id: 'personal',
      name: 'Kişisel',
      description: 'Kişisel görevler',
      color: '#33FF57',
      icon: 'account',
      isDefault: true,
      allowsSubcategories: false,
    };

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      completed: false,
      priority: newTaskPriority,
      category: defaultCategory,
      labels: [],
      subTasks: [],
      order: 0,
      attachments: [],
      status: 'not_started',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch(addTodo(newTodo));
    
    // Form'u sıfırla
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setModalVisible(false);
  };

  const handleDeleteTodo = (id: string) => {
    Alert.alert(
      'Görevi Sil',
      'Bu görevi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', onPress: () => dispatch(deleteTodo(id)), style: 'destructive' }
      ]
    );
  };

  const handleStatusChange = (todoId: string, status: Todo['status']) => {
    dispatch(updateTodo({ id: todoId, status }));
    setShowStatusPicker(null);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTaskTitle(todo.title);
    setNewTaskDescription(todo.description);
    setNewTaskPriority(todo.priority);
    setModalVisible(true);
  };

  const handleUpdateTodo = () => {
    if (!editingTodo || newTaskTitle.trim() === '') {
      Alert.alert('Hata', 'Görev başlığı boş olamaz!');
      return;
    }

    const updatedTodo = {
      id: editingTodo.id,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      priority: newTaskPriority,
    };

    dispatch(updateTodo(updatedTodo));
    
    // Form'u sıfırla
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setEditingTodo(null);
    setModalVisible(false);
  };

  const getMotivationalMessage = () => {
    const rate = completionRate * 100;
    if (rate >= 80) return "🎉 Harika gidiyorsun! Üstün performans!";
    if (rate >= 60) return "💪 Çok iyi! Devam et!";
    if (rate >= 40) return "👍 İyi başlangıç, biraz daha!";
    if (rate >= 20) return "🌱 Her yolculuk bir adımla başlar!";
    return "🚀 Hadi başlayalım! İlk görevin seni bekliyor!";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in_progress':
        return '#2196F3';
      case 'on_hold':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const renderTodoItem = (todo: Todo) => (
    <Card key={todo.id} style={styles.todoCard}>
      <Card.Content>
        <View style={styles.todoHeader}>
          <Button
            mode="text"
            compact
            onPress={() => handleToggleTodo(todo.id)}
            style={styles.checkboxButton}
          >
            {todo.completed ? '✅' : '⭕'}
          </Button>
          <View style={styles.todoContent}>
            <Text 
              variant="titleMedium" 
              style={[
                styles.todoTitle,
                todo.completed && styles.completedTitle
              ]}
            >
              {todo.title}
            </Text>
            <Text 
              variant="bodyMedium" 
              style={styles.todoDescription}
            >
              {todo.description}
            </Text>
            <View style={styles.todoTags}>
              <Chip 
                style={[styles.priorityChip, { backgroundColor: getPriorityColor(todo.priority) }]}
                textStyle={styles.chipText}
              >
                {todo.priority.toUpperCase()}
              </Chip>
              <Chip 
                style={[styles.statusChip, { backgroundColor: getStatusColor(todo.status) }]}
                textStyle={styles.chipText}
                onPress={() => setShowStatusPicker(showStatusPicker === todo.id ? null : todo.id)}
              >
                {todo.status.replace('_', ' ').toUpperCase()}
              </Chip>
              <Chip style={styles.categoryChip}>
                {todo.category.name}
              </Chip>
            </View>
            {todo.dueDate && (
              <Text variant="bodySmall" style={styles.dueDate}>
                Son Tarih: {new Date(todo.dueDate).toLocaleDateString('tr-TR')}
              </Text>
            )}
          </View>
          <View style={styles.todoActions}>
            <Button
              mode="text"
              compact
              onPress={() => handleEditTodo(todo)}
            >
              ✏️
            </Button>
            <Button
              mode="text"
              compact
              onPress={() => handleDeleteTodo(todo.id)}
            >
              🗑️
            </Button>
          </View>
        </View>
        
        {/* Durum Seçim Dropdown */}
        {showStatusPicker === todo.id && (
          <View style={styles.statusPicker}>
            {[
              { key: 'not_started', label: 'Başlanmadı', emoji: '⏸️' },
              { key: 'in_progress', label: 'Devam Ediyor', emoji: '🔄' },
              { key: 'completed', label: 'Tamamlandı', emoji: '✅' },
              { key: 'on_hold', label: 'Beklemede', emoji: '⏳' },
              { key: 'cancelled', label: 'İptal Edildi', emoji: '❌' },
            ].map((status) => (
              <Button
                key={status.key}
                mode={todo.status === status.key ? 'contained' : 'outlined'}
                compact
                style={styles.statusButton}
                onPress={() => handleStatusChange(todo.id, status.key as Todo['status'])}
              >
                {status.emoji} {status.label}
              </Button>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* İstatistik Kartı */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            🎯 Görevlerim
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {todos.length}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Toplam
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={[styles.statNumber, {color: '#4CAF50'}]}>
                {completedTodos.length}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Tamamlanan
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={[styles.statNumber, {color: '#FF9800'}]}>
                {pendingTodos.length}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Bekleyen
              </Text>
            </View>
          </View>

          {/* İlerleme Çubuğu */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text variant="bodyLarge">Tamamlanma Oranı</Text>
              <Text variant="bodyLarge" style={styles.progressValue}>
                %{Math.round(completionRate * 100)}
              </Text>
            </View>
            <ProgressBar 
              progress={completionRate} 
              style={styles.progressBar}
              color="#4CAF50"
            />
          </View>

          {/* Motivasyon Mesajı */}
          <Text variant="bodyMedium" style={styles.motivationText}>
            {getMotivationalMessage()}
          </Text>
        </Card.Content>
      </Card>

      {/* Arama ve Filtreler */}
      <Searchbar
        placeholder="🔍 Görevlerde ara..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={filterStatus === 'all'}
            onPress={() => setFilterStatus('all')}
            style={styles.filterChip}
          >
            📋 Tümü ({todos.length})
          </Chip>
          <Chip
            selected={filterStatus === 'pending'}
            onPress={() => setFilterStatus('pending')}
            style={styles.filterChip}
          >
            ⏳ Bekleyen ({pendingTodos.length})
          </Chip>
          <Chip
            selected={filterStatus === 'completed'}
            onPress={() => setFilterStatus('completed')}
            style={styles.filterChip}
          >
            ✅ Tamamlanan ({completedTodos.length})
          </Chip>
          
          <Divider style={styles.filterDivider} />
          
          <Chip
            selected={filterPriority === 'high'}
            onPress={() => setFilterPriority(filterPriority === 'high' ? 'all' : 'high')}
            style={[styles.filterChip, {backgroundColor: filterPriority === 'high' ? '#F44336' : '#fff'}]}
            textStyle={{color: filterPriority === 'high' ? '#fff' : '#333'}}
          >
            🔴 Yüksek
          </Chip>
          <Chip
            selected={filterPriority === 'medium'}
            onPress={() => setFilterPriority(filterPriority === 'medium' ? 'all' : 'medium')}
            style={[styles.filterChip, {backgroundColor: filterPriority === 'medium' ? '#FF9800' : '#fff'}]}
            textStyle={{color: filterPriority === 'medium' ? '#fff' : '#333'}}
          >
            🟡 Orta
          </Chip>
          <Chip
            selected={filterPriority === 'low'}
            onPress={() => setFilterPriority(filterPriority === 'low' ? 'all' : 'low')}
            style={[styles.filterChip, {backgroundColor: filterPriority === 'low' ? '#4CAF50' : '#fff'}]}
            textStyle={{color: filterPriority === 'low' ? '#fff' : '#333'}}
          >
            🟢 Düşük
          </Chip>
        </ScrollView>
      </View>

      {/* Görev Listesi */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTodos.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text variant="titleLarge" style={styles.emptyTitle}>
                  {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' 
                    ? 'Sonuç Bulunamadı' 
                    : 'İlk Görevinizi Ekleyin'
                  }
                </Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                    ? "Arama kriterlerinize uygun görev bulunamadı. Filtreleri değiştirmeyi deneyin."
                    : "Hedefinizi belirleyin ve ilk adımı atın. + butonuna tıklayarak başlayın!"
                  }
                </Text>
              </View>
            </Card.Content>
          </Card>
        ) : (
          filteredTodos.map(renderTodoItem)
        )}
      </ScrollView>
      
      <FAB
        label="➕"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            {editingTodo ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}
          </Text>
          
          <TextInput
            label="Görev Başlığı"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            style={styles.textInput}
            mode="outlined"
          />
          
          <TextInput
            label="Açıklama (İsteğe bağlı)"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            style={styles.textInput}
            mode="outlined"
            multiline
            numberOfLines={3}
          />
          
          <View style={styles.priorityContainer}>
            <Text variant="bodyLarge" style={styles.priorityLabel}>
              Öncelik Seviyesi:
            </Text>
            <View style={styles.priorityButtons}>
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <Button
                  key={priority}
                  mode={newTaskPriority === priority ? 'contained' : 'outlined'}
                  onPress={() => setNewTaskPriority(priority)}
                  style={styles.priorityButton}
                  compact
                >
                  {priority === 'low' ? 'Düşük' : priority === 'medium' ? 'Orta' : 'Yüksek'}
                </Button>
              ))}
            </View>
          </View>
          
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setNewTaskTitle('');
                setNewTaskDescription('');
                setNewTaskPriority('medium');
                setModalVisible(false);
              }}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={editingTodo ? handleUpdateTodo : handleAddTodo}
              style={styles.modalButton}
            >
              {editingTodo ? 'Güncelle' : 'Ekle'}
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
  statsCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 3,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
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
    color: '#4CAF50',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  motivationText: {
    textAlign: 'center',
    color: '#6200EE',
    fontStyle: 'italic',
    marginTop: 8,
  },
  searchbar: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: '#E3F2FD',
  },
  filterDivider: {
    width: 2,
    height: 20,
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyCard: {
    elevation: 1,
    marginTop: 32,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    lineHeight: 24,
  },
  todoCard: {
    marginBottom: 12,
    elevation: 2,
  },
  todoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  todoContent: {
    flex: 1,
    marginLeft: 8,
  },
  todoTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  todoDescription: {
    marginBottom: 8,
    color: '#666',
  },
  todoTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  priorityChip: {
    marginRight: 4,
  },
  statusChip: {
    marginRight: 4,
  },
  categoryChip: {
    backgroundColor: '#E1F5FE',
  },
  chipText: {
    color: 'white',
    fontSize: 10,
  },
  dueDate: {
    color: '#666',
    fontStyle: 'italic',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
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
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 16,
    flex: 1,
    marginHorizontal: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  textInput: {
    marginBottom: 16,
  },
  priorityContainer: {
    marginBottom: 16,
  },
  priorityLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  todoActions: {
    flexDirection: 'row',
  },
  checkboxButton: {
    minWidth: 40,
    marginRight: 8,
  },
  statusPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statusButton: {
    minWidth: 100,
    marginBottom: 4,
  },
});

export default TasksScreen;
