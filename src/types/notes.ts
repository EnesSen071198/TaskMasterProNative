export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  tags: string[];
  color?: string;
  isPinned: boolean;
  isArchived: boolean;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }[];
  collaborators?: {
    id: string;
    name: string;
    email: string;
    role: 'viewer' | 'editor';
    addedAt: Date;
  }[];
  version: number;
  history?: {
    id: string;
    content: string;
    updatedAt: Date;
    updatedBy?: string;
  }[];
  metadata?: {
    wordCount?: number;
    readTime?: number;
    lastViewed?: Date;
    viewCount?: number;
  };
}

export interface NoteCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  parentId?: string;
  order: number;
}

export interface NoteFilter {
  search?: string;
  categories?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface NoteSortOption {
  field: 'title' | 'createdAt' | 'updatedAt' | 'category';
  direction: 'asc' | 'desc';
}