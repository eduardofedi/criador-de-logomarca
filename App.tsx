import React, { useState, useEffect } from "react";
import { InputForm } from "./components/InputForm";
import { LogoPreview } from "./components/LogoPreview";
import { AppStep, LogoFormData } from "./types";
import { Loader2, AlertCircle } from "lucide-react";

const LOCAL_STORAGE_KEY = "logoSimplesData";
const PREVIEW_IMAGE_KEY = "logo_preview_image";
const FINAL_IMAGE_KEY = "logo_final_image";

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.FORM);
  const [formData, setFormData] = useState<LogoFormData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------------
  // 🔥 Fluxo do Mercado Pago
  // ------------------------------------------------------
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const status = urlParams.get("status");
    const collectionStatus = urlParams.get("collection_status");

    const isApproved = status === "approved" || collectionStatus === "approved";
    const isPending = status === "pending" || collectionStatus === "pending";

    if (isApproved) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const previewImg = localStorage.getItem(PREVIEW_IMAGE_KEY);

      if (saved && previewImg) {
        setFormData(JSON.parse(saved));
        setGeneratedImage(previewImg);
        localStorage.setItem(FINAL_IMAGE_KEY, previewImg);
        setStep(AppStep.SUCCESS);
      }

      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (isPending) {
      const paymentId =
        urlParams.get("collection_id") || urlParams.get("payment_id");

      setStep(AppStep.GENERATING_FINAL);

      const interval = setInterval(async () => {
        if (!paymentId) return;

        try {
          const res = await fetch(`/api/check-payment?id=${paymentId}`);
          const data = await res.json();

          if (data.status === "approved") {
            clearInterval(interval);

            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            const previewImg = localStorage.getItem(PREVIEW_IMAGE_KEY);

            if (saved && previewImg) {
              setFormData(JSON.parse(saved));
              setGeneratedImage(previewImg);
              localStorage.setItem(FINAL_IMAGE_KEY, previewImg);
              setStep(AppStep.SUCCESS);
            }

            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch {
          console.warn("Falha ao consultar pagamento.");
        }
      }, 4000);

      return () => clearInterval(interval);
    }
  }, []);

  // ------------------------------------------------------
  // 🔥 Geração da PRÉVIA via API (CORRIGIDO)
  // ------------------------------------------------------
  const handleFormSubmit = async (data: LogoFormData) => {
    setError(null);
    setFormData(data);
    setStep(AppStep.GENERATING_PREVIEW);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

    try {
      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Gere uma logo simples, comercial e minimalista para a marca "${data.name}", no nicho "${data.niche}". Cores desejadas: ${data.colors || "não especificado"}. Estilo: ${data.style || "não especificado"}. A imagem deve ser clara, nítida e sem mockup.`
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar");
      }

      const result = await response.json();

      if (!result.image) {
        throw new Error("Resposta inválida da API");
      }

      setGeneratedImage(result.image);

      localStorage.setItem(PREVIEW_IMAGE_KEY, result.image);

      setStep(AppStep.PREVIEW);
    } catch (err) {
      console.error("Erro ao gerar logo:", err);
      setError("Erro ao gerar a logo. Por favor, tente novamente.");
      setStep(AppStep.FORM);
    }
  };

  // ------------------------------------------------------
  // Renderização das telas
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              C
            </div>
            <span className="text-xl font-bold text-gray-900">Criador de Logomarca</span>
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

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Criador de Logomarca.</p>
          <p className="mt-2">Pagamento processado de forma segura.</p>
        </div>
      </footer>
    </div>
  );
}
