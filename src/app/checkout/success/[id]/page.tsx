'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Download, CheckCircle, Package, Loader2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import Image from 'next/image';
import { LogoGeneration } from '@/types/logo';

export default function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [logo, setLogo] = useState<LogoGeneration | null>(null);
    const [loading, setLoading] = useState(true);
    const compositionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Polling to wait for webhook or simulated approval
        const checkStatus = async () => {
            const res = await fetch(`/api/generation/${id}`);
            const data = await res.json();
            if (data.success && data.generation.paymentStatus === 'APPROVED') {
                setLogo(data.generation);
                setLoading(false);
            } else {
                setTimeout(checkStatus, 2000); // Retry 2s
            }
        };

        checkStatus();
    }, [id]);

    const downloadHighRes = async (format: 'png' | 'svg' | 'transparent') => {
        if (!compositionRef.current || !logo) return;

        try {
            const node = compositionRef.current;
            const originalBg = node.style.backgroundColor;

            // Remove BG for transparent format
            if (format === 'transparent') {
                node.style.backgroundColor = 'transparent';
            }

            // Convert
            const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 3 }); // High Res Pixel Ratio 3

            const link = document.createElement('a');
            link.download = `\${logo.companyName.replace(/\s+/g, '-')}-logo-\${format}.png`;
            link.href = dataUrl;
            link.click();

            // Restore
            if (format === 'transparent') {
                node.style.backgroundColor = originalBg;
            }
        } catch (err) {
            console.error('Download err', err);
            alert('Failed to generate high-res image');
        }
    };

    const downloadSVG = async () => {
        if (!logo || !logo.base64Image) return;

        // For structural SVG:
        // We compose the base64 raster into <image> tag and actual vector <text>.
        const svgCode = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <image href="\${logo.base64Image}" x="200" y="50" height="400" width="400" preserveAspectRatio="xMidYMid slice" />
        <text x="400" y="520" font-family="Arial, Helvetica, sans-serif" font-size="80" font-weight="900" fill="#1E3A8A" text-anchor="middle">
          \${logo.companyName}
        </text>
      </svg>
    `.trim();

        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `\${logo.companyName.replace(/\s+/g, '-')}-logo-vector.svg`;
        link.click();
    };

    if (loading || !logo) return <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <Loader2 className="animate-spin text-primary" /> Confirmando seu pagamento...
    </div>;

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

            <main className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 24px' }} />
                <h1>Pagamento Aprovado!</h1>
                <p>Abaixo estão os arquivos finais em alta resolução para download comercial.</p>

                {/* Hidden/Offscreen Composition for rendering without affecting UI */}
                <div style={{ position: 'absolute', left: '-9999px' }}>
                    <div
                        ref={compositionRef}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: 1024, height: 1024, backgroundColor: '#ffffff', padding: 80
                        }}
                    >
                        {logo.base64Image && (
                            <Image
                                src={logo.base64Image}
                                alt="Symbol"
                                width={600}
                                height={600}
                                unoptimized
                                style={{ width: 600, height: 600, objectFit: 'contain', marginBottom: 64 }}
                            />
                        )}
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '6rem', fontWeight: 800, color: '#1E3A8A' }}>
                            {logo.companyName}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', maxWidth: '800px', margin: '48px auto' }}>

                    <div className="glass-card flex-center" style={{ flexDirection: 'column', padding: 32 }}>
                        <Package size={40} style={{ marginBottom: 16, color: 'var(--color-primary)' }} />
                        <h3>Logo Completo</h3>
                        <p style={{ fontSize: '0.875rem' }}>Alta Qualidade, Fundo Branco (PNG)</p>
                        <button className="btn btn-primary" style={{ marginTop: 24, padding: '12px 24px' }} onClick={() => downloadHighRes('png')}>
                            <Download size={18} style={{ marginRight: 8 }} /> Baixar
                        </button>
                    </div>

                    <div className="glass-card flex-center" style={{ flexDirection: 'column', padding: 32 }}>
                        <Package size={40} style={{ marginBottom: 16, color: 'var(--color-primary)' }} />
                        <h3>Fundo Transparente</h3>
                        <p style={{ fontSize: '0.875rem' }}>Ideal para sites e vídeos</p>
                        <button className="btn btn-primary" style={{ marginTop: 24, padding: '12px 24px' }} onClick={() => downloadHighRes('transparent')}>
                            <Download size={18} style={{ marginRight: 8 }} /> Baixar
                        </button>
                    </div>

                    <div className="glass-card flex-center" style={{ flexDirection: 'column', padding: 32 }}>
                        <Package size={40} style={{ marginBottom: 16, color: 'var(--color-primary)' }} />
                        <h3>Vetor SVG (Master)</h3>
                        <p style={{ fontSize: '0.875rem' }}>Textos em curva + Símbolo HD</p>
                        <button className="btn btn-primary" style={{ marginTop: 24, padding: '12px 24px' }} onClick={downloadSVG}>
                            <Download size={18} style={{ marginRight: 8 }} /> Baixar
                        </button>
                    </div>

                </div>

            </main>
        </div>
    );
}


