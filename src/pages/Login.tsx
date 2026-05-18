import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlixEarnContext } from '../context/FlixEarnContext';
import { motion } from 'motion/react';
import { User, Lock, Mail, ChevronRight } from 'lucide-react';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, recoverPassword } = useFlixEarnContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecovering) {
      recoverPassword(email);
      setIsRecovering(false);
      return;
    }
    if (isLogin) {
      if (login(email, password)) navigate('/');
      else alert('Credenciais inválidas');
    } else {
      if (register(email, password)) navigate('/');
      else alert('E-mail já cadastrado');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E50914] blur-[200px] opacity-10 rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-[#E50914] text-5xl font-black tracking-tighter mb-2 italic">FLIXEARN</h1>
          <p className="text-white/40 font-bold text-sm tracking-widest uppercase">Assista e Lucre com Streaming</p>
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {!isRecovering ? (
            <>
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 text-sm font-black transition-all ${isLogin ? 'text-white border-b-2 border-[#E50914]' : 'text-white/30'}`}
                >
                  LOGIN
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 text-sm font-black transition-all ${!isLogin ? 'text-white border-b-2 border-[#E50914]' : 'text-white/30'}`}
                >
                  CADASTRO
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Seu E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#E50914] transition-colors"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Sua Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#E50914] transition-colors"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="text-right">
                    <button 
                      type="button" 
                      onClick={() => setIsRecovering(true)}
                      className="text-xs font-bold text-[#E50914] hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-[#E50914] hover:bg-[#b90710] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all group active:scale-[0.98]"
                >
                  {isLogin ? 'ENTRAR AGORA' : 'CRIAR CONTA'}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-black text-white mb-2">RECUPERAR SENHA</h2>
                <p className="text-white/40 text-xs font-bold px-4 leading-relaxed">
                  Digite seu e-mail para receber um link de redefinição de senha.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Seu E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#E50914] transition-colors"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#E50914] hover:bg-[#b90710] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all group active:scale-[0.98]"
                >
                  ENVIAR LINK
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  type="button" 
                  onClick={() => setIsRecovering(false)}
                  className="w-full text-center text-xs font-bold text-white/40 hover:text-white transition-colors"
                >
                  Voltar para o login
                </button>
              </form>
            </div>
          )}
        </div>

        {!isLogin && (
          <p className="text-center mt-6 text-xs text-white/40 font-bold px-4 leading-relaxed">
            Ao se cadastrar, você concorda com nossos <span className="text-white/60">Termos de Uso</span> e <span className="text-white/60">Política de Privacidade</span>.
          </p>
        )}
      </motion.div>
    </div>
  );
}
