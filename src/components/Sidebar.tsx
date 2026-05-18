import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, CreditCard, Shield, Film, Users, Landmark, X, Zap } from 'lucide-react';
import { useFlixEarnContext } from '../context/FlixEarnContext';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { state } = useFlixEarnContext();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Film, label: 'Filmes', path: '/movies' },
    { icon: Zap, label: 'Planos', path: '/plans' },
    { icon: Wallet, label: 'Saques', path: '/withdraw' },
  ];

  const adminItems = [
    { icon: Shield, label: 'Painel Master', path: '/admin' },
    { icon: Users, label: 'Gerir Usuários', path: '/admin/users' },
    { icon: Film, label: 'Gerir Filmes', path: '/admin/movies' },
    { icon: Zap, label: 'Gerir Planos', path: '/admin/plans' },
    { icon: Landmark, label: 'Caixa / Gateway', path: '/admin/cashier' },
    { icon: Wallet, label: 'Pedidos de Saque', path: '/admin/withdrawals' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-r border-white/5 w-64 pt-20 overflow-y-auto custom-scrollbar">
      {/* Wallet Section */}
      <div className="px-6 py-4 mb-2 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Saldo Atual</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/20">
                <span className="text-green-500 text-[10px] font-black italic">$</span>
              </div>
              <span className="font-black text-xl text-green-500 tracking-tight leading-none">
                R$ {state.currentUser?.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <Link 
            to="/withdraw"
            onClick={() => onClose()}
            className="flex items-center justify-center gap-2 w-full bg-[#22c55e] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-green-500/20"
          >
            <Wallet className="w-4 h-4" />
            SACAR AGORA
          </Link>
        </div>
      </div>

      <div className="px-4 py-4 space-y-1">
        <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Principal</p>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => onClose()}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
              location.pathname === item.path 
                ? 'bg-[#E50914] text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      {state.currentUser?.isAdmin && (
        <div className="px-4 py-6 space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#E50914] mb-2">Administração</p>
          {adminItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === item.path 
                  ? 'bg-zinc-800 text-white border border-white/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 group-hover:text-[#E50914] transition-colors" />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-auto p-6 border-t border-white/5">
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Seu Plano</p>
          <p className="text-[#E50914] font-black text-lg leading-tight uppercase italic">{state.currentUser?.plan}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Sticky position */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 z-[70] lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
