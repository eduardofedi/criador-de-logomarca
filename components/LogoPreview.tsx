import React from 'react';
import { Lock, Download, CheckCircle } from 'lucide-react';
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
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {isPaid ? "Sua Logomarca está Pronta!" : "Prévia da sua Logomarca"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {isPaid 
            ? "Download em alta resolução liberado." 
            : "Design profissional gerado com sucesso."}
        </p>
      </div>

      {/* Image Container */}
      <div className="relative group rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white max-w-[400px] w-full">
        {/* The Image - Blur reduced significantly to 0.5px */}
        <img 
          src={imageSrc} 
          alt="Logo Gerada" 
          className={`w-full h-auto object-contain mx-auto ${!isPaid ? 'blur-[0.5px]' : ''}`}
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />

        {/* Watermark Overlay */}
        {!isPaid && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center z-10 cursor-not-allowed select-none py-4"
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Background Pattern - Very Subtle and Small */}
            <div className="absolute inset-0 flex flex-wrap content-center justify-center overflow-hidden opacity-[0.03] pointer-events-none">
               {Array.from({ length: 12 }).map((_, i) => (
                 <span key={i} className="text-gray-900 text-[8px] font-bold -rotate-45 m-6 uppercase tracking-widest">
                    Criador de Logomarca
                 </span>
               ))}
            </div>
            
            {/* Center Badge - Tiny */}
            <div className="relative bg-white/40 backdrop-blur-[1px] border border-white/20 px-1.5 py-0.5 rounded-full shadow-sm">
              <div className="flex items-center space-x-1 text-gray-800">
                <Lock className="w-2 h-2 opacity-75" />
                <span className="text-[5px] font-bold uppercase tracking-widest leading-none">
                  Efetue a compra para liberar o download
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Section */}
      <div className="mt-8 w-full">
        {!isPaid ? (
          <PaymentBrick onPaymentSuccess={onPaymentClick} />
        ) : (
          <div className="space-y-6 w-full max-w-sm mx-auto">
             <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-center text-green-800 text-sm font-medium">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Pagamento confirmado.
             </div>
             <button 
              onClick={handleDownload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center transform hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5 mr-2" />
              BAIXAR PNG EM ALTA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};