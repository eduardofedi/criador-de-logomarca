import React, { useState } from 'react';
import { LogoFormData, LogoStyle } from '../types';
import { Loader2 } from 'lucide-react';

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
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Criador de <span className="text-blue-600">Logomarca</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Design profissional em menos de 30 segundos</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Marca *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: TechSmart"
            style={{ colorScheme: 'light' }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nicho de Atuação *</label>
          <input
            type="text"
            required
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Ex: Advocacia, Tecnologia, Beleza..."
            style={{ colorScheme: 'light' }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cores Desejadas (Opcional)</label>
          <input
            type="text"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="Ex: Azul escuro e Branco ..."
            style={{ colorScheme: 'light' }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estilo Visual (Opcional)</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as LogoStyle)}
            style={{ colorScheme: 'light' }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none"
          >
            <option value="">Selecione um estilo...</option>
            {Object.values(LogoStyle).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !name || !niche}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-6 w-6" /> Gerando...
            </>
          ) : (
            'GERAR LOGO'
          )}
        </button>
      </form>
    </div>
  );
};
