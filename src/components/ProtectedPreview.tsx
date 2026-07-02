'use client';

interface ProtectedPreviewProps {
  html: string;
  watermarkText?: string;
  isPaid?: boolean;
}

export default function ProtectedPreview({ html, watermarkText = 'Criador de Logomarca', isPaid = false }: ProtectedPreviewProps) {
  return (
    <div 
      className="relative border border-gray-800 rounded-2xl overflow-hidden group aspect-square flex items-center justify-center p-8 select-none bg-white"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* HTML Logo Render */}
      <div 
        className="w-full h-full flex items-center justify-center pointer-events-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Watermark Overlay (Anti-Cópia) */}
      {!isPaid && (
        <div 
          className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-30 flex flex-wrap justify-center items-center gap-x-6 gap-y-6 p-4 mix-blend-difference"
          style={{ transform: 'rotate(-25deg) scale(2)' }}
        >
          {Array.from({ length: 64 }).map((_, i) => (
            <span key={i} className="text-white font-black text-xl select-none whitespace-nowrap tracking-tighter">
              {watermarkText}
            </span>
          ))}
        </div>
      )}

      {/* Transparent Shield to block inspection click */}
      {!isPaid && (
        <div className="absolute inset-0 bg-transparent" onContextMenu={(e) => e.preventDefault()} />
      )}

      {!isPaid && (
        <div className="absolute top-4 right-4 bg-black/50 text-[10px] px-2 py-1 rounded-full uppercase tracking-widest text-white/70">
          Preview Protegido
        </div>
      )}
    </div>
  );
}
