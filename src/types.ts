export interface Category extends BaseTable {
  name: string;
  isActive: boolean;
  imageUrl: string;
}
export interface BaseTable {
  id: number;
  isActive: boolean;
}

export interface DynamicAttribute extends BaseTable {
  name: string;
  type: string;
}

export interface Region extends BaseTable {
  name: string;
  parentId?: number;
  parentName?: string;
}

export interface RegionFormData {
  nameEnglish: string;
  nameArabic: string;
  parentId?: number;
}

export interface Slider extends BaseTable {
  name: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
}

export interface SliderFormData {
  nameArabic: string;
  nameEnglish: string;
  startDate: Date;
  endDate: Date;
  image: File | null;
}

