export type PlanType = 'Iniciante' | 'Bronze' | 'Prata' | 'Ouro';

export interface User {
  id: string;
  email: string;
  name?: string;
  password?: string;
  balance: number;
  plan: PlanType;
  isAdmin: boolean;
  isBanned?: boolean;
  dailyEarnings: number;
  dailyHoursWatched?: number;
  lastEarningDate: string | null;
  lastWatchDate?: string | null;
  createdAt: string;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  embedUrl: string;
  rewardAmount: number;
  durationSeconds: number;
  category: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  pixKey: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'reward';
  description: string;
  status: 'completed' | 'processing' | 'failed';
  createdAt: string;
}

export interface GatewayState {
  balance: number;
  history: {
    id: string;
    type: 'deposit' | 'withdraw';
    amount: number;
    timestamp: string;
    description: string;
  }[];
}

export interface PlanConfig {
  id: PlanType;
  name: string;
  price: string;
  dailyLimit: number;
  hourlyEarning?: number;
  dailyHoursLimit?: number;
  rewardText: string;
  features: string[];
}

export interface AppState {
  users: User[];
  movies: Movie[];
  withdrawals: Withdrawal[];
  transactions: Transaction[];
  gateway: GatewayState;
  plans?: PlanConfig[];
  currentUser: User | null;
}
