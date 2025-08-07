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
  TextInput,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deleteNote, addNote, updateNote } from '../store/slices/notesSlice';
import { Note } from '../types';

const NotesScreen = () => {
  const dispatch = useDispatch();
  const { notes } = useSelector((state: RootState) => state.notes);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // New note form state
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDeleteNote = (id: string) => {
    dispatch(deleteNote(id));
  };

  const handleAddNote = () => {
    if (newNote.title.trim() === '') {
      return;
    }

    const noteToAdd: Note = {
      id: Date.now().toString(),
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      tags: newNote.tags,
      order: notes.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch(addNote(noteToAdd));
    
    // Form'u sıfırla
    setNewNote({ title: '', content: '', tags: [] });
    setModalVisible(false);
  };

  const handleEditNote = () => {
    if (!editingNote || newNote.title.trim() === '') {
      return;
    }

    const updatedNote = {
      id: editingNote.id,
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      tags: newNote.tags,
    };

    dispatch(updateNote(updatedNote));
    
    // Form'u sıfırla
    setNewNote({ title: '', content: '', tags: [] });
    setEditingNote(null);
    setModalVisible(false);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags || []
    });
    setModalVisible(true);
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
          <View style={styles.noteActions}>
            <Button
              mode="text"
              compact
              onPress={() => openEditModal(note)}
            >
              ✏️
            </Button>
            <Button
              mode="text"
              compact
              onPress={() => handleDeleteNote(note.id)}
            >
              🗑️
            </Button>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="🔍 Notlarda ara..."
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
            {editingNote ? 'Not Düzenle' : 'Yeni Not'}
          </Text>
          
          <TextInput
            label="Başlık"
            value={newNote.title}
            onChangeText={(text) => setNewNote(prev => ({ ...prev, title: text }))}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="İçerik"
            value={newNote.content}
            onChangeText={(text) => setNewNote(prev => ({ ...prev, content: text }))}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => {
                setModalVisible(false);
                setEditingNote(null);
                setNewNote({ title: '', content: '', tags: [] });
              }}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={editingNote ? handleEditNote : handleAddNote}
              style={styles.modalButton}
              disabled={!newNote.title.trim() || !newNote.content.trim()}
            >
              {editingNote ? 'Güncelle' : 'Ekle'}
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
  noteActions: {
    flexDirection: 'column',
    alignItems: 'center',
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
  input: {
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default NotesScreen;
