import React from 'react';
import { useFlixEarnContext } from '../context/FlixEarnContext';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export function Plans() {
  const { state, updateUserPlan } = useFlixEarnContext();

  const handleUpgrade = (plan: any) => {
    if (state.currentUser?.plan === plan.id) {
       alert('Você já possui este plano!');
       return;
    }
    
    // In a real app, this would open a payment gateway
    if (window.confirm(`Deseja adquirir o Plano ${plan.name}?`)) {
      updateUserPlan(plan.id);
      alert(`Parabéns! Você agora é Plano ${plan.name}.`);
    }
  };

  const plans = (state.plans || []);

  return (
    <div className="space-y-10 pb-24">
      <div className="flex flex-col gap-1 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Planos</h1>
        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Aumente seus ganhos diários agora</p>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl mx-auto md:mx-0 px-4 md:px-0">
        {plans.map((plan, index) => {
          const isCurrent = state.currentUser?.plan === plan.id;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-black rounded-[32px] p-8 border-2 transition-all ${
                isCurrent ? 'border-[#E50914]' : 'border-zinc-900/50'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-8 right-8">
                  <span className="bg-[#E50914] text-white text-[10px] font-black uppercase px-4 py-2 rounded-full tracking-widest shadow-lg shadow-[#E50914]/20">
                    ATUAL
                  </span>
                </div>
              )}

              <div className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">R$ {plan.price}</span>
                    <span className="text-white/30 font-black uppercase text-sm tracking-widest italic leading-none">/ ÚNICO</span>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl mt-4">
                    <p className="text-green-500 font-black uppercase tracking-widest text-[10px] italic">
                      Ganho mensal R$ {((plan.hourlyEarning || 0) * (plan.dailyHoursLimit || 0) * 30).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(plan.features || []).map((feature, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={3} />
                      </div>
                      <span className="text-base font-bold text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleUpgrade(plan)}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-base transition-all active:scale-95 ${
                      isCurrent 
                        ? 'bg-[#E50914] text-white shadow-xl shadow-[#E50914]/20' 
                        : 'bg-zinc-900 text-white hover:bg-zinc-800 border border-white/5'
                    }`}
                  >
                    {isCurrent ? 'RENOVAR PLANO' : 'ADQUIRIR PLANO'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
