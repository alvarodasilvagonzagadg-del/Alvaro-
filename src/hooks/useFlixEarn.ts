import { useState, useEffect } from 'react';
import { AppState, User, Movie, Withdrawal, Transaction, PlanType, GatewayState, PlanConfig } from '../types';

const STORAGE_KEY = 'flixearn_state';

const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'A Origem',
    posterUrl: 'https://images.unsplash.com/photo-1542204172-3c35b6b10705?w=500&auto=format&fit=crop&q=80',
    embedUrl: 'https://www.youtube.com/embed/R_3f6m0-Fsc',
    rewardAmount: 2.50,
    durationSeconds: 30,
    category: 'Ação'
  },
  {
    id: '2',
    title: 'Interestelar',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    embedUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    rewardAmount: 3.00,
    durationSeconds: 45,
    category: 'Ficção Científica'
  },
  {
    id: '3',
    title: 'The Batman',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop&q=80',
    embedUrl: 'https://www.youtube.com/embed/mqq_H62266s',
    rewardAmount: 4.20,
    durationSeconds: 60,
    category: 'Ação'
  }
];

const INITIAL_STATE: AppState = {
  users: [
    {
      id: 'admin-id',
      email: 'admin@gmail.com',
      password: 'admin',
      balance: 1000,
      plan: 'Ouro',
      isAdmin: true,
      dailyEarnings: 0,
      dailyHoursWatched: 0,
      lastEarningDate: null,
      lastWatchDate: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dev-user',
      email: 'alvarodasilvagonzagadg@gmail.com',
      balance: 1500,
      plan: 'Ouro',
      isAdmin: true,
      dailyEarnings: 0,
      dailyHoursWatched: 0,
      lastEarningDate: null,
      lastWatchDate: null,
      createdAt: new Date().toISOString()
    }
  ],
  movies: INITIAL_MOVIES,
  withdrawals: [],
  transactions: [],
  gateway: {
    balance: 5000,
    history: []
  },
  plans: [
    {
      id: 'Iniciante',
      name: 'INICIANTE',
      price: '10',
      dailyLimit: 30.00,
      hourlyEarning: 1.00,
      dailyHoursLimit: 1,
      rewardText: 'Ganho mensal R$ 30,00',
      features: ['R$ 1,00 por hora', '1 hora por dia', 'Suporte prioritário']
    },
    {
      id: 'Bronze',
      name: 'BRONZE',
      price: '20',
      dailyLimit: 120.00,
      hourlyEarning: 2.00,
      dailyHoursLimit: 2,
      rewardText: 'Ganho mensal R$ 120,00',
      features: ['R$ 2,00 por hora', '2 horas por dia', 'Suporte VIP']
    },
    {
      id: 'Prata',
      name: 'PRATA',
      price: '30',
      dailyLimit: 360.00,
      hourlyEarning: 4.00,
      dailyHoursLimit: 3,
      rewardText: 'Ganho mensal R$ 360,00',
      features: ['R$ 4,00 por hora', '3 horas por dia', 'Suporte Gold']
    },
    {
      id: 'Ouro',
      name: 'OURO',
      price: '50',
      dailyLimit: 600.00,
      hourlyEarning: 5.00,
      dailyHoursLimit: 4,
      rewardText: 'Ganho mensal R$ 600,00',
      features: ['R$ 5,00 por hora', '4 horas por dia', 'Gerente exclusivo']
    }
  ],
  currentUser: null
};

export function useFlixEarn() {
  const [state, setState] = useState<AppState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let parsedState: AppState;
    
    try {
      parsedState = stored ? JSON.parse(stored) : INITIAL_STATE;
      // Ensure basic structure exists
      if (!parsedState || !Array.isArray(parsedState.users)) {
        parsedState = INITIAL_STATE;
      }
    } catch (e) {
      console.error('Failed to parse state:', e);
      parsedState = INITIAL_STATE;
    }
    
    // Force plans if they don't exist in saved state
    if (!parsedState.plans || (Array.isArray(parsedState.plans) && parsedState.plans.length === 0)) {
      parsedState.plans = INITIAL_STATE.plans;
    } else {
      // Merge with initial state to ensure new properties like hourlyEarning exist
      parsedState.plans = parsedState.plans.map(p => {
        const found = INITIAL_STATE.plans?.find(ip => ip.id === p.id);
        if (found) {
          return {
            ...found,
            ...p
          };
        }
        return p;
      });
    }
    
    // Force admin for specific emails to ensure the user doesn't get locked out
    // for having an old state in localStorage.
    const devEmails = ['admin@gmail.com', 'alvarodasilvagonzagadg@gmail.com', 'admin@flixearn.com'];
    
    const updatedUsers = (parsedState.users || []).map(u => {
      let updatedUser = { ...u };
      if (devEmails.includes(u.email)) {
        updatedUser.isAdmin = true;
        updatedUser.isBanned = false; // Never ban admins
      }
      if (updatedUser.isBanned === undefined) {
        updatedUser.isBanned = false;
      }
      return updatedUser;
    });

    // If currentUser is one of these, update it too
    let updatedCurrentUser = parsedState.currentUser;
    if (updatedCurrentUser) {
      if (devEmails.includes(updatedCurrentUser.email)) {
        updatedCurrentUser = { ...updatedCurrentUser, isAdmin: true, isBanned: false };
      }
      if (updatedCurrentUser.isBanned === undefined) {
        updatedCurrentUser.isBanned = false;
      }
    }

    return {
      ...parsedState,
      users: updatedUsers,
      currentUser: updatedCurrentUser
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.currentUser?.isBanned) {
      alert('Sua conta foi suspensa por violação dos termos.');
      logout();
    }
  }, [state.currentUser?.isBanned]);

  const login = (email: string, pass: string) => {
    // Special case for dev/admin emails: Ensure they exist
    const devEmails = ['admin@gmail.com', 'alvarodasilvagonzagadg@gmail.com', 'admin@flixearn.com'];
    const isDevEmail = devEmails.includes(email.toLowerCase());
    
    let user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // If it's a dev email and doesn't exist, create it
    if (isDevEmail && !user) {
      const newUser: User = {
        id: 'admin-id-' + Math.random().toString(36).substr(2, 5),
        name: email.split('@')[0],
        email: email.toLowerCase(),
        password: pass, // Accept the password they just used
        balance: 100,
        plan: 'Ouro',
        isAdmin: true,
        isBanned: false,
        dailyEarnings: 0,
        lastEarningDate: null,
        createdAt: new Date().toISOString()
      };
      setState(prev => ({
        ...prev,
        users: [...prev.users, newUser]
      }));
      user = newUser;
    }

    if (user) {
      // If it's a dev email and password doesn't match, update it to let them in
      if (isDevEmail && user.password !== pass) {
        user = { ...user, password: pass };
        // We will update the state during the success path below
      }

      if (user.password === pass) {
        if (user.isBanned && !isDevEmail) {
          alert('Sua conta foi suspensa por violação dos termos.');
          return false;
        }
        
        const finalUser = { 
          ...user, 
          isAdmin: isDevEmail || user.isAdmin,
          isBanned: isDevEmail ? false : user.isBanned
        };
        
        setState(prev => ({ 
          ...prev, 
          currentUser: finalUser,
          users: prev.users.map(u => u.id === finalUser.id ? finalUser : u)
        }));
        return true;
      }
    }
    
    if (!user) {
      alert('Usuário não encontrado. Verifique o e-mail ou crie uma conta.');
    } else {
      alert('Senha incorreta. Tente novamente.');
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const register = (email: string, pass: string) => {
    if (state.users.some(u => u.email === email)) return false;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password: pass,
      balance: 0,
      plan: 'Iniciante',
      isAdmin: false,
      isBanned: false,
      dailyEarnings: 0,
      dailyHoursWatched: 0,
      lastEarningDate: null,
      lastWatchDate: null,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser
    }));
    return true;
  };

  const recoverPassword = (email: string) => {
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      // In a real app, we'd send an email. Here we'll just simulate it.
      alert(`Um link de recuperação foi enviado para ${email} (Simulação)`);
      return true;
    }
    alert('E-mail não encontrado em nossa base de dados.');
    return false;
  };

  const calculateMovieReward = (movie: Movie) => {
    if (!state.currentUser) return movie.rewardAmount;
    const planConfig = state.plans?.find(p => p.id === state.currentUser?.plan);
    if (planConfig?.hourlyEarning) {
      // Calculate reward based on hourly rate: (seconds / 3600) * hourlyRate
      return (movie.durationSeconds / 3600) * planConfig.hourlyEarning;
    }
    return movie.rewardAmount;
  };

  const addEarning = (amount: number, movieDurationSeconds?: number) => {
    if (!state.currentUser) return;
    
    // Check daily limit based on plan from state
    const planConfig = state.plans?.find(p => p.id === state.currentUser?.plan);
    const limit = 9999999; // Effectively removed daily money limit
    const hoursLimit = planConfig?.dailyHoursLimit ?? 2;
    
    const today = new Date().toDateString();
    
    // Reset daily limits if new day
    let dailyEarnings = state.currentUser.dailyEarnings;
    if (state.currentUser.lastEarningDate !== today) {
      dailyEarnings = 0;
    }

    let dailyHours = state.currentUser.dailyHoursWatched || 0;
    if (state.currentUser.lastWatchDate !== today) {
      dailyHours = 0;
    }

    // Check hours limit (approximate if duration provided)
    if (movieDurationSeconds) {
      const addedHours = movieDurationSeconds / 3600;
      if (dailyHours + addedHours > hoursLimit) {
        alert(`Limite de horas diárias (${hoursLimit}h) atingido!`);
        return false;
      }
      dailyHours += addedHours;
    }

    const updatedUser: User = {
      ...state.currentUser,
      balance: state.currentUser.balance + amount,
      dailyEarnings: dailyEarnings + amount,
      dailyHoursWatched: dailyHours,
      lastEarningDate: today,
      lastWatchDate: today
    };

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.currentUser.id,
      amount,
      type: 'reward',
      description: 'Recompensa por assistir vídeo',
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      currentUser: updatedUser,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u),
      transactions: [...prev.transactions, newTransaction]
    }));
    return true;
  };

  const requestWithdrawal = (amount: number, pixKey: string) => {
    if (!state.currentUser || state.currentUser.balance < amount) return false;

    const newWithdrawal: Withdrawal = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.currentUser.id,
      amount,
      pixKey,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedUser = {
      ...state.currentUser,
      balance: state.currentUser.balance - amount
    };

    setState(prev => ({
      ...prev,
      currentUser: updatedUser,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u),
      withdrawals: [...prev.withdrawals, newWithdrawal]
    }));
    return true;
  };

  // Admin actions
  const updateMovie = (movie: Movie) => {
    setState(prev => ({
      ...prev,
      movies: prev.movies.map(m => m.id === movie.id ? movie : m)
    }));
  };

  const addMovie = (movie: Omit<Movie, 'id'>) => {
    const newMovie = { ...movie, id: Math.random().toString(36).substr(2, 9) };
    setState(prev => ({
      ...prev,
      movies: [...prev.movies, newMovie]
    }));
  };

  const deleteMovie = (id: string) => {
    setState(prev => ({
      ...prev,
      movies: prev.movies.filter(m => m.id !== id)
    }));
  };

  const updateUserBalance = (userId: string, newBalance: number) => {
    adminUpdateUser(userId, { balance: newBalance });
  };

  const updateUserPlan = (userId: string, plan: PlanType) => {
    adminUpdateUser(userId, { plan });
  };

  const adminUpdateUser = (userId: string, data: Partial<User>) => {
    console.log(`[adminUpdateUser] Updating user ${userId}`, data);
    setState(prev => {
      const userToUpdate = prev.users.find(u => u.id === userId);
      if (!userToUpdate) {
        console.error('[adminUpdateUser] User not found:', userId);
        return prev;
      }

      const updatedUser = { ...userToUpdate, ...data };
      const updatedUsers = prev.users.map(u => u.id === userId ? updatedUser : u);
      
      const isCurrentUser = prev.currentUser?.id === userId;
      let updatedCurrentUser = prev.currentUser;
      
      if (isCurrentUser) {
        updatedCurrentUser = { ...prev.currentUser!, ...data };
        console.log('[adminUpdateUser] Updated current user as well');
      }

      const newTransactions = [...prev.transactions];

      // If balance is being updated, add a transaction record
      if (data.balance !== undefined && data.balance !== userToUpdate.balance) {
        newTransactions.push({
          id: Math.random().toString(36).substr(2, 9),
          userId: userId,
          amount: Math.abs(data.balance - userToUpdate.balance),
          type: data.balance > userToUpdate.balance ? 'reward' : 'reward',
          description: `Ajuste administrativo de saldo: R$ ${data.balance.toFixed(2)}`,
          status: 'completed',
          createdAt: new Date().toISOString()
        });
      }

      console.log('[adminUpdateUser] State update scheduled');
      return {
        ...prev,
        users: updatedUsers,
        currentUser: updatedCurrentUser,
        transactions: newTransactions
      };
    });
  };

  const approveWithdrawal = (id: string) => {
    const withdrawal = state.withdrawals.find(w => w.id === id);
    if (!withdrawal || withdrawal.status !== 'pending') return;

    if (state.gateway.balance < withdrawal.amount) {
      alert("Saldo insuficiente no Gateway (Caixa)!");
      return;
    }

    setState(prev => ({
      ...prev,
      withdrawals: prev.withdrawals.map(w => w.id === id ? { ...w, status: 'approved' } : w),
      gateway: {
        ...prev.gateway,
        balance: prev.gateway.balance - withdrawal.amount,
        history: [...prev.gateway.history, {
          id: `CAIXA-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          type: 'withdraw',
          amount: withdrawal.amount,
          timestamp: new Date().toISOString(),
          description: `Pagamento de saque PIX para user ${withdrawal.userId}`
        }]
      }
    }));
  };

  const rejectWithdrawal = (id: string) => {
    const withdrawal = state.withdrawals.find(w => w.id === id);
    if (!withdrawal || withdrawal.status !== 'pending') return;

    // Refund user
    const user = state.users.find(u => u.id === withdrawal.userId);
    if (user) {
      setState(prev => ({
        ...prev,
        withdrawals: prev.withdrawals.map(w => w.id === id ? { ...w, status: 'rejected' } : w),
        users: prev.users.map(u => u.id === user.id ? { ...u, balance: u.balance + withdrawal.amount } : u),
        currentUser: prev.currentUser?.id === user.id ? { ...prev.currentUser, balance: prev.currentUser.balance + withdrawal.amount } : prev.currentUser
      }));
    }
  };

  const depositToGateway = (amount: number) => {
     setState(prev => ({
      ...prev,
      gateway: {
        ...prev.gateway,
        balance: prev.gateway.balance + amount,
        history: [...prev.gateway.history, {
          id: `CAIXA-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          type: 'deposit',
          amount,
          timestamp: new Date().toISOString(),
          description: 'Depósito administrativo no caixa'
        }]
      }
    }));
  };

  const deleteUser = (userId: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId),
      withdrawals: prev.withdrawals.filter(w => w.userId !== userId),
      transactions: prev.transactions.filter(t => t.userId !== userId)
    }));
  };

  const addPlanConfig = (config: PlanConfig) => {
    setState(prev => ({
      ...prev,
      plans: [...(prev.plans || []), config]
    }));
  };

  const deletePlanConfig = (id: string) => {
    setState(prev => ({
      ...prev,
      plans: (prev.plans || []).filter(p => p.id !== id)
    }));
  };

  const updatePlanConfig = (config: PlanConfig) => {
    setState(prev => ({
      ...prev,
      plans: prev.plans?.map(p => p.id === config.id ? config : p)
    }));
  };

  return {
    state,
    login,
    logout,
    register,
    recoverPassword,
    addEarning,
    requestWithdrawal,
    updateMovie,
    addMovie,
    deleteMovie,
    updateUserBalance,
    updateUserPlan,
    adminUpdateUser,
    approveWithdrawal,
    rejectWithdrawal,
    depositToGateway,
    deleteUser,
    addPlanConfig,
    deletePlanConfig,
    updatePlanConfig,
    calculateMovieReward
  };
}
