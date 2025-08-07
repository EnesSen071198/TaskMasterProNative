import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskCategory, DefaultCategories } from '../../types/categories';
import { saveCategories, loadCategories } from '../../utils/storage';

interface CategoriesState {
  items: TaskCategory[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
}

// Kaydedilmiş kategorileri yükle, yoksa varsayılanları kullan
const loadedCategories = loadCategories();
const initialCategories = loadedCategories.length > 0 ? loadedCategories : DefaultCategories;

const initialState: CategoriesState = {
  items: initialCategories,
  loading: false,
  error: null,
  selectedCategory: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<TaskCategory>) => {
      // Kategori ID'sinin benzersiz olduğunu kontrol et
      if (state.items.find(cat => cat.id === action.payload.id)) {
        state.error = 'Bu ID ile bir kategori zaten mevcut';
        return;
      }
      state.items.push(action.payload);
      saveCategories(state.items);
    },
    updateCategory: (state, action: PayloadAction<TaskCategory>) => {
      const index = state.items.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        // Varsayılan kategorileri güncellemeyi engelle
        if (state.items[index].isDefault) {
          state.error = 'Varsayılan kategoriler düzenlenemez';
          return;
        }
        state.items[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      const category = state.items.find(cat => cat.id === action.payload);
      if (category?.isDefault) {
        state.error = 'Varsayılan kategoriler silinemez';
        return;
      }
      state.items = state.items.filter(cat => cat.id !== action.payload);
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    addSubcategory: (state, action: PayloadAction<{ parentId: string; category: TaskCategory }>) => {
      const parent = state.items.find(cat => cat.id === action.payload.parentId);
      if (!parent) {
        state.error = 'Üst kategori bulunamadı';
        return;
      }
      if (!parent.allowsSubcategories) {
        state.error = 'Bu kategori alt kategorilere izin vermiyor';
        return;
      }
      const subCategory = { ...action.payload.category, parentId: action.payload.parentId };
      state.items.push(subCategory);
    },
    reorderCategories: (state, action: PayloadAction<string[]>) => {
      // Kategori sıralamasını güncelle
      const reorderedCategories: TaskCategory[] = [];
      action.payload.forEach(id => {
        const category = state.items.find(cat => cat.id === id);
        if (category) {
          reorderedCategories.push(category);
        }
      });
      // Sıralanmayan kategorileri koru
      state.items.forEach(cat => {
        if (!action.payload.includes(cat.id)) {
          reorderedCategories.push(cat);
        }
      });
      state.items = reorderedCategories;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  setSelectedCategory,
  addSubcategory,
  reorderCategories,
  clearError,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;