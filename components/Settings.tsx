
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { ETHO_CONTRACT_ADDRESS, SYSTEM_WALLET_ADDRESS } from '../constants';
import { Wallet, ShieldCheck, Cpu, Copy, Check } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
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
    alert('Platform configuration updated successfully.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-10 duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Platform Configuration</h1>
        <p className="text-slate-400">Manage your trading preferences and payout addresses.</p>
      </div>

      <div className="bg-slate-900/40 p-8 rounded-[32px] border border-slate-800 shadow-xl space-y-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
            <input 
              type="text" 
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Payout Wallet Address (Polygon)</label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.payoutWallet}
                onChange={(e) => setFormData(prev => ({ ...prev, payoutWallet: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all font-mono"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400">
                <Wallet className="w-5 h-5 opacity-50" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">All image sales will be automatically settled to this address via the Etheron clearing house.</p>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-white hover:bg-sky-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-white/5 active:scale-95"
          >
            Update Profile & Payout Settings
          </button>
        </form>

        <div className="pt-10 border-t border-slate-800 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <ShieldCheck className="text-sky-400 w-6 h-6" />
            System Protocol Addresses
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                <Cpu className="w-3 h-3" />
                ETHO Contract Address
              </span>
              <div className="flex items-center justify-between">
                <code className="text-xs text-sky-400 break-all">{ETHO_CONTRACT_ADDRESS}</code>
                <button onClick={() => handleCopy(ETHO_CONTRACT_ADDRESS)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  {copied === ETHO_CONTRACT_ADDRESS ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                Treasury / Minting Wallet
              </span>
              <div className="flex items-center justify-between">
                <code className="text-xs text-indigo-400 break-all">{SYSTEM_WALLET_ADDRESS}</code>
                <button onClick={() => handleCopy(SYSTEM_WALLET_ADDRESS)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  {copied === SYSTEM_WALLET_ADDRESS ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[24px] bg-sky-500/5 border border-sky-500/10">
            <h4 className="font-bold text-sky-400 mb-2">Platform Protocol Rules</h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Transactions are processed exclusively in ETHO token on the Polygon Network.</li>
              <li>Every purchase is first routed through the Treasury Wallet for secure clearing.</li>
              <li>Upon transaction finality, images are minted into non-fungible tokens (ERC-721).</li>
              <li>The seller receives the full asking price directly from the Treasury clearing system.</li>
              <li>The minted NFT is archived within the platform's primary storage wallet ({SYSTEM_WALLET_ADDRESS.slice(0, 8)}).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
