export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  parentId?: string; // Alt kategoriler için
}

export interface TaskCategory extends Category {
  workspaceId?: string;
  isDefault: boolean;
  allowsSubcategories: boolean;
  metadata?: {
    estimatedTimeRequired?: number;
    requiredResources?: string[];
    dependencies?: string[];
  };
}

// Varsayılan kategori renkleri
export const CategoryColors = {
  WORK: '#FF5733',
  PERSONAL: '#33FF57',
  STUDY: '#3357FF',
  HEALTH: '#FF33F5',
  PROJECT: '#33FFF5',
  MEETING: '#F5FF33',
  DEADLINE: '#FF3333',
  OTHER: '#CCCCCC'
} as const;

// Varsayılan kategoriler
export const DefaultCategories: TaskCategory[] = [
  {
    id: 'work',
    name: 'İş',
    description: 'İş ile ilgili görevler ve projeler',
    color: CategoryColors.WORK,
    icon: 'work',
    isDefault: true,
    allowsSubcategories: true,
  },
  {
    id: 'personal',
    name: 'Kişisel',
    description: 'Kişisel görevler ve hatırlatıcılar',
    color: CategoryColors.PERSONAL,
    icon: 'person',
    isDefault: true,
    allowsSubcategories: true,
  },
  {
    id: 'study',
    name: 'Eğitim',
    description: 'Eğitim ve öğrenme ile ilgili görevler',
    color: CategoryColors.STUDY,
    icon: 'school',
    isDefault: true,
    allowsSubcategories: true,
  },
  {
    id: 'health',
    name: 'Sağlık',
    description: 'Sağlık ve fitness ile ilgili görevler',
    color: CategoryColors.HEALTH,
    icon: 'favorite',
    isDefault: true,
    allowsSubcategories: true,
  },
  {
    id: 'project',
    name: 'Proje',
    description: 'Proje yönetimi ve takibi',
    color: CategoryColors.PROJECT,
    icon: 'assignment',
    isDefault: true,
    allowsSubcategories: true,
  },
  {
    id: 'meeting',
    name: 'Toplantı',
    description: 'Toplantılar ve randevular',
    color: CategoryColors.MEETING,
    icon: 'event',
    isDefault: true,
    allowsSubcategories: false,
  },
  {
    id: 'deadline',
    name: 'Son Tarih',
    description: 'Acil ve son tarihli görevler',
    color: CategoryColors.DEADLINE,
    icon: 'alarm',
    isDefault: true,
    allowsSubcategories: false,
  }
];