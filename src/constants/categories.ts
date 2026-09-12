import { Category, CategoryId } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'essentials',
    name: 'Essentials & Groceries',
    icon: 'ShoppingCart',
    color: '#10b981', // emerald
    bgLight: 'rgba(16, 185, 129, 0.1)',
    isEssential: true,
    isSavings: false,
  },
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'Utensils',
    color: '#f59e0b', // amber
    bgLight: 'rgba(245, 158, 11, 0.1)',
    isEssential: false,
    isSavings: false,
  },
  {
    id: 'transport',
    name: 'Transport & Commute',
    icon: 'Car',
    color: '#3b82f6', // blue
    bgLight: 'rgba(59, 130, 246, 0.1)',
    isEssential: false,
    isSavings: false,
  },
  {
    id: 'education',
    name: 'Education & Learning',
    icon: 'GraduationCap',
    color: '#8b5cf6', // purple
    bgLight: 'rgba(139, 92, 246, 0.1)',
    isEssential: false,
    isSavings: false,
  },
  {
    id: 'personal',
    name: 'Personal Care',
    icon: 'User',
    color: '#ec4899', // pink
    bgLight: 'rgba(236, 72, 153, 0.1)',
    isEssential: false,
    isSavings: false,
  },
  {
    id: 'shopping',
    name: 'Shopping & Gear',
    icon: 'ShoppingBag',
    color: '#06b6d4', // cyan
    bgLight: 'rgba(6, 182, 212, 0.1)',
    isEssential: false,
    isSavings: false,
  },
  {
    id: 'bills',
    name: 'Bills & Subscriptions',
    icon: 'Receipt',
    color: '#f97316', // orange
    bgLight: 'rgba(249, 115, 22, 0.1)',
    isEssential: true,
    isSavings: false,
  },
  {
    id: 'savings',
    name: 'Savings & Investments',
    icon: 'PiggyBank',
    color: '#14b8a6', // teal
    bgLight: 'rgba(20, 184, 166, 0.1)',
    isEssential: false,
    isSavings: true,
  },
  {
    id: 'emergency',
    name: 'Emergency Fund',
    icon: 'ShieldAlert',
    color: '#ef4444', // red
    bgLight: 'rgba(239, 68, 68, 0.1)',
    isEssential: false,
    isSavings: true,
  },
  {
    id: 'other',
    name: 'Other & Miscellaneous',
    icon: 'MoreHorizontal',
    color: '#64748b', // slate
    bgLight: 'rgba(100, 116, 139, 0.1)',
    isEssential: false,
    isSavings: false,
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = DEFAULT_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  },
  {} as Record<CategoryId, Category>
);
