import React, { useState } from 'react';
import { useFlixEarnContext } from '../../context/FlixEarnContext';
import { Zap, Save, Check, RotateCcw, TrendingUp, DollarSign, Award, Plus, Trash2, X } from 'lucide-react';
import { PlanConfig } from '../../types';

export function AdminPlans() {
  const { state, updatePlanConfig, addPlanConfig, deletePlanConfig } = useFlixEarnContext();
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState<PlanConfig>({
    id: '',
    name: '',
    price: '',
    dailyLimit: 0,
    hourlyEarning: 0,
    dailyHoursLimit: 0,
    rewardText: '',
    features: ['']
  });

  const handleEdit = (plan: PlanConfig) => {
    setEditingPlan({ 
      ...plan,
      hourlyEarning: plan.hourlyEarning ?? 0,
      dailyHoursLimit: plan.dailyHoursLimit ?? 0
    });
  };

  const handleSave = () => {
    if (editingPlan) {
      updatePlanConfig(editingPlan);
      setEditingPlan(null);
      alert('Configuração do plano salva com sucesso!');
    }
  };

  const handleAddPlan = () => {
    if (!newPlan.id || !newPlan.name) {
      alert('ID e Nome são obrigatórios!');
      return;
    }
    if (state.plans?.some(p => p.id === newPlan.id)) {
      alert('Este ID de plano já existe!');
      return;
    }
    addPlanConfig(newPlan);
    setIsAdding(false);
    setNewPlan({
      id: '',
      name: '',
      price: '',
      dailyLimit: 0,
      hourlyEarning: 0,
      dailyHoursLimit: 0,
      rewardText: '',
      features: ['']
    });
    alert('Novo plano adicionado com sucesso!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano? Usuários vinculados a ele podem ter problemas.')) {
      deletePlanConfig(id);
    }
  };

  const handleChange = (field: keyof PlanConfig, value: any) => {
    if (editingPlan) {
      setEditingPlan({ ...editingPlan, [field]: value });
    }
  };

  const handleNewPlanChange = (field: keyof PlanConfig, value: any) => {
    setNewPlan({ ...newPlan, [field]: value });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">Gerir Planos</h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Configuração de valores, limites e benefícios dos planos</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-8 py-4 bg-[#E50914] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#E50914]/20 self-start md:self-center"
        >
          <Plus className="w-5 h-5" />
          Adicionar Plano
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#141414] border border-[#E50914] rounded-[32px] p-8 shadow-2xl shadow-[#E50914]/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-[#E50914]">Novo Plano</h2>
            <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
          
              <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">ID Único (Ex: Diamante)</label>
                <input 
                  type="text"
                  value={newPlan.id}
                  onChange={e => handleNewPlanChange('id', e.target.value)}
                  placeholder="ID do plano"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Nome de Exibição</label>
                <input 
                  type="text"
                  value={newPlan.name}
                  onChange={e => handleNewPlanChange('name', e.target.value)}
                  placeholder="Nome do plano"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Preço (Display)</label>
                  <input 
                    type="text"
                    value={newPlan.price}
                    onChange={e => handleNewPlanChange('price', e.target.value)}
                    placeholder="R$ 0,00"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Ganho por Hora (R$)</label>
                  <input 
                    type="number"
                    value={newPlan.hourlyEarning}
                    onChange={e => handleNewPlanChange('hourlyEarning', parseFloat(e.target.value))}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Limite de Horas</label>
                  <input 
                    type="number"
                    value={newPlan.dailyHoursLimit}
                    onChange={e => handleNewPlanChange('dailyHoursLimit', parseFloat(e.target.value))}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Benefícios (Um por linha)</label>
                <textarea 
                  rows={6}
                  value={newPlan.features.join('\n')}
                  onChange={e => handleNewPlanChange('features', e.target.value.split('\n'))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:outline-none focus:border-[#E50914] resize-none"
                />
              </div>
              <button 
                onClick={handleAddPlan}
                className="w-full py-4 bg-[#E50914] text-white rounded-xl font-black uppercase tracking-widest transition-all hover:bg-red-700"
              >
                Criar Plano Agora
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {(state.plans || []).map((plan) => (
          <div 
            key={plan.id}
            className={`bg-[#0f0f0f] border rounded-[32px] p-8 transition-all relative group ${
              editingPlan?.id === plan.id ? 'border-[#E50914] ring-1 ring-[#E50914]/20' : 'border-white/10'
            }`}
          >
            {editingPlan?.id !== plan.id && (
              <button 
                onClick={() => handleDelete(plan.id)}
                className="absolute top-8 right-8 p-3 text-white/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center justify-between mb-8 pr-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/5">
                  <Zap className={`w-6 h-6 ${['Ouro', 'Diamante', 'VIP'].includes(plan.name) ? 'text-[#E50914]' : 'text-white/40'}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight">{plan.name}</h3>
                  <p className="text-[10px] font-black uppercase text-white/20 tracking-widest leading-none">ID: {plan.id}</p>
                </div>
              </div>
              {editingPlan?.id === plan.id ? (
                <div className="flex gap-2">
                   <button 
                    onClick={handleSave}
                    className="p-3 bg-green-500 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/20"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setEditingPlan(null)}
                    className="p-3 bg-zinc-800 text-white/40 rounded-xl hover:text-white transition-all underline text-xs font-bold uppercase tracking-widest"
                  >
                    X
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleEdit(plan)}
                  className="px-6 py-3 bg-zinc-800 hover:bg-[#E50914] text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border border-white/5"
                >
                  Editar
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Preço (Display)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    <input 
                      disabled={editingPlan?.id !== plan.id}
                      type="text"
                      value={editingPlan?.id === plan.id ? editingPlan.price : plan.price}
                      onChange={e => handleChange('price', e.target.value)}
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-9 pr-4 text-xs font-bold text-white focus:outline-none focus:border-[#E50914] disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Ganho por Hora (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    <input 
                      disabled={editingPlan?.id !== plan.id}
                      type="number"
                      value={editingPlan?.id === plan.id ? editingPlan.hourlyEarning : plan.hourlyEarning}
                      onChange={e => handleChange('hourlyEarning', parseFloat(e.target.value))}
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-9 pr-4 text-xs font-bold text-white focus:outline-none focus:border-[#E50914] disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Limite de Horas/Dia</label>
                  <div className="relative">
                    <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    <input 
                      disabled={editingPlan?.id !== plan.id}
                      type="number"
                      value={editingPlan?.id === plan.id ? editingPlan.dailyHoursLimit : plan.dailyHoursLimit}
                      onChange={e => handleChange('dailyHoursLimit', parseFloat(e.target.value))}
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-9 pr-4 text-xs font-bold text-white focus:outline-none focus:border-[#E50914] disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-dashed border-white/10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Calculadora de Ganho Mensal (Automático)</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-white/20 italic uppercase tracking-widest text-wrap max-w-[150px]">
                      {editingPlan?.id === plan.id ? editingPlan.hourlyEarning : plan.hourlyEarning} p/h × {editingPlan?.id === plan.id ? editingPlan.dailyHoursLimit : plan.dailyHoursLimit} h/dia × 30 dias
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#E50914] italic">
                      R$ {(((editingPlan?.id === plan.id ? editingPlan.hourlyEarning : plan.hourlyEarning) || 0) * ((editingPlan?.id === plan.id ? editingPlan.dailyHoursLimit : plan.dailyHoursLimit) || 0) * 30).toFixed(2)}
                    </p>
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-tight">Ganho Potencial Mensal</p>
                  </div>
                </div>
              </div>

              {editingPlan?.id === plan.id && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Benefícios (Um por linha)</label>
                  <textarea 
                    rows={4}
                    value={editingPlan.features.join('\n')}
                    onChange={e => handleChange('features', e.target.value.split('\n'))}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-xs font-bold text-white focus:outline-none focus:border-[#E50914] resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
