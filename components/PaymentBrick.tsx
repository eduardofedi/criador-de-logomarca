import React from "react";
import { Lock, ShieldCheck } from "lucide-react";

interface PaymentBrickProps {
  onPaymentSuccess: () => void;
}

export const PaymentBrick: React.FC<PaymentBrickProps> = ({ onPaymentSuccess }) => {

  const initiatePayment = async () => {
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
      });

      const data = await response.json();

      if (!data.init_point) {
        alert("Erro ao criar pagamento!");
        return;
      }

      // Redireciona para o checkout real
      window.location.href = data.init_point;

    } catch (error) {
      console.error(error);
      alert("Erro ao iniciar pagamento.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <div>
            <span className="text-gray-600 font-medium block">Licença de Uso Comercial</span>
            <span className="text-gray-400 text-xs">PNG Alta Resolução</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-green-600">R$ 19,90</span>
          </div>
        </div>

        <button
          onClick={initiatePayment}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center text-lg"
        >
          <Lock className="w-5 h-5 mr-2" />
          Baixar logo por R$ 19,90
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 
            Pagamento via Mercado Pago
          </p>
        </div>
      </div>
    </div>
  );
};
