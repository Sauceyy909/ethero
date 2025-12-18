
import React from 'react';
import { ImageItem, View } from '../types';
import { ShoppingCart, Cpu, Info, Plus } from 'lucide-react';

interface MarketplaceProps {
  items: ImageItem[];
  onBuy: (item: ImageItem) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ items, onBuy }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight italic">IMAGE EXCHANGE</h1>
          <p className="text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Live Professional Trading Floor • <span className="text-sky-400 font-mono">Polygon Network</span>
          </p>
        </div>
        
        <div className="flex gap-3 bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
           <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 border-r border-slate-800">
             Protocol 1.0
           </div>
           <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-sky-400">
             Settlement: Automated
           </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-800 rounded-[40px] bg-slate-900/10">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
            <Plus className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No active listings</h2>
          <p className="text-slate-500 max-w-sm text-center mb-8">
            Be the first to list a high-quality digital asset on the Etheron professional exchange.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative flex flex-col bg-slate-900/30 rounded-[32px] overflow-hidden border border-slate-800 hover:border-sky-500/50 transition-all duration-300 shadow-xl hover:shadow-sky-500/5">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                
                {item.isSold && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-slate-950/60 flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                       <div className="px-6 py-2 bg-red-500 text-white font-black text-sm rounded-full shadow-2xl border-2 border-white/20 mb-2">
                        VAULT SECURED
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Minted to Treasury</span>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 left-4">
                  <span className="bg-slate-950/80 backdrop-blur-xl border border-white/10 text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest">
                    #{item.id.slice(0, 4).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-xl tracking-tight leading-tight group-hover:text-sky-400 transition-colors uppercase">{item.name}</h3>
                  <div className="flex items-center gap-1.5 text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                    <span className="font-mono text-sm font-black">{item.price}</span>
                    <span className="text-[10px] font-bold">ETHO</span>
                  </div>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 mb-6 min-h-[40px] leading-relaxed">
                  {item.description}
                </p>

                {item.aiAppraisal && (
                  <div className="mb-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed relative">
                    <div className="absolute -top-2 left-4 px-2 bg-slate-900 border border-slate-800 text-sky-500 text-[8px] font-black uppercase tracking-widest">
                      Gemini Appraisal
                    </div>
                    {item.aiAppraisal}
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-[10px] font-black border border-slate-700">
                      {item.sellerAddress.slice(2, 4).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Seller</span>
                      <span className="text-xs text-slate-300 font-mono">{item.sellerAddress.slice(0, 6)}...{item.sellerAddress.slice(-4)}</span>
                    </div>
                  </div>
                  
                  {!item.isSold && (
                    <button 
                      onClick={() => onBuy(item)}
                      className="flex items-center gap-2 bg-white hover:bg-sky-400 text-black px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
                    >
                      Trade
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Protocol Explanation Footer */}
      <div className="mt-16 bg-slate-900/20 border border-slate-800 p-10 rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div>
            <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Info className="text-sky-400 w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold mb-4">Etheron Protocol</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              A high-performance trading platform built on Polygon. We use an automated treasury system to ensure instant settlement between buyers and sellers while archiving every trade as a minted NFT in the system vault.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Cpu className="text-indigo-400 w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold mb-4">The ETHO Token</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              ETHO is our specialized asset-class token. It facilitates seamless value transfer with negligible gas costs. All platform interactions are denominated in ETHO to maintain a stable digital art economy.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="p-6 bg-slate-950 rounded-[24px] border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-4">Network Connectivity</span>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Mainnet Status</span>
                  <span className="text-xs text-emerald-400 font-bold">OPERATIONAL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Block Time</span>
                  <span className="text-xs text-slate-300 font-mono">2.1s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Treasury Vault</span>
                  <span className="text-xs text-sky-400 font-mono">SECURED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
