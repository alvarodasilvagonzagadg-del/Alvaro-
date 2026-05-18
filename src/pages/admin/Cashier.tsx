import React, { useState } from 'react';
import { useFlixEarnContext } from '../../context/FlixEarnContext';
import { Landmark, ArrowUpCircle, ArrowDownCircle, History, TrendingUp, DollarSign, Wallet, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminCashier() {
  const { state, depositToGateway } = useFlixEarnContext();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    
    setIsLoading(true);
    setTimeout(() => {
      depositToGateway(val);
      setAmount('');
      setIsLoading(false);
      alert('Depósito de R$ ' + val + ' realizado com sucesso!');
    }, 1000);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Caixa / Gateway</h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Simulador de fluxos financeiros ZettPay</p>
        </div>
        <div className="flex items-center gap-4 bg-[#E50914] px-10 py-6 rounded-[32px] shadow-2xl shadow-[#E50914]/20 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Saldo Liquidado</p>
            <p className="text-4xl font-black italic tracking-tighter tabular-nums">
              R$ {state.gateway.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <Landmark className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <section className="bg-[#0f0f0f] border border-white/10 rounded-[40px] p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                <ArrowUpCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight">Abastecer Caixa</h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Adicione saldo para pagar usuários</p>
              </div>
            </div>

            <form onSubmit={handleDeposit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Valor a Injetar (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-white/20" />
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="1.000,00"
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-2xl font-black text-white focus:outline-none focus:border-green-500 transition-all font-mono"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 text-lg uppercase italic tracking-wider shadow-lg shadow-green-500/10"
              >
                 {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    GERAR PIX RECEBIMENTO
                    <TrendingUp className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </section>

          <div className="bg-zinc-900/50 border border-white/5 rounded-[40px] p-8 flex items-center gap-8">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-10 h-10 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xl font-black mb-1 uppercase italic tracking-tight">Segurança ZettPay</h4>
              <p className="text-white/40 text-xs font-bold leading-relaxed uppercase tracking-wide">
                Todas as movimentações internas são registradas com hash único e checksum de integridade.
              </p>
            </div>
          </div>
        </div>

        <section className="bg-[#0f0f0f] border border-white/10 rounded-[40px] p-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white focus:outline-none">Faturamento</h2>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[600px] flex-1 pr-2 custom-scrollbar">
            {state.gateway.history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/20">
                <History className="w-12 h-12 mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">Nenhuma movimentação no caixa</p>
              </div>
            ) : (
              state.gateway.history.slice().reverse().map((entry) => (
                <div key={entry.id} className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${entry.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {entry.type === 'deposit' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{entry.description}</p>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{entry.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg ${entry.type === 'deposit' ? 'text-green-500' : 'text-red-500'} tabular-nums`}>
                      {entry.type === 'deposit' ? '+' : '-'} R$ {entry.amount.toFixed(2)}
                    </p>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{new Date(entry.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
