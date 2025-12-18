
export interface ImageItem {
  id: string;
  name: string;
  description: string;
  price: number; // In ETHO
  imageUrl: string;
  sellerAddress: string;
  createdAt: number;
  aiAppraisal?: string;
  isSold: boolean;
}

export interface Transaction {
  id: string;
  itemId: string;
  amount: number;
  type: 'PURCHASE' | 'MINT' | 'TRANSFER';
  timestamp: number;
  from: string;
  to: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}

export interface UserSettings {
  payoutWallet: string; // The address where they receive funds if they sell
  importedWallet: string; // Their active trading identity/address
  displayName: string;
}

export enum View {
  MARKETPLACE = 'MARKETPLACE',
  UPLOAD = 'UPLOAD',
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS'
}
