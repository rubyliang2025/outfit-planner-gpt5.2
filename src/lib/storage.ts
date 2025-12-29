import { ClothingItem, WeeklyPlan } from '@/types/clothing';

const CLOSET_KEY = 'outfit-planner-closet';
const PLAN_KEY = 'outfit-planner-plan';

export const storage = {
  saveCloset: (items: ClothingItem[]): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CLOSET_KEY, JSON.stringify(items));
    }
  },

  getCloset: (): ClothingItem[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CLOSET_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  savePlan: (plan: WeeklyPlan): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
    }
  },

  getPlan: (): WeeklyPlan | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(PLAN_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  clearAll: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CLOSET_KEY);
      localStorage.removeItem(PLAN_KEY);
    }
  },
};
