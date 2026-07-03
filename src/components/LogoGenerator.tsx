'use client';

import { useState, useEffect } from 'react';
import ProtectedPreview from './ProtectedPreview';
import { Loader2, Palette, ArrowRight, ShieldCheck, Zap, X, QrCode, Mail, Copy, CheckCircle2, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const loadingPhrases = [
  "Tomando um café para acordar os neurônios criativos...",
  "Analisando seu segmento para não criar mais um logo genérico...",
  "Calculando a proporção áurea (sim, a gente liga pra isso)...",
  "Ajustando o contraste para sua marca brilhar até no escuro...",
  "Quase lá! Passando um pano para entregar o logo brilhando...",
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
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [pixData, setPixData] = useState<{ encodedImage: string, payload: string, paymentId: string, orderId: string } | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Payment verification state
  const [isPaid, setIsPaid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Auto-polling for payment
  useEffect(() => {
    if (!pixData?.paymentId || !pixData?.orderId || isPaid) return;
    
    const interval = setInterval(() => {
      // Background check without setting isChecking to avoid UI flicker
      fetch('/api/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: pixData.paymentId, orderId: pixData.orderId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.paid) {
          setIsPaid(true);
        }
      })
      .catch(() => {}); // silent fail on background polling
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, [pixData, isPaid]);

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
    if (!cpfCnpj || cpfCnpj.length < 11) {
      alert('Por favor, informe um CPF ou CNPJ válido.');
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
          cpfCnpj: cpfCnpj.replace(/\D/g, '') // Send only digits
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

  const checkPayment = async () => {
    if (!pixData?.paymentId || !pixData?.orderId) return;
    setIsChecking(true);
    try {
      const res = await fetch('/api/check-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: pixData.paymentId, orderId: pixData.orderId })
      });
      const data = await res.json();
        
      if (data.paid) {
        setIsPaid(true);
        alert("Pagamento Confirmado! O logotipo já foi enviado para o seu e-mail e agora você pode baixá-lo sem marca d'água aqui mesmo.");
      } else {
        alert('O pagamento ainda não consta como confirmado. Se você acabou de pagar, aguarde alguns instantes e clique novamente.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  const downloadPng = () => {
    if (!result?.html) return;
    
    // O result.html contém: <img src="data:image/png;base64,..." alt="Logo" class="..." />
    // Extraímos a base64 com regex para forçar o download direto
    const srcMatch = result.html.match(/src="(data:image\/png;base64,[^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      const dataUrl = srcMatch[1];
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = 'Logotipo_Premium.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      alert("Erro ao extrair imagem PNG. Tente usar o botão direito e 'Salvar Imagem'.");
    }
  };

  const finalPrice = '29,90';

  return (
    <div className="w-full">
      {/* Condicional: Exibe o card de Loading no lugar exato do formulário de briefing */}
      {loading ? (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl max-w-md mx-auto text-center space-y-6 animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-900">Criando seu Logotipo...</h4>
            <p className="text-sm text-gray-500 min-h-[40px] transition-all duration-500 leading-relaxed">
              {loadingPhrases[phraseIdx]}
            </p>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-2/3 rounded-full animate-infinite-progress"></div>
          </div>
        </div>
      ) : (
        /* Form Card de Briefing */
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-2xl max-w-md mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10"></div>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Palette className="text-blue-600 w-5 h-5" /> Iniciar Projeto de Marca
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Nome da Empresa</label>
              <input 
                required
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl p-3.5 outline-none transition text-gray-900 text-sm font-medium"
                placeholder="Ex: Carlos Pizzas"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Ramo de Atuação</label>
              <input 
                required
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl p-3.5 outline-none transition text-gray-900 text-sm font-medium"
                placeholder="Ex: Pizzaria Artesanal"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">O que deseja ver no logo? (Opcional)</label>
              <textarea 
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl p-3.5 outline-none transition text-gray-900 text-sm font-medium"
                placeholder="Ex: Uma fatia de pizza geométrica integrada com a letra C de forma limpa."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/25 mt-6 text-sm"
            >
              Criar Logotipo Profissional <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-gray-400 font-medium pt-2">Você pode gerar até 3 variações gratuitas.</p>
          </form>
        </div>
      )}

      {/* Result Modal (Apresentação Imersiva e em Alta Definição - Light Mode) */}
      {result && (
        <div className="fixed inset-0 bg-white/90 z-50 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white border border-gray-200 w-full max-w-5xl p-6 md:p-12 rounded-[2.5rem] relative grid md:grid-cols-2 gap-8 md:gap-16 items-center shadow-2xl">
            
            {/* Close Button to go back and generate again */}
            <button 
              onClick={() => setResult(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition p-2 bg-gray-50 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Left: Large, Beautiful Preview */}
            <div className="w-full max-w-sm mx-auto">
              <ProtectedPreview html={result.html} isPaid={isPaid} />
              {!isPaid && (
                <p className="text-center text-xs font-semibold text-gray-500 mt-4 px-4 bg-gray-50 py-3 rounded-xl border border-gray-100 shadow-sm animate-pulse">
                  <span className="text-orange-500 font-bold">Aviso:</span> Conclua o pagamento para remover a marca d'água e baixar em altíssima definição (PNG 2000px).
                </p>
              )}
            </div>
            
            {/* Right: Checkout & Details */}
            <div className="space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-green-50 text-green-600 border border-green-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Design Concluído
                </span>
              </div>

              <h3 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">Seu logotipo exclusivo.</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Nossos sistemas estruturaram uma identidade visual de alto padrão baseada em grids geométricos e contraste profissional. O design foi projetado para funcionar perfeitamente em todas as superfícies.
              </p>

              {!pixData ? (
                <div className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.melhor@email.com"
                        className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 placeholder-gray-400 outline-none transition font-medium"
                      />
                    </div>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        type="text"
                        required
                        value={cpfCnpj}
                        onChange={(e) => setCpfCnpj(e.target.value)}
                        placeholder="Seu CPF ou CNPJ"
                        className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 placeholder-gray-400 outline-none transition font-medium"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleGeneratePix}
                    disabled={isGeneratingPix || !email || !cpfCnpj}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition text-base shadow-lg shadow-blue-600/20"
                  >
                    {isGeneratingPix ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Gerando Pagamento...</>
                    ) : (
                      <><QrCode className="w-5 h-5" /> Pagar via PIX (R$ {finalPrice})</>
                    )}
                  </button>
                  <button 
                    onClick={() => setResult(null)}
                    className="w-full text-gray-500 text-sm hover:text-blue-600 transition text-center font-semibold pt-2"
                  >
                    Criar outra variação de design
                  </button>
                </div>
              ) : (
                <div className="space-y-6 pt-4 animate-in fade-in zoom-in duration-300">
                  {isPaid ? (
                    <div className="space-y-6 text-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-gray-900 mb-2">Pagamento Confirmado!</h4>
                        <p className="text-gray-600 font-medium">
                          Seu logo foi enviado também no e-mail <strong>{email}</strong>
                          <br />
                          <span className="text-sm text-gray-500">Verifique a caixa de spam se não o encontrar na caixa de entrada.</span>
                        </p>
                      </div>
                      <button 
                        onClick={downloadPng}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-green-600/20"
                      >
                        <Download className="w-5 h-5" /> Baixar Imagem (PNG) Agora
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm mx-auto w-fit relative">
                        <img 
                          src={`data:image/jpeg;base64,${pixData.encodedImage}`} 
                          alt="QR Code PIX" 
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900 font-bold text-center">Pix Copia e Cola:</p>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            readOnly 
                            value={pixData.payload}
                            className="flex-1 bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-gray-600 font-medium outline-none"
                          />
                          <button 
                            onClick={copyToClipboard}
                            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl text-white transition flex items-center justify-center shadow-lg shadow-blue-600/20"
                          >
                            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={checkPayment}
                        disabled={isChecking}
                        className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:bg-gray-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                      >
                        {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} 
                        Já paguei, confirmar pagamento
                      </button>

                      <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-center">
                        <p className="text-sm text-blue-800 font-medium">
                          Assim que o pagamento for confirmado, seu logotipo em alta definição será enviado imediatamente para: <br/><strong className="text-blue-900">{email}</strong>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Trust Badges */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center mt-6">
                <div className="space-y-1.5">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto" />
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Compra Segura</p>
                </div>
                <div className="space-y-1.5">
                  <Zap className="w-6 h-6 text-blue-600 mx-auto" />
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Entrega Imediata</p>
                </div>
                <div className="space-y-1.5">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto" />
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Direitos Totais</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
