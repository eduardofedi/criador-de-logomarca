'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ShoppingCart, Lock, LayoutTemplate } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import Image from 'next/image';
import { LogoGeneration } from '@/types/logo';

export default function PreviewLogo({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [logo, setLogo] = useState<LogoGeneration | null>(null);
    const [price, setPrice] = useState('49.90');
    const [loading, setLoading] = useState(true);

    // Customization state
    const [layout, setLayout] = useState<'stack' | 'side'>('stack');
    const [fontColor, setFontColor] = useState('#1E3A8A');
    const compositionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`/api/generation/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.generation) {
                    setLogo(data.generation);
                    setPrice(data.priceAmount.toFixed(2).replace('.', ','));
                    setFontColor(data.generation.color.split(' e ')[0] || '#1E3A8A'); // Get first color extracted
                }
                setLoading(false);
            });
    }, [id]);

    const handleCheckout = async () => {
        // Generate secure link from MercadoPago
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Erro ao iniciar pagamento: ' + (data.error || 'Desconhecido'));
            }
        } catch {
            alert('Falha na comunicação.');
        }
    };

    const handleDownloadDemo = async () => {
        if (!compositionRef.current) return;
        try {
            // In a real app this would export SVG/PNG perfectly.
            // We export a Demo low-res watermark version:
            const dataUrl = await htmlToImage.toPng(compositionRef.current, { quality: 0.5 });
            const link = document.createElement('a');
            link.download = `logo-demo-\${logo.companyName}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '100vh' }}>Carregando sua obra de arte...</div>;
    if (!logo) return <div className="flex-center" style={{ minHeight: '100vh' }}>Logo não encontrado.</div>;

    const isPaid = logo.paymentStatus === 'APPROVED';

    return (
        <div>
            <header className="app-header">
                <div className="container flex-between">
                    <div className="logo cursor-pointer" onClick={() => router.push('/')}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)' }} />
                        Criador de Logomarca
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '40px 0', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>

                {/* Composition Canvas */}
                <div style={{ flex: '1 1 600px' }}>
                    <div
                        className="glass-card flex-center"
                        style={{
                            minHeight: 500,
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: '#f8fafc' // Force light background for preview
                        }}
                    >
                        {/* The actual Logo DOM Tree to be exported */}
                        <div
                            ref={compositionRef}
                            style={{
                                display: 'flex',
                                flexDirection: layout === 'stack' ? 'column' : 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '32px',
                                padding: '60px',
                                backgroundColor: '#ffffff',
                                width: '100%',
                                minHeight: '100%'
                            }}
                        >
                            {logo && logo.base64Image && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 300,
                                    height: 300,
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    borderRadius: '50%'
                                }}>
                                    <Image
                                        src={logo.base64Image}
                                        alt="Símbolo da Marca"
                                        width={300}
                                        height={300}
                                        unoptimized
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transform: 'scale(1.5)',
                                            mixBlendMode: 'multiply',
                                            backgroundColor: 'transparent'
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: layout === 'stack' ? '4.5rem' : '4rem',
                                    fontWeight: 800,
                                    letterSpacing: '-0.03em',
                                    color: fontColor,
                                    maxWidth: 800,
                                    textAlign: 'center',
                                    lineHeight: 1.1,
                                    wordWrap: 'break-word'
                                }}
                            >
                                {logo.companyName}
                            </div>
                        </div>

                        {/* Watermark Overlay (Will not be in the actual premium download page) */}
                        {!isPaid && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                pointerEvents: 'none', background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABCSURBVGhD7c8BDQAgDMAwIvgX5m4x8Kugk0m2c855XwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAOxsOIgD8T0T8eQAAAABJRU5ErkJggg==) repeat',
                                opacity: 0.05
                            }}>
                                <span style={{ transform: 'rotate(-45deg)', fontSize: '4rem', fontWeight: 900, color: '#000', opacity: 0.1 }}>
                                    PREVIEW
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card">
                        <h3 style={{ marginBottom: 16 }}>Personalizar</h3>

                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Cor do Texto</label>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                            {/* Pre-defined popular colors */}
                            {['#000000', '#1E3A8A', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'].map(color => (
                                <div
                                    key={color}
                                    onClick={() => setFontColor(color)}
                                    style={{
                                        width: 32, height: 32, borderRadius: '50%', backgroundColor: color,
                                        cursor: 'pointer',
                                        border: fontColor === color ? '3px solid #cbd5e1' : '1px solid #e2e8f0'
                                    }}
                                />
                            ))}
                            {/* Custom Color Picker Tool */}
                            <div style={{ position: 'relative', width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: '1px solid #cbd5e1', cursor: 'pointer' }}>
                                <input
                                    type="color"
                                    value={fontColor}
                                    title="Escolha uma cor customizada"
                                    onChange={(e) => setFontColor(e.target.value)}
                                    style={{ position: 'absolute', top: -10, left: -10, width: 60, height: 60, cursor: 'pointer', outline: 'none', border: 'none' }}
                                />
                            </div>
                        </div>

                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Layout</label>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                            <button
                                className={`btn \${layout === 'stack' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ padding: '8px 16px', flex: 1 }}
                                onClick={() => setLayout('stack')}
                            >
                                <LayoutTemplate size={18} style={{ marginRight: 8 }} /> Empilhado
                            </button>
                            <button
                                className={`btn \${layout === 'side' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ padding: '8px 16px', flex: 1 }}
                                onClick={() => setLayout('side')}
                            >
                                Lado a Lado
                            </button>
                        </div>

                    </div>

                    <div className="glass-card" style={{ border: '2px solid var(--color-primary)' }}>
                        <h2 style={{ marginBottom: 8, color: 'var(--color-primary)' }}>Sua Marca Pronta</h2>
                        <p>Compre os direitos comerciais e baixe em alta resolução imediatamente.</p>

                        <h1 style={{ fontSize: '3rem', margin: '24px 0' }}>R$ {price}</h1>

                        <button className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: 18 }} onClick={handleCheckout}>
                            <ShoppingCart size={20} style={{ marginRight: 8 }} /> Comprar e Baixar
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <Lock size={14} /> Pagamento Seguro Mercado Pago
                        </p>
                    </div>

                    <button className="btn btn-outline" onClick={handleDownloadDemo} style={{ width: '100%' }}>
                        <Download size={18} style={{ marginRight: 8 }} /> Baixar Preview (Com Marca d&apos;água)
                    </button>
                </div>
            </main>
        </div>
    );
}
