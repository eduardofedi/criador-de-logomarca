"use client";

import React, { useState, useEffect, Suspense } from "react";
import { InputForm } from "@/components/InputForm";
import { LogoPreview } from "@/components/LogoPreview";
import { AppStep, LogoFormData } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";

/**
 * 🎨 Premium Design System
 * Cores: Blue-600 (Primary), Slate-50 (Background), Emerald-500 (Success)
 */

function AppContent() {
    const [step, setStep] = useState<AppStep>(AppStep.FORM);
    const [formData, setFormData] = useState<LogoFormData | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const LOCAL_STORAGE_KEY = "logoSimplesData";
    const PREVIEW_IMAGE_KEY = "logo_preview_image";
    const FINAL_IMAGE_KEY = "logo_final_image";

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
                    const res = await fetch(`/api/payment/check?id=${paymentId}`);
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
    // 🔥 Geração da PRÉVIA usando API interna (Segura)
    // ------------------------------------------------------
    const handleFormSubmit = async (data: LogoFormData) => {
        setError(null);
        setFormData(data);
        setStep(AppStep.GENERATING_PREVIEW);

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (result.error) throw new Error(result.error);

            setGeneratedImage(result.image);
            localStorage.setItem(PREVIEW_IMAGE_KEY, result.image);
            setStep(AppStep.PREVIEW);
        } catch (err) {
            console.error("Erro ao gerar logo:", err);
            setError("Houve um problema ao gerar sua marca. Nossa IA pode estar sobrecarregada.");
            setStep(AppStep.FORM);
        }
    };

    const handlePaymentStart = async () => {
        try {
            const res = await fetch("/api/payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.init_point) {
                window.location.href = data.init_point;
            }
        } catch (err) {
            setError("Erro ao iniciar pagamento. Tente novamente.");
        }
    };

    const renderContent = () => {
        switch (step) {
            case AppStep.FORM:
                return <InputForm onSubmit={handleFormSubmit} isLoading={false} />;

            case AppStep.GENERATING_PREVIEW:
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                        <div className="relative">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            </div>
                            <div className="absolute top-0 right-0 w-6 h-6 bg-blue-500 rounded-full animate-pulse border-4 border-white"></div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Esculpindo sua marca...</h2>
                        <p className="text-gray-500 mt-3 max-w-md">
                            Nossa Inteligência Artificial está analisando seu nicho para criar um design exclusivo e memorável.
                        </p>
                    </div>
                );

            case AppStep.PREVIEW:
                return generatedImage ? (
                    <LogoPreview imageSrc={generatedImage} isPaid={false} onPaymentClick={handlePaymentStart} />
                ) : null;

            case AppStep.GENERATING_FINAL:
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Processando Pagamento...
                        </h2>
                        <p className="text-gray-500 mt-3 max-w-md">
                            Estamos aguardando a confirmação do seu PIX/Cartão para liberar o download em alta resolução.
                        </p>
                    </div>
                );

            case AppStep.SUCCESS:
                return generatedImage ? (
                    <LogoPreview imageSrc={generatedImage} isPaid={true} onPaymentClick={() => { }} />
                ) : null;

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100">
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 py-4 transition-all">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.href = "/"}>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                            C
                        </div>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                            Logo<span className="text-blue-600">IA</span>
                        </span>
                    </div>

                    {step !== AppStep.FORM && step !== AppStep.SUCCESS && (
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                            Começar de novo
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
                <div className="w-full max-w-5xl">
                    {error && (
                        <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center shadow-sm animate-in slide-in-from-top-4">
                            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        {renderContent()}
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-900 font-bold mb-1">LogoIA &copy; {new Date().getFullYear()}</p>
                    <p className="text-slate-400 text-sm">Designers de elite alimentados por silício.</p>
                    <div className="mt-6 flex items-center justify-center space-x-4 opacity-30 grayscale">
                        {/* Security Badges */}
                        <div className="h-8 w-20 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-8 w-20 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <AppContent />
        </Suspense>
    );
}
