import React, { useState } from 'react';
import { LogoFormData, LogoStyle } from '../types';
import { Loader2, Sparkles, Palette, Briefcase, Type } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: LogoFormData) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [colors, setColors] = useState('');
  const [style, setStyle] = useState<LogoStyle | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !niche) return;
    onSubmit({ name, niche, colors, style: style || undefined });
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-white/40 animate-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inteligência Artificial de Elite</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Sua marca <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">lendária</span> começa aqui.
        </h1>
        <p className="text-slate-500 mt-4 font-medium">Designers de silício prontos para esculpir sua identidade visual.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-slate-800 ml-1">
            <Type className="w-4 h-4 mr-2 text-blue-500" />
            Nome da Marca <span className="text-blue-500 ml-1">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: TechSmart"
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white/50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-slate-800 ml-1">
            <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
            Nicho de Atuação <span className="text-blue-500 ml-1">*</span>
          </label>
          <input
            type="text"
            required
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Ex: Advocacia, Tecnologia, Beleza..."
            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white/50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-bold text-slate-800 ml-1">
              <Palette className="w-4 h-4 mr-2 text-blue-500" />
              Cores
            </label>
            <input
              type="text"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="Ex: Azul e Branco"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white/50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-bold text-slate-800 ml-1">
              <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
              Estilo
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as LogoStyle)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white/50 text-slate-900 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Minimalista (Padrão)</option>
              {Object.values(LogoStyle).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !name || !niche}
          className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl tracking-tight mt-6 group"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-7 w-7" />
          ) : (
            <>
              CRIAR MEU LOGO
              <Sparkles className="ml-3 w-6 h-6 group-hover:animate-pulse" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
