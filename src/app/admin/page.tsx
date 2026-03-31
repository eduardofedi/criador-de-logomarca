'use client';

import { useState, useEffect } from 'react';
import { Settings, Activity, Database, Key, DollarSign, LogIn } from 'lucide-react';

interface GenerationLog {
    id: string;
    companyName: string;
    paymentStatus: string;
    cost: number | null;
    createdAt: string | Date;
}

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');

    const [priceAmount, setPriceAmount] = useState('49.90');
    const [geminiApiKey, setGeminiApiKey] = useState('');
    const [mercadoPagoToken, setMercadoPagoToken] = useState('');
    const [logs, setLogs] = useState<GenerationLog[]>([]);

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetch('/api/admin/config')
                .then(res => res.json())
                .then(data => {
                    if (data.config) {
                        setPriceAmount(data.config.priceAmount.toString());
                        setGeminiApiKey(data.config.geminiApiKey || '');
                        setMercadoPagoToken(data.config.mercadoPagoToken || '');
                    }
                    if (data.logs) {
                        setLogs(data.logs);
                    }
                });
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const normalizedUser = user.trim().toLowerCase();
        const normalizedPass = pass.trim();

        if (normalizedUser === 'admin' && normalizedPass === 'admin') {
            setIsAuthenticated(true);
        } else {
            alert('Credenciais erradas!');
        }
    };

    const saveSettings = async () => {
        setLoading(true);
        try {
            await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceAmount: parseFloat(priceAmount),
                    geminiApiKey,
                    mercadoPagoToken
                })
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            alert('Erro ao salvar config.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
            <form onSubmit={handleLogin} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 420 }}>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '16px' }}>
                        <Database size={32} color="var(--color-primary)" />
                    </div>
                    <h2>Acesso Restrito</h2>
                    <p style={{ margin: 0, fontSize: '1rem' }}>Identifique-se para acessar o painel</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input className="input-field" placeholder="Usuário (admin)" value={user} onChange={e => setUser(e.target.value)} />
                    <input className="input-field" type="password" placeholder="Senha (admin)" value={pass} onChange={e => setPass(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                    <LogIn size={20} style={{ marginRight: '8px' }} /> Entrar no sistema
                </button>
            </form>
        </div>
    );

    return (
        <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', padding: '48px 0' }}>
            <div className="container" style={{ maxWidth: 1200 }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                    <div style={{ padding: '12px', background: 'var(--color-primary)', borderRadius: '12px', color: 'white', display: 'flex' }}>
                        <Activity size={28} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: 0 }}>Painel Administrativo</h1>
                        <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-primary)' }}>Gerenciamento do Motor de IA</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: 32, alignItems: 'start' }}>
                    {/* Configs */}
                    <div className="glass-card" style={{ position: 'sticky', top: '48px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                            <Settings size={22} color="var(--color-text-light)" />
                            <h3 style={{ margin: 0 }}>Configurações Globais</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <label>
                                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.95rem' }}>
                                    <DollarSign size={16} /> Preço Final (R$)
                                </span>
                                <input type="number" step="0.01" className="input-field" value={priceAmount} onChange={e => setPriceAmount(e.target.value)} />
                            </label>

                            <label>
                                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.95rem' }}>
                                    <Key size={16} /> API Key Gemini (Google AI)
                                </span>
                                <input type="password" className="input-field" value={geminiApiKey} onChange={e => setGeminiApiKey(e.target.value)} placeholder="AIzaSy..." />
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '4px', display: 'block' }}>Recomendado: gemini-1.5-pro</span>
                            </label>

                            <label>
                                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.95rem' }}>
                                    <Key size={16} /> Token Mercado Pago
                                </span>
                                <input type="password" className="input-field" value={mercadoPagoToken} onChange={e => setMercadoPagoToken(e.target.value)} placeholder="APP_USR-..." />
                            </label>

                            <button className="btn btn-primary" onClick={saveSettings} disabled={loading} style={{ marginTop: '8px' }}>
                                {loading ? 'Sincronizando...' : 'Atualizar Motor'}
                            </button>
                            {saved && <div style={{ color: '#10B981', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '8px' }}>Configurações em vigor!</div>}
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>Histórico de Geração (IA)</h3>
                            <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>Últimas marcas geradas pelos clientes e os custos de inferência associados.</p>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            {logs.length === 0 ? (
                                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-light)' }}>Nenhum log de IA encontrado no banco.</div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--color-background)' }}>
                                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projeto / Marca</th>
                                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status (Pagamento)</th>
                                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Custo (Gemini)</th>
                                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-light)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log) => (
                                            <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{log.companyName}</td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                                                        backgroundColor: log.paymentStatus === 'APPROVED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                                        color: log.paymentStatus === 'APPROVED' ? '#10B981' : '#F59E0B'
                                                    }}>
                                                        {log.paymentStatus === 'APPROVED' ? 'Aprovado' : 'Pendente'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                                                    {log.cost ? `R$ ${log.cost.toFixed(4).replace('.', ',')}` : <span style={{ color: 'var(--color-text-light)' }}>N/A</span>}
                                                </td>
                                                <td style={{ padding: '16px 24px', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                                                    {new Date(log.createdAt).toLocaleString('pt-BR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
