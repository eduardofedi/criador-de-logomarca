'use client';

import { useState, useEffect } from 'react';
import ProtectedPreview from './ProtectedPreview';
import { Sparkles, Loader2, Palette, ArrowRight, ShieldCheck, Zap, X, QrCode, Mail, Copy, CheckCircle2 } from 'lucide-react';

const loadingPhrases = [
  "Analisando o nome da sua empresa e segmento...",
  "Definindo a paleta de cores ideal para a sua marca...",
  "Estruturando a tipografia com máxima legibilidade...",
  "Desenhando os elementos e ícones do logotipo...",
  "Ajustando as proporções e geometria do design...",
  "Finalizando o arquivo de alta resolução..."
];

export default function LogoGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ html: string; concept: string; id: string } | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    description: '',
    style: 'minimalist' as any
  });

  const [phraseIdx, setPhraseIdx] = useState(0);
  
  // Checkout state
  const [email, setEmail] = useState('');
  const [pixData, setPixData] = useState<{ encodedImage: string, payload: string, paymentId: string } | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading) return;
    setPhraseIdx(0);
    const interval = setInterval(() => {
      setPhraseIdx(prev => (prev + 1) % loadingPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setPixData(null);
    setEmail('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePix = async () => {
    if (!email || !email.includes('@')) {
      alert('Por favor, informe um e-mail válido para receber o logotipo.');
      return;
    }
    setIsGeneratingPix(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoId: result?.id,
          email,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPixData(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData?.payload) {
      navigator.clipboard.writeText(pixData.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const finalPrice = '29,90';

  return (
    <div className="w-full">
      {/* Condicional: Exibe o card de Loading no lugar exato do formulário de briefing */}
      {loading ? (
        <div className="bg-gray-950/80 p-8 rounded-3xl border border-gray-900 shadow-2xl backdrop-blur-md max-w-md mx-auto text-center space-y-6 animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white">Criando seu Logotipo...</h4>
            <p className="text-sm text-gray-400 min-h-[40px] transition-all duration-500 leading-relaxed">
              {loadingPhrases[phraseIdx]}
            </p>
          </div>
          <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-2/3 rounded-full animate-infinite-progress"></div>
          </div>
        </div>
      ) : (
        /* Form Card de Briefing */
        <div className="bg-gray-950/80 p-5 md:p-6 rounded-3xl border border-gray-900 shadow-2xl backdrop-blur-md max-w-md mx-auto">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Palette className="text-blue-500 w-4.5 h-4.5" /> Iniciar Projeto de Marca
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Nome da Empresa</label>
              <input 
                required
                className="w-full bg-black border border-gray-850 focus:border-blue-500 rounded-xl p-3 outline-none transition text-white text-sm"
                placeholder="Ex: Carlos Pizzas"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Ramo de Atuação</label>
              <input 
                required
                className="w-full bg-black border border-gray-850 focus:border-blue-500 rounded-xl p-3 outline-none transition text-white text-sm"
                placeholder="Ex: Pizzaria Artesanal"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">O que deseja ver no logo? (Opcional)</label>
              <textarea 
                rows={2}
                className="w-full bg-black border border-gray-850 focus:border-blue-500 rounded-xl p-3 outline-none transition text-white text-sm"
                placeholder="Ex: Uma fatia de pizza geométrica integrada com a letra C de forma limpa."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-850 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/25 mt-4 text-sm"
            >
              Criar Logotipo Profissional <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[9px] text-center text-gray-500 italic">Você pode gerar até 3 variações gratuitas.</p>
          </form>
        </div>
      )}

      {/* Result Modal (Apresentação Imersiva e em Alta Definição) */}
      {result && (
        <div className="fixed inset-0 bg-black/95 z-50 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-[#0f1115] to-[#07080a] border border-gray-900 w-full max-w-4xl p-6 md:p-10 rounded-3xl relative grid md:grid-cols-2 gap-8 md:gap-12 items-center shadow-2xl">
            
            {/* Close Button to go back and generate again */}
            <button 
              onClick={() => setResult(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition p-1.5 bg-white/5 rounded-full"
            >
              <X className="w-4.5 h-4.5" />
            </button>
            
            {/* Left: Large, Beautiful Preview */}
            <div className="w-full max-w-sm mx-auto">
              <ProtectedPreview html={result.html} />
            </div>
            
            {/* Right: Checkout & Details */}
            <div className="space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Design Concluído
                </span>
              </div>

              <h3 className="text-3xl font-black text-white leading-tight">Seu logotipo exclusivo.</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nossos sistemas estruturaram uma identidade visual de alto padrão baseada em grids geométricos e contraste profissional. O design foi projetado para funcionar perfeitamente em todas as superfícies.
              </p>

              {!pixData ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-300 font-medium">
                      Para onde enviaremos o seu logotipo final?
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.melhor@email.com"
                        className="w-full bg-black border border-gray-800 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 outline-none transition"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleGeneratePix}
                    disabled={isGeneratingPix || !email}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition text-base shadow-lg shadow-blue-600/20"
                  >
                    {isGeneratingPix ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Gerando Pagamento...</>
                    ) : (
                      <><QrCode className="w-5 h-5" /> Pagar via PIX (R$ {finalPrice})</>
                    )}
                  </button>
                  <button 
                    onClick={() => setResult(null)}
                    className="w-full text-gray-400 text-sm hover:text-white transition text-center underline underline-offset-4"
                  >
                    Criar outra variação de design
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="bg-white p-4 rounded-2xl mx-auto w-fit">
                    <img 
                      src={`data:image/jpeg;base64,${pixData.encodedImage}`} 
                      alt="QR Code PIX" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300 font-medium text-center">Pix Copia e Cola:</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={pixData.payload}
                        className="flex-1 bg-black border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-400"
                      />
                      <button 
                        onClick={copyToClipboard}
                        className="bg-blue-600 hover:bg-blue-500 p-2.5 rounded-xl text-white transition flex items-center justify-center"
                      >
                        {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl text-center">
                    <p className="text-sm text-blue-200">
                      Assim que o pagamento for confirmado, seu logotipo em alta definição será enviado imediatamente para: <strong>{email}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="pt-4 border-t border-gray-900 grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <ShieldCheck className="w-5 h-5 text-blue-500 mx-auto" />
                  <p className="text-[10px] text-gray-400 font-bold">Compra Segura</p>
                </div>
                <div className="space-y-1">
                  <Zap className="w-5 h-5 text-blue-500 mx-auto" />
                  <p className="text-[10px] text-gray-400 font-bold">Entrega Imediata</p>
                </div>
                <div className="space-y-1">
                  <ShieldCheck className="w-5 h-5 text-blue-500 mx-auto" />
                  <p className="text-[10px] text-gray-400 font-bold">Direitos Totais</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
