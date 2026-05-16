export type Language = 'en' | 'ur';

export interface NavItem {
  id: string;
  labelEn: string;
  labelUr: string;
}

export interface Program {
  id: string;
  icon: string;
  titleEn: string;
  titleUr: string;
  descEn: string;
  descUr: string;
}

export interface Testimonial {
  name: string;
  locationEn: string;
  locationUr: string;
  contentEn: string;
  contentUr: string;
}

export interface NewsItem {
  image: string;
  tagEn: string;
  tagUr: string;
  dateEn: string;
  dateUr: string;
  titleEn: string;
  titleUr: string;
}

export type CampaignStatus = 'active' | 'completed' | 'upcoming';

export interface Campaign {
  id: string;
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  imageUrl: string;
  targetAmount: number;
  collectedAmount: number;
  easypaisaNumber: string;
  easypaisaName: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  location: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NewsCategory = 'Campaign' | 'Event' | 'Health' | 'Education';
export type NewsStatus = 'published' | 'draft';

export interface NewsPost {
  id: string;
  titleEn: string;
  titleUr: string;
  category: NewsCategory;
  date: string;
  descriptionEn: string;
  descriptionUr: string;
  imageUrl: string;
  status: NewsStatus;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export interface Stats {
  totalDonations: number;
  totalVolunteers: number;
  updatedAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
  UPLOAD = 'upload',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
