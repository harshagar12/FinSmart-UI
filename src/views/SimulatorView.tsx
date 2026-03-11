import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Share2, 
  ArrowLeft, 
  Search, 
  ChevronLeft,
  ChevronRight, 
  PieChart as PieChartIcon,
  DollarSign,
  ArrowUpRight,
  X,
  CheckCircle2,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { cn } from '../lib/utils';
import type { MarketData, Holding } from '../types';

interface TransactionHistory {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  quantity: number;
  salePrice: number;
  avgPurchasePrice: number;
  profit: number;
  profitPercent: number;
  date: string;
}

interface SimulatorViewProps {
  onNavigate: (view: any) => void;
}

const INITIAL_CASH = 100000;
const ITEMS_PER_PAGE_MARKET = 5;
const ITEMS_PER_PAGE_HOLDINGS = 3;

const MOCK_MARKET: MarketData[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 65432.21, change: 2.4, type: 'crypto' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3456.78, change: -1.2, type: 'crypto' },
  { id: '3', name: 'Solana', symbol: 'SOL', price: 145.32, change: 5.6, type: 'crypto' },
  { id: '4', name: 'Apple Inc.', symbol: 'AAPL', price: 189.43, change: 0.8, type: 'stock' },
  { id: '5', name: 'Tesla Motors', symbol: 'TSLA', price: 175.21, change: -3.4, type: 'stock' },
  { id: '6', name: 'NVIDIA Corp', symbol: 'NVDA', price: 890.12, change: 4.2, type: 'stock' },
  { id: '7', name: 'S&P 500', symbol: 'SPX', price: 5123.45, change: 0.5, type: 'index' },
  { id: '8', name: 'Nasdaq 100', symbol: 'NDX', price: 18234.56, change: 0.7, type: 'index' },
  { id: '9', name: 'Dow Jones', symbol: 'DJI', price: 39123.45, change: -0.2, type: 'index' },
  { id: '10', name: 'Cardano', symbol: 'ADA', price: 0.45, change: 1.2, type: 'crypto' },
  { id: '11', name: 'Polkadot', symbol: 'DOT', price: 7.21, change: -0.5, type: 'crypto' },
  { id: '12', name: 'Microsoft', symbol: 'MSFT', price: 420.55, change: 1.1, type: 'stock' },
];

const MOCK_HISTORY = [
  { time: '09:00', value: 100000 },
  { time: '10:00', value: 102000 },
  { time: '11:00', value: 101500 },
  { time: '12:00', value: 104000 },
  { time: '13:00', value: 103200 },
  { time: '14:00', value: 106000 },
  { time: '15:00', value: 105500 },
];

const COLORS = ['#10b77f', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function SimulatorView({ onNavigate }: SimulatorViewProps) {
  const [cash, setCash] = useState(INITIAL_CASH);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [history, setHistory] = useState<TransactionHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'crypto' | 'stock' | 'index'>('all');
  const [buyAmount, setBuyAmount] = useState<{[key: string]: string}>({});
  const [sellAmount, setSellAmount] = useState<{[key: string]: string}>({});
  const [showShareModal, setShowShareModal] = useState<Holding | null>(null);
  const [showPortfolioShare, setShowPortfolioShare] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Pagination State
  const [marketPage, setMarketPage] = useState(1);
  const [holdingsPage, setHoldingsPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  const portfolioValue = useMemo(() => {
    return holdings.reduce((acc, h) => acc + (h.quantity * h.currentPrice), 0);
  }, [holdings]);

  const totalValue = cash + portfolioValue;
  const totalProfitLoss = totalValue - INITIAL_CASH;
  const profitLossPercentage = (totalProfitLoss / INITIAL_CASH) * 100;

  const allocationData = useMemo(() => {
    const data = holdings.map(h => ({
      name: h.symbol,
      value: h.quantity * h.currentPrice
    }));
    if (cash > 0) {
      data.push({ name: 'Cash', value: cash });
    }
    return data;
  }, [holdings, cash]);

  const filteredMarket = useMemo(() => {
    return MOCK_MARKET.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  // Paginated Market Assets
  const paginatedMarket = useMemo(() => {
    const start = (marketPage - 1) * ITEMS_PER_PAGE_MARKET;
    return filteredMarket.slice(start, start + ITEMS_PER_PAGE_MARKET);
  }, [filteredMarket, marketPage]);

  const totalMarketPages = Math.ceil(filteredMarket.length / ITEMS_PER_PAGE_MARKET);

  // Paginated Holdings
  const paginatedHoldings = useMemo(() => {
    const start = (holdingsPage - 1) * ITEMS_PER_PAGE_HOLDINGS;
    return holdings.slice(start, start + ITEMS_PER_PAGE_HOLDINGS);
  }, [holdings, holdingsPage]);

  const totalHoldingsPages = Math.ceil(holdings.length / ITEMS_PER_PAGE_HOLDINGS);

  // Paginated History
  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * ITEMS_PER_PAGE_HOLDINGS;
    return history.slice(start, start + ITEMS_PER_PAGE_HOLDINGS);
  }, [history, historyPage]);

  const totalHistoryPages = Math.ceil(history.length / ITEMS_PER_PAGE_HOLDINGS);

  const handleBuy = (asset: MarketData) => {
    const qty = parseFloat(buyAmount[asset.id] || '0');
    if (qty <= 0) return;

    const cost = qty * asset.price;
    if (cost > cash) {
      showNotification('Insufficient cash balance');
      return;
    }

    setCash(prev => prev - cost);
    setHoldings(prev => {
      const existing = prev.find(h => h.assetId === asset.id);
      if (existing) {
        return prev.map(h => h.assetId === asset.id ? {
          ...h,
          quantity: h.quantity + qty,
          avgPrice: (h.avgPrice * h.quantity + cost) / (h.quantity + qty),
          currentPrice: asset.price
        } : h);
      }
      return [...prev, {
        assetId: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        quantity: qty,
        avgPrice: asset.price,
        currentPrice: asset.price,
        type: asset.type,
        purchaseDate: new Date().toLocaleDateString()
      }];
    });

    setBuyAmount(prev => ({ ...prev, [asset.id]: '' }));
    showNotification(`Successfully bought ${qty} ${asset.symbol}`);
  };

  const handleSell = (holding: Holding) => {
    const qty = parseFloat(sellAmount[holding.assetId] || '0');
    if (qty <= 0) return;

    if (qty > holding.quantity) {
      showNotification('Insufficient holdings to sell');
      return;
    }

    const saleValue = qty * holding.currentPrice;
    const profit = (holding.currentPrice - holding.avgPrice) * qty;
    const profitPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;

    setCash(prev => prev + saleValue);
    
    setHoldings(prev => {
      const updated = prev.map(h => {
        if (h.assetId === holding.assetId) {
          return { ...h, quantity: h.quantity - qty };
        }
        return h;
      }).filter(h => h.quantity > 0);
      return updated;
    });

    setHistory(prev => [{
      id: Date.now().toString(),
      assetId: holding.assetId,
      symbol: holding.symbol,
      name: holding.name,
      quantity: qty,
      salePrice: holding.currentPrice,
      avgPurchasePrice: holding.avgPrice,
      profit,
      profitPercent,
      date: new Date().toLocaleDateString()
    }, ...prev]);

    setSellAmount(prev => ({ ...prev, [holding.assetId]: '' }));
    showNotification(`Successfully sold ${qty} ${holding.symbol}`);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const Pagination = ({ current, total, onPageChange }: { current: number, total: number, onPageChange: (p: number) => void }) => {
    if (total <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button 
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
          className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {[...Array(total)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={cn(
              "size-8 rounded-xl text-xs font-black transition-all",
              current === i + 1 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
            )}
          >
            {i + 1}
          </button>
        ))}
        <button 
          disabled={current === total}
          onClick={() => onPageChange(current + 1)}
          className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Trading Simulator</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Paper Trading</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cash Available', value: cash, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Portfolio Value', value: portfolioValue, icon: PieChartIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Amount', value: totalValue, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { 
            label: 'Total Profit/Loss', 
            value: totalProfitLoss, 
            icon: totalProfitLoss >= 0 ? TrendingUp : TrendingDown, 
            color: totalProfitLoss >= 0 ? 'text-emerald-600' : 'text-red-600',
            bg: totalProfitLoss >= 0 ? 'bg-emerald-50' : 'bg-red-50',
            suffix: ` (${profitLossPercentage.toFixed(2)}%)`
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <div className={cn("p-2 rounded-xl", stat.bg)}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              {stat.suffix && <span className={cn("text-xs font-bold", stat.color)}>{stat.suffix}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Market List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Market Assets</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setMarketPage(1);
                  }}
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-48"
                />
              </div>
              <select 
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value as any);
                  setMarketPage(1);
                }}
                className="px-3 py-2 bg-slate-100 border-none rounded-xl text-sm font-bold text-slate-600 outline-none"
              >
                <option value="all">All</option>
                <option value="crypto">Crypto</option>
                <option value="stock">Stocks</option>
                <option value="index">Indices</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">24h Change</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedMarket.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-600 text-xs">
                            {asset.symbol[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{asset.name}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{asset.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-700">
                        ${asset.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold",
                          asset.change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        )}>
                          {asset.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {Math.abs(asset.change)}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            placeholder="Qty"
                            value={buyAmount[asset.id] || ''}
                            onChange={(e) => setBuyAmount(prev => ({ ...prev, [asset.id]: e.target.value }))}
                            className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none focus:border-emerald-500"
                          />
                          <button 
                            onClick={() => handleBuy(asset)}
                            className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination current={marketPage} total={totalMarketPages} onPageChange={setMarketPage} />
        </div>

        {/* Holdings & Share */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Your Holdings</h2>
              {holdings.length > 0 && (
                <button 
                  onClick={() => setShowPortfolioShare(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
                >
                  <Share2 size={12} />
                  Share Portfolio
                </button>
              )}
            </div>
            <div className="space-y-4">
              {holdings.length === 0 ? (
                <div className="p-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-center space-y-3">
                  <div className="size-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <Wallet size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">No assets held yet</p>
                </div>
              ) : (
                <>
                  {paginatedHoldings.map((holding) => {
                    const profit = (holding.currentPrice - holding.avgPrice) * holding.quantity;
                    const profitPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                    
                    return (
                      <motion.div 
                        layout
                        key={holding.assetId}
                        className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 text-xs">
                              {holding.symbol[0]}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{holding.name}</div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{holding.quantity} {holding.symbol}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              placeholder="Qty"
                              value={sellAmount[holding.assetId] || ''}
                              onChange={(e) => setSellAmount(prev => ({ ...prev, [holding.assetId]: e.target.value }))}
                              className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none focus:border-red-500"
                            />
                            <button 
                              onClick={() => handleSell(holding)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                            >
                              Sell
                            </button>
                            <button 
                              onClick={() => setShowShareModal(holding)}
                              className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                            >
                              <Share2 size={18} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                          <div>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Avg. Price</span>
                            <span className="text-sm font-bold text-slate-700">${holding.avgPrice.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Profit/Loss</span>
                            <span className={cn(
                              "text-sm font-bold",
                              profit >= 0 ? "text-emerald-600" : "text-red-600"
                            )}>
                              {profit >= 0 ? '+' : ''}{profit.toLocaleString()} ({profitPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <Pagination current={holdingsPage} total={totalHoldingsPages} onPageChange={setHoldingsPage} />
                </>
              )}
            </div>
          </div>

          {/* Transaction History Section */}
          <div className="space-y-6 pt-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Trade History</h2>
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="p-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-center space-y-3">
                  <p className="text-sm font-bold text-slate-400">No trade history yet</p>
                </div>
              ) : (
                <>
                  {paginatedHistory.map((item) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={item.id}
                      className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-red-50 flex items-center justify-center font-black text-red-400 text-xs">
                            {item.symbol[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{item.name}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sold {item.quantity} {item.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</div>
                          <div className="text-sm font-black text-slate-900">${(item.quantity * item.salePrice).toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Sale Price</span>
                          <span className="text-sm font-bold text-slate-700">${item.salePrice.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Profit/Loss</span>
                          <span className={cn(
                            "text-sm font-bold",
                            item.profit >= 0 ? "text-emerald-600" : "text-red-600"
                          )}>
                            {item.profit >= 0 ? '+' : ''}{item.profit.toLocaleString()} ({item.profitPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <Pagination current={historyPage} total={totalHistoryPages} onPageChange={setHistoryPage} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Moved to Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-8 border-t border-slate-100">
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Portfolio Performance</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <BarChart3 size={12} />
              Live View
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HISTORY}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b77f" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b77f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <YAxis 
                  hide 
                  domain={['dataMin - 1000', 'dataMax + 1000']} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b77f" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Allocation</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {allocationData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Asset Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Share Performance</h3>
                  <button onClick={() => setShowShareModal(null)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                {/* Share Card to "Screenshot" */}
                <div className="p-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[2rem] text-white space-y-8 shadow-xl shadow-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-white">
                        {showShareModal.symbol[0]}
                      </div>
                      <div>
                        <div className="font-black text-lg leading-none">{showShareModal.name}</div>
                        <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Trading Performance</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Bought On</div>
                      <div className="font-bold text-sm">{showShareModal.purchaseDate}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest block">Market Price</span>
                      <span className="text-2xl font-black">${showShareModal.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest block">Total Profit</span>
                      <div className="flex items-center justify-end gap-1 text-2xl font-black">
                        <ArrowUpRight size={24} />
                        ${((showShareModal.currentPrice - showShareModal.avgPrice) * showShareModal.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-6 bg-white rounded-lg flex items-center justify-center">
                        <TrendingUp size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-xs font-black tracking-tight">FinSmart Simulator</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Verified Trade</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                    <Plus size={18} />
                    Copy Link
                  </button>
                  <button className="flex items-center justify-center gap-2 py-4 bg-emerald-500 rounded-2xl font-bold text-white hover:bg-emerald-600 transition-colors">
                    <Share2 size={18} />
                    Share Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Portfolio Modal */}
      <AnimatePresence>
        {showPortfolioShare && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPortfolioShare(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Portfolio Summary</h3>
                  <button onClick={() => setShowPortfolioShare(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Globe size={120} className="text-emerald-500" />
                  </div>

                  <div className="space-y-1 relative z-10">
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-[0.3em]">Total Net Worth</span>
                    <div className="text-4xl font-black tracking-tighter">${totalValue.toLocaleString()}</div>
                    <div className={cn(
                      "inline-flex items-center gap-1 text-xs font-bold",
                      totalProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"
                    )}>
                      {totalProfitLoss >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toLocaleString()} ({profitLossPercentage.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest block mb-1">Holdings</span>
                      <span className="text-lg font-black">{holdings.length} Assets</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest block mb-1">Cash Balance</span>
                      <span className="text-lg font-black">${cash.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3 relative z-10">
                    <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest block">Top Assets</span>
                    <div className="flex flex-wrap gap-2">
                      {holdings.slice(0, 3).map(h => (
                        <div key={h.symbol} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                          {h.symbol}
                        </div>
                      ))}
                      {holdings.length > 3 && (
                        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest">
                          +{holdings.length - 3} More
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="size-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Zap size={14} className="text-black" />
                      </div>
                      <span className="text-xs font-black tracking-tight">FinSmart Elite</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Global Portfolio</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    showNotification('Portfolio link copied to clipboard');
                    setShowPortfolioShare(false);
                  }}
                  className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                >
                  <Share2 size={18} />
                  Share My Portfolio
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-sm font-bold">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
