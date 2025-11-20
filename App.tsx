import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { LogoPreview } from './components/LogoPreview';
import { generateLogoImage } from './services/geminiService';
import { AppStep, LogoFormData } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'logoSimplesData';

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.FORM);
  const [formData, setFormData] = useState<LogoFormData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verificação de retorno de pagamento (Fluxo Real)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paidParam = urlParams.get('paid');
    
    // Se o Mercado Pago redirecionar de volta com ?paid=true
    if (paidParam === 'true') {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        // Inicia a geração final automaticamente
        generateFinalVersion(parsedData);
        // Limpa a URL para ficar bonita (remove o ?paid=true)
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleFormSubmit = async (data: LogoFormData) => {
    setError(null);
    setFormData(data);
    setStep(AppStep.GENERATING_PREVIEW);
    
    // Salva no localStorage para recuperar quando voltar do Mercado Pago
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

    try {
      const imageBase64 = await generateLogoImage(data, false);
      setGeneratedImage(imageBase64);
      setStep(AppStep.PREVIEW);
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar a logo. Por favor, tente novamente.");
      setStep(AppStep.FORM);
    }
  };

  const generateFinalVersion = async (data: LogoFormData) => {
    setStep(AppStep.GENERATING_FINAL);
    try {
      // Gera a versão final (pode ser highQuality=true se implementado upscaling, ou apenas regeneração limpa)
      const imageBase64 = await generateLogoImage(data, true);
      setGeneratedImage(imageBase64);
      setStep(AppStep.SUCCESS);
    } catch (err) {
      setError("Erro ao gerar versão final. Atualize a página.");
      setStep(AppStep.PREVIEW); 
    }
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.FORM:
        return <InputForm onSubmit={handleFormSubmit} isLoading={false} />;
      
      case AppStep.GENERATING_PREVIEW:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800">Criando sua marca...</h2>
            <p className="text-gray-500 mt-2">A IA está desenhando a melhor opção para o seu nicho.</p>
          </div>
        );

      case AppStep.PREVIEW:
        return generatedImage ? (
          <LogoPreview 
            imageSrc={generatedImage} 
            isPaid={false} 
            onPaymentClick={() => {}} // Ação agora é direta no botão (href)
          />
        ) : null;

      case AppStep.GENERATING_FINAL:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-16 h-16 text-green-600 animate-spin mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800">Pagamento Confirmado!</h2>
            <p className="text-gray-500 mt-2">Gerando arquivo de alta definição (PNG) sem marca d'água.</p>
          </div>
        );

      case AppStep.SUCCESS:
         return generatedImage ? (
          <LogoPreview 
            imageSrc={generatedImage} 
            isPaid={true} 
            onPaymentClick={() => {}} 
          />
        ) : null;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">C</div>
             <span className="text-xl font-bold text-gray-900 tracking-tight">Criador de Logomarca</span>
          </div>
          {step !== AppStep.FORM && step !== AppStep.SUCCESS && (
            <button 
              onClick={() => window.location.href = '/'}
              className="text-sm text-gray-500 hover:text-gray-900 font-medium"
            >
              Começar de novo
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full">
          {error && (
            <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
          
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Criador de Logomarca. Todos os direitos reservados.</p>
          <p className="mt-2">Pagamento processado de forma segura.</p>
        </div>
      </footer>
    </div>
  );
}