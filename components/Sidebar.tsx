
import React from 'react';
import { View } from '../types';
import { LayoutGrid, Upload, PieChart, Settings, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: View.MARKETPLACE, label: 'Marketplace', icon: LayoutGrid },
    { id: View.UPLOAD, label: 'List Image', icon: Upload },
    { id: View.DASHBOARD, label: 'Analytics', icon: PieChart },
    { id: View.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 hidden lg:flex flex-col bg-slate-950">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-sky-900/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          ETHERON
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-inner shadow-sky-500/5'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl glass border-slate-800/50">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Network Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Polygon Mainnet</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
