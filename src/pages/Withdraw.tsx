import React, { useState } from 'react';
import { useFlixEarnContext } from '../context/FlixEarnContext';
import { motion } from 'motion/react';
import { Wallet, Landmark, ArrowRight, History, CheckCircle2, Clock, XCircle, ChevronRight, Calculator } from 'lucide-react';

export function Withdraw() {
  const { state, requestWithdrawal } = useFlixEarnContext();
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const myWithdrawals = state.withdrawals.filter(w => w.userId === state.currentUser?.id);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val < 20) {
      alert('Mínimo para saque é R$ 20,00');
      return;
    }
    if (val > (state.currentUser?.balance || 0)) {
       alert('Saldo insuficiente');
       return;
    }
    if (!pixKey) {
      alert('Informe sua chave PIX');
      return;
    }

    setIsLoading(true);
    // Simulate delay
    setTimeout(() => {
      const success = requestWithdrawal(val, pixKey);
      if (success) {
        setAmount('');
        setPixKey('');
        alert('Saque solicitado com sucesso! Aguarde a aprovação.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Carteira de Lucros</h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Transforme seus minutos assistidos em dinheiro real</p>
        </div>
        <div className="bg-[#E50914] px-10 py-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Landmark className="w-20 h-20" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Saldo Disponível</p>
          <p className="text-4xl font-black italic tracking-tighter">
            R$ {state.currentUser?.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <section className="space-y-6">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[40px] p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
                <Wallet className="w-6 h-6 text-[#E50914]" />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Solicitar Retirada</h2>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Valor do Saque (R$)</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-white/20">R$</div>
                  <input 
                    type="number" 
                    step="0.01"
                    min="20"
                    placeholder="20,00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-2xl font-black text-white focus:outline-none focus:border-[#E50914] transition-all"
                  />
                </div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1 italic">Saque mínimo: R$ 20,00 • Taxa: R$ 0,00</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Chave PIX (CPF/Email/Celular)</label>
                <input 
                  type="text" 
                  placeholder="Informe sua chave PIX aqui"
                  value={pixKey}
                  onChange={e => setPixKey(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-5 px-6 font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-[#E50914] transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E50914] hover:bg-[#b90710] disabled:bg-zinc-800 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 text-lg group uppercase italic tracking-wider"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    SOLICITAR PIX
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="bg-white/5 p-6 rounded-3xl border border-dashed border-white/10">
               <div className="flex items-center gap-4 text-xs font-bold text-white/40 leading-relaxed">
                  <Calculator className="w-5 h-5 text-[#E50914]" />
                  Prazo de pagamento: Processamos todos os saques em até 24 horas úteis via gateway ZettPay.
               </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[40px] p-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
                  <History className="w-6 h-6 text-[#E50914]" />
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight text-white focus:outline-none">Histórico</h2>
              </div>
              <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{myWithdrawals.length} Solicitações</span>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar flex-1">
              {myWithdrawals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/20">
                  <History className="w-12 h-12 mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs">Nenhum saque realizado ainda</p>
                </div>
              ) : (
                myWithdrawals.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((w) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={w.id} 
                    className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between gap-4 group hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        w.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                        w.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 
                        'bg-[#E50914]/10 text-[#E50914]'
                      }`}>
                        {w.status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : 
                         w.status === 'rejected' ? <XCircle className="w-5 h-5" /> : 
                         <Clock className="w-5 h-5 animate-pulse" />}
                      </div>
                      <div>
                        <p className="font-black text-lg tabular-nums">R$ {w.amount.toFixed(2)}</p>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                          {new Date(w.createdAt).toLocaleDateString('pt-BR')} às {new Date(w.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-full border mb-1 ${
                        w.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        w.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        'bg-zinc-800 text-white/40 border-white/10'
                      }`}>
                        {w.status === 'approved' ? 'Aprovado' : w.status === 'rejected' ? 'Rejeitado' : 'Processando'}
                      </p>
                      <p className="text-[9px] font-bold text-white/20 truncate max-w-[80px]">{w.pixKey}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <button className="mt-8 flex items-center justify-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest group">
              Ver Histórico Completo
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
