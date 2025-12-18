
import React, { useState } from 'react';
import { Transaction } from '../types';
import { ETHO_CONTRACT_ADDRESS, SYSTEM_WALLET_ADDRESS } from '../constants';
// Added 'Info' to the imports to fix the missing component error
import { CheckCircle2, Loader2, ExternalLink, ShieldAlert, Cpu, ShoppingCart, ArrowRight, Wallet, Info } from 'lucide-react';

interface TransactionModalProps {
  tx: Transaction;
  onConfirm: () => void;
  onCancel: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ tx, onConfirm, onCancel }) => {
  const [step, setStep] = useState<'CONFIRM' | 'PROCESSING' | 'SUCCESS'>('CONFIRM');

  const handleProcess = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      onConfirm();
      setStep('SUCCESS');
    }, 4500); // Simulated time for multi-step settlement
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={step === 'CONFIRM' ? onCancel : undefined}></div>
      
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-10">
          {step === 'CONFIRM' && (
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-sky-500/10 rounded-3xl flex items-center justify-center text-sky-400 border border-sky-500/20">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black italic tracking-tight">SETTLEMENT REVIEW</h3>
                  <p className="text-slate-400">Execute asset acquisition via imported wallet.</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="bg-slate-950 rounded-3xl p-8 border border-slate-800 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Protocol Deposit</span>
                    <span className="font-mono font-black text-2xl text-sky-400">{tx.amount} ETHO</span>
                  </div>
                  
                  <div className="flex flex-col gap-4 py-6 border-y border-slate-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1.5">
                          <Wallet className="w-3 h-3 text-sky-500" />
                          Source Identity
                        </span>
                        <code className="text-xs text-slate-300 font-mono">{tx.from.slice(0, 10)}...{tx.from.slice(-6)}</code>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-700 mx-4" />
                      <div className="flex flex-col text-right">
                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1.5 justify-end">
                          Target Treasury
                          <ShieldAlert className="w-3 h-3 text-indigo-400" />
                        </span>
                        <code className="text-xs text-indigo-400 font-mono">{SYSTEM_WALLET_ADDRESS.slice(0, 10)}...</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-black text-xs uppercase tracking-widest">Final Commitment</span>
                    <div className="flex flex-col items-end">
                      <span className="text-3xl font-mono font-black text-white">{tx.amount} ETHO</span>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Straight to Treasury Wallet</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info icon is used here, previously missing from imports */}
              <div className="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/20 flex gap-4">
                <Info className="w-6 h-6 text-sky-400 shrink-0" />
                <p className="text-[10px] text-sky-300 leading-relaxed uppercase font-bold tracking-wider">
                  Funds will be deposited directly to the background treasury hub for immediate trade clearing and archival minting.
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={onCancel}
                  className="flex-1 py-5 rounded-2xl font-black text-slate-400 hover:text-white hover:bg-slate-800 transition-all uppercase tracking-widest text-[10px]"
                >
                  Decline
                </button>
                <button 
                  onClick={handleProcess}
                  className="flex-[2] py-5 rounded-2xl font-black bg-white hover:bg-sky-400 text-black shadow-xl transition-all uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Authorize Settlement
                </button>
              </div>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="py-20 flex flex-col items-center justify-center space-y-10">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500/30 blur-3xl rounded-full animate-pulse"></div>
                <Loader2 className="w-24 h-24 text-sky-500 animate-spin relative z-10" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black italic tracking-tight">SETTLING DEPOSIT</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-slate-400 text-sm animate-pulse flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                    Routing ETHO to Treasury Hub...
                  </p>
                  <p className="text-slate-400 text-sm opacity-50 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                    Validating System Wallet Receipt...
                  </p>
                  <p className="text-slate-400 text-sm opacity-50 flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                    Minting Archival ERC-721...
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-sm">
                <div className="h-full bg-sky-500 animate-progress"></div>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/20 mb-4">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-4xl font-black italic mb-3">DEPOSIT VERIFIED</h3>
                <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">Funds successfully deposited to Treasury Wallet. NFT generated and archived.</p>
              </div>
              
              <div className="w-full grid grid-cols-1 gap-4 pt-6">
                <div className="p-6 bg-slate-950 rounded-[30px] border border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Protocol Finality</span>
                    <span className="text-[10px] text-emerald-400 font-black tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">SECURED</span>
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Treasury Rx:</span>
                      <span className="text-sky-400">0x8a1...f3e9</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Direct Deposit:</span>
                      <span className="text-emerald-400">COMPLETED</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Vault ID:</span>
                      <span className="text-indigo-400">ETHON-#{Math.floor(Math.random()*999)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={onCancel}
                className="w-full py-5 bg-white hover:bg-sky-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl"
              >
                Close Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
