
import React from 'react';
import { Transaction, ImageItem } from '../types';
import { PieChart, TrendingUp, DollarSign, Image as ImageIcon, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  items: ImageItem[];
  wallet: string;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, items, wallet }) => {
  const chartData = [
    { name: 'Mon', volume: 4000 },
    { name: 'Tue', volume: 3000 },
    { name: 'Wed', volume: 2000 },
    { name: 'Thu', volume: 2780 },
    { name: 'Fri', volume: 1890 },
    { name: 'Sat', volume: 2390 },
    { name: 'Sun', volume: 3490 },
  ];

  const totalSales = transactions.filter(t => t.type === 'PURCHASE' && t.status === 'SUCCESS').length;
  const totalVolume = transactions
    .filter(t => t.type === 'PURCHASE' && t.status === 'SUCCESS')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Analytics</h1>
          <p className="text-slate-400">Real-time performance metrics for the Etheron Exchange.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Volume" value={`${totalVolume} ETHO`} icon={DollarSign} trend="+12.5%" />
        <StatCard title="Unique Assets" value={items.length.toString()} icon={ImageIcon} />
        <StatCard title="Active Listings" value={items.filter(i => !i.isSold).length.toString()} icon={Activity} trend="-3.2%" />
        <StatCard title="Total Sales" value={totalSales.toString()} icon={TrendingUp} trend="+4.8%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-8 rounded-[32px] h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Transaction Volume</h3>
            <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="w-full h-full pb-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[32px] flex flex-col">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {transactions.length > 0 ? transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  tx.type === 'PURCHASE' ? 'bg-sky-500/10 text-sky-400' :
                  tx.type === 'MINT' ? 'bg-purple-500/10 text-purple-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {tx.type === 'PURCHASE' ? <ShoppingCart className="w-5 h-5" /> :
                   tx.type === 'MINT' ? <Cpu className="w-5 h-5" /> :
                   <TrendingUp className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{tx.type} Request</p>
                  <p className="text-xs text-slate-500 font-mono truncate">{tx.id}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">{tx.amount > 0 ? `+${tx.amount}` : '0'} ETHO</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">{tx.status}</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center py-10">
                <PieChart className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">No transaction data available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend?: string }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[24px] hover:border-sky-500/30 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:bg-sky-500/10 transition-colors">
        <Icon className="text-slate-400 group-hover:text-sky-400 transition-colors w-6 h-6" />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
          trend.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
        }`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{title}</p>
    <p className="text-2xl font-mono font-bold">{value}</p>
  </div>
);

// Helper Icon
const ShoppingCart = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);

const Cpu = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M15 2v2"/><path d="M9 2v2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 20v2"/><path d="M15 20v2"/><path d="M2 9h2"/><path d="M2 15h2"/>
  </svg>
);

export default Dashboard;
