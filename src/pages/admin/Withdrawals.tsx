import React from 'react';
import { useFlixEarnContext } from '../../context/FlixEarnContext';
import { CheckCircle2, XCircle, Clock, Search, Filter, Landmark, User, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminWithdrawals() {
  const { state, approveWithdrawal, rejectWithdrawal } = useFlixEarnContext();

  const pendingCount = state.withdrawals.filter(w => w.status === 'pending').length;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Pedidos de Saque</h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Gestão de solicitações de retirada via PIX</p>
        </div>
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 flex items-center gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#E50914] mb-1">Gateway ZettPay</p>
            <p className="text-2xl font-black tabular-nums">R$ {state.gateway.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Pendentes ({pendingCount})</p>
            <p className="text-2xl font-black tabular-nums text-amber-500">
              R$ {state.withdrawals.filter(w => w.status === 'pending').reduce((a,b) => a + b.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                <th className="px-8 py-6">Solicitante</th>
                <th className="px-8 py-6">Valor / PIX</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Data</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {state.withdrawals.slice().reverse().map((w) => {
                const user = state.users.find(u => u.id === w.userId);
                return (
                  <tr key={w.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-white/60">
                          {user?.email[0].toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{user?.email || 'Usuário Excluído'}</p>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-tight">Plano: {user?.plan || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div>
                        <p className="font-black text-lg text-[#E50914] tabular-nums leading-tight">R$ {w.amount.toFixed(2)}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <CreditCard className="w-3 h-3 text-white/20" />
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{w.pixKey}</p>
                        </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                        w.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        w.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {w.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : 
                         w.status === 'rejected' ? <XCircle className="w-3 h-3" /> : 
                         <Clock className="w-3 h-3 animate-pulse" />}
                        {w.status === 'approved' ? 'Aprovado' : w.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-white/40 capitalize">
                         {new Date(w.createdAt).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                         <span className="block opacity-50 font-medium">{new Date(w.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {w.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => {
                              if (window.confirm(`Aprovar pagamento de R$ ${w.amount.toFixed(2)}?`)) approveWithdrawal(w.id);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Aprovar
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('Rejeitar este saque e extornar o saldo?')) rejectWithdrawal(w.id);
                            }}
                            className="bg-zinc-800 hover:bg-red-500 text-white/40 hover:text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                          >
                            <XCircle className="w-4 h-4" />
                            Recusar
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs font-black text-white/10 uppercase tracking-widest italic py-2 pr-4">
                          Processado
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
