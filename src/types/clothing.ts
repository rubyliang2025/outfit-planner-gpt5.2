export type PrimaryCategory = 'top' | 'bottom';
export type SecondaryCategory = 'inner' | 'outer' | 'unknown';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all-season';
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type Category = 'outerwear' | 'top' | 'bottom' | 'shoes' | 'accessory' | 'unknown';

export interface ClothingItem {
  id: string;
  imageDataUrl: string;
  primary: PrimaryCategory;
  secondary: SecondaryCategory;
  seasons: Season[];
  colors: string[];
  styleTags: string[];
  notes?: string;
  category?: Category;
}

export interface OutfitDay {
  day: DayOfWeek;
  topId: string;
  bottomId: string;
  outerId?: string;
  reason: string;
}

export interface WeeklyPlan {
  days: OutfitDay[];
}

export interface GeneratePlanRequest {
  items: ClothingItem[];
  preferences: {
    style: string;
    repeatLimit: number;
  };
}
