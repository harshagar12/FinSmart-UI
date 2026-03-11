export type View = 'home' | 'dashboard' | 'calculator' | 'chat' | 'dictionary' | 'simulator';

export interface MarketData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  type: 'crypto' | 'stock' | 'index';
}

export interface Holding {
  assetId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  type: 'crypto' | 'stock' | 'index';
  purchaseDate: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
