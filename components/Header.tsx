
import React from 'react';
import { Wallet, Bell, Search } from 'lucide-react';

interface HeaderProps {
  appName: string;
  wallet: string;
}

const Header: React.FC<HeaderProps> = ({ appName, wallet }) => {
  return (
    <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative group w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search digital assets..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
        </button>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full py-1.5 pl-2 pr-4 shadow-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-none">Connected Wallet</span>
            <span className="text-xs font-mono text-slate-300 font-semibold">{wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
