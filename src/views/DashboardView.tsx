import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PlusCircle, MoreHorizontal, ArrowRight, Activity, Bitcoin, BarChart3, Globe, Coins } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const portfolioData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 4500 },
  { name: 'Fri', value: 6000 },
  { name: 'Sat', value: 5500 },
  { name: 'Sun', value: 7000 },
];

const watchlist = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$67,432.10', change: 3.52, mcap: '$1.32T', trend: 'up' },
  { name: 'Ethereum', symbol: 'ETH', price: '$3,521.80', change: 2.18, mcap: '$422.5B', trend: 'up' },
  { name: 'Apple Inc.', symbol: 'AAPL', price: '$189.43', change: -0.12, mcap: '$2.93T', trend: 'down' },
  { name: 'Solana', symbol: 'SOL', price: '$142.25', change: 8.12, mcap: '$63.1B', trend: 'up' },
  { name: 'NVIDIA Corp', symbol: 'NVDA', price: '$890.12', change: 4.2, mcap: '$2.21T', trend: 'up' },
  { name: 'Tesla Motors', symbol: 'TSLA', price: '$175.21', change: -3.4, mcap: '$556.2B', trend: 'down' },
  { name: 'Cardano', symbol: 'ADA', price: '$0.45', change: 1.2, mcap: '$16.1B', trend: 'up' },
  { name: 'Polkadot', symbol: 'DOT', price: '$7.21', change: -0.5, mcap: '$10.3B', trend: 'down' },
];

const ITEMS_PER_PAGE = 4;

export default function DashboardView() {
  const [selectedCategory, setSelectedCategory] = useState('Crypto');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: 'Crypto', icon: Bitcoin },
    { id: 'Indices', icon: Activity },
    { id: 'Stocks', icon: BarChart3 },
    { id: 'Metals', icon: Coins },
  ];

  const totalPages = Math.ceil(watchlist.length / ITEMS_PER_PAGE);
  const paginatedWatchlist = watchlist.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Market Stats Cards */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#10b77f] rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Assets</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'S&P 500', value: '5,204.34', change: '+1.24%', up: true },
          { label: 'Nasdaq', value: '16,384.47', change: '-0.41%', up: false },
          { label: 'Bitcoin', value: '$67,432.10', change: '+3.52%', up: true },
          { label: 'Ethereum', value: '$3,521.80', change: '+2.18%', up: true },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            <div className="h-12 mt-4 opacity-50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData}>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={stat.up ? '#10b77f' : '#ef4444'} 
                    fill={stat.up ? '#10b77f20' : '#ef444420'} 
                    strokeWidth={2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

      {/* Watchlist Table */}
      <div className="bg-white rounded-3xl border border-emerald-50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Live Market Watchlist</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-[#10b77f] text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <cat.icon size={18} />
                {cat.id}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-8 py-4">Asset</th>
                <th className="px-8 py-4 text-right">Price</th>
                <th className="px-8 py-4 text-right">24h Change</th>
                <th className="px-8 py-4 text-right">Market Cap</th>
                <th className="px-8 py-4">Trend</th>
                <th className="px-8 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedWatchlist.map((asset, idx) => (
                <tr key={asset.symbol} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-600 group-hover:bg-white transition-colors">
                        {asset.symbol}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{asset.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black">{asset.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right text-sm font-black text-slate-900">{asset.price}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${asset.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {asset.change > 0 ? '+' : ''}{asset.change}%
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-sm font-medium text-slate-500">{asset.mcap}</td>
                  <td className="px-8 py-5 w-32">
                    <div className="h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={portfolioData}>
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={asset.trend === 'up' ? '#10b77f' : '#ef4444'} 
                            fill={asset.trend === 'up' ? '#10b77f10' : '#ef444410'} 
                            strokeWidth={2} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button className="px-4 py-2 bg-emerald-50 text-[#10b77f] text-xs font-bold rounded-xl hover:bg-[#10b77f] hover:text-white transition-all">
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {Math.min(watchlist.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} - {Math.min(watchlist.length, currentPage * ITEMS_PER_PAGE)} of {watchlist.length} assets
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
            >
              <TrendingDown size={16} className="rotate-90" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "size-8 rounded-xl text-xs font-black transition-all shadow-sm",
                  currentPage === i + 1 
                    ? "bg-[#10b77f] text-white shadow-emerald-500/20" 
                    : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
            >
              <TrendingUp size={16} className="-rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
