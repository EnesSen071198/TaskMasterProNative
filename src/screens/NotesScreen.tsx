import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
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
  Searchbar,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deleteNote } from '../store/slices/notesSlice';
import { Note } from '../types';

const NotesScreen = () => {
  const dispatch = useDispatch();
  const { notes } = useSelector((state: RootState) => state.notes);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDeleteNote = (id: string) => {
    dispatch(deleteNote(id));
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderNoteItem = (note: Note) => (
    <Card key={note.id} style={styles.noteCard}>
      <Card.Content>
        <View style={styles.noteHeader}>
          <View style={styles.noteContent}>
            <Text variant="titleMedium" style={styles.noteTitle}>
              {note.title}
            </Text>
            <Text 
              variant="bodyMedium" 
              style={styles.noteContentText}
              numberOfLines={3}
            >
              {note.content}
            </Text>
            <View style={styles.noteTags}>
              {note.tags.map((tag, index) => (
                <Chip key={index} style={styles.tagChip}>
                  {tag}
                </Chip>
              ))}
            </View>
            <Text variant="bodySmall" style={styles.noteDate}>
              {new Date(note.updatedAt).toLocaleDateString('tr-TR')}
            </Text>
          </View>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeleteNote(note.id)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Notlarda ara..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>
            Notlarım ({filteredNotes.length})
          </Text>
          
          {filteredNotes.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text variant="bodyLarge" style={styles.emptyText}>
                  {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz not eklenmemiş'}
                </Text>
                <Text variant="bodyMedium" style={styles.emptySubtext}>
                  + butonu ile yeni not ekleyebilirsiniz
                </Text>
              </Card.Content>
            </Card>
          ) : (
            filteredNotes.map(renderNoteItem)
          )}
        </View>
      </ScrollView>
      
      <FAB
        icon="plus"
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
            Yeni Not
          </Text>
          <Text variant="bodyMedium">
            Not ekleme formu burada olacak
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  noteCard: {
    marginBottom: 12,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteContentText: {
    marginBottom: 12,
    color: '#666',
    lineHeight: 20,
  },
  noteTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  tagChip: {
    backgroundColor: '#E8F5E8',
    marginRight: 4,
    marginBottom: 4,
  },
  noteDate: {
    color: '#999',
    fontStyle: 'italic',
  },
  emptyCard: {
    marginTop: 32,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
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
  },
});

export default NotesScreen;
