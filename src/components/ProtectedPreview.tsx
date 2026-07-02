'use client';

interface ProtectedPreviewProps {
  html: string;
  watermarkText?: string;
}

export default function ProtectedPreview({ html, watermarkText = 'Criador de Logomarca' }: ProtectedPreviewProps) {
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
      <div 
        className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-10 flex flex-wrap justify-center items-center gap-x-16 gap-y-12 p-8"
        style={{ transform: 'rotate(-30deg) scale(1.5)' }}
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="text-gray-400 font-black text-sm select-none whitespace-nowrap tracking-wider">
            {watermarkText}
          </span>
        ))}
      </div>

      {/* Transparent Shield to block inspection click */}
      <div className="absolute inset-0 bg-transparent" onContextMenu={(e) => e.preventDefault()} />

      <div className="absolute top-4 right-4 bg-black/50 text-[10px] px-2 py-1 rounded-full uppercase tracking-widest text-white/70">
        Preview Protegido
      </div>
    </div>
  );
}
