import React from 'react';
import { useFlixEarnContext } from '../context/FlixEarnContext';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Play, Star, Clock } from 'lucide-react';

export function MoviesCatalog() {
  const { state, calculateMovieReward } = useFlixEarnContext();

  const groupedMovies = state.movies.reduce((acc, movie) => {
    const category = movie.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(movie);
    return acc;
  }, {} as Record<string, typeof state.movies>);

  const categories = Object.keys(groupedMovies);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-1 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Catálogo de Filmes</h1>
        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Explore nossa curadoria de conteúdos premiados</p>
      </div>

      <div className="space-y-16">
        {categories.map((category) => (
          <div key={category} className="space-y-6">
            <div className="flex items-center gap-4 px-4 md:px-0">
              <div className="h-8 w-1.5 bg-[#E50914] rounded-full" />
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight">{category}</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 md:px-0">
              {groupedMovies[category].map((movie) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative"
                >
                  <Link to={`/player/${movie.id}`}>
                    <div className="aspect-[2/3] rounded-3xl overflow-hidden mb-4 relative ring-1 ring-white/5 group-hover:ring-[#E50914]/50 transition-all shadow-2xl">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                        <div className="w-14 h-14 bg-[#E50914] rounded-full flex items-center justify-center shadow-2xl shadow-[#E50914]/40">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-[#E50914] fill-[#E50914]" />
                        <span className="text-[10px] font-black text-white">R$ {calculateMovieReward(movie).toFixed(2)}</span>
                      </div>

                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[10px] font-bold text-white/60">
                        <Clock className="w-3 h-3" />
                        <span>{movie.durationSeconds}s</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm md:text-base tracking-tight group-hover:text-[#E50914] transition-colors truncate px-2">
                      {movie.title}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/30 px-2 mt-1">
                      {movie.category}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20 bg-zinc-900/50 rounded-[40px] border border-white/5">
          <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Nenhum filme disponível no momento</p>
        </div>
      )}
    </div>
  );
}
