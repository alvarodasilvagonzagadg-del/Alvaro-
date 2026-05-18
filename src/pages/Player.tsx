import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlixEarnContext } from '../context/FlixEarnContext';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, CheckCircle2, Wallet, ArrowLeft, Loader2 } from 'lucide-react';

export function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, addEarning, calculateMovieReward } = useFlixEarnContext();
  const movie = state.movies.find(m => m.id === id);
  const rewardAmount = movie ? calculateMovieReward(movie) : 0;

  const [timeLeft, setTimeLeft] = useState(movie?.durationSeconds || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [claimed, setClaimed] = useState(false);
  
  const planConfig = state.plans?.find(p => p.id === state.currentUser?.plan);
  const earningPerSecond = (planConfig?.hourlyEarning || 0) / 3600;
  
  const [liveReward, setLiveReward] = useState(0);
  const [dailySecondsLeft, setDailySecondsLeft] = useState(() => {
    if (!state.currentUser || !planConfig) return 0;
    const today = new Date().toDateString();
    const watchedHours = state.currentUser.lastWatchDate === today ? (state.currentUser.dailyHoursWatched || 0) : 0;
    return Math.max(0, (planConfig.dailyHoursLimit || 0) * 3600 - (watchedHours * 3600));
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !isFinished && dailySecondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setDailySecondsLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            alert('Seu limite diário de horas foi atingido! Volte amanhã ou faça um upgrade de plano.');
            return 0;
          }
          return prev - 1;
        });
        
        setLiveReward(prev => prev + earningPerSecond);

        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isFinished, timeLeft, dailySecondsLeft, earningPerSecond]);

  if (!movie) return <div>Filme não encontrado</div>;

  const handleClaim = () => {
    if (claimed) return;
    const success = addEarning(rewardAmount, movie.durationSeconds);
    if (success) {
      setClaimed(true);
      setLiveReward(0);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const calculateProgress = () => {
    const total = movie.durationSeconds;
    const current = total - timeLeft;
    return (current / total) * 100;
  };

  return (
    <div className="space-y-8 pb-20">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o Início
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
            {!isPlaying && !isFinished && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 bg-[#E50914] rounded-full flex items-center justify-center shadow-lg shadow-[#E50914]/20"
                >
                  <Play className="w-8 h-8 fill-current text-white ml-1" />
                </motion.button>
                <p className="mt-6 font-black uppercase tracking-[0.2em] text-white italic">Clique para começar a lucrar</p>
              </div>
            )}

            {isPlaying && (
              <iframe 
                src={`${movie.embedUrl}?autoplay=1&controls=0&mute=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            )}

            <AnimatePresence>
              {isFinished && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-center p-8"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Filme Concluído!</h2>
                  <p className="text-white/60 font-bold mb-8 uppercase tracking-widest text-xs">Você assistiu o tempo necessário para receber sua recompensa.</p>
                  
                  {!claimed ? (
                    <button
                      onClick={handleClaim}
                      className="bg-[#E50914] hover:bg-[#b90710] text-white px-10 py-4 rounded-xl font-black text-sm tracking-widest flex items-center gap-3 transition-all active:scale-95"
                    >
                      <Wallet className="w-5 h-5" />
                      COLETAR R$ {rewardAmount.toFixed(2)}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-green-500 font-black uppercase tracking-widest flex items-center gap-2 justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                        SALDO ADICIONADO!
                      </div>
                      <button 
                        onClick={() => navigate('/')}
                        className="text-white/40 hover:text-white font-bold underline text-sm"
                      >
                        Continuar assistindo
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top Bar for Progress */}
            <div className="absolute top-0 left-0 right-0 p-6 z-30 pointer-events-none">
              <div className="flex items-center justify-between gap-6 max-w-xl mx-auto">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-xl">
                  <motion.div 
                    className="h-full bg-[#E50914]"
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="bg-black/80 backdrop-blur px-4 py-1 rounded-full border border-white/10 flex items-center gap-2 min-w-[80px] justify-center">
                  <Loader2 className={`w-3 h-3 text-[#E50914] ${isPlaying ? 'animate-spin' : ''}`} />
                  <span className="font-black text-xs tabular-nums text-white">
                    {timeLeft}s
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-1">{movie.title}</h2>
                <div className="flex items-center gap-4 text-xs font-bold text-white/40 uppercase tracking-widest">
                  <span className="text-[#E50914]">R$ {rewardAmount.toFixed(2)} / vídeo</span>
                  <span>•</span>
                  <span>HD 4K</span>
                  <span>•</span>
                  <span>Audio Original</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center min-w-[100px]">
                  <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 text-center whitespace-nowrap">Ganhos Agora</p>
                  <p className="text-sm md:text-xl font-black text-green-500 tabular-nums">R$ {liveReward.toFixed(4)}</p>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center min-w-[100px]">
                  <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 text-center whitespace-nowrap">Tempo Restante</p>
                  <p className="text-sm md:text-xl font-black text-white tabular-nums">{formatTime(dailySecondsLeft)}</p>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-white/5" />
            
            <p className="text-white/60 leading-relaxed font-medium">
              Assista ao vídeo até o final para validar sua visualização e coletar os lucros. O progresso é salvo em tempo real no seu navegador. Evite trocar de aba para garantir que o temporizador não seja pausado.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                { icon: Play, label: 'Visualizações', value: '1.4k+' },
                { icon: Wallet, label: 'Lucro Total', value: 'R$ 4.2k' },
                { icon: CheckCircle2, label: 'Verificado', value: 'Sim' },
                { icon: RotateCcw, label: 'Duração', value: `${movie.durationSeconds}s` },
               ].map((item, i) => (
                 <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                   <div className="p-2 bg-zinc-900 rounded-lg">
                    <item.icon className="w-4 h-4 text-[#E50914]" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{item.label}</p>
                     <p className="font-bold text-sm">{item.value}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar Mini Recommendations */}
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase italic tracking-tight">Vistos Recentemente</h3>
          <div className="space-y-4">
            {state.movies.filter(m => m.id !== id).map(m => (
              <motion.div 
                key={m.id}
                whileHover={{ x: 10 }}
                onClick={() => navigate(`/player/${m.id}`)}
                className="flex gap-4 cursor-pointer group"
              >
                <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-[#E50914]/50 transition-colors">
                  <img src={m.posterUrl} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h4 className="font-bold text-sm tracking-tight group-hover:text-[#E50914] transition-colors">{m.title}</h4>
                  <div className="text-[10px] font-black text-[#E50914] uppercase tracking-widest">R$ {calculateMovieReward(m).toFixed(2)}</div>
                  <div className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Ação • 2024</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
