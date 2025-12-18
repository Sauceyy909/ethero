
import React, { useState, useEffect, useCallback } from 'react';
import { View, ImageItem, Transaction, UserSettings } from './types';
import { ETHO_CONTRACT_ADDRESS, SYSTEM_WALLET_ADDRESS, APP_NAME } from './constants';
import Marketplace from './components/Marketplace';
import UploadForm from './components/UploadForm';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TransactionModal from './components/TransactionModal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.MARKETPLACE);
  const [items, setItems] = useState<ImageItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('etheron_settings');
    return saved ? JSON.parse(saved) : {
      payoutWallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      displayName: "Etheron Trader"
    };
  });
  const [pendingTx, setPendingTx] = useState<Transaction | null>(null);

  // Load persistent data
  useEffect(() => {
    const savedItems = localStorage.getItem('etheron_items');
    const savedTxs = localStorage.getItem('etheron_transactions');
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedTxs) setTransactions(JSON.parse(savedTxs));
  }, []);

  // Save persistent data
  useEffect(() => {
    localStorage.setItem('etheron_items', JSON.stringify(items));
    localStorage.setItem('etheron_transactions', JSON.stringify(transactions));
    localStorage.setItem('etheron_settings', JSON.stringify(userSettings));
  }, [items, transactions, userSettings]);

  const handleUpload = (newItem: ImageItem) => {
    setItems(prev => [newItem, ...prev]);
    setCurrentView(View.MARKETPLACE);
  };

  const handleBuy = useCallback((item: ImageItem) => {
    const tx: Transaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      itemId: item.id,
      amount: item.price,
      type: 'PURCHASE',
      timestamp: Date.now(),
      from: '0xBUYER_WALLET_PROXIED',
      to: SYSTEM_WALLET_ADDRESS,
      status: 'PENDING'
    };
    setPendingTx(tx);
  }, []);

  const confirmTransaction = async () => {
    if (!pendingTx) return;

    // Simulation of the 3-step blockchain protocol
    const item = items.find(i => i.id === pendingTx.itemId);
    if (!item) return;

    // Step 1: System pays Seller from Treasury
    const sellerPayment: Transaction = {
      id: `payout-${pendingTx.id}`,
      itemId: item.id,
      amount: item.price,
      type: 'TRANSFER',
      timestamp: Date.now(),
      from: SYSTEM_WALLET_ADDRESS,
      to: item.sellerAddress,
      status: 'SUCCESS'
    };

    // Step 2: Minting NFT to System Treasury
    const mintTx: Transaction = {
      id: `mint-${pendingTx.id}`,
      itemId: item.id,
      amount: 0,
      type: 'MINT',
      timestamp: Date.now(),
      from: '0x0000...0000',
      to: SYSTEM_WALLET_ADDRESS,
      status: 'SUCCESS'
    };

    setTransactions(prev => [mintTx, sellerPayment, { ...pendingTx, status: 'SUCCESS' }, ...prev]);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isSold: true } : i));
    setPendingTx(null);
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 selection:bg-sky-500/30">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col">
        <Header appName={APP_NAME} wallet={userSettings.payoutWallet} />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {currentView === View.MARKETPLACE && (
            <Marketplace items={items} onBuy={handleBuy} />
          )}
          {currentView === View.UPLOAD && (
            <UploadForm onUpload={handleUpload} sellerAddress={userSettings.payoutWallet} />
          )}
          {currentView === View.DASHBOARD && (
            <Dashboard transactions={transactions} items={items} wallet={userSettings.payoutWallet} />
          )}
          {currentView === View.SETTINGS && (
            <Settings settings={userSettings} onSave={setUserSettings} />
          )}
        </div>
      </main>

      {pendingTx && (
        <TransactionModal 
          tx={pendingTx} 
          onConfirm={confirmTransaction} 
          onCancel={() => setPendingTx(null)} 
        />
      )}
    </div>
  );
};

export default App;
