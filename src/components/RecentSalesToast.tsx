'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';

const cities = ['São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Curitiba, PR', 'Salvador, BA', 'Porto Alegre, RS', 'Brasília, DF', 'Fortaleza, CE'];
const niches = ['Pizzaria', 'Consultório Odontológico', 'Oficina Mecânica', 'Escritório de Advocacia', 'Studio de Estética', 'Academia', 'Hambúrgueria Gourmet', 'Loja Virtual'];

export default function RecentSalesToast() {
  const [show, setShow] = useState(false);
  const [sale, setSale] = useState({ city: '', niche: '' });

  useEffect(() => {
    const triggerNotification = () => {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomNiche = niches[Math.floor(Math.random() * niches.length)];
      
      setSale({ city: randomCity, niche: randomNiche });
      setShow(true);

      // Esconde o toast após 5 segundos
      setTimeout(() => {
        setShow(false);
      }, 5000);
    };

    const initialTimeout = setTimeout(triggerNotification, 8000);
    const interval = setInterval(triggerNotification, 25000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-black/80 backdrop-blur-xl border border-blue-500/20 px-5 py-4 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.15)] flex items-center gap-4 max-w-xs animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Ícone alterado para um joinha (ThumbsUp) */}
      <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
        <ThumbsUp className="w-4 h-4 text-white fill-white" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nova Venda Aprovada</p>
        </div>
        <p className="text-sm font-black text-white leading-tight mt-1">
          {sale.niche}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Adquirido em {sale.city}</p>
      </div>
    </div>
  );
}
