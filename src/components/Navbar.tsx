import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, Wallet, LayoutDashboard } from 'lucide-react';
import { useFlixEarnContext } from '../context/FlixEarnContext';
import { motion } from 'motion/react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { state, logout } = useFlixEarnContext();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-b border-white/10 z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="text-[#E50914] text-2xl font-black tracking-tighter hover:scale-105 transition-transform">
          FLIXEARN
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#E50914] flex items-center justify-center font-black text-sm md:text-base italic shadow-lg shadow-[#E50914]/20">
            {state.currentUser?.name ? state.currentUser.name[0].toUpperCase() : state.currentUser?.email[0].toUpperCase()}
          </div>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
