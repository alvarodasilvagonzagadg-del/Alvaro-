import React, { useState } from 'react';
import { useFlixEarnContext } from '../../context/FlixEarnContext';
import { Search, User as UserIcon, Shield, Trash2, Edit2, Check, X, Filter, Zap, Ban, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { PlanType } from '../../types';

export function AdminUsers() {
  const { state, adminUpdateUser, deleteUser } = useFlixEarnContext();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [editPlan, setEditPlan] = useState<PlanType>('Iniciante');

  const filteredUsers = state.users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

  const startEdit = (user: any) => {
    setEditingId(user.id);
    setEditBalance(user.balance.toString());
    setEditPlan(user.plan);
  };

  const handleSave = (userId: string) => {
    // Handle both comma and dot as decimal separators
    const normalizedBalance = editBalance.replace(',', '.');
    const balance = parseFloat(normalizedBalance);
    
    if (isNaN(balance)) {
      alert('Por favor, insira um valor de saldo válido (use ponto ou vírgula para decimais).');
      return;
    }
    
    adminUpdateUser(userId, { balance, plan: editPlan });
    setEditingId(null);
    alert('Alterações salvas com sucesso!');
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">Gestão de Usuários</h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Acompanhamento e edição de contas cadastradas</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input 
            type="text" 
            placeholder="Buscar por e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[#E50914] transition-all"
          />
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-[32px] md:rounded-[40px] overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-white/5">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-[#E50914]">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm truncate max-w-[150px]">{user.email}</p>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">ID: {user.id}</p>
                  </div>
                </div>
                {editingId !== user.id && (
                  <div className="flex gap-2">
                    {user.email !== 'admin@gmail.com' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const isBanned = !user.isBanned;
                          adminUpdateUser(user.id, { isBanned });
                        }}
                        title={user.isBanned ? "Desbanir Usuário" : "Banir Usuário"}
                        className={`p-2.5 rounded-xl transition-all border border-white/5 active:scale-90 cursor-pointer relative z-30 shadow-lg ${
                          user.isBanned 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {user.isBanned ? <UserCheck className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                      </button>
                    )}
                    <button 
                      onClick={() => startEdit(user)}
                      className="p-2.5 bg-zinc-800 text-white rounded-xl active:bg-[#E50914] transition-all border border-white/5"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!user.isAdmin && (
                      <button 
                        onClick={() => {
                          if (confirm('Deseja REALMENTE excluir este usuário?')) {
                            deleteUser(user.id);
                            alert('Usuário removido com sucesso.');
                          }
                        }}
                        className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-white/5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Plano</p>
                  {editingId === user.id ? (
                    <select 
                      value={editPlan}
                      onChange={e => setEditPlan(e.target.value as PlanType)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-bold text-white"
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Bronze">Bronze</option>
                      <option value="Prata">Prata</option>
                      <option value="Ouro">Ouro</option>
                    </select>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {user.isBanned && (
                        <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-red-500 text-white animate-pulse">
                          BANIDO
                        </span>
                      )}
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-white/10 ${
                        user.plan === 'Ouro' ? 'text-amber-500' : 
                        user.plan === 'Prata' ? 'text-slate-300' :
                        user.plan === 'Bronze' ? 'text-amber-700' : 'text-zinc-400'
                      }`}>
                        {user.plan}
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Saldo</p>
                  {editingId === user.id ? (
                    <input 
                      type="number"
                      step="0.01"
                      value={editBalance}
                      onChange={e => setEditBalance(e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-white"
                    />
                  ) : (
                    <p className="font-black text-sm text-[#E50914]">R$ {(user.balance || 0).toFixed(2)}</p>
                  )}
                </div>
              </div>

              {editingId === user.id && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSave(user.id)}
                    className="flex-1 py-3 bg-green-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-green-500/10 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Salvar
                  </button>
                  <button 
                    onClick={() => setEditingId(null)}
                    className="flex-1 py-3 bg-zinc-800 text-white/60 font-black text-xs uppercase tracking-widest rounded-xl hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                <th className="px-8 py-5">Usuário</th>
                <th className="px-8 py-5">Plano</th>
                <th className="px-8 py-5">Saldo</th>
                <th className="px-8 py-5">Criado em</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-[#E50914]">
                        {user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{user.email}</p>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {editingId === user.id ? (
                      <select 
                        value={editPlan}
                        onChange={e => setEditPlan(e.target.value as PlanType)}
                        className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none"
                      >
                        <option value="Iniciante">Iniciante</option>
                        <option value="Bronze">Bronze</option>
                        <option value="Prata">Prata</option>
                        <option value="Ouro">Ouro</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        {user.isAdmin && <Shield className="w-3 h-3 text-[#E50914]" />}
                        {user.isBanned && (
                          <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-red-500 text-white animate-pulse">
                            BANIDO
                          </span>
                        )}
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-white/5 border border-white/5 ${
                          user.plan === 'Ouro' ? 'text-amber-500' : 
                          user.plan === 'Prata' ? 'text-slate-300' :
                          user.plan === 'Bronze' ? 'text-amber-700' : 'text-zinc-400'
                        }`}>
                          {user.plan}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    {editingId === user.id ? (
                      <input 
                        type="number"
                        step="0.01"
                        value={editBalance}
                        onChange={e => setEditBalance(e.target.value)}
                        className="w-24 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none"
                      />
                    ) : (
                      <p className="font-black text-sm tabular-nums">R$ {(user.balance || 0).toFixed(2)}</p>
                    )}
                  </td>
                  <td className="px-8 py-6 font-bold text-xs text-white/40">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    {editingId === user.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleSave(user.id)}
                          className="p-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/10"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="p-2 bg-zinc-800 text-white/40 rounded-lg hover:bg-zinc-700 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        {user.email !== 'admin@gmail.com' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const isBanned = !user.isBanned;
                              adminUpdateUser(user.id, { isBanned });
                            }}
                            title={user.isBanned ? "Desbanir Usuário" : "Banir Usuário"}
                            className={`p-2 rounded-lg transition-all border border-white/5 active:scale-90 cursor-pointer relative z-30 ${
                              user.isBanned 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-600 text-white'
                            }`}
                          >
                            {user.isBanned ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </button>
                        )}
                        <button 
                          onClick={() => startEdit(user)}
                          className="p-2 bg-zinc-800 text-white hover:bg-[#E50914] rounded-lg transition-all border border-white/5"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                         {!user.isAdmin && (
                          <button 
                            className="p-2 bg-zinc-800 text-red-500/60 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-white/5"
                            onClick={() => {
                              if (confirm('Deseja REALMENTE excluir este usuário? Esta ação é irreversível e removerá todo o histórico.')) {
                                deleteUser(user.id);
                                alert('Usuário removido com sucesso.');
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                         )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
