import React, { useState, useEffect } from "react";
import { InputForm } from "./components/InputForm";
import { LogoPreview } from "./components/LogoPreview";
import { generateLogoImage } from "./services/geminiService";
import { AppStep, LogoFormData } from "./types";
import { Loader2, AlertCircle } from "lucide-react";

const LOCAL_STORAGE_KEY = "logoSimplesData";

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.FORM);
  const [formData, setFormData] = useState<LogoFormData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------------
  // 🔥 Fluxo de retorno do Mercado Pago
  // ------------------------------------------------------
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const status = urlParams.get("status");
    const collectionStatus = urlParams.get("collection_status");

    const isApproved =
      status === "approved" || collectionStatus === "approved";

    const isPending =
      status === "pending" || collectionStatus === "pending";

    // ------------------------------------------------------
    // 🔥 PAGAMENTO APROVADO
    // ------------------------------------------------------
    if (isApproved) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        generateFinalVersion(parsed);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return;
    }

    // ------------------------------------------------------
    // 🔥 PIX PENDENTE → iniciar polling com merchant_order_id
    // ------------------------------------------------------
    if (isPending) {
      const orderId = urlParams.get("merchant_order_id"); // O CORRETO!

      setStep(AppStep.GENERATING_FINAL);

      const interval = setInterval(async () => {
        if (!orderId) return;

        const res = await fetch(`/api/check-payment?id=${orderId}`);
        const data = await res.json();

        if (data.status === "approved") {
          clearInterval(interval);

          const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            generateFinalVersion(parsedData);
          }

          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }, 4000);

      return () => clearInterval(interval);
    }
  }, []);

  // ------------------------------------------------------
  // Geração da prévia
  // ------------------------------------------------------
  const handleFormSubmit = async (data: LogoFormData) => {
    setError(null);
    setFormData(data);
    setStep(AppStep.GENERATING_PREVIEW);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

    try {
      const imageBase64 = await generateLogoImage(data, false);
      setGeneratedImage(imageBase64);
      setStep(AppStep.PREVIEW);
    } catch {
      setError("Erro ao gerar a logo. Por favor, tente novamente.");
      setStep(AppStep.FORM);
    }
  };

  // ------------------------------------------------------
  // Geração final sem marca d’água
  // ------------------------------------------------------
  const generateFinalVersion = async (data: LogoFormData) => {
    setStep(AppStep.GENERATING_FINAL);

    try {
      const finalImg = await generateLogoImage(data, true);
      setGeneratedImage(finalImg);
      setStep(AppStep.SUCCESS);
    } catch {
      setError("Erro ao gerar versão final. Atualize a página.");
      setStep(AppStep.PREVIEW);
    }
  };

  // ------------------------------------------------------
  // Renderização de telas
  // ------------------------------------------------------
  const renderContent = () => {
    switch (step) {
      case AppStep.FORM:
        return <InputForm onSubmit={handleFormSubmit} isLoading={false} />;

      case AppStep.GENERATING_PREVIEW:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800">Criando sua marca...</h2>
            <p className="text-gray-500 mt-2">
              A IA está desenhando a melhor opção para o seu nicho.
            </p>
          </div>
        );

      case AppStep.PREVIEW:
        return generatedImage ? (
          <LogoPreview imageSrc={generatedImage} isPaid={false} onPaymentClick={() => {}} />
        ) : null;

      case AppStep.GENERATING_FINAL:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-16 h-16 text-green-600 animate-spin mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Aguardando Confirmação do PIX...
            </h2>
            <p className="text-gray-500 mt-2">
              Seu pagamento está sendo confirmado. Isso pode levar alguns segundos.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              A página será atualizada automaticamente.
            </p>
          </div>
        );

      case AppStep.SUCCESS:
        return generatedImage ? (
          <LogoPreview imageSrc={generatedImage} isPaid={true} onPaymentClick={() => {}} />
        ) : null;

      default:
        return null;
    }
  };

  // ------------------------------------------------------
  // Estrutura da página
  // ------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              C
            </div>
            <span className="text-xl font-bold text-gray-900">
              Criador de Logomarca
            </span>
          </div>

          {step !== AppStep.FORM && step !== AppStep.SUCCESS && (
            <button
              onClick={() => (window.location.href = "/")}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Começar de novo
            </button>
          )}
        </div>
      </header>

      {/* MAIN */}
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

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Criador de Logomarca.</p>
          <p className="mt-2">Pagamento processado de forma segura.</p>
        </div>
      </footer>
    </div>
  );
}
