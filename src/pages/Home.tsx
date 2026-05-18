import React from 'react';
import { useFlixEarnContext } from '../context/FlixEarnContext';
import { motion } from 'motion/react';
import { Play, Star, Clock, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const { state, calculateMovieReward } = useFlixEarnContext();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1600&auto=format&fit=crop&q=80" 
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-10 left-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2 bg-[#E50914] w-fit px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">
            <Star className="w-3 h-3 fill-current" />
            Top Escolha do Dia
          </div>
          <h1 className="text-6xl font-black tracking-tighter leading-none italic uppercase">
            Interestelar
          </h1>
          <p className="text-white/70 text-lg font-medium leading-relaxed">
            Uma equipe de exploradores viaja através de um buraco de minhoca no espaço, na tentativa de garantir a sobrevivência da humanidade.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <Link 
              to="/player/2"
              className="bg-white text-black px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-[#E50914] hover:text-white transition-all active:scale-[0.98]"
            >
              <Play className="w-5 h-5 fill-current" />
              ASSISTIR E LUCRAR
            </Link>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10">
              <Trophy className="w-5 h-5 text-[#E50914]" />
              <span className="font-bold">R$ {state.movies[0] ? calculateMovieReward(state.movies[0]).toFixed(2) : '0.00'} de recompensa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight uppercase italic">Disponíveis para Assistir</h2>
          <div className="text-xs font-black tracking-widest text-white/40 uppercase">Filmes recomendados</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {state.movies.map((movie, idx) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/player/${movie.id}`}>
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 border border-white/5 group-hover:border-[#E50914]/50 transition-colors">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-14 h-14 rounded-full bg-[#E50914] flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-2 py-1 rounded-lg border border-white/10 text-[10px] font-black text-[#E50914]">
                    R$ {calculateMovieReward(movie).toFixed(2)}
                  </div>
                </div>
                <h3 className="font-bold text-sm tracking-tight group-hover:text-[#E50914] transition-colors">{movie.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {movie.durationSeconds} segundos
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
