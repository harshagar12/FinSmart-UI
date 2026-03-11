import React, { useState, useEffect } from 'react';
import { Calculator, Info, TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function CalculatorView() {
  const [strategyType, setStrategyType] = useState('SIP (Monthly)');
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [duration, setDuration] = useState(25);
  const [expectedReturn, setExpectedReturn] = useState(8.5);
  const [results, setResults] = useState({ wealth: 0, principal: 0, profit: 0 });

  const strategyOptions = [
    "SIP (Monthly)", 
    "Step-Up SIP", 
    "Lumpsum", 
    "Fixed Deposit", 
    "Recurring Deposit", 
    "PPF (Yearly)"
  ];

  useEffect(() => {
    const calculate = () => {
      let wealth = 0;
      let principal = 0;

      if (strategyType === 'Lumpsum' || strategyType === 'Fixed Deposit') {
        const rate = expectedReturn / 100;
        wealth = initialInvestment * Math.pow(1 + rate, duration);
        principal = initialInvestment;
      } else if (strategyType === 'PPF (Yearly)') {
        const rate = expectedReturn / 100;
        principal = initialInvestment * duration;
        for (let i = 0; i < duration; i++) {
          wealth = (wealth + initialInvestment) * (1 + rate);
        }
      } else if (strategyType === 'Step-Up SIP') {
        const monthlyRate = expectedReturn / 100 / 12;
        let currentMonthly = monthlyContribution;
        wealth = initialInvestment;
        principal = initialInvestment;
        
        for (let year = 1; year <= duration; year++) {
          for (let month = 1; month <= 12; month++) {
            wealth = (wealth + currentMonthly) * (1 + monthlyRate);
            principal += currentMonthly;
          }
          currentMonthly *= 1.1; // 10% step up
        }
      } else {
        // SIP or Recurring Deposit
        const monthlyRate = expectedReturn / 100 / 12;
        const months = duration * 12;
        wealth = initialInvestment * Math.pow(1 + monthlyRate, months);
        principal = initialInvestment + (monthlyContribution * months);
        
        for (let i = 1; i <= months; i++) {
          wealth += monthlyContribution * Math.pow(1 + monthlyRate, months - i);
        }
      }

      setResults({
        wealth: Math.round(wealth),
        principal: Math.round(principal),
        profit: Math.round(wealth - principal)
      });
    };

    calculate();
  }, [initialInvestment, monthlyContribution, duration, expectedReturn, strategyType]);

  const chartData = [
    { name: 'Principal', value: results.principal, color: '#94a3b8' },
    { name: 'Profit', value: results.profit, color: '#10b77f' },
  ];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#10b77f] rounded-full" />
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Investment Calculator</h1>
        </div>
        <p className="text-slate-500 mt-2 text-lg font-medium">Forecast your wealth growth and achieve your financial milestones with precision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs Section */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <Calculator className="text-[#10b77f]" size={24} />
                Strategy Parameters
              </h3>
              
              <div className="relative">
                <select 
                  value={strategyType}
                  onChange={(e) => setStrategyType(e.target.value)}
                  className="w-full bg-slate-50 border border-emerald-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  {strategyOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <TrendingUp size={16} className="text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Initial Investment / Yearly for PPF */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-600">
                    {strategyType === 'PPF (Yearly)' ? 'Yearly Investment' : 'Initial Investment'}
                  </label>
                  <div className="flex items-center bg-emerald-50 rounded-full px-3 py-1">
                    <span className="text-[#10b77f] font-black text-sm">$</span>
                    <input 
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(Number(e.target.value))}
                      className="bg-transparent border-none text-[#10b77f] font-black text-sm w-20 outline-none focus:ring-0"
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#10b77f]" 
                />
              </div>

              {/* Monthly Contribution - Hidden for Lumpsum/FD/PPF */}
              {!(strategyType === 'Lumpsum' || strategyType === 'Fixed Deposit' || strategyType === 'PPF (Yearly)') && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-600">Monthly Contribution</label>
                    <div className="flex items-center bg-emerald-50 rounded-full px-3 py-1">
                      <span className="text-[#10b77f] font-black text-sm">$</span>
                      <input 
                        type="number"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                        className="bg-transparent border-none text-[#10b77f] font-black text-sm w-16 outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    step="50"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#10b77f]" 
                  />
                </div>
              )}

              {/* Duration */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-600">Duration (Years)</label>
                  <div className="flex items-center bg-emerald-50 rounded-full px-3 py-1">
                    <input 
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="bg-transparent border-none text-[#10b77f] font-black text-sm w-10 text-right outline-none focus:ring-0"
                    />
                    <span className="text-[#10b77f] font-black text-sm ml-1">Yrs</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#10b77f]" 
                />
              </div>

              {/* Expected Return */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-600">Expected Annual Return (%)</label>
                  <div className="flex items-center bg-emerald-50 rounded-full px-3 py-1">
                    <input 
                      type="number"
                      step="0.1"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}
                      className="bg-transparent border-none text-[#10b77f] font-black text-sm w-12 text-right outline-none focus:ring-0"
                    />
                    <span className="text-[#10b77f] font-black text-sm ml-1">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="0.5"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#10b77f]" 
                />
              </div>
            </div>

            <button className="w-full mt-10 bg-[#10b77f] hover:bg-emerald-600 text-white font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20">
              <Calculator size={20} />
              Calculate Growth
            </button>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl flex gap-4 items-start">
            <Info className="text-[#10b77f] shrink-0" size={20} />
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Based on historic S&P 500 performance. Taxes and inflation are not factored in these estimates.
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              key={results.wealth}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm"
            >
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Estimated Wealth</p>
              <h2 className="text-4xl font-black text-slate-900 mt-2">{formatCurrency(results.wealth)}</h2>
              <div className="flex items-center gap-1 text-[#10b77f] text-sm mt-3 font-bold">
                <TrendingUp size={16} />
                +{formatCurrency(results.profit)} profit
              </div>
            </motion.div>

            <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm">
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Contributions</p>
              <h2 className="text-4xl font-black text-slate-900 mt-2">{formatCurrency(results.principal)}</h2>
              <div className="flex items-center gap-1 text-slate-400 text-sm mt-3 font-bold">
                <DollarSign size={16} />
                Initial + Monthly
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-emerald-50 shadow-sm flex flex-col md:flex-row items-center gap-12">
            <div className="relative size-64 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Returns</span>
                <span className="text-3xl font-black text-slate-900">
                  {Math.round((results.profit / results.wealth) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-8 w-full">
              <h4 className="text-2xl font-black text-slate-900">Growth Distribution</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full bg-slate-400" />
                    <span className="text-slate-600 font-bold">Total Principal</span>
                  </div>
                  <span className="font-black text-slate-900">{formatCurrency(results.principal)}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full bg-[#10b77f]" />
                    <span className="text-emerald-700 font-bold">Estimated Interest</span>
                  </div>
                  <span className="font-black text-[#10b77f]">+{formatCurrency(results.profit)}</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2">
                  <span className="text-slate-900 font-black text-lg">Projected Total</span>
                  <span className="text-3xl font-black text-slate-900">{formatCurrency(results.wealth)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm">
            <h4 className="text-xl font-bold text-slate-900 mb-6">Milestone Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="pb-4">Timeline</th>
                    <th className="pb-4 text-right">Contributions</th>
                    <th className="pb-4 text-right">Total Interest</th>
                    <th className="pb-4 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[5, 15, duration].map((year) => {
                    const monthlyRate = expectedReturn / 100 / 12;
                    const months = year * 12;
                    let wealth = initialInvestment * Math.pow(1 + monthlyRate, months);
                    for (let i = 1; i <= months; i++) wealth += monthlyContribution * Math.pow(1 + monthlyRate, months - i);
                    const principal = initialInvestment + (monthlyContribution * months);
                    return (
                      <tr key={year} className="text-sm">
                        <td className="py-5 text-slate-900 font-bold">{year} Years</td>
                        <td className="py-5 text-right text-slate-500 font-medium">{formatCurrency(principal)}</td>
                        <td className="py-5 text-right text-[#10b77f] font-bold">+{formatCurrency(wealth - principal)}</td>
                        <td className="py-5 text-right font-black text-slate-900">{formatCurrency(wealth)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
