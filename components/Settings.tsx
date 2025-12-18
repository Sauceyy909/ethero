
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { ETHO_CONTRACT_ADDRESS, SYSTEM_WALLET_ADDRESS } from '../constants';
import { Wallet, ShieldCheck, Cpu, Copy, Check, Info, Zap } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onConnectMetaMask: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, onConnectMetaMask }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    alert('Wallet profile and trade identity updated.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-10 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">IDENTITY PORTAL</h1>
          <p className="text-slate-400 mt-2">Manage your personal trade wallet and asset settlement profile.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Protocol Sync: Ready</span>
        </div>
      </div>

      <div className="bg-slate-900/40 p-10 rounded-[40px] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600"></div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Info className="w-3 h-3" />
                Trader Alias
              </label>
              <input 
                type="text" 
                placeholder="Enter trading handle..."
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-[20px] px-5 py-4 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all font-medium placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Wallet className="w-3 h-3" />
                Personal Trade Wallet
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="0x..."
                    value={formData.importedWallet}
                    onChange={(e) => setFormData(prev => ({ ...prev, importedWallet: e.target.value }))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-[20px] px-5 py-4 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all font-mono text-xs placeholder:text-slate-700"
                    required
                  />
                </div>
                <button 
                  type="button"
                  onClick={onConnectMetaMask}
                  className="bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 px-4 rounded-[20px] flex items-center gap-2 transition-all group"
                  title="Sync with MetaMask"
                >
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase">Sync</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" />
              Settlement Target (Polygon)
            </label>
            <input 
              type="text" 
              placeholder="Address where you receive sales revenue..."
              value={formData.payoutWallet}
              onChange={(e) => setFormData(prev => ({ ...prev, payoutWallet: e.target.value }))}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-[20px] px-5 py-4 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all font-mono text-sm placeholder:text-slate-700"
            />
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest pl-2">
              Note: This address is used for automated clearing of asset trades.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-white hover:bg-sky-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-[20px] transition-all shadow-xl hover:shadow-white/10 active:scale-95"
          >
            Commit Protocol Settings
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-slate-800/50 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black italic flex items-center gap-3 tracking-tight">
              <Cpu className="text-sky-400 w-6 h-6" />
              BACKGROUND TREASURY
            </h3>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Platform Core v1.0</span>
          </div>

          <div className="p-6 rounded-[30px] bg-sky-500/5 border border-sky-500/10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Treasury Clearing Hub</span>
              <div className="flex items-center gap-3">
                <code className="text-sm text-sky-400 font-mono break-all bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                  {SYSTEM_WALLET_ADDRESS}
                </code>
                <button 
                  onClick={() => handleCopy(SYSTEM_WALLET_ADDRESS)} 
                  className="p-3 bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                >
                  {copied === SYSTEM_WALLET_ADDRESS ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="md:w-px h-12 bg-slate-800 hidden md:block"></div>
            <div className="flex-1">
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "All platform deposits flow directly into this secure background treasury to facilitate automated asset minting and clearing."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
