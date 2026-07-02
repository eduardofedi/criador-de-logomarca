'use client';

import { useState, useEffect } from 'react';
import { Settings, BookOpen, BarChart3, LogOut, Save, Plus, Trash2, Edit, X } from 'lucide-react';

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'blog' | 'settings'>('stats');
  
  // Blog State
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState({ title: '', content: '', status: 'draft' });

  // Settings State
  const [newPrice, setNewPrice] = useState(0);
  const [passwords, setPasswords] = useState({ current: '', new: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: password, mode: 'login' })
    });
    if (res.ok) setAuth(true);
    else alert('Senha incorreta');
  };

  const loadData = async () => {
    const [settingsRes, blogRes] = await Promise.all([
      fetch('/api/admin/settings'),
      fetch('/api/admin/blog')
    ]);
    setData(await settingsRes.json());
    setPosts(await blogRes.json());
  };

  useEffect(() => {
    if (auth) loadData();
  }, [auth]);

  const savePost = async () => {
    await fetch('/api/admin/blog', {
      method: 'POST',
      body: JSON.stringify(currentPost)
    });
    setIsEditing(false);
    loadData();
  };

  const deletePost = async (id: string) => {
    if (confirm('Deletar post?')) {
      await fetch('/api/admin/blog', { method: 'DELETE', body: JSON.stringify({ id }) });
      loadData();
    }
  };

  const updatePassword = async () => {
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new, mode: 'change' })
    });
    if (res.ok) alert('Senha alterada!');
    else alert('Erro ao alterar senha');
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
        <form onSubmit={handleLogin} className="bg-gray-900 p-10 rounded-3xl border border-gray-800 w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-center">LogoPro Admin</h1>
          <input 
            type="password" 
            placeholder="Senha de Acesso" 
            className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-700 transition">Entrar no Painel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-6 space-y-10">
        <div className="font-bold text-xl flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">L</div> Admin
        </div>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'stats' ? 'bg-blue-600' : 'text-gray-400 hover:bg-gray-900'}`}><BarChart3 size={20} /> Dashboard</button>
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'blog' ? 'bg-blue-600' : 'text-gray-400 hover:bg-gray-900'}`}><BookOpen size={20} /> Blog</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'settings' ? 'bg-blue-600' : 'text-gray-400 hover:bg-gray-900'}`}><Settings size={20} /> Configurações</button>
        </nav>
        <button onClick={() => window.location.reload()} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition mt-auto"><LogOut size={20} /> Sair</button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'stats' && data && (
          <div className="space-y-10">
            <h1 className="text-4xl font-bold">Resumo</h1>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800"><p className="text-gray-400 mb-2">Gerações</p><div className="text-4xl font-black">{data.stats.totalGenerations}</div></div>
              <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800"><p className="text-gray-400 mb-2">Vendas</p><div className="text-4xl font-black text-green-500">{data.stats.paidLogos}</div></div>
              <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800"><p className="text-gray-400 mb-2">Custo GPT</p><div className="text-4xl font-black text-red-400">{data.stats.estimatedCost}</div></div>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">Blog</h1>
              <button onClick={() => { setCurrentPost({ title: '', content: '', status: 'draft' }); setIsEditing(true); }} className="bg-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={20} /> Novo Post</button>
            </div>
            <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-gray-800 text-gray-400 text-sm"><tr><th className="p-6">Título</th><th className="p-6">Status</th><th className="p-6 text-right">Ações</th></tr></thead>
                 <tbody>
                    {posts.map(post => (
                      <tr key={post.id} className="border-t border-gray-800">
                        <td className="p-6">{post.title}</td>
                        <td className="p-6 uppercase text-xs font-bold">{post.status}</td>
                        <td className="p-6 text-right space-x-4">
                          <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="text-blue-500 hover:text-blue-400"><Edit size={18} /></button>
                          <button onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && data && (
          <div className="max-w-2xl space-y-12">
            <h1 className="text-4xl font-bold">Configurações</h1>

            <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 space-y-6">
              <h3 className="text-xl font-bold">Alterar Senha Admin</h3>
              <input type="password" placeholder="Senha Atual" className="w-full bg-black border border-gray-700 p-4 rounded-xl outline-none" onChange={e => setPasswords({...passwords, current: e.target.value})} />
              <input type="password" placeholder="Nova Senha" className="w-full bg-black border border-gray-700 p-4 rounded-xl outline-none" onChange={e => setPasswords({...passwords, new: e.target.value})} />
              <button onClick={updatePassword} className="w-full bg-white text-black py-4 rounded-xl font-bold">Atualizar Senha</button>
            </div>
          </div>
        )}
      </main>

      {/* Blog Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 w-full max-w-4xl p-10 rounded-3xl border border-gray-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Editar Artigo</h2>
              <button onClick={() => setIsEditing(false)}><X /></button>
            </div>
            <input placeholder="Título do Artigo" className="w-full bg-black border border-gray-700 p-4 rounded-xl outline-none text-2xl font-bold" value={currentPost.title} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} />
            <textarea rows={12} placeholder="Conteúdo do artigo..." className="w-full bg-black border border-gray-700 p-4 rounded-xl outline-none leading-relaxed" value={currentPost.content} onChange={e => setCurrentPost({...currentPost, content: e.target.value})} />
            <div className="flex gap-4">
              <select className="bg-black border border-gray-700 p-4 rounded-xl outline-none" value={currentPost.status} onChange={e => setCurrentPost({...currentPost, status: e.target.value})}>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
              <button onClick={savePost} className="flex-1 bg-blue-600 py-4 rounded-xl font-bold">Salvar Artigo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
