import React from 'react';
import { useFlixEarnContext } from '../../context/FlixEarnContext';
import { Users, CreditCard, Wallet, Landmark, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminDashboard() {
  const { state } = useFlixEarnContext();

  const totalUsers = state.users.length;
  const totalBalance = state.users.reduce((acc, u) => acc + u.balance, 0);
  const pendingWithdrawals = state.withdrawals.filter(w => w.status === 'pending');
  const totalPendingAmount = pendingWithdrawals.reduce((acc, w) => acc + w.amount, 0);

  const stats = [
    { label: 'Usuários Totais', value: totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Saldo em Contas', value: `R$ ${totalBalance.toLocaleString()}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Saques Pendentes', value: pendingWithdrawals.length, icon: Wallet, color: 'text-[#E50914]', bg: 'bg-[#E50914]/10' },
    { label: 'Gateway ZettPay', value: `R$ ${state.gateway.balance.toLocaleString()}`, icon: Landmark, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Master Control</h1>
        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Administração centralizada do sistema FlixEarn</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0f0f0f] border border-white/10 p-8 rounded-[32px] group hover:border-white/20 transition-all"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
            <p className="text-3xl font-black italic tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[40px] p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-3">
                <Activity className="w-6 h-6 text-[#E50914]" />
                Atividade Recente
              </h2>
              <button className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">Ver Tudo</button>
            </div>
            
            <div className="space-y-4">
              {state.transactions.slice(-5).reverse().map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${t.type === 'reward' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {t.type === 'reward' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t.description}</p>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Usuário: {t.userId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${t.type === 'reward' ? 'text-green-500' : 'text-red-500'}`}>
                      {t.type === 'reward' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                    </p>
                    <p className="text-[9px] font-bold text-white/20 uppercase">{new Date(t.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-900 border border-white/10 rounded-[40px] p-8 relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-xl font-black italic uppercase tracking-tight mb-6">Alerta de Saques</h3>
               <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Volume total pendente</p>
                    <p className="text-3xl font-black text-[#E50914]">R$ {totalPendingAmount.toFixed(2)}</p>
                  </div>
                  <p className="text-xs font-bold text-white/60 leading-relaxed italic">
                    Existem {pendingWithdrawals.length} solicitações aguardando sua revisão manual. Verifique se o saldo do Gateway é suficiente antes de aprovar.
                  </p>
                  <button className="w-full bg-[#E50914] text-white py-4 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-[#b90710] transition-colors mt-4">
                    Resolver Pendências
                  </button>
               </div>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-5">
                <Wallet className="w-40 h-40" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
