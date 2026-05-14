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
