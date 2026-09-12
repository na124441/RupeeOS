import { ShoppingProvider } from '../types';

export interface ProviderInfo {
  id: ShoppingProvider;
  name: string;
  shortName: string;
  badgeColor: string;
  textColor: string;
  bgClass: string;
  borderClass: string;
  generateUrl: (itemQuery: string) => string;
}

export const SHOPPING_PROVIDERS: Record<ShoppingProvider, ProviderInfo> = {
  blinkit: {
    id: 'blinkit',
    name: 'Blinkit',
    shortName: 'Blinkit',
    badgeColor: '#f7d000',
    textColor: '#000000',
    bgClass: 'bg-yellow-400/15 text-yellow-300 hover:bg-yellow-400/25',
    borderClass: 'border-yellow-400/40',
    generateUrl: (query: string) => `https://blinkit.com/s/?q=${encodeURIComponent(query)}`,
  },
  zepto: {
    id: 'zepto',
    name: 'Zepto',
    shortName: 'Zepto',
    badgeColor: '#7c3aed',
    textColor: '#ffffff',
    bgClass: 'bg-purple-500/15 text-purple-300 hover:bg-purple-500/25',
    borderClass: 'border-purple-500/40',
    generateUrl: (query: string) => `https://www.zeptonow.com/search?query=${encodeURIComponent(query)}`,
  },
  instamart: {
    id: 'instamart',
    name: 'Swiggy Instamart',
    shortName: 'Instamart',
    badgeColor: '#fc8019',
    textColor: '#ffffff',
    bgClass: 'bg-orange-500/15 text-orange-300 hover:bg-orange-500/25',
    borderClass: 'border-orange-500/40',
    generateUrl: (query: string) => `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(query)}`,
  },
  amazon: {
    id: 'amazon',
    name: 'Amazon Fresh / India',
    shortName: 'Amazon',
    badgeColor: '#232f3e',
    textColor: '#ff9900',
    bgClass: 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25',
    borderClass: 'border-amber-500/40',
    generateUrl: (query: string) => `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
  },
};

export function getProviderUrl(provider: ShoppingProvider, itemName: string): string {
  const prov = SHOPPING_PROVIDERS[provider] || SHOPPING_PROVIDERS.blinkit;
  return prov.generateUrl(itemName);
}
