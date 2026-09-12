import { CategoryId } from '../types';

interface CategorizationRule {
  categoryId: CategoryId;
  keywords: string[];
}

const DEFAULT_RULES: CategorizationRule[] = [
  {
    categoryId: 'essentials',
    keywords: [
      'blinkit', 'zepto', 'instamart', 'bigbasket', 'dmart', 'grofers', 'grocery', 
      'groceries', 'milk', 'sabzi', 'vegetables', 'fruits', 'ration', 'supermarket',
      'chemist', 'pharmacy', 'apollo', 'medplus', 'medicine', 'medicines', 'sattu', 'paneer', 'oats'
    ],
  },
  {
    categoryId: 'food',
    keywords: [
      'zomato', 'swiggy', 'domino', 'pizza', 'burger', 'mcdonald', 'kfc', 'subway',
      'starbucks', 'chai', 'coffee', 'cafe', 'restaurant', 'dhaba', 'biryani', 'dinner',
      'lunch', 'breakfast', 'snack', 'snacks', 'haldiram', 'eats', 'barbeque', 'bakery'
    ],
  },
  {
    categoryId: 'transport',
    keywords: [
      'metro', 'uber', 'ola', 'rapido', 'petrol', 'fuel', 'diesel', 'cng', 'auto',
      'cab', 'taxi', 'toll', 'fastag', 'parking', 'bus', 'train', 'irctc', 'flight', 'indigo'
    ],
  },
  {
    categoryId: 'bills',
    keywords: [
      'netflix', 'spotify', 'prime video', 'hotstar', 'youtube premium', 'icloud', 'google one',
      'chatgpt', 'openai', 'aws', 'wifi', 'broadband', 'airtel', 'jio', 'vi', 'electricity',
      'bescom', 'water bill', 'piped gas', 'cylinder', 'maintenance', 'rent'
    ],
  },
  {
    categoryId: 'shopping',
    keywords: [
      'amazon', 'flipkart', 'myntra', 'ajio', 'tata cliq', 'croma', 'reliance digital',
      'zara', 'h&m', 'uniqlo', 'shoes', 'clothes', 'electronics', 'gadget', 'laptop', 'mouse', 'keyboard'
    ],
  },
  {
    categoryId: 'education',
    keywords: [
      'udemy', 'coursera', 'books', 'book', 'course', 'tuition', 'class', 'stationery',
      'notebook', 'pen', 'exam', 'cert', 'certification', 'kindle', 'coaching'
    ],
  },
  {
    categoryId: 'personal',
    keywords: [
      'salon', 'haircut', 'barber', 'spa', 'skincare', 'cosmetics', 'shampoo', 'soap',
      'perfume', 'deodorant', 'gym', 'fitness', 'cult.fit', 'creatine', 'protein'
    ],
  },
  {
    categoryId: 'savings',
    keywords: [
      'zerodha', 'groww', 'sip', 'mutual fund', 'stocks', 'etf', 'index fund',
      'gold', 'ppf', 'nps', 'fixed deposit', 'fd', 'rd'
    ],
  },
  {
    categoryId: 'emergency',
    keywords: [
      'hospital', 'doctor', 'clinic', 'dentist', 'emergency', 'urgent', 'repair', 'mechanic'
    ],
  },
];

export function predictCategory(text: string): CategoryId | null {
  if (!text || !text.trim()) return null;

  const normalized = text.toLowerCase().trim();

  // 1. Exact or partial keyword match
  for (const rule of DEFAULT_RULES) {
    for (const keyword of rule.keywords) {
      // Word boundary or containment
      const regex = new RegExp(`(^|\\b|\\s|_|-)${keyword}(\\b|\\s|_|-|$)`, 'i');
      if (regex.test(normalized) || normalized.includes(keyword)) {
        return rule.categoryId;
      }
    }
  }

  return null;
}
