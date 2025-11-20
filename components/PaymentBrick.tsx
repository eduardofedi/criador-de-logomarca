import React, { useState } from "react";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

interface PaymentBrickProps {
  onPaymentSuccess: () => void;
}

export const PaymentBrick: React.FC<PaymentBrickProps> = () => {
  
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    if (loading) return; // trava clique duplo

    setLoading(true);

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        alert("Erro ao conectar com o servidor. Tente novamente.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.init_point) {
        alert("Erro ao criar pagamento. Revise as credenciais da API.");
        setLoading(false);
        return;
      }

      // Redireciona para o checkout real (PIX + Cartão)
      window.location.href = data.init_point;

    } catch (error) {
      console.error("Erro ao iniciar pagamento:", error);
      alert("Falha na comunicação com o Mercado Pago.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        
        {/* Cabeçalho – Nome da Licença */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <div>
            <span className="text-gray-700 font-semibold block">
              Licença de Uso Comercial
            </span>
            <span className="text-gray-400 text-xs">
              PNG Alta Resolução
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold text-green-600">
              R$ 19,90
            </span>
          </div>
        </div>

        {/* BOTÃO DE PAGAMENTO */}
        <button
          onClick={initiatePayment}
          disabled={loading}
          className={`w-full flex items-center justify-center py-4 rounded-xl text-lg font-bold text-white shadow-lg transition-all
            ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Baixar logo por R$ 19,90
            </>
          )}
        </button>

        {/* Rodapé Seguro */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 
            Pagamento via Mercado Pago – Seguro
          </p>
        </div>
      </div>
    </div>
  );
};
