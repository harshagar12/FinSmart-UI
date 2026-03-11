import React, { useState } from 'react';
import { TrendingUp, Calculator, MessageSquare, BookOpen, ArrowRight, Wallet, DollarSign, PiggyBank, CreditCard, Receipt, Target, Sparkles, Activity as ActivityIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import type { View } from '../types';

interface HomeViewProps {
  onNavigate: (view: View) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [salary, setSalary] = useState<string>('');
  const [emi, setEmi] = useState<string>('');
  const [savings, setSavings] = useState<string>('');
  const [expenses, setExpenses] = useState<string>('');
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const tools = [
    { id: 'calculator', title: 'Calculator', desc: 'Compute returns & yields', icon: Calculator, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'chat', title: 'AI Chat', desc: 'Ask financial questions', icon: MessageSquare, color: 'bg-blue-50 text-blue-600' },
    { id: 'simulator', title: 'Simulator', desc: 'Trade with paper money', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'dashboard', title: 'Market Data', desc: 'Live asset tracking', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = parseFloat(salary) || 0;
    const em = parseFloat(emi) || 0;
    const sv = parseFloat(savings) || 0;
    const ex = parseFloat(expenses) || 0;

    const disposable = s - (em + ex);
    const disposablePercent = (disposable / s) * 100;

    let result = "";
    if (s === 0) {
      result = "Please enter your salary to get a suggestion.";
    } else if (disposable < 0) {
      result = "Focus on debt management and reducing expenses before trading. Your current obligations exceed your income.";
    } else if (disposablePercent > 30 && sv > (ex * 6)) {
      result = "Your Affordability DNA is strong! You can explore High-Growth Trading (Options or Crypto) with 10% of your disposable income.";
    } else if (disposablePercent > 15) {
      result = "Moderate Risk Profile. Consider Swing Trading in Blue-chip Stocks or Major Indices (S&P 500/Nasdaq).";
    } else {
      result = "Conservative Profile. Focus on Long-term Wealth Building via ETFs and Mutual Funds while building more liquid savings.";
    }
    setSuggestion(result);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-16">
      {/* Affordability DNA Section - Redesigned for Elegance and Clarity */}
      <section className="bg-white rounded-[2.5rem] border border-emerald-50 shadow-xl shadow-emerald-900/5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Input Form */}
          <div className="p-8 lg:p-12 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-[#10b77f] rounded-full" />
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Affordability DNA</h2>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed max-w-md">
                Understand your financial capacity and discover the trading strategies that align with your lifestyle.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { label: 'Monthly Salary', value: salary, setter: setSalary, icon: Wallet, placeholder: 'e.g. 5000' },
                  { label: 'Existing EMI', value: emi, setter: setEmi, icon: CreditCard, placeholder: 'e.g. 800' },
                  { label: 'Total Savings', value: savings, setter: setSavings, icon: PiggyBank, placeholder: 'e.g. 25000' },
                  { label: 'Monthly Expenses', value: expenses, setter: setExpenses, icon: Receipt, placeholder: 'e.g. 1200' },
                ].map((field) => (
                  <div key={field.label} className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <field.icon size={16} />
                      <label className="text-xs font-bold uppercase tracking-widest">{field.label}</label>
                    </div>
                    <input 
                      type="number" 
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-lg font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              <button 
                type="submit"
                className="w-full bg-[#10b77f] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3"
              >
                <Target size={20} />
                Analyze My Profile
              </button>
            </form>
          </div>

          {/* Right: Result Display */}
          <div className="bg-emerald-50/30 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden border-l border-emerald-50">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Sparkles size={240} className="text-[#10b77f]" />
            </div>

            <AnimatePresence mode="wait">
              {suggestion ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 relative z-10"
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-[#10b77f] rounded-full text-[10px] font-black uppercase tracking-widest">
                      <Sparkles size={12} />
                      Your Strategy
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      Personalized <br />
                      <span className="text-[#10b77f]">Recommendation</span>
                    </h3>
                  </div>

                  <div className="p-8 bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 relative">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10b77f] rounded-l-full" />
                    <p className="text-slate-600 font-bold leading-relaxed text-xl italic">
                      "{suggestion}"
                    </p>
                  </div>

                  <button 
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center gap-3 text-[#10b77f] font-black text-sm uppercase tracking-widest hover:gap-5 transition-all group"
                  >
                    Explore Live Markets
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="size-24 rounded-[2rem] bg-white shadow-lg shadow-emerald-900/5 border border-emerald-50 flex items-center justify-center mx-auto">
                    <TrendingUp size={40} className="text-emerald-100" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-400">Ready for Analysis</h3>
                    <p className="text-sm text-slate-400 font-medium max-w-[240px] mx-auto leading-relaxed">
                      Enter your financial details to receive a tailored trading strategy.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#10b77f] rounded-full" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Smart Tools</h2>
        </div>
        
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, idx) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              onClick={() => onNavigate(tool.id as View)}
              className="group p-6 bg-white rounded-3xl border border-emerald-50 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer"
            >
              <div className={cn("size-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300", tool.color)}>
                <tool.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
            </motion.div>
          ))}
        </section>
      </div>

      {/* Footer */}
      <footer className="pt-12 pb-8 border-t border-emerald-50 text-center space-y-6">
        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-[#10b77f] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#10b77f] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#10b77f] transition-colors">Contact Us</a>
        </div>
        <p className="text-xs text-slate-400">© 2024 FinSmart. All rights reserved.</p>
      </footer>
    </div>
  );
}
