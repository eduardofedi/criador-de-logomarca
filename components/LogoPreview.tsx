import React from 'react';
import { Lock, CheckCircle, ShieldCheck, Zap, DownloadCloud } from 'lucide-react';
import { PaymentBrick } from './PaymentBrick';

interface LogoPreviewProps {
  imageSrc: string;
  isPaid: boolean;
  onPaymentClick: () => void;
}

export const LogoPreview: React.FC<LogoPreviewProps> = ({ imageSrc, isPaid, onPaymentClick }) => {

  const handleDownload = () => {
    if (!isPaid) return;
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'minha-logomarca-profissional.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
          {isPaid ? <ShieldCheck className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
          <span>{isPaid ? "Licença Comercial Ativa" : "Sua Obra-Prima Personalizada"}</span>
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          {isPaid ? "Marca Pronta para o Sucesso!" : "Veja como ficou incrível."}
        </h2>
        <p className="text-slate-500 text-lg mt-3 font-medium">
          {isPaid
            ? "O arquivo original em alta resolução já está disponível."
            : "Cada detalhe foi refinado para transmitir autoridade e confiança."}
        </p>
      </div>

      {/* Image Container */}
      <div className="relative group rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-slate-200 bg-white max-w-[500px] w-full transition-transform hover:scale-[1.02] duration-500">
        {/* The Image */}
        <div className="aspect-square flex items-center justify-center p-12 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
          <img
            src={imageSrc}
            alt="Logo Gerada"
            className={`max-w-full max-h-full object-contain drop-shadow-2xl transition-all duration-1000 ${!isPaid ? 'blur-[0.5px] brightness-95' : ''}`}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>

        {/* Watermark Overlay */}
        {!isPaid && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-10 cursor-not-allowed select-none overflow-hidden"
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Artistic Watermark Pattern */}
            <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-12 opacity-[0.05] pointer-events-none rotate-12 scale-150">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="text-slate-900 text-sm font-black uppercase tracking-[0.3em] whitespace-nowrap">
                  LOGOIA PREMIUM
                </span>
              ))}
            </div>

            {/* Security Badge */}
            <div className="relative bg-white/80 backdrop-blur-md border border-white/40 px-6 py-3 rounded-2xl shadow-2xl animate-pulse">
              <div className="flex items-center space-x-3 text-slate-900">
                <Lock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Proteja sua Propriedade
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Section */}
      <div className="mt-12 w-full">
        {!isPaid ? (
          <div className="max-w-md mx-auto transform transition-all">
            <PaymentBrick onPaymentSuccess={onPaymentClick} />
            <p className="text-center text-slate-400 text-xs mt-6 px-8">
              Ao adquirir, você recebe os direitos de uso comercial e o arquivo em PNG transparente de alta definição.
            </p>
          </div>
        ) : (
          <div className="space-y-8 w-full max-w-md mx-auto animate-in zoom-in-95 duration-500">
            <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] p-6 flex flex-col items-center text-center shadow-sm">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-4 text-white">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-emerald-900 font-bold text-xl">Propriedade Confirmada</h3>
              <p className="text-emerald-700/80 text-sm mt-1">Obrigado por escolher a LogoIA.</p>
            </div>

            <button
              onClick={handleDownload}
              className="group w-full bg-slate-900 hover:bg-blue-600 text-white text-xl font-black py-6 px-10 rounded-[2rem] shadow-2xl shadow-slate-900/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center transform hover:-translate-y-1 active:scale-[0.98]"
            >
              <DownloadCloud className="w-7 h-7 mr-3 group-hover:animate-bounce" />
              BAIXAR EM ALTA (PNG)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};