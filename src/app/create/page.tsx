'use client';

import { useState, useEffect } from 'react';
import { Mic, Square, Check, ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateLogo() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [companyName, setCompanyName] = useState('');

    const [isRecording, setIsRecording] = useState(false);
    const [briefing, setBriefing] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const reco = new SpeechRecognition();
                reco.continuous = true;
                reco.interimResults = true;
                reco.lang = 'pt-BR';

                reco.onresult = (event: SpeechRecognitionEvent) => {
                    let finalStr = '';
                    for (let j = 0; j < event.results.length; j++) {
                        finalStr += event.results[j][0].transcript;
                    }
                    setBriefing(finalStr);
                };

                reco.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error("Speech recognition error", event.error);
                    setIsRecording(false);
                };

                reco.onend = () => {
                    setIsRecording(false);
                };

                setRecognition(reco);
            }
        }
    }, []);

    const handleNextStep = () => {
        if (step === 1 && companyName.trim().length > 1) {
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            if (recognition) recognition.stop();
            setIsRecording(false);
            setStep(3); // Go to edit transcription step
        } else {
            setBriefing('');
            if (recognition) recognition.start();
            setIsRecording(true);
        }
    };

    const generateLogo = async () => {
        if (!companyName || !briefing) return;
        setIsGenerating(true);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyName, briefingText: briefing })
            });

            const data = await response.json();
            if (data.success && data.id) {
                router.push(`/preview/${data.id}`);
            } else {
                alert('Erro ao gerar logo: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro na geração.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="app-header" style={{ position: 'relative' }}>
                <div className="container">
                    <div className="logo cursor-pointer" onClick={() => router.push('/')}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)' }} />
                        Criador de Logomarca
                    </div>
                </div>
            </header>

            <main className="container flex-center" style={{ flex: 1, flexDirection: 'column' }}>
                <div className="glass-card" style={{ maxWidth: 640, width: '100%', padding: '48px', position: 'relative', overflow: 'hidden' }}>

                    {step === 1 && (
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            <h2>Qual o nome da sua empresa?</h2>
                            <p>Este nome fará parte da composição da logomarca final.</p>

                            <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                                <input
                                    autoFocus
                                    className="input-field"
                                    placeholder="Ex: Tech Solutions"
                                    value={companyName}
                                    onChange={e => setCompanyName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleNextStep()}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleNextStep}
                                    disabled={companyName.trim().length === 0}
                                >
                                    <ArrowRight />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ animation: 'fadeIn 0.5s ease', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2rem' }}>Explique sua visão</h2>
                            <p>Como seria a marca dos seus sonhos? Fale sobre cores, elementos e qual sensação ela deve passar.</p>

                            <div
                                style={{
                                    margin: '48px auto',
                                    width: 120, height: 120,
                                    borderRadius: '50%',
                                    backgroundColor: isRecording ? '#fee2e2' : '#e0f2fe',
                                    color: isRecording ? '#ef4444' : 'var(--color-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: isRecording ? '0 0 0 8px rgba(239, 68, 68, 0.2)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                className={isRecording ? 'animate-pulse' : ''}
                                onClick={toggleRecording}
                            >
                                {isRecording ? <Square size={40} fill="currentColor" /> : <Mic size={48} />}
                            </div>

                            <p style={{ fontWeight: 600, color: isRecording ? '#ef4444' : 'var(--color-primary)' }}>
                                {isRecording ? "Gravando... Clique para parar." : "Clique no microfone para falar"}
                            </p>

                            {isRecording && briefing && (
                                <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8, fontStyle: 'italic' }}>
                                    &quot;{briefing}&quot;
                                </div>
                            )}

                            {!isRecording && (
                                <button className="btn" style={{ color: 'var(--color-text-light)', marginTop: 16 }} onClick={() => setStep(3)}>
                                    Prefiro digitar
                                </button>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            <h2>Revisar Briefing</h2>
                            <p>Adicione mais detalhes ou corrija o que precisamos saber.</p>

                            <textarea
                                className="input-field"
                                style={{ minHeight: 150, resize: 'vertical', marginTop: 16 }}
                                value={briefing}
                                onChange={e => setBriefing(e.target.value)}
                                placeholder="Ex: Quero um logo moderno que use as cores azul escuro e dourado. Elemento principal: um leão estilizado com linhas geométricas."
                            />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                                <button className="btn btn-outline" onClick={() => setStep(2)}>
                                    Voltar
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={generateLogo}
                                    disabled={isGenerating || briefing.trim().length < 5}
                                    style={{ gap: 8 }}
                                >
                                    {isGenerating ? (
                                        <><Loader className="animate-pulse" size={20} /> Processando IA...</>
                                    ) : (
                                        <><Check size={20} /> Gerar Logotipo</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Global CSS for animation inline */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
        </div>
    );
}
