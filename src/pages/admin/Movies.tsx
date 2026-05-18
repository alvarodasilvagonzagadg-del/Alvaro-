import React, { useState } from 'react';
import { useFlixEarnContext } from '../../context/FlixEarnContext';
import { Plus, Trash2, Edit2, Play, ExternalLink, Image as ImageIcon, DollarSign, Clock, X, Save, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie } from '../../types';

export function AdminMovies() {
  const { state, addMovie, updateMovie, deleteMovie } = useFlixEarnContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Movie, 'id'>>({
    title: '',
    posterUrl: '',
    embedUrl: '',
    rewardAmount: 0.5,
    durationSeconds: 30,
    category: 'Ação'
  });

  const handleEdit = (movie: Movie) => {
    setEditingId(movie.id);
    setFormData({
      title: movie.title,
      posterUrl: movie.posterUrl,
      embedUrl: movie.embedUrl,
      rewardAmount: movie.rewardAmount,
      durationSeconds: movie.durationSeconds,
      category: movie.category || 'Ação'
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: '',
      posterUrl: '',
      embedUrl: '',
      rewardAmount: 0.5,
      durationSeconds: 30,
      category: 'Ação'
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMovie({ ...formData, id: editingId });
      alert('Filme atualizado!');
    } else {
      addMovie(formData);
      alert('Filme adicionado!');
    }
    resetForm();
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Gerir Filmes</h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Adicione novos títulos e configure as recompensas</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#E50914] hover:bg-[#b90710] text-white font-black px-8 py-4 rounded-2xl flex items-center gap-2 transition-all active:scale-95 text-sm tracking-widest uppercase italic shadow-lg shadow-[#E50914]/10"
        >
          <Plus className="w-5 h-5" />
          Adicionar Novo
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0f0f0f] border border-white/10 rounded-[40px] p-8 md:p-10 space-y-8 mb-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black italic uppercase tracking-tight">
                  {editingId ? 'Editar Filme' : 'Novo Filme'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 italic">Título do Filme</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Matrix Resurrections"
                      className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-[#E50914] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 italic">Thumbnail / Poster</label>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input 
                          required
                          value={formData.posterUrl}
                          onChange={e => setFormData({ ...formData, posterUrl: e.target.value })}
                          placeholder="URL da imagem..."
                          className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-[#E50914] transition-all"
                        />
                      </div>
                      <label className="flex items-center justify-center px-6 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl cursor-pointer transition-all border border-white/5 active:scale-95 group">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({ ...formData, posterUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 italic">Link Embed (YouTube/Vimeo/Iframe)</label>
                    <div className="relative">
                      <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <input 
                        required
                        value={formData.embedUrl}
                        onChange={e => setFormData({ ...formData, embedUrl: e.target.value })}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-[#E50914] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 italic">Categoria</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <input 
                        required
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Ex: Ação, Comédia, Drama"
                        className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-[#E50914] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 italic">Recompensa (R$)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500/50" />
                        <input 
                          type="number"
                          step="0.01"
                          required
                          value={formData.rewardAmount}
                          onChange={e => setFormData({ ...formData, rewardAmount: parseFloat(e.target.value) })}
                          className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-[#E50914] transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 italic">Tempo Necessário (seg)</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/50" />
                        <input 
                          type="number"
                          required
                          value={formData.durationSeconds}
                          onChange={e => setFormData({ ...formData, durationSeconds: parseInt(e.target.value) })}
                          className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:outline-none focus:border-[#E50914] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="aspect-video bg-zinc-900 rounded-[32px] border border-white/5 border-dashed flex flex-col items-center justify-center text-center p-6 grayscale hover:grayscale-0 transition-all cursor-default">
                    {formData.posterUrl ? (
                       <img src={formData.posterUrl} className="w-full h-full object-cover rounded-xl border border-white/10" alt="Preview" />
                    ) : (
                      <>
                        <ImageIcon className="w-12 h-12 text-white/10 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Preview do Poster</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#E50914] hover:text-white transition-all active:scale-[0.98] uppercase text-sm tracking-widest italic"
                  >
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                  </button>
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="px-10 bg-zinc-900 text-white/40 font-black py-4 rounded-2xl flex items-center justify-center hover:bg-zinc-800 transition-all uppercase text-sm tracking-widest italic"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {state.movies.map((movie) => (
          <motion.div 
            key={movie.id}
            layout
            className="group bg-[#0f0f0f] border border-white/10 rounded-[32px] overflow-hidden hover:border-white/20 transition-all flex h-48"
          >
            <div className="w-32 flex-shrink-0 relative overflow-hidden">
              <img src={movie.posterUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={movie.title} />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-black italic text-lg leading-tight uppercase tracking-tight group-hover:text-[#E50914] transition-colors line-clamp-2">{movie.title}</h3>
                <div className="flex flex-wrap gap-2 mt-3 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/60 bg-white/5 px-2 py-0.5 rounded italic">{movie.category}</span>
                  <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded">R$ {movie.rewardAmount.toFixed(2)}</span>
                  <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{movie.durationSeconds}s</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleEdit(movie)}
                  className="flex-1 bg-zinc-900 border border-white/5 hover:border-white/20 text-white/60 hover:text-white p-2.5 rounded-xl transition-all"
                >
                  <Edit2 className="w-4 h-4 mx-auto" />
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Excluir este filme?')) deleteMovie(movie.id);
                  }}
                  className="flex-1 bg-zinc-900 border border-white/5 hover:border-red-500 text-white/60 hover:text-red-500 p-2.5 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
