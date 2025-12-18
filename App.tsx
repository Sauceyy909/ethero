
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
      payoutWallet: "",
      importedWallet: "",
      displayName: "Anonymous Trader"
    };
  });
  const [pendingTx, setPendingTx] = useState<Transaction | null>(null);

  // MetaMask Connection Logic
  const connectMetaMask = useCallback(async () => {
    // Cast window to any to access the ethereum provider injected by MetaMask
    const ethereum = (window as any).ethereum;
    if (typeof ethereum !== 'undefined') {
      try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          setUserSettings(prev => ({
            ...prev,
            importedWallet: accounts[0]
          }));
        }
      } catch (error) {
        console.error("User rejected MetaMask connection", error);
      }
    } else {
      alert("MetaMask not detected. Please install the extension or enter your wallet manually in Settings.");
    }
  }, []);

  // Sync with MetaMask changes
  useEffect(() => {
    // Cast window to any to access the ethereum provider injected by MetaMask
    const ethereum = (window as any).ethereum;
    if (typeof ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setUserSettings(prev => ({ ...prev, importedWallet: accounts[0] }));
        } else {
          setUserSettings(prev => ({ ...prev, importedWallet: "" }));
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

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
    if (!userSettings.importedWallet) {
      alert("Please connect MetaMask or import your wallet in Settings before trading.");
      setCurrentView(View.SETTINGS);
      return;
    }

    const tx: Transaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      itemId: item.id,
      amount: item.price,
      type: 'PURCHASE',
      timestamp: Date.now(),
      from: userSettings.importedWallet,
      to: SYSTEM_WALLET_ADDRESS,
      status: 'PENDING'
    };
    setPendingTx(tx);
  }, [userSettings.importedWallet]);

  const confirmTransaction = async () => {
    if (!pendingTx) return;

    const item = items.find(i => i.id === pendingTx.itemId);
    if (!item) return;

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

    setTransactions(prev => [mintTx, { ...pendingTx, status: 'SUCCESS' }, ...prev]);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isSold: true } : i));
    setPendingTx(null);
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 selection:bg-sky-500/30">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col">
        <Header 
          appName={APP_NAME} 
          wallet={userSettings.importedWallet} 
          onImportClick={connectMetaMask}
        />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {currentView === View.MARKETPLACE && (
            <Marketplace items={items} onBuy={handleBuy} />
          )}
          {currentView === View.UPLOAD && (
            <UploadForm 
              onUpload={handleUpload} 
              sellerAddress={userSettings.payoutWallet || userSettings.importedWallet} 
            />
          )}
          {currentView === View.DASHBOARD && (
            <Dashboard 
              transactions={transactions} 
              items={items} 
              wallet={userSettings.importedWallet} 
            />
          )}
          {currentView === View.SETTINGS && (
            <Settings settings={userSettings} onSave={setUserSettings} onConnectMetaMask={connectMetaMask} />
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
