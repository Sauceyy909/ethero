
import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ImageItem } from '../types';
import { appraiseImage, generateMetadata } from '../services/geminiService';

interface UploadFormProps {
  onUpload: (item: ImageItem) => void;
  sellerAddress: string;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload, sellerAddress }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPreview(base64);
        
        // Auto-analyze with AI
        setIsAnalyzing(true);
        const metadata = await generateMetadata(base64);
        setName(metadata.name);
        setDescription(metadata.description);
        
        const appraisal = await appraiseImage(base64, metadata.name);
        setAiReport(appraisal);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !price) return;

    const newItem: ImageItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      price,
      imageUrl: preview,
      sellerAddress: sellerAddress,
      createdAt: Date.now(),
      aiAppraisal: aiReport,
      isSold: false
    };

    onUpload(newItem);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-10 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">List New Digital Asset</h1>
          <p className="text-slate-400">Upload your masterpiece and set your asking price in ETHO.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/40 p-8 rounded-3xl border border-slate-800 shadow-xl">
            {/* File Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                preview ? 'border-sky-500/50 bg-sky-500/5' : 'border-slate-800 hover:border-slate-600 hover:bg-slate-800/20'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              
              {preview ? (
                <div className="relative group w-full">
                  <img src={preview} alt="Preview" className="w-full max-h-[300px] object-contain rounded-xl shadow-lg" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(''); }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="text-slate-400 w-8 h-8" />
                  </div>
                  <p className="text-lg font-semibold mb-1">Click to browse images</p>
                  <p className="text-sm text-slate-500">PNG, JPG or WebP (Max 10MB)</p>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Asset Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter art title..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Asking Price (ETHO)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all pr-16"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-400 font-mono font-bold text-sm">ETHO</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell the story behind this asset..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={!file || isAnalyzing}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                !file || isAnalyzing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              List Asset for Sale
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-sky-500/10 rounded-lg flex items-center justify-center">
                <Sparkles className="text-sky-400 w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">AI Appraisal Studio</h2>
            </div>

            <div className="flex-1 space-y-4">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
                  <div className="text-center">
                    <p className="font-bold text-slate-300">Gemini 3.0 Pro Analyzing...</p>
                    <p className="text-sm">Calculating rarity and market value score</p>
                  </div>
                </div>
              ) : preview ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20">
                    <p className="text-sm leading-relaxed text-slate-300 italic">
                      "{aiReport || "Upload an image to start the appraisal process..."}"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Rarity Estimate</p>
                      <p className="text-2xl font-mono font-bold text-sky-400">8.4/10</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Market Sentiment</p>
                      <p className="text-2xl font-mono font-bold text-emerald-400">BULLISH</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center px-6 py-12">
                  <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                  <p>Upload an asset to trigger the high-performance AI appraisal engine.</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/50">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                <p className="text-xs text-indigo-300 leading-normal">
                  <strong>Verification Notice:</strong> All listed items are automatically minted as NFTs upon successful sale and transferred to the system treasury.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
